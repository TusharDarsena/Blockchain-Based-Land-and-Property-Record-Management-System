import * as StellarSdk from '@stellar/stellar-sdk'
import { requestAccess, getPublicKey, signTransaction } from '@stellar/freighter-api'

// Network configuration
const NETWORK = import.meta.env.VITE_STELLAR_NETWORK || 'testnet'
const HORIZON_URL = import.meta.env.VITE_STELLAR_HORIZON_URL || 'https://horizon-testnet.stellar.org'
const SOROBAN_RPC_URL = import.meta.env.VITE_STELLAR_SOROBAN_RPC_URL || 'https://soroban-testnet.stellar.org'
const NETWORK_PASSPHRASE = import.meta.env.VITE_STELLAR_NETWORK_PASSPHRASE || StellarSdk.Networks.TESTNET

/**
 * Get Stellar Server instance
 */
export const getStellarServer = () => {
  return new StellarSdk.Horizon.Server(HORIZON_URL)
}

/**
 * Get Soroban RPC Server instance
 */
export const getSorobanServer = () => {
  return new StellarSdk.SorobanRpc.Server(SOROBAN_RPC_URL)
}

/**
 * Check if Freighter wallet is installed
 */
export const isFreighterInstalled = async () => {
  return await requestAccess().then(() => true).catch(() => false)
}

/**
 * Get public key from Freighter wallet
 */
export const getFreighterPublicKey = async () => {
  try {
    const publicKey = await getPublicKey()
    return publicKey
  } catch (error) {
    console.error('Error getting public key:', error)
    throw error
  }
}

/**
 * Sign transaction with Freighter
 */
export const signTransactionWithFreighter = async (xdr, network = NETWORK_PASSPHRASE) => {
  try {
    const signedXdr = await signTransaction(xdr, { network })
    return signedXdr
  } catch (error) {
    console.error('Error signing transaction:', error)
    throw error
  }
}

/**
 * Get account details
 */
export const getAccountDetails = async (publicKey) => {
  try {
    const server = getStellarServer()
    const account = await server.loadAccount(publicKey)
    return account
  } catch (error) {
    console.error('Error loading account:', error)
    throw error
  }
}

/**
 * Get account balance
 */
export const getAccountBalance = async (publicKey) => {
  try {
    const account = await getAccountDetails(publicKey)
    const nativeBalance = account.balances.find(balance => balance.asset_type === 'native')
    return nativeBalance ? parseFloat(nativeBalance.balance) : 0
  } catch (error) {
    console.error('Error getting balance:', error)
    return 0
  }
}

/**
 * Format Stellar address (shorten for display)
 */
export const formatAddress = (address) => {
  if (!address) return ''
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

/**
 * Validate Stellar address
 */
export const isValidStellarAddress = (address) => {
  try {
    return StellarSdk.StrKey.isValidEd25519PublicKey(address)
  } catch (error) {
    return false
  }
}

/**
 * Convert stroops to XLM
 */
export const stroopsToXLM = (stroops) => {
  return Number(stroops) / 10000000
}

/**
 * Convert XLM to stroops
 */
export const xlmToStroops = (xlm) => {
  return Math.floor(Number(xlm) * 10000000)
}

// Export constants
export { NETWORK, NETWORK_PASSPHRASE, HORIZON_URL, SOROBAN_RPC_URL }

export default {
  getStellarServer,
  getSorobanServer,
  isFreighterInstalled,
  getFreighterPublicKey,
  signTransactionWithFreighter,
  getAccountDetails,
  getAccountBalance,
  formatAddress,
  isValidStellarAddress,
  stroopsToXLM,
  xlmToStroops,
  NETWORK,
  NETWORK_PASSPHRASE,
  HORIZON_URL,
  SOROBAN_RPC_URL,
}
