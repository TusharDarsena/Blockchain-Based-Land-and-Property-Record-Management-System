/**
 * Format date from timestamp
 */
export const formatDate = (timestamp) => {
  if (!timestamp) return 'N/A'
  
  const date = new Date(Number(timestamp) * 1000)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Format currency (XLM)
 */
export const formatCurrency = (amount, currency = 'XLM') => {
  if (!amount && amount !== 0) return 'N/A'
  
  const num = Number(amount)
  return `${num.toLocaleString()} ${currency}`
}

/**
 * Format large numbers with abbreviation
 */
export const formatNumber = (num) => {
  if (!num && num !== 0) return '0'
  
  const number = Number(num)
  
  if (number >= 1000000) {
    return `${(number / 1000000).toFixed(1)}M`
  }
  if (number >= 1000) {
    return `${(number / 1000).toFixed(1)}K`
  }
  return number.toLocaleString()
}

/**
 * Truncate string
 */
export const truncateString = (str, maxLength = 50) => {
  if (!str) return ''
  if (str.length <= maxLength) return str
  return `${str.substring(0, maxLength)}...`
}

/**
 * Generate random ID
 */
export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Debounce function
 */
export const debounce = (func, delay = 300) => {
  let timeoutId
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

/**
 * Throttle function
 */
export const throttle = (func, limit = 300) => {
  let inThrottle
  return (...args) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * Copy to clipboard
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    console.error('Copy failed:', error)
    return false
  }
}

/**
 * Download file
 */
export const downloadFile = (content, filename, type = 'text/plain') => {
  const blob = new Blob([content], { type })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

/**
 * Validate email
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate Aadhar number (12 digits)
 */
export const isValidAadhar = (aadhar) => {
  const aadharRegex = /^\d{12}$/
  return aadharRegex.test(aadhar)
}

/**
 * Validate PAN number (format: ABCDE1234F)
 */
export const isValidPAN = (pan) => {
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/
  return panRegex.test(pan)
}

/**
 * Calculate percentage
 */
export const calculatePercentage = (value, total) => {
  if (!total || total === 0) return 0
  return ((value / total) * 100).toFixed(2)
}

/**
 * Get status badge color
 */
export const getStatusColor = (status) => {
  const colors = {
    verified: 'badge-success',
    pending: 'badge-warning',
    rejected: 'badge-error',
    approved: 'badge-success',
    completed: 'badge-success',
    active: 'badge-info',
  }
  return colors[status?.toLowerCase()] || 'badge-info'
}

/**
 * Format land area
 */
export const formatArea = (area, unit = 'sq ft') => {
  if (!area && area !== 0) return 'N/A'
  return `${Number(area).toLocaleString()} ${unit}`
}

/**
 * Calculate price per square unit
 */
export const calculatePricePerUnit = (price, area) => {
  if (!area || area === 0) return 0
  return (Number(price) / Number(area)).toFixed(2)
}

/**
 * Group array by key
 */
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const groupKey = item[key]
    if (!result[groupKey]) {
      result[groupKey] = []
    }
    result[groupKey].push(item)
    return result
  }, {})
}

/**
 * Sort array by key
 */
export const sortBy = (array, key, order = 'asc') => {
  return [...array].sort((a, b) => {
    const aVal = a[key]
    const bVal = b[key]
    
    if (order === 'asc') {
      return aVal > bVal ? 1 : -1
    } else {
      return aVal < bVal ? 1 : -1
    }
  })
}

/**
 * Filter array by search term
 */
export const filterBySearch = (array, searchTerm, keys) => {
  if (!searchTerm) return array
  
  const term = searchTerm.toLowerCase()
  
  return array.filter(item => {
    return keys.some(key => {
      const value = item[key]
      return value && value.toString().toLowerCase().includes(term)
    })
  })
}

/**
 * Check if object is empty
 */
export const isEmpty = (obj) => {
  return Object.keys(obj).length === 0
}

/**
 * Deep clone object
 */
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * Sleep/delay function
 */
export const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Get relative time (e.g., "2 hours ago")
 */
export const getRelativeTime = (timestamp) => {
  const now = Date.now()
  const then = Number(timestamp) * 1000
  const diff = now - then

  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  return 'Just now'
}

/**
 * Capitalize first letter
 */
export const capitalize = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Convert to title case
 */
export const toTitleCase = (str) => {
  if (!str) return ''
  return str
    .toLowerCase()
    .split(' ')
    .map(word => capitalize(word))
    .join(' ')
}

/**
 * Generate color from string (for avatars, etc.)
 */
export const stringToColor = (str) => {
  if (!str) return '#FDDA24'
  
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  const colors = [
    '#FDDA24', // gold
    '#59b7e9', // blue
    '#8c5ca4', // purple
    '#99b7cf', // blue light
    '#4d246f', // violet
  ]
  
  return colors[Math.abs(hash) % colors.length]
}

/**
 * Format file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

/**
 * Check if browser supports feature
 */
export const supportsFeature = (feature) => {
  const features = {
    clipboard: typeof navigator.clipboard !== 'undefined',
    notifications: 'Notification' in window,
    serviceWorker: 'serviceWorker' in navigator,
  }
  
  return features[feature] || false
}

export default {
  formatDate,
  formatCurrency,
  formatNumber,
  truncateString,
  generateId,
  debounce,
  throttle,
  copyToClipboard,
  downloadFile,
  isValidEmail,
  isValidAadhar,
  isValidPAN,
  calculatePercentage,
  getStatusColor,
  formatArea,
  calculatePricePerUnit,
  groupBy,
  sortBy,
  filterBySearch,
  isEmpty,
  deepClone,
  sleep,
  getRelativeTime,
  capitalize,
  toTitleCase,
  stringToColor,
  formatFileSize,
  supportsFeature,
}
