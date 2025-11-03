import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useStellar } from '../contexts/StellarContext'
import { useAuth } from '../contexts/AuthContext'
import { formatAddress } from '../utils/stellar'
import { copyToClipboard } from '../utils/helpers'
import { Wallet, LogOut, Copy, Check, Menu, X } from 'lucide-react'
import { toast } from 'react-toastify'

const Navbar = ({ title }) => {
  const { publicKey, disconnectWallet, isConnected } = useStellar()
  const { userRole, userData } = useAuth()
  const [copied, setCopied] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const handleCopyAddress = async () => {
    if (publicKey) {
      const success = await copyToClipboard(publicKey)
      if (success) {
        setCopied(true)
        toast.success('Address copied!')
        setTimeout(() => setCopied(false), 2000)
      }
    }
  }

  const handleDisconnect = () => {
    disconnectWallet()
    window.location.href = '/'
  }

  const getRoleColor = () => {
    switch (userRole) {
      case 'buyer':
        return 'bg-stellar-blue'
      case 'seller':
        return 'bg-stellar-purple'
      case 'inspector':
        return 'bg-stellar-violet'
      default:
        return 'bg-stellar-gold'
    }
  }

  const getRoleLabel = () => {
    return userRole ? userRole.charAt(0).toUpperCase() + userRole.slice(1) : 'User'
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="glass border-b border-stellar-gold/20 sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Title */}
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-display gradient-text">
              Fractional
            </h1>
            {title && (
              <>
                <div className="hidden sm:block w-px h-6 bg-stellar-gold/30"></div>
                <span className="hidden sm:block text-gray-400">{title}</span>
              </>
            )}
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4">
            {/* Role Badge */}
            {userRole && (
              <div className={`px-3 py-1 rounded-full text-xs font-semibold text-dark ${getRoleColor()}`}>
                {getRoleLabel()}
              </div>
            )}

            {/* Wallet Info */}
            {isConnected && publicKey && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/50 border border-stellar-gold/30">
                <Wallet className="w-4 h-4 text-stellar-gold" />
                <span className="text-sm font-mono text-gray-300">
                  {formatAddress(publicKey)}
                </span>
                <button
                  onClick={handleCopyAddress}
                  className="p-1 hover:bg-gray-700 rounded transition-colors"
                  title="Copy address"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
            )}

            {/* Disconnect Button */}
            <button
              onClick={handleDisconnect}
              className="btn btn-ghost"
              title="Disconnect wallet"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-800/50 transition-colors"
          >
            {menuOpen ? (
              <X className="w-6 h-6 text-gray-300" />
            ) : (
              <Menu className="w-6 h-6 text-gray-300" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4 border-t border-stellar-gold/20"
          >
            <div className="space-y-4">
              {/* Role Badge */}
              {userRole && (
                <div className="flex justify-center">
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold text-dark ${getRoleColor()}`}>
                    {getRoleLabel()}
                  </div>
                </div>
              )}

              {/* Wallet Info */}
              {isConnected && publicKey && (
                <div className="p-4 rounded-lg bg-gray-800/50 border border-stellar-gold/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Wallet Address</span>
                    <Wallet className="w-4 h-4 text-stellar-gold" />
                  </div>
                  <p className="text-sm font-mono text-gray-300 break-all mb-2">
                    {publicKey}
                  </p>
                  <button
                    onClick={handleCopyAddress}
                    className="btn btn-outline w-full text-sm"
                  >
                    {copied ? (
                      <span className="flex items-center justify-center gap-2">
                        <Check className="w-4 h-4" />
                        Copied!
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <Copy className="w-4 h-4" />
                        Copy Address
                      </span>
                    )}
                  </button>
                </div>
              )}

              {/* Disconnect Button */}
              <button
                onClick={handleDisconnect}
                className="btn btn-ghost w-full"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Disconnect Wallet
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  )
}

export default Navbar
