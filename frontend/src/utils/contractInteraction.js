import * as StellarSdk from '@stellar/stellar-sdk'
import { 
  signTransactionWithFreighter, 
  getSorobanServer, 
  NETWORK_PASSPHRASE 
} from './stellar'
import { toast } from 'react-toastify'

const CONTRACT_ID = import.meta.env.VITE_LAND_REGISTRY_CONTRACT_ID

/**
 * Build and submit a contract transaction
 */
const buildAndSubmitTransaction = async (publicKey, operation) => {
  try {
    const server = getSorobanServer()
    const sourceAccount = await server.getAccount(publicKey)

    // Build transaction
    const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(operation)
      .setTimeout(180)
      .build()

    // Simulate transaction
    const simulatedTx = await server.simulateTransaction(transaction)
    
    if (StellarSdk.SorobanRpc.Api.isSimulationError(simulatedTx)) {
      throw new Error(`Simulation failed: ${simulatedTx.error}`)
    }

    // Prepare transaction
    const preparedTx = StellarSdk.SorobanRpc.assembleTransaction(
      transaction,
      simulatedTx
    ).build()

    // Sign with Freighter
    const signedXdr = await signTransactionWithFreighter(preparedTx.toXDR())
    const signedTx = StellarSdk.TransactionBuilder.fromXDR(signedXdr, NETWORK_PASSPHRASE)

    // Submit transaction
    const result = await server.sendTransaction(signedTx)

    // Wait for confirmation
    let status = await server.getTransaction(result.hash)
    while (status.status === 'NOT_FOUND' || status.status === 'PENDING') {
      await new Promise(resolve => setTimeout(resolve, 1000))
      status = await server.getTransaction(result.hash)
    }

    if (status.status === 'SUCCESS') {
      return {
        success: true,
        result: status.returnValue,
        hash: result.hash,
      }
    } else {
      throw new Error(`Transaction failed: ${status.status}`)
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
    const operation = StellarSdk.Operation.invokeContractFunction({
      contract: CONTRACT_ID,
      function: 'initialize',
      args: [
        toScVal.address(inspectorAddress),
        toScVal.string(name),
        toScVal.u32(age),
        toScVal.string(designation),
      ],
    })

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
    const server = getSorobanServer()
    const contract = new StellarSdk.Contract(CONTRACT_ID)
    
    const result = await server.call(
      contract.call('is_land_inspector', toScVal.address(address))
    )
    
    return StellarSdk.scValToNative(result.returnValue)
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
    const operation = StellarSdk.Operation.invokeContractFunction({
      contract: CONTRACT_ID,
      function: 'register_seller',
      args: [
        toScVal.address(publicKey),
        toScVal.string(name),
        toScVal.u32(age),
        toScVal.string(aadharNumber),
        toScVal.string(panNumber),
        toScVal.string(landsOwned),
        toScVal.string(document),
      ],
    })

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
    const operation = StellarSdk.Operation.invokeContractFunction({
      contract: CONTRACT_ID,
      function: 'update_seller',
      args: [
        toScVal.address(publicKey),
        toScVal.string(name),
        toScVal.u32(age),
        toScVal.string(aadharNumber),
        toScVal.string(panNumber),
        toScVal.string(landsOwned),
      ],
    })

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
    const server = getSorobanServer()
    const contract = new StellarSdk.Contract(CONTRACT_ID)
    
    const result = await server.call(
      contract.call('get_seller', toScVal.address(sellerAddress))
    )
    
    return StellarSdk.scValToNative(result.returnValue)
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
    const operation = StellarSdk.Operation.invokeContractFunction({
      contract: CONTRACT_ID,
      function: 'register_buyer',
      args: [
        toScVal.address(publicKey),
        toScVal.string(name),
        toScVal.u32(age),
        toScVal.string(city),
        toScVal.string(aadharNumber),
        toScVal.string(panNumber),
        toScVal.string(document),
        toScVal.string(email),
      ],
    })

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
    const operation = StellarSdk.Operation.invokeContractFunction({
      contract: CONTRACT_ID,
      function: 'update_buyer',
      args: [
        toScVal.address(publicKey),
        toScVal.string(name),
        toScVal.u32(age),
        toScVal.string(city),
        toScVal.string(aadharNumber),
        toScVal.string(panNumber),
        toScVal.string(email),
      ],
    })

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
    const server = getSorobanServer()
    const contract = new StellarSdk.Contract(CONTRACT_ID)
    
    const result = await server.call(
      contract.call('get_buyer', toScVal.address(buyerAddress))
    )
    
    return StellarSdk.scValToNative(result.returnValue)
  } catch (error) {
    console.error('Error fetching buyer:', error)
    return null
  }
}

// ==================== VERIFICATION FUNCTIONS ====================

export const verifySeller = async (inspectorAddress, sellerAddress) => {
  try {
    const operation = StellarSdk.Operation.invokeContractFunction({
      contract: CONTRACT_ID,
      function: 'verify_seller',
      args: [
        toScVal.address(inspectorAddress),
        toScVal.address(sellerAddress),
      ],
    })

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
    const operation = StellarSdk.Operation.invokeContractFunction({
      contract: CONTRACT_ID,
      function: 'reject_seller',
      args: [
        toScVal.address(inspectorAddress),
        toScVal.address(sellerAddress),
      ],
    })

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
    const operation = StellarSdk.Operation.invokeContractFunction({
      contract: CONTRACT_ID,
      function: 'verify_buyer',
      args: [
        toScVal.address(inspectorAddress),
        toScVal.address(buyerAddress),
      ],
    })

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
    const operation = StellarSdk.Operation.invokeContractFunction({
      contract: CONTRACT_ID,
      function: 'reject_buyer',
      args: [
        toScVal.address(inspectorAddress),
        toScVal.address(buyerAddress),
      ],
    })

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
    const operation = StellarSdk.Operation.invokeContractFunction({
      contract: CONTRACT_ID,
      function: 'add_land',
      args: [
        toScVal.address(sellerAddress),
        toScVal.u32(area),
        toScVal.string(city),
        toScVal.string(state),
        toScVal.i128(landPrice),
        toScVal.u32(propertyPid),
        toScVal.u32(surveyNum),
        toScVal.string(ipfsHash),
        toScVal.string(document),
      ],
    })

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
    const operation = StellarSdk.Operation.invokeContractFunction({
      contract: CONTRACT_ID,
      function: 'add_fractional_land',
      args: [
        toScVal.address(sellerAddress),
        toScVal.u32(area),
        toScVal.string(city),
        toScVal.string(state),
        toScVal.i128(totalPrice),
        toScVal.u32(propertyPid),
        toScVal.u32(surveyNum),
        toScVal.string(ipfsHash),
        toScVal.string(document),
        toScVal.u32(totalFractions),
      ],
    })

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
    const operation = StellarSdk.Operation.invokeContractFunction({
      contract: CONTRACT_ID,
      function: 'verify_land',
      args: [
        toScVal.address(inspectorAddress),
        toScVal.u32(landId),
      ],
    })

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
    const server = getSorobanServer()
    const contract = new StellarSdk.Contract(CONTRACT_ID)
    
    const result = await server.call(
      contract.call('get_land', toScVal.u32(landId))
    )
    
    return StellarSdk.scValToNative(result.returnValue)
  } catch (error) {
    console.error('Error fetching land:', error)
    return null
  }
}

export const getLandsCount = async () => {
  try {
    const server = getSorobanServer()
    const contract = new StellarSdk.Contract(CONTRACT_ID)
    
    const result = await server.call(contract.call('get_lands_count'))
    return StellarSdk.scValToNative(result.returnValue)
  } catch (error) {
    console.error('Error fetching lands count:', error)
    return 0
  }
}

export const isLandVerified = async (landId) => {
  try {
    const server = getSorobanServer()
    const contract = new StellarSdk.Contract(CONTRACT_ID)
    
    const result = await server.call(
      contract.call('is_land_verified', toScVal.u32(landId))
    )
    
    return StellarSdk.scValToNative(result.returnValue)
  } catch (error) {
    console.error('Error checking land verification:', error)
    return false
  }
}

// ==================== REQUEST FUNCTIONS ====================

export const requestLand = async (buyerAddress, sellerAddress, landId) => {
  try {
    const operation = StellarSdk.Operation.invokeContractFunction({
      contract: CONTRACT_ID,
      function: 'request_land',
      args: [
        toScVal.address(buyerAddress),
        toScVal.address(sellerAddress),
        toScVal.u32(landId),
      ],
    })

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
    const operation = StellarSdk.Operation.invokeContractFunction({
      contract: CONTRACT_ID,
      function: 'request_fractional_land',
      args: [
        toScVal.address(buyerAddress),
        toScVal.address(sellerAddress),
        toScVal.u32(landId),
      ],
    })

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
    const operation = StellarSdk.Operation.invokeContractFunction({
      contract: CONTRACT_ID,
      function: 'approve_request',
      args: [
        toScVal.address(sellerAddress),
        toScVal.u32(requestId),
      ],
    })

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
    const operation = StellarSdk.Operation.invokeContractFunction({
      contract: CONTRACT_ID,
      function: 'payment',
      args: [
        toScVal.address(buyerAddress),
        toScVal.u32(requestId),
      ],
    })

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
    const server = getSorobanServer()
    const contract = new StellarSdk.Contract(CONTRACT_ID)
    
    const result = await server.call(
      contract.call('get_request', toScVal.u32(requestId))
    )
    
    return StellarSdk.scValToNative(result.returnValue)
  } catch (error) {
    console.error('Error fetching request:', error)
    return null
  }
}

export const getRequestsCount = async () => {
  try {
    const server = getSorobanServer()
    const contract = new StellarSdk.Contract(CONTRACT_ID)
    
    const result = await server.call(contract.call('get_requests_count'))
    return StellarSdk.scValToNative(result.returnValue)
  } catch (error) {
    console.error('Error fetching requests count:', error)
    return 0
  }
}

// ==================== FRACTIONAL OWNERSHIP FUNCTIONS ====================

export const getFractionalOwnership = async (landId, fractionId) => {
  try {
    const server = getSorobanServer()
    const contract = new StellarSdk.Contract(CONTRACT_ID)
    
    const result = await server.call(
      contract.call(
        'get_fractional_ownership',
        toScVal.u32(landId),
        toScVal.u32(fractionId)
      )
    )
    
    return StellarSdk.scValToNative(result.returnValue)
  } catch (error) {
    console.error('Error fetching fractional ownership:', error)
    return null
  }
}

export const getLandFractionOwners = async (landId) => {
  try {
    const server = getSorobanServer()
    const contract = new StellarSdk.Contract(CONTRACT_ID)
    
    const result = await server.call(
      contract.call('get_land_fraction_owners', toScVal.u32(landId))
    )
    
    return StellarSdk.scValToNative(result.returnValue)
  } catch (error) {
    console.error('Error fetching fraction owners:', error)
    return []
  }
}

export const getUserFractionalLands = async (userAddress) => {
  try {
    const server = getSorobanServer()
    const contract = new StellarSdk.Contract(CONTRACT_ID)
    
    const result = await server.call(
      contract.call('get_user_fractional_lands', toScVal.address(userAddress))
    )
    
    return StellarSdk.scValToNative(result.returnValue)
  } catch (error) {
    console.error('Error fetching user fractional lands:', error)
    return []
  }
}

export const getAvailableFractions = async (landId) => {
  try {
    const server = getSorobanServer()
    const contract = new StellarSdk.Contract(CONTRACT_ID)
    
    const result = await server.call(
      contract.call('get_available_fractions', toScVal.u32(landId))
    )
    
    return StellarSdk.scValToNative(result.returnValue)
  } catch (error) {
    console.error('Error fetching available fractions:', error)
    return 0
  }
}

// ==================== OWNERSHIP TRANSFER ====================

export const transferOwnership = async (inspectorAddress, landId, newOwnerAddress) => {
  try {
    const operation = StellarSdk.Operation.invokeContractFunction({
      contract: CONTRACT_ID,
      function: 'transfer_ownership',
      args: [
        toScVal.address(inspectorAddress),
        toScVal.u32(landId),
        toScVal.address(newOwnerAddress),
      ],
    })

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
    const server = getSorobanServer()
    const contract = new StellarSdk.Contract(CONTRACT_ID)
    
    const result = await server.call(
      contract.call('get_land_owner', toScVal.u32(landId))
    )
    
    return StellarSdk.scValToNative(result.returnValue)
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
    // This is a placeholder implementation
    // In production, the contract should expose get_buyers_count() and iteration
    // For now, return empty array - buyers will be tracked in the app state
    console.log('getAllBuyers: Contract integration pending')
    return []
  } catch (error) {
    console.error('Error fetching all buyers:', error)
    return []
  }
}

export const getAllSellers = async () => {
  try {
    // This is a placeholder implementation
    // In production, the contract should expose get_sellers_count() and iteration
    // For now, return empty array - sellers will be tracked in the app state
    console.log('getAllSellers: Contract integration pending')
    return []
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
