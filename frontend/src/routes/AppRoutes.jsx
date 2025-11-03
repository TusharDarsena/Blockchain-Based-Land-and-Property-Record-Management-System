import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useStellar } from '../contexts/StellarContext'

// Pages (will be created in Task 3)
import Landing from '../pages/Landing'
import Login from '../pages/Login'
import RegisterBuyer from '../pages/RegisterBuyer'
import RegisterSeller from '../pages/RegisterSeller'
import BuyerDashboard from '../pages/BuyerDashboard'
import SellerDashboard from '../pages/SellerDashboard'
import InspectorDashboard from '../pages/InspectorDashboard'

const AppRoutes = () => {
  const { isConnected } = useStellar()
  const { userRole, isRegistered } = useAuth()

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      
      {/* Registration Routes */}
      <Route 
        path="/register/buyer" 
        element={isConnected ? <RegisterBuyer /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/register/seller" 
        element={isConnected ? <RegisterSeller /> : <Navigate to="/login" />} 
      />

      {/* Dashboard Routes */}
      <Route 
        path="/buyer/*" 
        element={
          isConnected && isRegistered && userRole === 'buyer' 
            ? <BuyerDashboard /> 
            : <Navigate to="/login" />
        } 
      />
      <Route 
        path="/seller/*" 
        element={
          isConnected && isRegistered && userRole === 'seller' 
            ? <SellerDashboard /> 
            : <Navigate to="/login" />
        } 
      />
      <Route 
        path="/inspector/*" 
        element={
          isConnected && isRegistered && userRole === 'inspector' 
            ? <InspectorDashboard /> 
            : <Navigate to="/login" />
        } 
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default AppRoutes
