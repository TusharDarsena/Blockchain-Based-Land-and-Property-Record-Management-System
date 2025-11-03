import React from 'react'
import Navbar from '../components/Navbar'

const InspectorDashboard = () => {
  return (
    <div className="min-h-screen relative z-10">
      <Navbar title="Land Inspector Dashboard" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card text-center py-12">
          <h2 className="text-4xl font-display gradient-text mb-4">
            Land Inspector Dashboard
          </h2>
          <p className="text-xl text-gray-400 mb-6">
            Verify buyers, sellers, and land listings
          </p>
          <p className="text-gray-500">
            Full implementation coming soon...
          </p>
        </div>
      </div>
    </div>
  )
}

export default InspectorDashboard
