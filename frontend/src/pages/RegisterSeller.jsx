import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useStellar } from '../contexts/StellarContext'
import { registerSeller } from '../utils/contractInteraction'
import { uploadToIPFS, validateFile } from '../utils/ipfs'
import { isValidAadhar, isValidPAN } from '../utils/helpers'
import { ArrowLeft, Upload, FileText, CheckCircle } from 'lucide-react'
import { toast } from 'react-toastify'

const RegisterSeller = () => {
  const navigate = useNavigate()
  const { publicKey } = useStellar()
  
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    aadharNumber: '',
    panNumber: '',
    landsOwned: '',
  })

  const [document, setDocument] = useState(null)
  const [documentPreview, setDocumentPreview] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const isValid = validateFile(file, {
        maxSize: 5 * 1024 * 1024,
        allowedTypes: ['image/jpeg', 'image/png', 'application/pdf'],
      })

      if (isValid) {
        setDocument(file)
        
        if (file.type.startsWith('image/')) {
          const reader = new FileReader()
          reader.onloadend = () => {
            setDocumentPreview(reader.result)
          }
          reader.readAsDataURL(file)
        } else {
          setDocumentPreview(null)
        }

        if (errors.document) {
          setErrors(prev => ({ ...prev, document: '' }))
        }
      }
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    const age = parseInt(formData.age)
    if (!formData.age || age < 18 || age > 100) {
      newErrors.age = 'Age must be between 18 and 100'
    }

    if (!isValidAadhar(formData.aadharNumber)) {
      newErrors.aadharNumber = 'Invalid Aadhar number (12 digits required)'
    }

    if (!isValidPAN(formData.panNumber.toUpperCase())) {
      newErrors.panNumber = 'Invalid PAN number'
    }

    if (!formData.landsOwned.trim()) {
      newErrors.landsOwned = 'Land ownership details are required'
    }

    if (!document) {
      newErrors.document = 'Ownership documents are required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error('Please fix the errors in the form')
      return
    }

    setIsSubmitting(true)

    try {
      toast.info('Uploading documents to IPFS...')
      const ipfsHash = await uploadToIPFS(document)

      toast.info('Submitting registration to blockchain...')
      await registerSeller(
        publicKey,
        formData.name,
        parseInt(formData.age),
        formData.aadharNumber,
        formData.panNumber.toUpperCase(),
        formData.landsOwned,
        ipfsHash
      )

      toast.success('Registration submitted! Waiting for Land Inspector verification.')
      navigate('/seller')
    } catch (error) {
      console.error('Registration error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen py-12 px-4 relative z-10">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate('/login')}
            className="btn btn-ghost mb-4 inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <h1 className="text-5xl font-display gradient-text mb-4">
            Register as Seller
          </h1>
          <p className="text-gray-400">
            Complete your registration to start listing land properties
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="card"
        >
          {/* Wallet Address */}
          <div className="mb-6 p-4 rounded-lg bg-stellar-gold/10 border border-stellar-gold/30">
            <label className="text-sm text-gray-400 mb-1 block">Wallet Address</label>
            <p className="text-stellar-gold font-mono text-sm break-all">
              {publicKey}
            </p>
          </div>

          {/* Personal Information */}
          <div className="space-y-6">
            <h3 className="text-2xl font-display text-stellar-gold">
              Personal Information
            </h3>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`input ${errors.name ? 'input-error' : ''}`}
                placeholder="Enter your full name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-400">{errors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-300 mb-2">
                Age *
              </label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                className={`input ${errors.age ? 'input-error' : ''}`}
                placeholder="18"
                min="18"
                max="100"
              />
              {errors.age && (
                <p className="mt-1 text-sm text-red-400">{errors.age}</p>
              )}
            </div>
          </div>

          {/* Identity Documents */}
          <div className="space-y-6 mt-8">
            <h3 className="text-2xl font-display text-stellar-gold">
              Identity Documents
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="aadharNumber" className="block text-sm font-medium text-gray-300 mb-2">
                  Aadhar Number *
                </label>
                <input
                  type="text"
                  id="aadharNumber"
                  name="aadharNumber"
                  value={formData.aadharNumber}
                  onChange={handleInputChange}
                  className={`input ${errors.aadharNumber ? 'input-error' : ''}`}
                  placeholder="123456789012"
                  maxLength="12"
                />
                {errors.aadharNumber && (
                  <p className="mt-1 text-sm text-red-400">{errors.aadharNumber}</p>
                )}
              </div>

              <div>
                <label htmlFor="panNumber" className="block text-sm font-medium text-gray-300 mb-2">
                  PAN Number *
                </label>
                <input
                  type="text"
                  id="panNumber"
                  name="panNumber"
                  value={formData.panNumber}
                  onChange={handleInputChange}
                  className={`input ${errors.panNumber ? 'input-error' : ''}`}
                  placeholder="ABCDE1234F"
                  maxLength="10"
                  style={{ textTransform: 'uppercase' }}
                />
                {errors.panNumber && (
                  <p className="mt-1 text-sm text-red-400">{errors.panNumber}</p>
                )}
              </div>
            </div>
          </div>

          {/* Land Ownership Information */}
          <div className="space-y-6 mt-8">
            <h3 className="text-2xl font-display text-stellar-gold">
              Land Ownership Information
            </h3>

            <div>
              <label htmlFor="landsOwned" className="block text-sm font-medium text-gray-300 mb-2">
                Lands Owned (Description) *
              </label>
              <textarea
                id="landsOwned"
                name="landsOwned"
                value={formData.landsOwned}
                onChange={handleInputChange}
                rows="4"
                className={`input ${errors.landsOwned ? 'input-error' : ''}`}
                placeholder="Describe the lands you own, including location, survey numbers, etc."
              />
              {errors.landsOwned && (
                <p className="mt-1 text-sm text-red-400">{errors.landsOwned}</p>
              )}
              <p className="mt-2 text-sm text-gray-500">
                Provide details about your land properties that you intend to list
              </p>
            </div>

            {/* Document Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Ownership Documents (Land Title/Deed) *
              </label>
              
              <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-all ${
                errors.document 
                  ? 'border-red-500 bg-red-500/5' 
                  : 'border-stellar-gold/30 hover:border-stellar-gold/60 bg-stellar-gold/5'
              }`}>
                <input
                  type="file"
                  id="document"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                
                {document ? (
                  <div className="space-y-4">
                    {documentPreview ? (
                      <img 
                        src={documentPreview} 
                        alt="Preview" 
                        className="max-h-48 mx-auto rounded-lg"
                      />
                    ) : (
                      <FileText className="w-16 h-16 mx-auto text-stellar-gold" />
                    )}
                    
                    <div className="flex items-center justify-center gap-2 text-green-400">
                      <CheckCircle className="w-5 h-5" />
                      <span>{document.name}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => document.getElementById('document').click()}
                      className="btn btn-outline"
                    >
                      Change File
                    </button>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-400 mb-2">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-sm text-gray-500">
                      PNG, JPG or PDF (max 5MB)
                    </p>
                    <button
                      type="button"
                      onClick={() => document.getElementById('document').click()}
                      className="btn btn-outline mt-4"
                    >
                      Choose File
                    </button>
                  </div>
                )}
              </div>

              {errors.document && (
                <p className="mt-2 text-sm text-red-400">{errors.document}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 pt-6 border-t border-stellar-gold/20">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary w-full"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="spinner"></div>
                  Registering...
                </span>
              ) : (
                'Submit Registration'
              )}
            </button>

            <p className="text-sm text-gray-500 mt-4 text-center">
              Your registration will be reviewed by a Land Inspector
            </p>
          </div>
        </motion.form>
      </div>
    </div>
  )
}

export default RegisterSeller
