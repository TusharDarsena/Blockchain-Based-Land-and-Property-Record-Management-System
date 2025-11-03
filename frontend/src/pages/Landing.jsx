import React from 'react'
import { motion } from 'framer-motion'

const Landing = () => {
  return (
    <div className="min-h-screen flex items-center justify-center relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <h1 className="text-6xl font-display gradient-text mb-4">
          Fractional
        </h1>
        <p className="text-xl text-stellar-blue mb-8">
          Land Registry on Stellar Blockchain
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn btn-primary"
          onClick={() => window.location.href = '/login'}
        >
          Get Started
        </motion.button>
      </motion.div>
    </div>
  )
}

export default Landing
