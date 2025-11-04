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
  rejectBuyer,
  isLandInspector,
  initializeContract
} from '../utils/contractInteraction'
import { toast } from 'react-toastify'
import { Users, Home, CheckCircle, XCircle, Clock, User, Settings } from 'lucide-react'

const InspectorDashboard = () => {
  const { publicKey } = useStellar()
  const [loading, setLoading] = useState(true)
  const [isInitialized, setIsInitialized] = useState(null)
  const [showSetup, setShowSetup] = useState(false)

  useEffect(() => {
    checkInitialization()
  }, [])

  const checkInitialization = async () => {
    try {
      // Check if contract is initialized by checking if there's an inspector
      const inspectorExists = await isLandInspector('GDMORAOEBRU43PT4L4FLIJQGJTHZTXKCYDBIVKN676XY3AI7VLHJMJWR')
      setIsInitialized(inspectorExists !== null && inspectorExists !== false)
    } catch (error) {
      console.error('Error checking initialization:', error)
      setIsInitialized(false)
    } finally {
      setLoading(false)
    }
  }

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
        {/* Contract Setup Banner (only show if not initialized) */}
        {isInitialized === false && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 rounded-xl bg-yellow-500/10 border border-yellow-500/30"
          >
            <div className="flex items-start gap-4">
              <Settings className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-yellow-500 mb-2">
                  Contract Not Initialized
                </h3>
                <p className="text-gray-400 mb-4">
                  The land registry contract needs to be initialized before you can manage verifications. 
                  This is a one-time setup that designates the Land Inspector.
                </p>
                <button
                  onClick={() => setShowSetup(!showSetup)}
                  className="btn btn-primary"
                >
                  {showSetup ? 'Hide Setup' : 'Initialize Contract'}
                </button>
              </div>
            </div>
            
            {showSetup && <ContractSetup onComplete={checkInitialization} />}
          </motion.div>
        )}

        {/* Welcome Banner */}
        {isInitialized && (
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
        )}

        {/* Navigation Tabs */}
        {isInitialized && (
          <>
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
          </>
        )}
      </div>
    </div>
  )
}

// Contract Setup Component
const ContractSetup = ({ onComplete }) => {
  const { publicKey } = useStellar()
  const [formData, setFormData] = useState({
    inspectorAddress: 'GDMORAOEBRU43PT4L4FLIJQGJTHZTXKCYDBIVKN676XY3AI7VLHJMJWR',
    name: '',
    age: '',
    designation: ''
  })
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      await initializeContract(
        publicKey,
        formData.inspectorAddress,
        formData.name,
        parseInt(formData.age),
        formData.designation
      )
      toast.success('Contract initialized successfully!')
      onComplete()
    } catch (error) {
      console.error('Error initializing contract:', error)
      toast.error(`Initialization failed: ${error.message}`)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      className="mt-6 p-6 rounded-xl bg-gray-800/50 border border-gray-700"
    >
      <h4 className="text-xl font-semibold text-stellar-gold mb-4">
        Initialize Land Registry Contract
      </h4>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Inspector Wallet Address
          </label>
          <input
            type="text"
            value={formData.inspectorAddress}
            onChange={(e) => setFormData({ ...formData, inspectorAddress: e.target.value })}
            className="input w-full bg-gray-700/50"
            required
            readOnly
          />
          <p className="text-xs text-gray-500 mt-1">
            This address will have inspector privileges (pre-filled)
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Inspector Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input w-full"
              placeholder="e.g., John Doe"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Age
            </label>
            <input
              type="number"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              className="input w-full"
              placeholder="e.g., 45"
              min="18"
              max="100"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Designation
          </label>
          <input
            type="text"
            value={formData.designation}
            onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
            className="input w-full"
            placeholder="e.g., Government Land Officer"
            required
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary flex-1"
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <div className="spinner"></div>
                Initializing...
              </span>
            ) : (
              'Initialize Contract'
            )}
          </button>
        </div>

        <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
          <p className="text-sm text-blue-400">
            <strong>Note:</strong> This action can only be performed once. The inspector address cannot be changed after initialization.
          </p>
        </div>
      </form>
    </motion.div>
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
