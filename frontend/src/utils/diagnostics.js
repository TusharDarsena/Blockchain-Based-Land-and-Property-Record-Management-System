import { toast } from 'react-toastify'
import { getSorobanServer } from './stellar'

/**
 * Check if account is funded and ready for transactions
 */
export const checkAccountReadiness = async (publicKey) => {
  try {
    const server = getSorobanServer()
    const account = await server.getAccount(publicKey)
    
    // Check XLM balance
    const balances = account.balances
    const xlmBalance = balances.find(b => b.asset_type === 'native')
    const balance = xlmBalance ? parseFloat(xlmBalance.balance) : 0
    
    console.log('Account Diagnostics:')
    console.log('- Public Key:', publicKey)
    console.log('- XLM Balance:', balance)
    console.log('- Sequence Number:', account.sequence)
    
    if (balance < 1) {
      toast.error(
        'Insufficient XLM balance! Please fund your testnet account at: https://laboratory.stellar.org/#account-creator',
        { autoClose: 10000 }
      )
      return false
    }
    
    if (balance < 5) {
      toast.warning(
        `Low XLM balance (${balance.toFixed(2)} XLM). Consider adding more for multiple transactions.`,
        { autoClose: 5000 }
      )
    }
    
    return true
  } catch (error) {
    if (error.response?.status === 404) {
      toast.error(
        'Account not found! Please create and fund your testnet account at: https://laboratory.stellar.org/#account-creator',
        { autoClose: 10000 }
      )
      return false
    }
    
    console.error('Account check error:', error)
    toast.error(`Error checking account: ${error.message}`)
    return false
  }
}

/**
 * Verify Freighter wallet connection and network
 */
export const verifyFreighterSetup = async () => {
  try {
    // Check if Freighter is installed
    if (!window.freighter) {
      toast.error(
        'Freighter wallet not detected. Please install it from: https://www.freighter.app/',
        { autoClose: 10000 }
      )
      return false
    }
    
    // Check network
    // Note: This is a basic check, actual network verification happens during transaction
    console.log('Freighter wallet detected')
    return true
  } catch (error) {
    console.error('Freighter verification error:', error)
    return false
  }
}

/**
 * Display helpful troubleshooting tips
 */
export const showTroubleshootingTips = () => {
  console.log(`
╔════════════════════════════════════════════════════════════════╗
║  STELLAR TESTNET TROUBLESHOOTING GUIDE                         ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║  1. FUND YOUR ACCOUNT:                                         ║
║     https://laboratory.stellar.org/#account-creator            ║
║                                                                ║
║  2. CHECK FREIGHTER NETWORK:                                   ║
║     Open Freighter → Settings → Network → Select "Testnet"    ║
║                                                                ║
║  3. ENSURE ACCOUNT IS UNLOCKED:                                ║
║     Freighter should not be locked during transactions         ║
║                                                                ║
║  4. CHECK CONSOLE FOR ERRORS:                                  ║
║     Press F12 and look at Console tab                          ║
║                                                                ║
║  5. VERIFY CONTRACT IS DEPLOYED:                               ║
║     Check .env file for VITE_LAND_REGISTRY_CONTRACT_ID         ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
  `)
}
