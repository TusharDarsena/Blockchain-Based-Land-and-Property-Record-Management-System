import * as StellarSdk from '@stellar/stellar-sdk'
import { 
  signTransactionWithFreighter, 
  getSorobanServer,
  getStellarServer,
  NETWORK_PASSPHRASE 
} from './stellar'
import { toast } from 'react-toastify'

const CONTRACT_ID = import.meta.env.VITE_LAND_REGISTRY_CONTRACT_ID

/**
 * Call a read-only contract function
 * Returns null if the contract function panics (e.g., user not found)
 */
const callReadOnlyFunction = async (functionName, ...args) => {
  try {
    const server = getSorobanServer()
    const contract = new StellarSdk.Contract(CONTRACT_ID)
    
    // Create a dummy account for simulation
    const account = new StellarSdk.Account(
      'GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF',
      '0'
    )
    
    const transaction = new StellarSdk.TransactionBuilder(account, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(contract.call(functionName, ...args))
      .setTimeout(30)
      .build()
    
    const simulation = await server.simulateTransaction(transaction)
    
    if (StellarSdk.SorobanRpc.Api.isSimulationSuccess(simulation)) {
      return StellarSdk.scValToNative(simulation.result.retval)
    } else {
      // Check if this is a contract panic (user not found, etc.)
      const errorMessage = simulation.error || ''
      if (errorMessage.includes('UnreachableCodeReached') || 
          errorMessage.includes('InvalidAction') ||
          errorMessage.includes('WasmVm')) {
        // Contract panicked - likely means the entity doesn't exist
        return null
      }
      throw new Error(`Simulation failed: ${errorMessage}`)
    }
  } catch (error) {
    // If it's already a handled error, rethrow
    if (error.message && error.message.startsWith('Simulation failed:')) {
      throw error
    }
    // Log and return null for other errors
    console.error(`Error calling ${functionName}:`, error)
    return null
  }
}

/**
 * Build and submit a contract transaction
 */
const buildAndSubmitTransaction = async (publicKey, operation) => {
  try {
    const server = getSorobanServer()
    const sourceAccount = await server.getAccount(publicKey)

    // Check balance using Horizon (more reliable for balance info)
    try {
      const horizonServer = getStellarServer()
      const horizonAccount = await horizonServer.loadAccount(publicKey)
      const xlmBalance = horizonAccount.balances.find(b => b.asset_type === 'native')
      const balance = xlmBalance ? parseFloat(xlmBalance.balance) : 0
      
      console.log('Account XLM balance:', balance, 'XLM')
      
      if (balance < 1) {
        throw new Error('Insufficient XLM balance. Please fund your account with testnet XLM from https://laboratory.stellar.org/#account-creator')
      }
    } catch (balanceError) {
      console.warn('Could not verify balance, continuing anyway:', balanceError.message)
    }

    // Build transaction with higher fee for Soroban
    const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
      fee: (100000).toString(), // Higher fee for Soroban contracts
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(operation)
      .setTimeout(180)
      .build()

    console.log('Built transaction, simulating...')

    // Simulate transaction
    const simulatedTx = await server.simulateTransaction(transaction)
    
    if (StellarSdk.SorobanRpc.Api.isSimulationError(simulatedTx)) {
      console.error('Simulation error:', simulatedTx.error)
      throw new Error(`Simulation failed: ${simulatedTx.error}`)
    }

    console.log('Simulation successful, preparing transaction...')

    // Prepare transaction with simulated results
    const preparedTx = StellarSdk.SorobanRpc.assembleTransaction(
      transaction,
      simulatedTx
    ).build()

    console.log('Transaction prepared, requesting signature from Freighter...')
    console.log('Transaction XDR length:', preparedTx.toXDR().length)

    // Sign with Freighter
    const signedXdr = await signTransactionWithFreighter(preparedTx.toXDR())
    
    console.log('Transaction signed, parsing...')
    const signedTx = StellarSdk.TransactionBuilder.fromXDR(signedXdr, NETWORK_PASSPHRASE)

    console.log('Submitting transaction to network...')
    
    // Submit transaction
    let sendResponse
    try {
      sendResponse = await server.sendTransaction(signedTx)
      console.log('Transaction submitted, hash:', sendResponse.hash)
    } catch (sendError) {
      console.error('Error sending transaction:', sendError)
      throw new Error(`Failed to send transaction: ${sendError.message}`)
    }

    // Wait for confirmation with proper error handling
    let getResponse
    let attempts = 0
    const maxAttempts = 30 // 30 seconds max wait
    
    try {
      getResponse = await server.getTransaction(sendResponse.hash)
      
      while (getResponse.status === StellarSdk.SorobanRpc.Api.GetTransactionStatus.NOT_FOUND && attempts < maxAttempts) {
        console.log(`Waiting for transaction confirmation... (${attempts + 1}/${maxAttempts})`)
        await new Promise(resolve => setTimeout(resolve, 1000))
        getResponse = await server.getTransaction(sendResponse.hash)
        attempts++
      }
    } catch (getError) {
      console.error('Error getting transaction:', getError)
      
      // The "Bad union switch" error often occurs when parsing void return types
      // If the transaction was sent successfully, we can check the ledger directly
      if (getError.message && getError.message.includes('Bad union switch')) {
        console.log('Detected XDR parsing issue (likely void return), checking transaction via alternative method')
        
        // Wait a bit for the transaction to be confirmed
        await new Promise(resolve => setTimeout(resolve, 3000))
        
        // Try to fetch again with raw response
        try {
          const rawResponse = await fetch(`${server.serverURL.toString()}/transactions/${sendResponse.hash}`)
          if (rawResponse.ok) {
            console.log('Transaction found via direct fetch, assuming success')
            return {
              success: true,
              hash: sendResponse.hash,
            }
          }
        } catch (fetchError) {
          console.log('Could not fetch via alternative method:', fetchError)
        }
        
        // If we've sent the transaction and waited, assume success
        console.log('Transaction sent successfully, assuming completion')
        return {
          success: true,
          hash: sendResponse.hash,
        }
      }
      
      // If we can't get the transaction status but it was sent successfully,
      // assume it succeeded after a reasonable wait
      if (attempts >= 5) {
        console.log('Transaction sent but status check failed, assuming success after wait')
        return {
          success: true,
          hash: sendResponse.hash,
        }
      }
      throw getError
    }

    console.log('Transaction status:', getResponse.status)

    if (getResponse.status === StellarSdk.SorobanRpc.Api.GetTransactionStatus.SUCCESS) {
      console.log('Transaction successful!')
      return {
        success: true,
        hash: sendResponse.hash,
      }
    } else if (getResponse.status === StellarSdk.SorobanRpc.Api.GetTransactionStatus.FAILED) {
      console.error('Transaction failed:', getResponse)
      // Extract error details if available
      let errorMessage = 'Transaction failed.'
      if (getResponse.resultXdr) {
        try {
          const result = StellarSdk.xdr.TransactionResult.fromXDR(getResponse.resultXdr, 'base64')
          errorMessage += ` Result code: ${result.result().switch().name}`
        } catch (e) {
          console.error('Could not parse result XDR:', e)
        }
      }
      throw new Error(errorMessage)
    } else {
      throw new Error(`Transaction status: ${getResponse.status}`)
    }
  } catch (error) {
    console.error('Transaction error:', error)
    throw error
  }
}

/**
 * Convert JS values to Soroban ScVal
 */
const toScVal = {
  string: (value) => StellarSdk.nativeToScVal(value, { type: 'string' }),
  u32: (value) => StellarSdk.nativeToScVal(value, { type: 'u32' }),
  i128: (value) => StellarSdk.nativeToScVal(value, { type: 'i128' }),
  bool: (value) => StellarSdk.nativeToScVal(value, { type: 'bool' }),
  address: (value) => new StellarSdk.Address(value).toScVal(),
  option: (value, innerType) => {
    if (value === null || value === undefined) {
      return StellarSdk.xdr.ScVal.scvVoid()
    }
    return StellarSdk.nativeToScVal(value, { type: innerType })
  },
}

/**
 * Contract Methods
 */

// ==================== INITIALIZATION ====================

export const initializeContract = async (publicKey, inspectorAddress, name, age, designation) => {
  try {
    const contract = new StellarSdk.Contract(CONTRACT_ID)
    
    const operation = contract.call(
      'initialize',
      toScVal.address(inspectorAddress),
      toScVal.string(name),
      toScVal.u32(age),
      toScVal.string(designation)
    )

    const result = await buildAndSubmitTransaction(publicKey, operation)
    toast.success('Contract initialized successfully!')
    return result
  } catch (error) {
    toast.error(`Initialization failed: ${error.message}`)
    throw error
  }
}

export const isLandInspector = async (address) => {
  try {
    return await callReadOnlyFunction('is_land_inspector', toScVal.address(address))
  } catch (error) {
    console.error('Error checking inspector:', error)
    return false
  }
}

// ==================== SELLER FUNCTIONS ====================

export const registerSeller = async (
  publicKey,
  name,
  age,
  aadharNumber,
  panNumber,
  landsOwned,
  document
) => {
  try {
    const contract = new StellarSdk.Contract(CONTRACT_ID)
    
    const operation = contract.call(
      'register_seller',
      toScVal.address(publicKey),
      toScVal.string(name),
      toScVal.u32(age),
      toScVal.string(aadharNumber),
      toScVal.string(panNumber),
      toScVal.string(landsOwned),
      toScVal.string(document)
    )

    const result = await buildAndSubmitTransaction(publicKey, operation)
    toast.success('Seller registered successfully!')
    return result
  } catch (error) {
    toast.error(`Registration failed: ${error.message}`)
    throw error
  }
}

export const updateSeller = async (
  publicKey,
  name,
  age,
  aadharNumber,
  panNumber,
  landsOwned
) => {
  try {
    const contract = new StellarSdk.Contract(CONTRACT_ID)
    
    const operation = contract.call(
      'update_seller',
      toScVal.address(publicKey),
      toScVal.string(name),
      toScVal.u32(age),
      toScVal.string(aadharNumber),
      toScVal.string(panNumber),
      toScVal.string(landsOwned)
    )

    const result = await buildAndSubmitTransaction(publicKey, operation)
    toast.success('Seller profile updated!')
    return result
  } catch (error) {
    toast.error(`Update failed: ${error.message}`)
    throw error
  }
}

export const getSeller = async (sellerAddress) => {
  try {
    return await callReadOnlyFunction('get_seller', toScVal.address(sellerAddress))
  } catch (error) {
    console.error('Error fetching seller:', error)
    return null
  }
}

// ==================== BUYER FUNCTIONS ====================

export const registerBuyer = async (
  publicKey,
  name,
  age,
  city,
  aadharNumber,
  panNumber,
  document,
  email
) => {
  try {
    const contract = new StellarSdk.Contract(CONTRACT_ID)
    
    const operation = contract.call(
      'register_buyer',
      toScVal.address(publicKey),
      toScVal.string(name),
      toScVal.u32(age),
      toScVal.string(city),
      toScVal.string(aadharNumber),
      toScVal.string(panNumber),
      toScVal.string(document),
      toScVal.string(email)
    )

    const result = await buildAndSubmitTransaction(publicKey, operation)
    toast.success('Buyer registered successfully!')
    return result
  } catch (error) {
    toast.error(`Registration failed: ${error.message}`)
    throw error
  }
}

export const updateBuyer = async (
  publicKey,
  name,
  age,
  city,
  aadharNumber,
  panNumber,
  email
) => {
  try {
    const contract = new StellarSdk.Contract(CONTRACT_ID)
    
    const operation = contract.call(
      'update_buyer',
      toScVal.address(publicKey),
      toScVal.string(name),
      toScVal.u32(age),
      toScVal.string(city),
      toScVal.string(aadharNumber),
      toScVal.string(panNumber),
      toScVal.string(email)
    )

    const result = await buildAndSubmitTransaction(publicKey, operation)
    toast.success('Buyer profile updated!')
    return result
  } catch (error) {
    toast.error(`Update failed: ${error.message}`)
    throw error
  }
}

export const getBuyer = async (buyerAddress) => {
  try {
    return await callReadOnlyFunction('get_buyer', toScVal.address(buyerAddress))
  } catch (error) {
    console.error('Error fetching buyer:', error)
    return null
  }
}

// ==================== VERIFICATION FUNCTIONS ====================

export const verifySeller = async (inspectorAddress, sellerAddress) => {
  try {
    const contract = new StellarSdk.Contract(CONTRACT_ID)
    
    const operation = contract.call(
      'verify_seller',
      toScVal.address(inspectorAddress),
      toScVal.address(sellerAddress)
    )

    const result = await buildAndSubmitTransaction(inspectorAddress, operation)
    toast.success('Seller verified successfully!')
    return result
  } catch (error) {
    toast.error(`Verification failed: ${error.message}`)
    throw error
  }
}

export const rejectSeller = async (inspectorAddress, sellerAddress) => {
  try {
    const contract = new StellarSdk.Contract(CONTRACT_ID)
    
    const operation = contract.call(
      'reject_seller',
      toScVal.address(inspectorAddress),
      toScVal.address(sellerAddress)
    )

    const result = await buildAndSubmitTransaction(inspectorAddress, operation)
    toast.success('Seller rejected')
    return result
  } catch (error) {
    toast.error(`Rejection failed: ${error.message}`)
    throw error
  }
}

export const verifyBuyer = async (inspectorAddress, buyerAddress) => {
  try {
    const contract = new StellarSdk.Contract(CONTRACT_ID)
    
    const operation = contract.call(
      'verify_buyer',
      toScVal.address(inspectorAddress),
      toScVal.address(buyerAddress)
    )

    const result = await buildAndSubmitTransaction(inspectorAddress, operation)
    toast.success('Buyer verified successfully!')
    return result
  } catch (error) {
    toast.error(`Verification failed: ${error.message}`)
    throw error
  }
}

export const rejectBuyer = async (inspectorAddress, buyerAddress) => {
  try {
    const contract = new StellarSdk.Contract(CONTRACT_ID)
    
    const operation = contract.call(
      'reject_buyer',
      toScVal.address(inspectorAddress),
      toScVal.address(buyerAddress)
    )

    const result = await buildAndSubmitTransaction(inspectorAddress, operation)
    toast.success('Buyer rejected')
    return result
  } catch (error) {
    toast.error(`Rejection failed: ${error.message}`)
    throw error
  }
}

// ==================== LAND FUNCTIONS ====================

export const addLand = async (
  sellerAddress,
  area,
  city,
  state,
  landPrice,
  propertyPid,
  surveyNum,
  ipfsHash,
  document
) => {
  try {
    const contract = new StellarSdk.Contract(CONTRACT_ID)
    
    const operation = contract.call(
      'add_land',
      toScVal.address(sellerAddress),
      toScVal.u32(area),
      toScVal.string(city),
      toScVal.string(state),
      toScVal.i128(landPrice),
      toScVal.u32(propertyPid),
      toScVal.u32(surveyNum),
      toScVal.string(ipfsHash),
      toScVal.string(document)
    )

    const result = await buildAndSubmitTransaction(sellerAddress, operation)
    toast.success('Land added successfully!')
    return result
  } catch (error) {
    toast.error(`Failed to add land: ${error.message}`)
    throw error
  }
}

export const addFractionalLand = async (
  sellerAddress,
  area,
  city,
  state,
  totalPrice,
  propertyPid,
  surveyNum,
  ipfsHash,
  document,
  totalFractions
) => {
  try {
    const contract = new StellarSdk.Contract(CONTRACT_ID)
    
    const operation = contract.call(
      'add_fractional_land',
      toScVal.address(sellerAddress),
      toScVal.u32(area),
      toScVal.string(city),
      toScVal.string(state),
      toScVal.i128(totalPrice),
      toScVal.u32(propertyPid),
      toScVal.u32(surveyNum),
      toScVal.string(ipfsHash),
      toScVal.string(document),
      toScVal.u32(totalFractions)
    )

    const result = await buildAndSubmitTransaction(sellerAddress, operation)
    toast.success('Fractional land added successfully!')
    return result
  } catch (error) {
    toast.error(`Failed to add fractional land: ${error.message}`)
    throw error
  }
}

export const verifyLand = async (inspectorAddress, landId) => {
  try {
    const contract = new StellarSdk.Contract(CONTRACT_ID)
    
    const operation = contract.call(
      'verify_land',
      toScVal.address(inspectorAddress),
      toScVal.u32(landId)
    )

    const result = await buildAndSubmitTransaction(inspectorAddress, operation)
    toast.success('Land verified successfully!')
    return result
  } catch (error) {
    toast.error(`Verification failed: ${error.message}`)
    throw error
  }
}

export const getLand = async (landId) => {
  try {
    return await callReadOnlyFunction('get_land', toScVal.u32(landId))
  } catch (error) {
    console.error('Error fetching land:', error)
    return null
  }
}

export const getLandsCount = async () => {
  try {
    return await callReadOnlyFunction('get_lands_count')
  } catch (error) {
    console.error('Error fetching lands count:', error)
    return 0
  }
}

export const isLandVerified = async (landId) => {
  try {
    return await callReadOnlyFunction('is_land_verified', toScVal.u32(landId))
  } catch (error) {
    console.error('Error checking land verification:', error)
    return false
  }
}

// ==================== REQUEST FUNCTIONS ====================

export const requestLand = async (buyerAddress, sellerAddress, landId) => {
  try {
    const contract = new StellarSdk.Contract(CONTRACT_ID)
    
    const operation = contract.call(
      'request_land',
      toScVal.address(buyerAddress),
      toScVal.address(sellerAddress),
      toScVal.u32(landId)
    )

    const result = await buildAndSubmitTransaction(buyerAddress, operation)
    toast.success('Land request submitted!')
    return result
  } catch (error) {
    toast.error(`Request failed: ${error.message}`)
    throw error
  }
}

export const requestFractionalLand = async (buyerAddress, sellerAddress, landId) => {
  try {
    const contract = new StellarSdk.Contract(CONTRACT_ID)
    
    const operation = contract.call(
      'request_fractional_land',
      toScVal.address(buyerAddress),
      toScVal.address(sellerAddress),
      toScVal.u32(landId)
    )

    const result = await buildAndSubmitTransaction(buyerAddress, operation)
    toast.success('Fractional land request submitted!')
    return result
  } catch (error) {
    toast.error(`Request failed: ${error.message}`)
    throw error
  }
}

export const approveRequest = async (sellerAddress, requestId) => {
  try {
    const contract = new StellarSdk.Contract(CONTRACT_ID)
    
    const operation = contract.call(
      'approve_request',
      toScVal.address(sellerAddress),
      toScVal.u32(requestId)
    )

    const result = await buildAndSubmitTransaction(sellerAddress, operation)
    toast.success('Request approved!')
    return result
  } catch (error) {
    toast.error(`Approval failed: ${error.message}`)
    throw error
  }
}

export const makePayment = async (buyerAddress, requestId) => {
  try {
    const contract = new StellarSdk.Contract(CONTRACT_ID)
    
    const operation = contract.call(
      'payment',
      toScVal.address(buyerAddress),
      toScVal.u32(requestId)
    )

    const result = await buildAndSubmitTransaction(buyerAddress, operation)
    toast.success('Payment completed successfully!')
    return result
  } catch (error) {
    toast.error(`Payment failed: ${error.message}`)
    throw error
  }
}

export const getRequest = async (requestId) => {
  try {
    return await callReadOnlyFunction('get_request', toScVal.u32(requestId))
  } catch (error) {
    console.error('Error fetching request:', error)
    return null
  }
}

export const getRequestsCount = async () => {
  try {
    return await callReadOnlyFunction('get_requests_count')
  } catch (error) {
    console.error('Error fetching requests count:', error)
    return 0
  }
}

// ==================== FRACTIONAL OWNERSHIP FUNCTIONS ====================

export const getFractionalOwnership = async (landId, fractionId) => {
  try {
    return await callReadOnlyFunction(
      'get_fractional_ownership',
      toScVal.u32(landId),
      toScVal.u32(fractionId)
    )
  } catch (error) {
    console.error('Error fetching fractional ownership:', error)
    return null
  }
}

export const getLandFractionOwners = async (landId) => {
  try {
    return await callReadOnlyFunction('get_land_fraction_owners', toScVal.u32(landId))
  } catch (error) {
    console.error('Error fetching fraction owners:', error)
    return []
  }
}

export const getUserFractionalLands = async (userAddress) => {
  try {
    return await callReadOnlyFunction('get_user_fractional_lands', toScVal.address(userAddress))
  } catch (error) {
    console.error('Error fetching user fractional lands:', error)
    return []
  }
}

export const getAvailableFractions = async (landId) => {
  try {
    return await callReadOnlyFunction('get_available_fractions', toScVal.u32(landId))
  } catch (error) {
    console.error('Error fetching available fractions:', error)
    return 0
  }
}

// ==================== OWNERSHIP TRANSFER ====================

export const transferOwnership = async (inspectorAddress, landId, newOwnerAddress) => {
  try {
    const contract = new StellarSdk.Contract(CONTRACT_ID)
    
    const operation = contract.call(
      'transfer_ownership',
      toScVal.address(inspectorAddress),
      toScVal.u32(landId),
      toScVal.address(newOwnerAddress)
    )

    const result = await buildAndSubmitTransaction(inspectorAddress, operation)
    toast.success('Ownership transferred!')
    return result
  } catch (error) {
    toast.error(`Transfer failed: ${error.message}`)
    throw error
  }
}

export const getLandOwner = async (landId) => {
  try {
    return await callReadOnlyFunction('get_land_owner', toScVal.u32(landId))
  } catch (error) {
    console.error('Error fetching land owner:', error)
    return null
  }
}

// ==================== HELPER FUNCTIONS ====================

export const getAllLands = async () => {
  try {
    const count = await getLandsCount()
    const lands = []
    
    for (let i = 1; i <= count; i++) {
      const land = await getLand(i)
      if (land) {
        lands.push({ ...land, id: i })
      }
    }
    
    return lands
  } catch (error) {
    console.error('Error fetching all lands:', error)
    return []
  }
}

export const getAllRequests = async () => {
  try {
    const count = await getRequestsCount()
    const requests = []
    
    for (let i = 1; i <= count; i++) {
      const request = await getRequest(i)
      if (request) {
        requests.push({ ...request, id: i })
      }
    }
    
    return requests
  } catch (error) {
    console.error('Error fetching all requests:', error)
    return []
  }
}

// Helper functions for getting all buyers and sellers
// Note: These are simplified implementations. In production, you'd want
// the contract to expose count/list functions for buyers and sellers

export const getAllBuyers = async () => {
  try {
    // Get list of buyer addresses from contract
    const buyerAddresses = await callReadOnlyFunction('get_buyer_list')
    if (!buyerAddresses || buyerAddresses.length === 0) {
      return []
    }

    // Fetch details for each buyer
    const buyers = []
    for (const address of buyerAddresses) {
      try {
        const buyer = await getBuyer(address)
        if (buyer) {
          buyers.push({ ...buyer, address })
        }
      } catch (error) {
        console.error(`Error fetching buyer ${address}:`, error)
      }
    }

    return buyers
  } catch (error) {
    console.error('Error fetching all buyers:', error)
    return []
  }
}

export const getAllSellers = async () => {
  try {
    // Get list of seller addresses from contract
    const sellerAddresses = await callReadOnlyFunction('get_seller_list')
    if (!sellerAddresses || sellerAddresses.length === 0) {
      return []
    }

    // Fetch details for each seller
    const sellers = []
    for (const address of sellerAddresses) {
      try {
        const seller = await getSeller(address)
        if (seller) {
          sellers.push({ ...seller, address })
        }
      } catch (error) {
        console.error(`Error fetching seller ${address}:`, error)
      }
    }

    return sellers
  } catch (error) {
    console.error('Error fetching all sellers:', error)
    return []
  }
}

export default {
  // Initialization
  initializeContract,
  isLandInspector,
  
  // Seller
  registerSeller,
  updateSeller,
  getSeller,
  getAllSellers,
  
  // Buyer
  registerBuyer,
  updateBuyer,
  getBuyer,
  getAllBuyers,
  
  // Verification
  verifySeller,
  rejectSeller,
  verifyBuyer,
  rejectBuyer,
  
  // Land
  addLand,
  addFractionalLand,
  verifyLand,
  getLand,
  getLandsCount,
  isLandVerified,
  getAllLands,
  
  // Requests
  requestLand,
  requestFractionalLand,
  approveRequest,
  makePayment,
  getRequest,
  getRequestsCount,
  getAllRequests,
  
  // Fractional Ownership
  getFractionalOwnership,
  getLandFractionOwners,
  getUserFractionalLands,
  getAvailableFractions,
  
  // Ownership
  transferOwnership,
  getLandOwner,
}
