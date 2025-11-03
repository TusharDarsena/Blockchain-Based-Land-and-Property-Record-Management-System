import { toast } from 'react-toastify'

/**
 * Stellar-specific error messages
 */
const STELLAR_ERRORS = {
  // Transaction errors
  TX_FAILED: 'Transaction failed',
  TX_TIMEOUT: 'Transaction timed out',
  TX_BAD_AUTH: 'Invalid authentication',
  TX_INSUFFICIENT_BALANCE: 'Insufficient XLM balance',
  TX_INSUFFICIENT_FEE: 'Insufficient fee',
  
  // Account errors
  ACCOUNT_NOT_FOUND: 'Account not found on network',
  ACCOUNT_NOT_FUNDED: 'Account needs to be funded',
  
  // Contract errors
  CONTRACT_NOT_FOUND: 'Smart contract not found',
  CONTRACT_INVOKE_FAILED: 'Contract invocation failed',
  
  // Wallet errors
  WALLET_NOT_CONNECTED: 'Wallet not connected',
  WALLET_REJECTED: 'Transaction rejected by user',
  WALLET_NOT_INSTALLED: 'Freighter wallet not installed',
  
  // Network errors
  NETWORK_ERROR: 'Network error occurred',
  RPC_ERROR: 'RPC server error',
}

/**
 * Contract-specific error messages
 */
const CONTRACT_ERRORS = {
  ALREADY_INITIALIZED: 'Contract already initialized',
  ALREADY_REGISTERED: 'Address already registered',
  NOT_REGISTERED: 'User not registered',
  NOT_VERIFIED: 'User not verified',
  NOT_INSPECTOR: 'Only Land Inspector can perform this action',
  INVALID_FRACTIONS: 'Invalid number of fractions (must be 1-100)',
  ALL_FRACTIONS_SOLD: 'All fractions have been sold',
  ALREADY_OWNS_FRACTION: 'Buyer already owns a fraction of this land',
  NOT_FRACTIONAL_LAND: 'This is not fractional land',
  IS_FRACTIONAL_LAND: 'This is fractional land',
  CANNOT_TRANSFER_FRACTIONAL: 'Cannot transfer ownership of fractional land',
  NOT_SELLER: 'Only the seller can perform this action',
  NOT_BUYER: 'Only the buyer can perform this action',
  REQUEST_NOT_APPROVED: 'Request not approved',
  PAYMENT_ALREADY_RECEIVED: 'Payment already received',
  LAND_NOT_FOUND: 'Land not found',
  SELLER_NOT_FOUND: 'Seller not found',
  BUYER_NOT_FOUND: 'Buyer not found',
  REQUEST_NOT_FOUND: 'Request not found',
}

/**
 * Parse Stellar error
 */
export const parseStellarError = (error) => {
  if (!error) return 'Unknown error occurred'

  const errorString = error.toString().toLowerCase()
  const errorMessage = error.message?.toLowerCase() || ''

  // Check for wallet errors
  if (errorString.includes('user declined') || errorString.includes('rejected')) {
    return STELLAR_ERRORS.WALLET_REJECTED
  }

  if (errorString.includes('freighter') || errorMessage.includes('freighter')) {
    return STELLAR_ERRORS.WALLET_NOT_INSTALLED
  }

  // Check for account errors
  if (errorString.includes('account not found')) {
    return STELLAR_ERRORS.ACCOUNT_NOT_FOUND
  }

  if (errorString.includes('account requires a minimum balance')) {
    return STELLAR_ERRORS.ACCOUNT_NOT_FUNDED
  }

  // Check for balance errors
  if (errorString.includes('insufficient balance') || errorString.includes('underfunded')) {
    return STELLAR_ERRORS.TX_INSUFFICIENT_BALANCE
  }

  // Check for transaction errors
  if (errorString.includes('tx_failed') || errorString.includes('transaction failed')) {
    return STELLAR_ERRORS.TX_FAILED
  }

  if (errorString.includes('timeout')) {
    return STELLAR_ERRORS.TX_TIMEOUT
  }

  if (errorString.includes('bad_auth')) {
    return STELLAR_ERRORS.TX_BAD_AUTH
  }

  // Check for contract errors
  if (errorString.includes('contract not found')) {
    return STELLAR_ERRORS.CONTRACT_NOT_FOUND
  }

  // Check for network errors
  if (errorString.includes('network') || errorString.includes('connection')) {
    return STELLAR_ERRORS.NETWORK_ERROR
  }

  // Return original message if no match
  return error.message || errorString || 'Unknown error occurred'
}

/**
 * Parse contract-specific error from panic message
 */
export const parseContractError = (error) => {
  if (!error) return 'Contract error occurred'

  const errorString = error.toString().toLowerCase()
  const errorMessage = error.message?.toLowerCase() || ''

  // Check each contract error
  for (const [key, message] of Object.entries(CONTRACT_ERRORS)) {
    const searchTerm = message.toLowerCase()
    if (errorString.includes(searchTerm) || errorMessage.includes(searchTerm)) {
      return message
    }
  }

  // Check for common patterns
  if (errorString.includes('already initialized')) {
    return CONTRACT_ERRORS.ALREADY_INITIALIZED
  }

  if (errorString.includes('already registered')) {
    return CONTRACT_ERRORS.ALREADY_REGISTERED
  }

  if (errorString.includes('not registered')) {
    return CONTRACT_ERRORS.NOT_REGISTERED
  }

  if (errorString.includes('not verified')) {
    return CONTRACT_ERRORS.NOT_VERIFIED
  }

  if (errorString.includes('inspector')) {
    return CONTRACT_ERRORS.NOT_INSPECTOR
  }

  return parseStellarError(error)
}

/**
 * Handle error with toast notification
 */
export const handleError = (error, customMessage = null) => {
  console.error('Error:', error)

  const errorMessage = customMessage || parseContractError(error)
  toast.error(errorMessage)

  return errorMessage
}

/**
 * Wrap async function with error handling
 */
export const withErrorHandling = (fn, customErrorMessage = null) => {
  return async (...args) => {
    try {
      return await fn(...args)
    } catch (error) {
      handleError(error, customErrorMessage)
      throw error
    }
  }
}

/**
 * Validate transaction before submission
 */
export const validateTransaction = async (publicKey, server) => {
  try {
    // Check if account exists
    const account = await server.loadAccount(publicKey)
    
    // Check XLM balance
    const nativeBalance = account.balances.find(b => b.asset_type === 'native')
    const balance = parseFloat(nativeBalance?.balance || 0)
    
    if (balance < 0.5) {
      throw new Error(STELLAR_ERRORS.TX_INSUFFICIENT_BALANCE)
    }

    return true
  } catch (error) {
    if (error.message === STELLAR_ERRORS.TX_INSUFFICIENT_BALANCE) {
      throw error
    }
    throw new Error(STELLAR_ERRORS.ACCOUNT_NOT_FOUND)
  }
}

/**
 * Retry function with exponential backoff
 */
export const retryWithBackoff = async (fn, maxRetries = 3, baseDelay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      if (i === maxRetries - 1) throw error
      
      const delay = baseDelay * Math.pow(2, i)
      console.log(`Retry ${i + 1}/${maxRetries} after ${delay}ms`)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
}

/**
 * Check if error is recoverable
 */
export const isRecoverableError = (error) => {
  const errorString = error.toString().toLowerCase()
  
  const recoverableErrors = [
    'timeout',
    'network',
    'connection',
    'rate limit',
  ]

  return recoverableErrors.some(term => errorString.includes(term))
}

/**
 * Format error for display
 */
export const formatErrorMessage = (error) => {
  if (typeof error === 'string') return error
  
  const parsed = parseContractError(error)
  
  return {
    title: 'Error',
    message: parsed,
    details: error.message || error.toString(),
  }
}

/**
 * Log error for debugging
 */
export const logError = (error, context = {}) => {
  const errorLog = {
    timestamp: new Date().toISOString(),
    message: error.message || error.toString(),
    stack: error.stack,
    context,
  }

  console.error('Error Log:', errorLog)

  // In production, you might want to send this to a logging service
  if (import.meta.env.PROD) {
    // Send to logging service
  }

  return errorLog
}

/**
 * Create user-friendly error message
 */
export const getUserFriendlyError = (error) => {
  const parsed = parseContractError(error)

  const friendlyMessages = {
    [STELLAR_ERRORS.TX_INSUFFICIENT_BALANCE]: 
      'You need more XLM in your wallet to complete this transaction. Please add funds and try again.',
    
    [STELLAR_ERRORS.WALLET_NOT_INSTALLED]: 
      'Please install the Freighter wallet extension to use this app.',
    
    [STELLAR_ERRORS.WALLET_REJECTED]: 
      'You rejected the transaction. Please try again when ready.',
    
    [CONTRACT_ERRORS.NOT_VERIFIED]: 
      'Your account needs to be verified by a Land Inspector before you can proceed.',
    
    [CONTRACT_ERRORS.NOT_REGISTERED]: 
      'Please register your account before proceeding.',
    
    [CONTRACT_ERRORS.ALL_FRACTIONS_SOLD]: 
      'Sorry, all fractions of this land have been sold.',
  }

  return friendlyMessages[parsed] || parsed
}

export default {
  parseStellarError,
  parseContractError,
  handleError,
  withErrorHandling,
  validateTransaction,
  retryWithBackoff,
  isRecoverableError,
  formatErrorMessage,
  logError,
  getUserFriendlyError,
  STELLAR_ERRORS,
  CONTRACT_ERRORS,
}
