import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Routes, Route, NavLink } from 'react-router-dom'
import { useStellar } from '../contexts/StellarContext'
import Navbar from '../components/Navbar'
import Loading from '../components/Loading'
import { 
  getAllSellers, 
  getAllBuyers, 
  getAllLands,
  verifySeller,
  verifyBuyer,
  verifyLand,
  rejectSeller,
  rejectBuyer
} from '../utils/contractInteraction'
import { toast } from 'react-toastify'
import { Users, Home, CheckCircle, XCircle, Clock, User } from 'lucide-react'

const InspectorDashboard = () => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar title="Land Inspector Dashboard" />
        <Loading message="Loading dashboard..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen relative z-10">
      <Navbar title="Land Inspector Dashboard" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-6 rounded-xl bg-gradient-stellar"
        >
          <h3 className="text-lg font-semibold text-dark mb-2">
            Welcome, Land Inspector
          </h3>
          <p className="text-gray-800">
            Review and verify buyer registrations, seller registrations, and land listings.
          </p>
        </motion.div>

        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-8 overflow-x-auto">
          <NavLink
            to="/inspector"
            end
            className={({ isActive }) =>
              `px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-gradient-stellar text-dark'
                  : 'bg-gray-800/50 text-gray-400 hover:text-stellar-gold'
              }`
            }
          >
            <Users className="w-4 h-4 inline mr-2" />
            Buyer Verifications
          </NavLink>
          <NavLink
            to="/inspector/sellers"
            className={({ isActive }) =>
              `px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-gradient-stellar text-dark'
                  : 'bg-gray-800/50 text-gray-400 hover:text-stellar-gold'
              }`
            }
          >
            <User className="w-4 h-4 inline mr-2" />
            Seller Verifications
          </NavLink>
          <NavLink
            to="/inspector/lands"
            className={({ isActive }) =>
              `px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-gradient-stellar text-dark'
                  : 'bg-gray-800/50 text-gray-400 hover:text-stellar-gold'
              }`
            }
          >
            <Home className="w-4 h-4 inline mr-2" />
            Land Verifications
          </NavLink>
        </div>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<BuyerVerifications />} />
          <Route path="/sellers" element={<SellerVerifications />} />
          <Route path="/lands" element={<LandVerifications />} />
        </Routes>
      </div>
    </div>
  )
}

// Buyer Verifications Component
const BuyerVerifications = () => {
  const { publicKey } = useStellar()
  const [buyers, setBuyers] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('pending') // 'all', 'pending', 'verified', 'rejected'

  useEffect(() => {
    loadBuyers()
  }, [])

  const loadBuyers = async () => {
    try {
      const allBuyers = await getAllBuyers()
      setBuyers(allBuyers)
    } catch (error) {
      console.error('Error loading buyers:', error)
      toast.error('Failed to load buyers')
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async (buyerAddress, approve) => {
    try {
      if (approve) {
        await verifyBuyer(publicKey, buyerAddress)
      } else {
        await rejectBuyer(publicKey, buyerAddress)
      }
      toast.success(`Buyer ${approve ? 'approved' : 'rejected'} successfully`)
      loadBuyers()
    } catch (error) {
      console.error('Error verifying buyer:', error)
      toast.error('Failed to verify buyer')
    }
  }

  const filteredBuyers = buyers.filter(buyer => {
    if (filter === 'pending') return !buyer.verified && !buyer.rejected
    if (filter === 'verified') return buyer.verified
    if (filter === 'rejected') return buyer.rejected
    return true
  })

  if (loading) return <Loading message="Loading buyers..." />

  return (
    <div>
      {/* Filter Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setFilter('pending')}
          className={`btn ${filter === 'pending' ? 'btn-primary' : 'btn-outline'}`}
        >
          <Clock className="w-4 h-4 mr-2" />
          Pending
        </button>
        <button
          onClick={() => setFilter('verified')}
          className={`btn ${filter === 'verified' ? 'btn-primary' : 'btn-outline'}`}
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Verified
        </button>
        <button
          onClick={() => setFilter('rejected')}
          className={`btn ${filter === 'rejected' ? 'btn-primary' : 'btn-outline'}`}
        >
          <XCircle className="w-4 h-4 mr-2" />
          Rejected
        </button>
        <button
          onClick={() => setFilter('all')}
          className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline'}`}
        >
          All
        </button>
      </div>

      {/* Buyers List */}
      {filteredBuyers.length === 0 ? (
        <div className="card text-center py-12">
          <Users className="w-16 h-16 mx-auto text-gray-600 mb-4" />
          <p className="text-gray-400">No buyers found in this category</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredBuyers.map((buyer, index) => (
            <motion.div
              key={buyer.address || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-xl font-semibold text-stellar-gold">
                      {buyer.name}
                    </h3>
                    {buyer.verified && (
                      <span className="badge badge-success">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified
                      </span>
                    )}
                    {buyer.rejected && (
                      <span className="badge badge-error">
                        <XCircle className="w-3 h-3 mr-1" />
                        Rejected
                      </span>
                    )}
                    {!buyer.verified && !buyer.rejected && (
                      <span className="badge badge-warning">
                        <Clock className="w-3 h-3 mr-1" />
                        Pending
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Age</p>
                      <p className="text-white">{buyer.age}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">City</p>
                      <p className="text-white">{buyer.city}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Aadhar</p>
                      <p className="text-white">{buyer.aadhar_number}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">PAN</p>
                      <p className="text-white">{buyer.pan_number}</p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <p className="text-xs text-gray-500 break-all">
                      Address: {buyer.address}
                    </p>
                  </div>
                </div>

                {!buyer.verified && !buyer.rejected && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleVerify(buyer.address, true)}
                      className="btn btn-success"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleVerify(buyer.address, false)}
                      className="btn btn-error"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

// Seller Verifications Component
const SellerVerifications = () => {
  const { publicKey } = useStellar()
  const [sellers, setSellers] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('pending')

  useEffect(() => {
    loadSellers()
  }, [])

  const loadSellers = async () => {
    try {
      const allSellers = await getAllSellers()
      setSellers(allSellers)
    } catch (error) {
      console.error('Error loading sellers:', error)
      toast.error('Failed to load sellers')
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async (sellerAddress, approve) => {
    try {
      if (approve) {
        await verifySeller(publicKey, sellerAddress)
      } else {
        await rejectSeller(publicKey, sellerAddress)
      }
      toast.success(`Seller ${approve ? 'approved' : 'rejected'} successfully`)
      loadSellers()
    } catch (error) {
      console.error('Error verifying seller:', error)
      toast.error('Failed to verify seller')
    }
  }

  const filteredSellers = sellers.filter(seller => {
    if (filter === 'pending') return !seller.verified && !seller.rejected
    if (filter === 'verified') return seller.verified
    if (filter === 'rejected') return seller.rejected
    return true
  })

  if (loading) return <Loading message="Loading sellers..." />

  return (
    <div>
      {/* Filter Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setFilter('pending')}
          className={`btn ${filter === 'pending' ? 'btn-primary' : 'btn-outline'}`}
        >
          <Clock className="w-4 h-4 mr-2" />
          Pending
        </button>
        <button
          onClick={() => setFilter('verified')}
          className={`btn ${filter === 'verified' ? 'btn-primary' : 'btn-outline'}`}
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Verified
        </button>
        <button
          onClick={() => setFilter('rejected')}
          className={`btn ${filter === 'rejected' ? 'btn-primary' : 'btn-outline'}`}
        >
          <XCircle className="w-4 h-4 mr-2" />
          Rejected
        </button>
        <button
          onClick={() => setFilter('all')}
          className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline'}`}
        >
          All
        </button>
      </div>

      {/* Sellers List */}
      {filteredSellers.length === 0 ? (
        <div className="card text-center py-12">
          <User className="w-16 h-16 mx-auto text-gray-600 mb-4" />
          <p className="text-gray-400">No sellers found in this category</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredSellers.map((seller, index) => (
            <motion.div
              key={seller.address || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-xl font-semibold text-stellar-gold">
                      {seller.name}
                    </h3>
                    {seller.verified && (
                      <span className="badge badge-success">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified
                      </span>
                    )}
                    {seller.rejected && (
                      <span className="badge badge-error">
                        <XCircle className="w-3 h-3 mr-1" />
                        Rejected
                      </span>
                    )}
                    {!seller.verified && !seller.rejected && (
                      <span className="badge badge-warning">
                        <Clock className="w-3 h-3 mr-1" />
                        Pending
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Age</p>
                      <p className="text-white">{seller.age}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Lands Owned</p>
                      <p className="text-white">{seller.lands_owned}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Aadhar</p>
                      <p className="text-white">{seller.aadhar_number}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">PAN</p>
                      <p className="text-white">{seller.pan_number}</p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <p className="text-xs text-gray-500 break-all">
                      Address: {seller.address}
                    </p>
                  </div>
                </div>

                {!seller.verified && !seller.rejected && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleVerify(seller.address, true)}
                      className="btn btn-success"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleVerify(seller.address, false)}
                      className="btn btn-error"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

// Land Verifications Component
const LandVerifications = () => {
  const { publicKey } = useStellar()
  const [lands, setLands] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('pending')

  useEffect(() => {
    loadLands()
  }, [])

  const loadLands = async () => {
    try {
      const allLands = await getAllLands()
      setLands(allLands)
    } catch (error) {
      console.error('Error loading lands:', error)
      toast.error('Failed to load lands')
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async (landId, approve) => {
    try {
      if (approve) {
        await verifyLand(publicKey, landId)
        toast.success('Land approved successfully')
      } else {
        // TODO: Add rejectLand function to contract
        toast.info('Land rejection functionality pending in contract')
      }
      loadLands()
    } catch (error) {
      console.error('Error verifying land:', error)
      toast.error('Failed to verify land')
    }
  }

  const filteredLands = lands.filter(land => {
    if (filter === 'pending') return !land.verified && !land.rejected
    if (filter === 'verified') return land.verified
    if (filter === 'rejected') return land.rejected
    return true
  })

  if (loading) return <Loading message="Loading lands..." />

  return (
    <div>
      {/* Filter Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setFilter('pending')}
          className={`btn ${filter === 'pending' ? 'btn-primary' : 'btn-outline'}`}
        >
          <Clock className="w-4 h-4 mr-2" />
          Pending
        </button>
        <button
          onClick={() => setFilter('verified')}
          className={`btn ${filter === 'verified' ? 'btn-primary' : 'btn-outline'}`}
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Verified
        </button>
        <button
          onClick={() => setFilter('rejected')}
          className={`btn ${filter === 'rejected' ? 'btn-primary' : 'btn-outline'}`}
        >
          <XCircle className="w-4 h-4 mr-2" />
          Rejected
        </button>
        <button
          onClick={() => setFilter('all')}
          className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline'}`}
        >
          All
        </button>
      </div>

      {/* Lands List */}
      {filteredLands.length === 0 ? (
        <div className="card text-center py-12">
          <Home className="w-16 h-16 mx-auto text-gray-600 mb-4" />
          <p className="text-gray-400">No lands found in this category</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredLands.map((land, index) => (
            <motion.div
              key={land.id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-xl font-semibold text-stellar-gold">
                      {land.city}, {land.state}
                    </h3>
                    {land.is_fractional && (
                      <span className="badge badge-info">Fractional</span>
                    )}
                    {land.verified && (
                      <span className="badge badge-success">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified
                      </span>
                    )}
                    {land.rejected && (
                      <span className="badge badge-error">
                        <XCircle className="w-3 h-3 mr-1" />
                        Rejected
                      </span>
                    )}
                    {!land.verified && !land.rejected && (
                      <span className="badge badge-warning">
                        <Clock className="w-3 h-3 mr-1" />
                        Pending
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Area</p>
                      <p className="text-white">{land.area} sq.ft</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Price</p>
                      <p className="text-white">{land.price} XLM</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Property PID</p>
                      <p className="text-white">{land.property_pid}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Survey No.</p>
                      <p className="text-white">{land.physical_survey_number}</p>
                    </div>
                  </div>

                  {land.is_fractional && (
                    <div className="mt-3 flex gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">Total Shares</p>
                        <p className="text-white">{land.total_shares}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Available Shares</p>
                        <p className="text-white">{land.available_shares}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Price/Share</p>
                        <p className="text-white">{land.price_per_share} XLM</p>
                      </div>
                    </div>
                  )}

                  <div className="mt-3">
                    <p className="text-xs text-gray-500 break-all">
                      Owner: {land.owner}
                    </p>
                  </div>
                </div>

                {!land.verified && !land.rejected && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleVerify(land.id, true)}
                      className="btn btn-success"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleVerify(land.id, false)}
                      className="btn btn-error"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default InspectorDashboard
