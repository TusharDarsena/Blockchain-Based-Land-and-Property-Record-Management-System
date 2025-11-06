import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Routes, Route, NavLink } from 'react-router-dom'
import { useStellar } from '../contexts/StellarContext'
import { useAuth } from '../contexts/AuthContext'
import Navbar from '../components/Navbar'
import Loading from '../components/Loading'
import LandCard from '../components/LandCard'
import { getAllLands, getUserFractionalLands, getAllRequests, getLand, getLandOwner, makePayment } from '../utils/contractInteraction'
import { Home, ShoppingBag, Wallet as WalletIcon, User, Clock, CheckCircle, XCircle, DollarSign } from 'lucide-react'

const BuyerDashboard = () => {
  const { publicKey } = useStellar()
  const { userData } = useAuth()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1000)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar title="Buyer Dashboard" />
        <Loading message="Loading your dashboard..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen relative z-10">
      <Navbar title="Buyer Dashboard" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Banner */}
        {userData && !userData.verified && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 rounded-xl bg-yellow-500/10 border border-yellow-500/30"
          >
            <h3 className="text-lg font-semibold text-yellow-400 mb-2">
              Verification Pending
            </h3>
            <p className="text-gray-400">
              Your registration is awaiting verification by a Land Inspector. 
              You can browse properties, but purchases will be enabled after verification.
            </p>
          </motion.div>
        )}

        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-8 overflow-x-auto">
          <NavLink
            to="/buyer"
            end
            className={({ isActive }) =>
              `px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-gradient-stellar text-dark'
                  : 'bg-gray-800/50 text-gray-400 hover:text-stellar-gold'
              }`
            }
          >
            <Home className="w-4 h-4 inline mr-2" />
            Browse Lands
          </NavLink>
          <NavLink
            to="/buyer/owned"
            className={({ isActive }) =>
              `px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-gradient-stellar text-dark'
                  : 'bg-gray-800/50 text-gray-400 hover:text-stellar-gold'
              }`
            }
          >
            <WalletIcon className="w-4 h-4 inline mr-2" />
            My Properties
          </NavLink>
          <NavLink
            to="/buyer/requests"
            className={({ isActive }) =>
              `px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-gradient-stellar text-dark'
                  : 'bg-gray-800/50 text-gray-400 hover:text-stellar-gold'
              }`
            }
          >
            <ShoppingBag className="w-4 h-4 inline mr-2" />
            My Requests
          </NavLink>
          <NavLink
            to="/buyer/profile"
            className={({ isActive }) =>
              `px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-gradient-stellar text-dark'
                  : 'bg-gray-800/50 text-gray-400 hover:text-stellar-gold'
              }`
            }
          >
            <User className="w-4 h-4 inline mr-2" />
            Profile
          </NavLink>
        </div>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<BrowseLands />} />
          <Route path="/owned" element={<OwnedProperties />} />
          <Route path="/requests" element={<MyRequests />} />
          <Route path="/profile" element={<BuyerProfile />} />
        </Routes>
      </div>
    </div>
  )
}

// Browse Lands Component
const BrowseLands = () => {
  const [lands, setLands] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // 'all', 'regular', 'fractional'

  useEffect(() => {
    loadLands()
  }, [])

  const loadLands = async () => {
    try {
      const allLands = await getAllLands()
      setLands(allLands)
    } catch (error) {
      console.error('Error loading lands:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredLands = lands.filter(land => {
    if (filter === 'regular') return !land.is_fractional
    if (filter === 'fractional') return land.is_fractional
    return true
  })

  if (loading) return <Loading message="Loading properties..." />

  return (
    <div>
      {/* Filter Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline'}`}
        >
          All Properties
        </button>
        <button
          onClick={() => setFilter('regular')}
          className={`btn ${filter === 'regular' ? 'btn-primary' : 'btn-outline'}`}
        >
          Regular Lands
        </button>
        <button
          onClick={() => setFilter('fractional')}
          className={`btn ${filter === 'fractional' ? 'btn-primary' : 'btn-outline'}`}
        >
          Fractional Lands
        </button>
      </div>

      {/* Lands Grid */}
      {filteredLands.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-400">No properties found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLands.map(land => (
            <LandCard
              key={land.id}
              land={land}
              onClick={() => console.log('View land details:', land)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// Owned Properties Component
const OwnedProperties = () => {
  const { publicKey } = useStellar()
  const [ownedLands, setOwnedLands] = useState([])
  const [fractionalLands, setFractionalLands] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('whole') // 'whole' or 'fractional'

  useEffect(() => {
    loadOwnedProperties()
  }, [publicKey])

  const loadOwnedProperties = async () => {
    if (!publicKey) return
    
    try {
      setLoading(true)
      
      // Get all lands and check which ones the buyer owns
      const allLands = await getAllLands()
      const wholeLands = []
      
      for (const land of allLands) {
        const owner = await getLandOwner(land.id)
        if (owner === publicKey && !land.is_fractional) {
          wholeLands.push(land)
        }
      }
      
      setOwnedLands(wholeLands)
      
      // Get fractional lands owned by the buyer
      const fractionalLandIds = await getUserFractionalLands(publicKey)
      const fractionalDetails = []
      
      if (fractionalLandIds && fractionalLandIds.length > 0) {
        for (const landId of fractionalLandIds) {
          const land = await getLand(landId)
          if (land) {
            fractionalDetails.push(land)
          }
        }
      }
      
      setFractionalLands(fractionalDetails)
    } catch (error) {
      console.error('Error loading owned properties:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Loading message="Loading your properties..." />

  const totalProperties = ownedLands.length + fractionalLands.length

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-2xl font-display gradient-text mb-2">
          Your Properties
        </h3>
        <p className="text-gray-400">
          Total Properties: {totalProperties} ({ownedLands.length} whole, {fractionalLands.length} fractional)
        </p>
      </div>

      {/* Tab Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab('whole')}
          className={`btn ${activeTab === 'whole' ? 'btn-primary' : 'btn-outline'}`}
        >
          Whole Lands ({ownedLands.length})
        </button>
        <button
          onClick={() => setActiveTab('fractional')}
          className={`btn ${activeTab === 'fractional' ? 'btn-primary' : 'btn-outline'}`}
        >
          Fractional Shares ({fractionalLands.length})
        </button>
      </div>

      {/* Whole Lands */}
      {activeTab === 'whole' && (
        <>
          {ownedLands.length === 0 ? (
            <div className="card text-center py-12">
              <Home className="w-16 h-16 mx-auto text-gray-600 mb-4" />
              <p className="text-gray-400">You don't own any whole land properties yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ownedLands.map(land => (
                <LandCard
                  key={land.id}
                  land={land}
                  showOwned={true}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Fractional Lands */}
      {activeTab === 'fractional' && (
        <>
          {fractionalLands.length === 0 ? (
            <div className="card text-center py-12">
              <WalletIcon className="w-16 h-16 mx-auto text-gray-600 mb-4" />
              <p className="text-gray-400">You don't own any fractional shares yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {fractionalLands.map(land => (
                <LandCard
                  key={land.id}
                  land={land}
                  showOwned={true}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

// My Requests Component
const MyRequests = () => {
  const { publicKey } = useStellar()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // 'all', 'pending', 'approved', 'completed'

  useEffect(() => {
    loadRequests()
  }, [publicKey])

  const loadRequests = async () => {
    if (!publicKey) return
    
    try {
      setLoading(true)
      const allRequests = await getAllRequests()
      
      // Filter requests where the buyer is the current user
      const myRequests = allRequests.filter(req => req.buyer_id === publicKey)
      
      // Fetch land details for each request
      const requestsWithLandDetails = await Promise.all(
        myRequests.map(async (req) => {
          const land = await getLand(req.land_id)
          return { ...req, land }
        })
      )
      
      setRequests(requestsWithLandDetails)
    } catch (error) {
      console.error('Error loading requests:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePayment = async (requestId) => {
    try {
      await makePayment(publicKey, requestId)
      loadRequests() // Reload requests after payment
    } catch (error) {
      console.error('Error making payment:', error)
    }
  }

  const filteredRequests = requests.filter(req => {
    if (filter === 'pending') return !req.approved && !req.payment_received
    if (filter === 'approved') return req.approved && !req.payment_received
    if (filter === 'completed') return req.payment_received
    return true
  })

  if (loading) return <Loading message="Loading your requests..." />

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-2xl font-display gradient-text mb-2">
          Purchase Requests
        </h3>
        <p className="text-gray-400">
          Total Requests: {requests.length}
        </p>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline'}`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`btn ${filter === 'pending' ? 'btn-primary' : 'btn-outline'}`}
        >
          <Clock className="w-4 h-4 mr-2" />
          Pending Approval
        </button>
        <button
          onClick={() => setFilter('approved')}
          className={`btn ${filter === 'approved' ? 'btn-primary' : 'btn-outline'}`}
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Approved
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`btn ${filter === 'completed' ? 'btn-primary' : 'btn-outline'}`}
        >
          <DollarSign className="w-4 h-4 mr-2" />
          Completed
        </button>
      </div>

      {/* Requests List */}
      {filteredRequests.length === 0 ? (
        <div className="card text-center py-12">
          <ShoppingBag className="w-16 h-16 mx-auto text-gray-600 mb-4" />
          <p className="text-gray-400">No purchase requests found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <motion.div
              key={request.req_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card"
            >
              <div className="flex flex-col md:flex-row gap-6">
                {/* Land Info */}
                <div className="flex-1">
                  <h4 className="text-xl font-semibold text-stellar-gold mb-2">
                    Request #{request.req_id}
                  </h4>
                  
                  {request.land && (
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-300">
                        <span className="text-gray-500">Land:</span> {request.land.city}, {request.land.state}
                      </p>
                      <p className="text-gray-300">
                        <span className="text-gray-500">Area:</span> {request.land.area} sq. ft.
                      </p>
                      <p className="text-gray-300">
                        <span className="text-gray-500">Price:</span> {
                          request.is_fractional_purchase && request.land.price_per_fraction
                            ? `${Number(request.land.price_per_fraction) / 10000000} XLM (per fraction)`
                            : `${Number(request.land.land_price) / 10000000} XLM`
                        }
                      </p>
                      <p className="text-gray-300">
                        <span className="text-gray-500">Type:</span>{' '}
                        {request.is_fractional_purchase ? (
                          <span className="badge badge-info">Fractional</span>
                        ) : (
                          <span className="badge badge-success">Whole Land</span>
                        )}
                      </p>
                    </div>
                  )}
                </div>

                {/* Status & Actions */}
                <div className="flex flex-col justify-between items-end gap-4">
                  {/* Status Badge */}
                  <div>
                    {request.payment_received ? (
                      <span className="badge badge-success text-lg px-4 py-2">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Completed
                      </span>
                    ) : request.approved ? (
                      <span className="badge badge-info text-lg px-4 py-2">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approved - Awaiting Payment
                      </span>
                    ) : (
                      <span className="badge badge-warning text-lg px-4 py-2">
                        <Clock className="w-4 h-4 mr-2" />
                        Pending Seller Approval
                      </span>
                    )}
                  </div>

                  {/* Payment Button */}
                  {request.approved && !request.payment_received && (
                    <button
                      onClick={() => handlePayment(request.req_id)}
                      className="btn btn-primary"
                    >
                      <DollarSign className="w-4 h-4 mr-2" />
                      Make Payment
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

// Buyer Profile Component
const BuyerProfile = () => {
  const { userData } = useAuth()

  return (
    <div className="max-w-2xl">
      <div className="card">
        <h3 className="text-2xl font-display gradient-text mb-6">
          Buyer Profile
        </h3>
        
        {userData && (
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400">Name</label>
              <p className="text-lg text-white">{userData.name}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400">Age</label>
                <p className="text-lg text-white">{userData.age}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">City</label>
                <p className="text-lg text-white">{userData.city}</p>
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-400">Email</label>
              <p className="text-lg text-white">{userData.email}</p>
            </div>
            <div>
              <label className="text-sm text-gray-400">Status</label>
              <div className="mt-2">
                {userData.verified ? (
                  <span className="badge badge-success">Verified</span>
                ) : userData.rejected ? (
                  <span className="badge badge-error">Rejected</span>
                ) : (
                  <span className="badge badge-warning">Pending Verification</span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BuyerDashboard
