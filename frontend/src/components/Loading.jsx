import React from 'react'
import { motion } from 'framer-motion'

const Loading = ({ message = 'Loading...' }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-12"
    >
      <div className="spinner mb-4"></div>
      <p className="text-stellar-blue text-lg">{message}</p>
    </motion.div>
  )
}

export default Loading
