import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Wallet, Shield, TrendingUp, Users, Share2, Lock } from 'lucide-react'

const Landing = () => {
  const navigate = useNavigate()

  const features = [
    {
      icon: Shield,
      title: 'Blockchain Security',
      description: 'Immutable land records secured on Stellar blockchain',
      gradient: 'from-stellar-gold to-stellar-blue',
    },
    {
      icon: Share2,
      title: 'Fractional Ownership',
      description: 'Buy and sell fractional shares of land properties',
      gradient: 'from-stellar-blue to-stellar-violet',
    },
    {
      icon: TrendingUp,
      title: 'Easy Trading',
      description: 'Seamless buying and selling with instant settlement',
      gradient: 'from-stellar-purple to-stellar-gold',
    },
    {
      icon: Users,
      title: 'Verified Users',
      description: 'Land Inspector verified buyers and sellers',
      gradient: 'from-stellar-violet to-stellar-purple',
    },
    {
      icon: Lock,
      title: 'Secure Transactions',
      description: 'Smart contract powered transparent transactions',
      gradient: 'from-stellar-gold to-stellar-purple',
    },
    {
      icon: Wallet,
      title: 'Freighter Wallet',
      description: 'Connect with Freighter for secure authentication',
      gradient: 'from-stellar-blue to-stellar-gold',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <div className="min-h-screen relative z-10">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center max-w-5xl mx-auto"
        >
          {/* Logo/Brand */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <h1 className="text-8xl font-display gradient-text mb-2 animate-gradient">
              Fractional
            </h1>
            <div className="h-2 w-48 mx-auto bg-gradient-stellar rounded-full animate-pulse-glow"></div>
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-2xl md:text-3xl text-stellar-blue mb-4 text-shadow"
          >
            Revolutionary Land Registry on Stellar
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto"
          >
            Buy, sell, and own fractional shares of land properties. 
            Secured by blockchain, verified by inspectors, powered by smart contracts.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <button
              onClick={() => navigate('/login')}
              className="btn btn-primary text-lg px-10 py-4"
            >
              Get Started
            </button>
            <button
              onClick={() => window.open('https://developers.stellar.org/', '_blank')}
              className="btn btn-outline text-lg px-10 py-4"
            >
              Learn More
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.1 }}
            className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto"
          >
            <div className="text-center">
              <div className="text-4xl font-bold gradient-text mb-2">100%</div>
              <div className="text-gray-400 text-sm">Secure</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold gradient-text mb-2">24/7</div>
              <div className="text-gray-400 text-sm">Available</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold gradient-text mb-2">∞</div>
              <div className="text-gray-400 text-sm">Possibilities</div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto"
        >
          <h2 className="text-5xl font-display gradient-text text-center mb-4">
            Why Choose Fractional?
          </h2>
          <p className="text-xl text-gray-400 text-center mb-16 max-w-2xl mx-auto">
            Experience the future of land ownership with cutting-edge blockchain technology
          </p>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -10, scale: 1.02 }}
                className="card card-hover group"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:shadow-glow-lg transition-all duration-300`}>
                  <feature.icon className="w-8 h-8 text-dark" />
                </div>
                <h3 className="text-2xl font-display text-stellar-gold mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <h2 className="text-5xl font-display gradient-text text-center mb-16">
            How It Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                step: '01',
                title: 'Connect Wallet',
                description: 'Install Freighter wallet and connect to the platform',
              },
              {
                step: '02',
                title: 'Register & Verify',
                description: 'Register as buyer or seller, get verified by Land Inspector',
              },
              {
                step: '03',
                title: 'Buy or Sell',
                description: 'List land properties or purchase whole/fractional ownership',
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-7xl font-bold gradient-text opacity-20 mb-4">
                  {item.step}
                </div>
                <h3 className="text-2xl font-display text-stellar-gold mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-400">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto card text-center"
        >
          <h2 className="text-4xl font-display gradient-text mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Join the future of land ownership today
          </p>
          <button
            onClick={() => navigate('/login')}
            className="btn btn-primary text-lg px-12 py-4"
          >
            Launch App
          </button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 text-center text-gray-500 border-t border-stellar-gold/20">
        <p>© 2025 Fractional. Powered by Stellar Blockchain.</p>
      </footer>
    </div>
  )
}

export default Landing
