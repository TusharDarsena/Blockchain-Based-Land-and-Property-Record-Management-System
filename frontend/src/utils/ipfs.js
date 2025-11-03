import { create } from 'ipfs-http-client'
import { toast } from 'react-toastify'

// IPFS Configuration
const IPFS_HOST = import.meta.env.VITE_IPFS_HOST || 'ipfs.infura.io'
const IPFS_PORT = import.meta.env.VITE_IPFS_PORT || 5001
const IPFS_PROTOCOL = import.meta.env.VITE_IPFS_PROTOCOL || 'https'

// Create IPFS client
let ipfsClient = null

const getIPFSClient = () => {
  if (!ipfsClient) {
    try {
      ipfsClient = create({
        host: IPFS_HOST,
        port: IPFS_PORT,
        protocol: IPFS_PROTOCOL,
      })
    } catch (error) {
      console.error('Failed to create IPFS client:', error)
      toast.error('Failed to connect to IPFS')
      return null
    }
  }
  return ipfsClient
}

/**
 * Upload file to IPFS
 * @param {File} file - File to upload
 * @returns {Promise<string>} IPFS hash
 */
export const uploadToIPFS = async (file) => {
  try {
    const client = getIPFSClient()
    if (!client) {
      throw new Error('IPFS client not initialized')
    }

    // Show loading toast
    const toastId = toast.loading('Uploading to IPFS...')

    // Convert file to buffer
    const fileBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(fileBuffer)

    // Upload to IPFS
    const result = await client.add(buffer, {
      progress: (prog) => {
        const percentage = Math.round((prog / file.size) * 100)
        toast.update(toastId, {
          render: `Uploading to IPFS... ${percentage}%`,
          isLoading: true,
        })
      },
    })

    // Update toast
    toast.update(toastId, {
      render: 'File uploaded to IPFS successfully!',
      type: 'success',
      isLoading: false,
      autoClose: 3000,
    })

    return result.path
  } catch (error) {
    console.error('IPFS upload error:', error)
    toast.error(`Failed to upload to IPFS: ${error.message}`)
    throw error
  }
}

/**
 * Upload JSON data to IPFS
 * @param {Object} data - JSON data to upload
 * @returns {Promise<string>} IPFS hash
 */
export const uploadJSONToIPFS = async (data) => {
  try {
    const client = getIPFSClient()
    if (!client) {
      throw new Error('IPFS client not initialized')
    }

    const jsonString = JSON.stringify(data)
    const buffer = Buffer.from(jsonString)

    const result = await client.add(buffer)
    toast.success('Data uploaded to IPFS!')
    
    return result.path
  } catch (error) {
    console.error('IPFS JSON upload error:', error)
    toast.error(`Failed to upload data: ${error.message}`)
    throw error
  }
}

/**
 * Upload multiple files to IPFS
 * @param {File[]} files - Array of files to upload
 * @returns {Promise<string[]>} Array of IPFS hashes
 */
export const uploadMultipleToIPFS = async (files) => {
  try {
    const toastId = toast.loading(`Uploading ${files.length} files to IPFS...`)
    const hashes = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      toast.update(toastId, {
        render: `Uploading file ${i + 1}/${files.length}...`,
        isLoading: true,
      })

      const hash = await uploadToIPFS(file)
      hashes.push(hash)
    }

    toast.update(toastId, {
      render: 'All files uploaded successfully!',
      type: 'success',
      isLoading: false,
      autoClose: 3000,
    })

    return hashes
  } catch (error) {
    console.error('Multiple upload error:', error)
    toast.error('Failed to upload some files')
    throw error
  }
}

/**
 * Get IPFS gateway URL for a hash
 * @param {string} hash - IPFS hash
 * @param {string} gateway - Gateway URL (default: ipfs.io)
 * @returns {string} Full gateway URL
 */
export const getIPFSUrl = (hash, gateway = 'https://ipfs.io') => {
  if (!hash) return ''
  
  // Remove 'ipfs://' prefix if present
  const cleanHash = hash.replace('ipfs://', '')
  
  return `${gateway}/ipfs/${cleanHash}`
}

/**
 * Retrieve data from IPFS
 * @param {string} hash - IPFS hash
 * @returns {Promise<Uint8Array>} File data
 */
export const retrieveFromIPFS = async (hash) => {
  try {
    const client = getIPFSClient()
    if (!client) {
      throw new Error('IPFS client not initialized')
    }

    const stream = client.cat(hash)
    const chunks = []

    for await (const chunk of stream) {
      chunks.push(chunk)
    }

    return Buffer.concat(chunks)
  } catch (error) {
    console.error('IPFS retrieve error:', error)
    toast.error(`Failed to retrieve from IPFS: ${error.message}`)
    throw error
  }
}

/**
 * Retrieve JSON data from IPFS
 * @param {string} hash - IPFS hash
 * @returns {Promise<Object>} Parsed JSON data
 */
export const retrieveJSONFromIPFS = async (hash) => {
  try {
    const data = await retrieveFromIPFS(hash)
    const jsonString = Buffer.from(data).toString('utf8')
    return JSON.parse(jsonString)
  } catch (error) {
    console.error('IPFS JSON retrieve error:', error)
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
 * Pin file to ensure it stays on IPFS
 * @param {string} hash - IPFS hash to pin
 */
export const pinToIPFS = async (hash) => {
  try {
    const client = getIPFSClient()
    if (!client) {
      throw new Error('IPFS client not initialized')
    }

    await client.pin.add(hash)
    toast.success('File pinned to IPFS')
  } catch (error) {
    console.error('IPFS pin error:', error)
    toast.error(`Failed to pin: ${error.message}`)
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
