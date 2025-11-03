import React, { createContext, useContext, useState, useEffect } from 'react'
import { getStellarServer, getFreighterPublicKey, isFreighterInstalled } from '../utils/stellar'
import { toast } from 'react-toastify'

const StellarContext = createContext()

export const useStellar = () => {
  const context = useContext(StellarContext)
  if (!context) {
    throw new Error('useStellar must be used within a StellarProvider')
  }
  return context
}

export const StellarProvider = ({ children }) => {
  const [publicKey, setPublicKey] = useState(null)
  const [server, setServer] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [network, setNetwork] = useState(import.meta.env.VITE_STELLAR_NETWORK || 'testnet')

  useEffect(() => {
    initializeStellar()
  }, [])

  const initializeStellar = async () => {
    try {
      const stellarServer = getStellarServer()
      setServer(stellarServer)
      
      // Check if Freighter is installed
      const installed = await isFreighterInstalled()
      if (!installed) {
        console.log('Freighter wallet not detected')
      }
    } catch (error) {
      console.error('Failed to initialize Stellar:', error)
    }
  }

  const connectWallet = async () => {
    setIsLoading(true)
    try {
      const installed = await isFreighterInstalled()
      if (!installed) {
        toast.error('Please install Freighter wallet extension')
        window.open('https://www.freighter.app/', '_blank')
        return false
      }

      const pubKey = await getFreighterPublicKey()
      if (pubKey) {
        setPublicKey(pubKey)
        setIsConnected(true)
        toast.success('Wallet connected successfully!')
        return true
      } else {
        toast.error('Failed to connect wallet')
        return false
      }
    } catch (error) {
      console.error('Wallet connection error:', error)
      toast.error(`Failed to connect: ${error.message}`)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const disconnectWallet = () => {
    setPublicKey(null)
    setIsConnected(false)
    toast.info('Wallet disconnected')
  }

  const value = {
    publicKey,
    server,
    isConnected,
    isLoading,
    network,
    connectWallet,
    disconnectWallet,
  }

  return (
    <StellarContext.Provider value={value}>
      {children}
    </StellarContext.Provider>
  )
}
