import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Routes, Route, NavLink } from 'react-router-dom'
import { useStellar } from '../contexts/StellarContext'
import { useAuth } from '../contexts/AuthContext'
import Navbar from '../components/Navbar'
import Loading from '../components/Loading'
import LandCard from '../components/LandCard'
import { getAllLands, getUserFractionalLands } from '../utils/contractInteraction'
import { Home, ShoppingBag, Wallet as WalletIcon, User } from 'lucide-react'

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
  return (
    <div className="card text-center py-12">
      <h3 className="text-2xl font-display gradient-text mb-4">
        Your Properties
      </h3>
      <p className="text-gray-400 mb-6">
        This feature will display your owned lands and fractional shares
      </p>
      <p className="text-sm text-gray-500">
        Implementation in progress...
      </p>
    </div>
  )
}

// My Requests Component
const MyRequests = () => {
  return (
    <div className="card text-center py-12">
      <h3 className="text-2xl font-display gradient-text mb-4">
        Purchase Requests
      </h3>
      <p className="text-gray-400 mb-6">
        View and manage your land purchase requests
      </p>
      <p className="text-sm text-gray-500">
        Implementation in progress...
      </p>
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
