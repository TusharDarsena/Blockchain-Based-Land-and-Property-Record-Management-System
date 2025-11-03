import React, { createContext, useContext, useState, useEffect } from 'react'
import { useStellar } from './StellarContext'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const { publicKey, isConnected } = useStellar()
  const [userRole, setUserRole] = useState(null) // 'buyer', 'seller', 'inspector', or null
  const [userData, setUserData] = useState(null)
  const [isRegistered, setIsRegistered] = useState(false)

  useEffect(() => {
    if (isConnected && publicKey) {
      checkUserRegistration()
    } else {
      resetAuth()
    }
  }, [isConnected, publicKey])

  const checkUserRegistration = async () => {
    // This will be implemented when we create contract interaction utilities
    // For now, just set initial state
    setIsRegistered(false)
    setUserRole(null)
    setUserData(null)
  }

  const resetAuth = () => {
    setUserRole(null)
    setUserData(null)
    setIsRegistered(false)
  }

  const updateUserData = (role, data) => {
    setUserRole(role)
    setUserData(data)
    setIsRegistered(true)
  }

  const value = {
    userRole,
    userData,
    isRegistered,
    updateUserData,
    resetAuth,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
