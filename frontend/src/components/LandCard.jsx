import React from 'react'
import { motion } from 'framer-motion'
import { MapPin, Ruler, DollarSign, FileText, Share2, CheckCircle, Clock } from 'lucide-react'
import { formatCurrency, formatArea, getStatusColor } from '../utils/helpers'
import { getIPFSUrl } from '../utils/ipfs'

const LandCard = ({ land, onClick, showStatus = false }) => {
  const isFractional = land.is_fractional
  const fractionsSold = land.fractions_sold || 0
  const totalFractions = land.total_fractions || 0
  const availableFractions = totalFractions - fractionsSold
  const pricePerFraction = land.price_per_fraction

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      onClick={onClick}
      className="card card-hover group cursor-pointer"
    >
      {/* Image */}
      {land.ipfs_hash && (
        <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden bg-gray-800">
          <img
            src={getIPFSUrl(land.ipfs_hash)}
            alt={`Land ${land.id}`}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          
          {/* Fractional Badge */}
          {isFractional && (
            <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-stellar-purple/90 text-white text-xs font-semibold flex items-center gap-1">
              <Share2 className="w-3 h-3" />
              Fractional
            </div>
          )}

          {/* Verified Badge */}
          {land.verified && (
            <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-green-500/90 text-white text-xs font-semibold flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Verified
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="space-y-3">
        {/* Title */}
        <div className="flex items-start justify-between">
          <h3 className="text-xl font-display text-stellar-gold group-hover:text-stellar-blue transition-colors">
            Land #{land.id}
          </h3>
          {showStatus && land.status && (
            <span className={`badge ${getStatusColor(land.status)}`}>
              {land.status}
            </span>
          )}
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-gray-400">
          <MapPin className="w-4 h-4" />
          <span>{land.city}, {land.state}</span>
        </div>

        {/* Area */}
        <div className="flex items-center gap-2 text-gray-400">
          <Ruler className="w-4 h-4" />
          <span>{formatArea(land.area)}</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-stellar-gold" />
          {isFractional ? (
            <div>
              <p className="text-lg font-semibold text-stellar-gold">
                {formatCurrency(pricePerFraction)} per fraction
              </p>
              <p className="text-sm text-gray-500">
                Total: {formatCurrency(land.land_price)}
              </p>
            </div>
          ) : (
            <p className="text-lg font-semibold text-stellar-gold">
              {formatCurrency(land.land_price)}
            </p>
          )}
        </div>

        {/* Fractional Info */}
        {isFractional && (
          <div className="pt-3 border-t border-stellar-gold/20">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-400">Fractions Available</span>
              <span className="text-stellar-blue font-semibold">
                {availableFractions} / {totalFractions}
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(fractionsSold / totalFractions) * 100}%` }}
                transition={{ duration: 1, delay: 0.2 }}
                className="h-full bg-gradient-stellar"
              />
            </div>

            <p className="text-xs text-gray-500 mt-2">
              {((fractionsSold / totalFractions) * 100).toFixed(0)}% sold
            </p>
          </div>
        )}

        {/* Additional Info */}
        <div className="pt-3 border-t border-stellar-gold/20 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <FileText className="w-3 h-3" />
            <span>PID: {land.property_pid}</span>
          </div>
          <div className="flex items-center gap-1">
            <FileText className="w-3 h-3" />
            <span>Survey: {land.physical_survey_number}</span>
          </div>
        </div>
      </div>

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 rounded-2xl border-2 border-stellar-gold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </motion.div>
  )
}

export default LandCard
