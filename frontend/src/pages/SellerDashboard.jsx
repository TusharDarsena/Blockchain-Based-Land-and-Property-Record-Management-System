import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Routes, Route, NavLink } from 'react-router-dom'
import { useStellar } from '../contexts/StellarContext'
import { useAuth } from '../contexts/AuthContext'
import Navbar from '../components/Navbar'
import Loading from '../components/Loading'
import LandCard from '../components/LandCard'
import { addLand, addFractionalLand, getAllLands } from '../utils/contractInteraction'
import { uploadToIPFS } from '../utils/ipfs'
import { toast } from 'react-toastify'
import { Home, Plus, ClipboardList, User, Upload, Image, MapPin } from 'lucide-react'

const SellerDashboard = () => {
  const { publicKey } = useStellar()
  const { userData } = useAuth()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar title="Seller Dashboard" />
        <Loading message="Loading your dashboard..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen relative z-10">
      <Navbar title="Seller Dashboard" />
      
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
              Your seller registration is awaiting verification by a Land Inspector. 
              You can add listings, but they will be enabled after verification.
            </p>
          </motion.div>
        )}

        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-8 overflow-x-auto">
          <NavLink
            to="/seller"
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
            My Listings
          </NavLink>
          <NavLink
            to="/seller/add"
            className={({ isActive }) =>
              `px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-gradient-stellar text-dark'
                  : 'bg-gray-800/50 text-gray-400 hover:text-stellar-gold'
              }`
            }
          >
            <Plus className="w-4 h-4 inline mr-2" />
            Add Land
          </NavLink>
          <NavLink
            to="/seller/requests"
            className={({ isActive }) =>
              `px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-gradient-stellar text-dark'
                  : 'bg-gray-800/50 text-gray-400 hover:text-stellar-gold'
              }`
            }
          >
            <ClipboardList className="w-4 h-4 inline mr-2" />
            Purchase Requests
          </NavLink>
          <NavLink
            to="/seller/profile"
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
          <Route path="/" element={<MyListings />} />
          <Route path="/add" element={<AddLand />} />
          <Route path="/requests" element={<PurchaseRequests />} />
          <Route path="/profile" element={<SellerProfile />} />
        </Routes>
      </div>
    </div>
  )
}

// My Listings Component
const MyListings = () => {
  const { publicKey } = useStellar()
  const [lands, setLands] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadMyLands()
  }, [publicKey])

  const loadMyLands = async () => {
    try {
      const allLands = await getAllLands()
      // Filter lands owned by this seller
      const myLands = allLands.filter(land => land.owner === publicKey)
      setLands(myLands)
    } catch (error) {
      console.error('Error loading lands:', error)
      toast.error('Failed to load your listings')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Loading message="Loading your listings..." />

  return (
    <div>
      {lands.length === 0 ? (
        <div className="card text-center py-12">
          <Plus className="w-16 h-16 mx-auto text-gray-600 mb-4" />
          <h3 className="text-xl font-semibold text-gray-300 mb-2">
            No Listings Yet
          </h3>
          <p className="text-gray-400 mb-6">
            Start by adding your first land property
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lands.map(land => (
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

// Add Land Component
const AddLand = () => {
  const { publicKey } = useStellar()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    area: '',
    city: '',
    state: '',
    price: '',
    propertyPid: '',
    physicalSurveyNumber: '',
    isFractional: false,
    totalShares: '',
    pricePerShare: '',
  })
  const [documents, setDocuments] = useState([])
  const [images, setImages] = useState([])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleFileChange = (e, type) => {
    const files = Array.from(e.target.files)
    if (type === 'documents') {
      setDocuments(files)
    } else {
      setImages(files)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!publicKey) {
      toast.error('Please connect your wallet first')
      return
    }

    setLoading(true)
    try {
      // Upload documents and images to IPFS
      let documentHash = ''
      let imageHashes = []

      if (documents.length > 0) {
        toast.info('Uploading documents to IPFS...')
        const docHash = await uploadToIPFS(documents[0])
        documentHash = docHash
      }

      if (images.length > 0) {
        toast.info('Uploading images to IPFS...')
        for (const image of images) {
          const imgHash = await uploadToIPFS(image)
          imageHashes.push(imgHash)
        }
      }

      // Add land to blockchain
      toast.info('Adding land to blockchain...')
      
      const imageHashString = imageHashes.join(',')
      
      if (formData.isFractional) {
        // Add fractional land
        await addFractionalLand(
          publicKey,
          parseInt(formData.area),
          formData.city,
          formData.state,
          BigInt(formData.price) * BigInt(10000000), // Convert to stroops (7 decimals for XLM-like precision)
          parseInt(formData.propertyPid),
          parseInt(formData.physicalSurveyNumber),
          imageHashString,
          documentHash,
          parseInt(formData.totalShares)
        )
      } else {
        // Add regular land
        await addLand(
          publicKey,
          parseInt(formData.area),
          formData.city,
          formData.state,
          BigInt(formData.price) * BigInt(10000000), // Convert to stroops (7 decimals for XLM-like precision)
          parseInt(formData.propertyPid),
          parseInt(formData.physicalSurveyNumber),
          imageHashString,
          documentHash
        )
      }
      
      // Reset form
      setFormData({
        area: '',
        city: '',
        state: '',
        price: '',
        propertyPid: '',
        physicalSurveyNumber: '',
        isFractional: false,
        totalShares: '',
        pricePerShare: '',
      })
      setDocuments([])
      setImages([])
      
      toast.success('Land added successfully!')
    } catch (error) {
      console.error('Error adding land:', error)
      toast.error(`Failed to add land: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <h2 className="text-2xl font-display gradient-text mb-6">
          Add New Land Property
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-stellar-gold">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Area (sq. ft.) *
                </label>
                <input
                  type="number"
                  name="area"
                  value={formData.area}
                  onChange={handleInputChange}
                  className="input w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Price (XLM) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="input w-full"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="input w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  State *
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="input w-full"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Property PID *
              </label>
              <input
                type="text"
                name="propertyPid"
                value={formData.propertyPid}
                onChange={handleInputChange}
                className="input w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Physical Survey Number *
              </label>
              <input
                type="text"
                name="physicalSurveyNumber"
                value={formData.physicalSurveyNumber}
                onChange={handleInputChange}
                className="input w-full"
                required
              />
            </div>
          </div>

          {/* Fractional Ownership */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="isFractional"
                name="isFractional"
                checked={formData.isFractional}
                onChange={handleInputChange}
                className="w-5 h-5"
              />
              <label htmlFor="isFractional" className="text-stellar-gold font-semibold">
                Enable Fractional Ownership
              </label>
            </div>

            {formData.isFractional && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-8"
              >
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Total Shares *
                  </label>
                  <input
                    type="number"
                    name="totalShares"
                    value={formData.totalShares}
                    onChange={handleInputChange}
                    className="input w-full"
                    required={formData.isFractional}
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Price Per Share (XLM) *
                  </label>
                  <input
                    type="number"
                    name="pricePerShare"
                    value={formData.pricePerShare}
                    onChange={handleInputChange}
                    className="input w-full"
                    required={formData.isFractional}
                  />
                </div>
              </motion.div>
            )}
          </div>

          {/* File Uploads */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-stellar-gold">Documents & Images</h3>
            
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                <Upload className="w-4 h-4 inline mr-2" />
                Property Documents
              </label>
              <input
                type="file"
                onChange={(e) => handleFileChange(e, 'documents')}
                className="input w-full"
                accept=".pdf,.doc,.docx"
              />
              {documents.length > 0 && (
                <p className="text-sm text-green-400 mt-2">
                  {documents.length} document(s) selected
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">
                <Image className="w-4 h-4 inline mr-2" />
                Property Images
              </label>
              <input
                type="file"
                onChange={(e) => handleFileChange(e, 'images')}
                className="input w-full"
                accept="image/*"
                multiple
              />
              {images.length > 0 && (
                <p className="text-sm text-green-400 mt-2">
                  {images.length} image(s) selected
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary flex-1"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                  Adding Land...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5 mr-2" />
                  Add Land
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

// Purchase Requests Component
const PurchaseRequests = () => {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Load purchase requests from contract
    setTimeout(() => setLoading(false), 1000)
  }, [])

  if (loading) return <Loading message="Loading requests..." />

  return (
    <div className="card text-center py-12">
      <ClipboardList className="w-16 h-16 mx-auto text-gray-600 mb-4" />
      <h3 className="text-2xl font-display gradient-text mb-4">
        Purchase Requests
      </h3>
      <p className="text-gray-400 mb-6">
        Manage and approve buyer purchase requests
      </p>
      <p className="text-sm text-gray-500">
        No pending requests at the moment
      </p>
    </div>
  )
}

// Seller Profile Component
const SellerProfile = () => {
  const { userData } = useAuth()

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <h3 className="text-2xl font-display gradient-text mb-6">
          Seller Profile
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
                <label className="text-sm text-gray-400">Lands Owned</label>
                <p className="text-lg text-white">{userData.landsOwned || 'N/A'}</p>
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-400">Aadhar Number</label>
              <p className="text-lg text-white">{userData.aadharNumber || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm text-gray-400">PAN Number</label>
              <p className="text-lg text-white">{userData.panNumber || 'N/A'}</p>
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

export default SellerDashboard
