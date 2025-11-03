import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { StellarProvider } from './contexts/StellarContext'
import { AuthProvider } from './contexts/AuthContext'
import AppRoutes from './routes/AppRoutes'
import ParticleBackground from './components/ParticleBackground'

function App() {
  return (
    <Router>
      <StellarProvider>
        <AuthProvider>
          <div className="relative min-h-screen">
            <ParticleBackground />
            <AppRoutes />
          </div>
        </AuthProvider>
      </StellarProvider>
    </Router>
  )
}

export default App
