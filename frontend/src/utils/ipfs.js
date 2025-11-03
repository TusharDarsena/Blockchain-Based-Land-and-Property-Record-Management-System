import { toast } from 'react-toastify'

/**
 * Generate SHA-256 hash of a file
 * This is used to create a unique identifier for documents without needing IPFS
 * @param {File} file - File to hash
 * @returns {Promise<string>} Hex string of the hash
 */
const generateFileHash = async (file) => {
  const arrayBuffer = await file.arrayBuffer()
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  return hashHex
}

/**
 * Upload file to IPFS
 * For Stellar dApp, we don't actually upload to IPFS
 * Instead, we generate a SHA-256 hash of the file as a document identifier
 * The actual document verification is done off-chain by the Land Inspector
 * @param {File} file - File to process
 * @returns {Promise<string>} Document hash
 */
export const uploadToIPFS = async (file) => {
  try {
    const toastId = toast.loading('Processing document...')
    
    // Generate SHA-256 hash of the file
    const hash = await generateFileHash(file)
    
    // Simulate processing time for better UX
    await new Promise(resolve => setTimeout(resolve, 500))
    
    toast.update(toastId, {
      render: '✓ Document processed successfully',
      type: 'success',
      isLoading: false,
      autoClose: 2000,
    })
    
    console.log('Document Hash (SHA-256):', hash)
    console.log('Document Name:', file.name)
    console.log('Document Size:', file.size, 'bytes')
    
    // Return hash prefixed with 'doc_' to indicate it's a document hash
    return `doc_${hash.substring(0, 40)}`
  } catch (error) {
    console.error('Document processing error:', error)
    toast.error(`Failed to process document: ${error.message}`)
    throw error
  }
}

/**
 * Upload JSON data (simplified for Stellar dApp)
 * Generates a hash of the JSON data
 * @param {Object} data - JSON data to process
 * @returns {Promise<string>} Data hash
 */
export const uploadJSONToIPFS = async (data) => {
  try {
    const jsonString = JSON.stringify(data)
    const encoder = new TextEncoder()
    const uint8Array = encoder.encode(jsonString)
    
    // Generate SHA-256 hash
    const hashBuffer = await crypto.subtle.digest('SHA-256', uint8Array)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    
    toast.success('Data processed successfully')
    return `json_${hashHex.substring(0, 40)}`
  } catch (error) {
    console.error('JSON processing error:', error)
    toast.error(`Failed to process data: ${error.message}`)
    throw error
  }
}

/**
 * Process multiple files
 * @param {File[]} files - Array of files to process
 * @returns {Promise<string[]>} Array of document hashes
 */
export const uploadMultipleToIPFS = async (files) => {
  try {
    const toastId = toast.loading(`Processing ${files.length} files...`)
    const hashes = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      
      toast.update(toastId, {
        render: `Processing file ${i + 1}/${files.length}...`,
        isLoading: true,
      })

      const hash = await uploadToIPFS(file)
      hashes.push(hash)
    }

    toast.update(toastId, {
      render: 'All files processed successfully!',
      type: 'success',
      isLoading: false,
      autoClose: 3000,
    })

    return hashes
  } catch (error) {
    console.error('Multiple file processing error:', error)
    toast.error('Failed to process some files')
    throw error
  }
}

/**
 * Get document identifier (for display purposes)
 * @param {string} hash - Document hash
 * @returns {string} Shortened hash for display
 */
export const getIPFSUrl = (hash) => {
  if (!hash) return ''
  
  // For document hashes, return a display-friendly format
  if (hash.startsWith('doc_') || hash.startsWith('json_')) {
    return `Document ID: ${hash.substring(0, 20)}...`
  }
  
  return hash
}

/**
 * Retrieve document info (simplified for Stellar dApp)
 * In a real implementation, this would query a backend service
 * @param {string} hash - Document hash
 * @returns {Promise<Object>} Document metadata
 */
export const retrieveFromIPFS = async (hash) => {
  try {
    // In a Stellar dApp, document verification is done off-chain
    // This is a placeholder that returns metadata about the hash
    return {
      hash,
      verified: false,
      message: 'Document verification pending by Land Inspector'
    }
  } catch (error) {
    console.error('Document retrieval error:', error)
    throw error
  }
}

/**
 * Retrieve JSON data (simplified)
 * @param {string} hash - Data hash
 * @returns {Promise<Object>} Metadata
 */
export const retrieveJSONFromIPFS = async (hash) => {
  try {
    return await retrieveFromIPFS(hash)
  } catch (error) {
    console.error('JSON retrieval error:', error)
    toast.error(`Failed to retrieve JSON: ${error.message}`)
    throw error
  }
}

/**
 * Validate file before upload
 * @param {File} file - File to validate
 * @param {Object} options - Validation options
 * @returns {boolean} Is valid
 */
export const validateFile = (file, options = {}) => {
  const {
    maxSize = 10 * 1024 * 1024, // 10MB default
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
  } = options

  if (file.size > maxSize) {
    toast.error(`File size exceeds ${maxSize / 1024 / 1024}MB limit`)
    return false
  }

  if (!allowedTypes.includes(file.type)) {
    toast.error(`File type ${file.type} not allowed`)
    return false
  }

  return true
}

/**
 * Create image thumbnail
 * @param {File} file - Image file
 * @param {number} maxWidth - Max width
 * @param {number} maxHeight - Max height
 * @returns {Promise<Blob>} Thumbnail blob
 */
export const createThumbnail = (file, maxWidth = 200, maxHeight = 200) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      const img = new Image()
      
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width
            width = maxWidth
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height
            height = maxHeight
          }
        }

        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)

        canvas.toBlob((blob) => {
          resolve(blob)
        }, file.type)
      }

      img.onerror = reject
      img.src = e.target.result
    }

    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/**
 * Pin/save document hash (for Stellar dApp, this is a no-op)
 * @param {string} hash - Document hash
 */
export const pinToIPFS = async (hash) => {
  try {
    // In Stellar dApp, hashes are stored on-chain
    console.log('Document hash stored on blockchain:', hash)
    return true
  } catch (error) {
    console.error('Pin error:', error)
    throw error
  }
}

export default {
  uploadToIPFS,
  uploadJSONToIPFS,
  uploadMultipleToIPFS,
  retrieveFromIPFS,
  retrieveJSONFromIPFS,
  getIPFSUrl,
  validateFile,
  createThumbnail,
  pinToIPFS,
}
