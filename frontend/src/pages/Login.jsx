import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useStellar } from '../contexts/StellarContext'
import { useAuth } from '../contexts/AuthContext'
import { getBuyer, getSeller, isLandInspector } from '../utils/contractInteraction'
import { Wallet, UserPlus, Store, Shield, ArrowLeft } from 'lucide-react'
import { toast } from 'react-toastify'

const Login = () => {
  const navigate = useNavigate()
  const { connectWallet, isConnected, publicKey, isLoading } = useStellar()
  const { updateUserData } = useAuth()
  const [checking, setChecking] = useState(false)

  useEffect(() => {
    if (isConnected && publicKey) {
      checkUserStatus()
    }
  }, [isConnected, publicKey])

  const checkUserStatus = async () => {
    setChecking(true)
    try {
      // FIRST: Check if this is the designated inspector address (even if contract not initialized)
      const DESIGNATED_INSPECTOR = 'GDMORAOEBRU43PT4L4FLIJQGJTHZTXKCYDBIVKN676XY3AI7VLHJMJWR'
      if (publicKey === DESIGNATED_INSPECTOR) {
        updateUserData('inspector', { address: publicKey })
        toast.success('Welcome, Land Inspector!')
        navigate('/inspector')
        return
      }

      // Check if user is Land Inspector (for initialized contracts)
      const inspector = await isLandInspector(publicKey)
      if (inspector) {
        updateUserData('inspector', { address: publicKey })
        toast.success('Welcome, Land Inspector!')
        navigate('/inspector')
        return
      }

      // Check if user is registered as Buyer
      const buyer = await getBuyer(publicKey)
      if (buyer) {
        updateUserData('buyer', buyer)
        if (buyer.verified) {
          toast.success('Welcome back!')
          navigate('/buyer')
        } else if (buyer.rejected) {
          toast.error('Your registration was rejected. Please contact support.')
        } else {
          toast.info('Your registration is pending verification')
          navigate('/buyer')
        }
        return
      }

      // Check if user is registered as Seller
      const seller = await getSeller(publicKey)
      if (seller) {
        updateUserData('seller', seller)
        if (seller.verified) {
          toast.success('Welcome back!')
          navigate('/seller')
        } else if (seller.rejected) {
          toast.error('Your registration was rejected. Please contact support.')
        } else {
          toast.info('Your registration is pending verification')
          navigate('/seller')
        }
        return
      }

      // User not registered - show registration options
      toast.info('Please complete registration')
    } catch (error) {
      console.error('Error checking user status:', error)
    } finally {
      setChecking(false)
    }
  }

  const handleConnect = async () => {
    const success = await connectWallet()
    if (success) {
      // checkUserStatus will be called by useEffect
    }
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-stellar-blue text-lg">Checking your account...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative z-10 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-4xl"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <button
            onClick={() => navigate('/')}
            className="btn btn-ghost mb-6 inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
          
          <h1 className="text-6xl font-display gradient-text mb-4">
            Welcome to Fractional
          </h1>
          <p className="text-xl text-gray-400">
            Connect your wallet to get started
          </p>
        </div>

        {!isConnected ? (
          /* Wallet Connection */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="card text-center max-w-md mx-auto"
          >
            <div className="w-20 h-20 rounded-full bg-gradient-stellar mx-auto mb-6 flex items-center justify-center animate-pulse-glow">
              <Wallet className="w-10 h-10 text-dark" />
            </div>
            
            <h2 className="text-3xl font-display text-stellar-gold mb-4">
              Connect Freighter Wallet
            </h2>
            
            <p className="text-gray-400 mb-8">
              You need a Freighter wallet to use this application. 
              If you don't have one, install it from the link below.
            </p>

            <button
              onClick={handleConnect}
              disabled={isLoading}
              className="btn btn-primary w-full mb-4"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="spinner"></div>
                  Connecting...
                </span>
              ) : (
                'Connect Wallet'
              )}
            </button>

            <a
              href="https://www.freighter.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-stellar-blue hover:text-stellar-gold transition-colors"
            >
              Don't have Freighter? Get it here →
            </a>
          </motion.div>
        ) : (
          /* Registration Options */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="card mb-8 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 text-green-400 border border-green-500/50 mb-4">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                Wallet Connected
              </div>
              <p className="text-gray-400">
                {publicKey?.slice(0, 8)}...{publicKey?.slice(-8)}
              </p>
            </div>

            <h2 className="text-3xl font-display text-center gradient-text mb-8">
              Choose Your Role
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Register as Buyer */}
              <motion.div
                whileHover={{ y: -10, scale: 1.02 }}
                className="card card-hover group cursor-pointer"
                onClick={() => navigate('/register/buyer')}
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-blue flex items-center justify-center mb-6 group-hover:shadow-blue-glow transition-all duration-300">
                  <UserPlus className="w-8 h-8 text-dark" />
                </div>
                
                <h3 className="text-2xl font-display text-stellar-gold mb-3">
                  Register as Buyer
                </h3>
                
                <p className="text-gray-400 mb-6">
                  Browse and purchase land properties. 
                  Buy whole lands or fractional shares.
                </p>

                <ul className="text-sm text-gray-500 space-y-2">
                  <li>✓ Browse available properties</li>
                  <li>✓ Buy fractional ownership</li>
                  <li>✓ Manage your portfolio</li>
                </ul>

                <div className="mt-6">
                  <span className="btn btn-outline w-full group-hover:bg-stellar-blue group-hover:text-dark transition-all">
                    Continue as Buyer →
                  </span>
                </div>
              </motion.div>

              {/* Register as Seller */}
              <motion.div
                whileHover={{ y: -10, scale: 1.02 }}
                className="card card-hover group cursor-pointer"
                onClick={() => navigate('/register/seller')}
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-purple flex items-center justify-center mb-6 group-hover:shadow-purple-glow transition-all duration-300">
                  <Store className="w-8 h-8 text-dark" />
                </div>
                
                <h3 className="text-2xl font-display text-stellar-gold mb-3">
                  Register as Seller
                </h3>
                
                <p className="text-gray-400 mb-6">
                  List your land properties for sale. 
                  Offer whole lands or fractional ownership.
                </p>

                <ul className="text-sm text-gray-500 space-y-2">
                  <li>✓ List land properties</li>
                  <li>✓ Enable fractional sales</li>
                  <li>✓ Manage requests</li>
                </ul>

                <div className="mt-6">
                  <span className="btn btn-outline w-full group-hover:bg-stellar-purple group-hover:text-dark transition-all">
                    Continue as Seller →
                  </span>
                </div>
              </motion.div>
            </div>

            {/* Inspector Notice */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-8 p-6 rounded-xl bg-stellar-violet/10 border border-stellar-violet/30"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-stellar-violet/20 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-stellar-violet" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-stellar-gold mb-2">
                    Land Inspector Access
                  </h4>
                  <p className="text-sm text-gray-400">
                    If you are a Land Inspector, you will be automatically redirected to the inspector dashboard after connecting your wallet.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

export default Login
