# 🌟 Fractional - Stellar Land Registry

**Fractional** is a next-generation decentralized land registry application built on the Stellar blockchain with support for fractional land ownership. Buy, sell, and manage land properties securely on the blockchain.

[![Stellar](https://img.shields.io/badge/Stellar-Network-blue)](https://stellar.org)
[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)](https://reactjs.org)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?logo=vite)](https://vitejs.dev)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 🌟 Features

### Core Features
- ✅ **Decentralized Land Registry**: Register and manage land ownership on Stellar blockchain
- ✅ **Fractional Ownership**: Buy and sell fractional shares of land properties
- ✅ **Smart Contract Integration**: Soroban smart contracts for secure transactions
- ✅ **IPFS Storage**: Decentralized storage for documents and images
- ✅ **Freighter Wallet**: Secure wallet integration

### User Roles
- 👤 **Buyers**: Browse, request, and purchase lands (full or fractional)
- 🏘️ **Sellers**: List properties, manage requests, approve sales
- 🔍 **Land Inspectors**: Verify registrations and listings

### Additional Features
- 💰 XLM payment integration
- 📊 Real-time ownership tracking
- 🎨 Modern, responsive UI with animations
- 🔒 Secure authentication and verification
- 📱 Mobile-friendly design
- 🌐 Multi-network support (Testnet/Mainnet)

## 🚀 Quick Start

### Prerequisites

Ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js
- **Freighter Wallet** Extension - [Install](https://www.freighter.app/)

### Installation

1. **Clone the repository**:
```bash
git clone https://github.com/TusharDarsena/Blockchain-Based-Land-and-Property-Record-Management-System.git
cd "land registry project/frontend"
```

2. **Install dependencies**:
```bash
npm install
```

3. **Configure environment**:

Create a `.env` file in the `frontend` directory:
```env
# Stellar Network Configuration
VITE_STELLAR_NETWORK=testnet
VITE_STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org
VITE_STELLAR_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org

# Contract ID (Already configured)
VITE_LAND_REGISTRY_CONTRACT_ID=C4TOGUUMX42QP2LZHUWV3I3YW2MXBCOATDF6E6XJRIMEVFITRTSNRAW

# Network Passphrase
VITE_STELLAR_NETWORK_PASSPHRASE=Test SDF Network ; September 2015

# IPFS Configuration
VITE_IPFS_HOST=ipfs.infura.io
VITE_IPFS_PORT=5001
VITE_IPFS_PROTOCOL=https

# Application
VITE_APP_NAME=Fractional
VITE_APP_VERSION=1.0.0
```

4. **Start development server**:
```bash
npm run dev
```

The application will be available at `http://localhost:5173` 🎉

## 📖 Documentation

- **[Testing Guide](TESTING_GUIDE.md)** - Comprehensive testing instructions
- **[Deployment Guide](DEPLOYMENT.md)** - Production deployment steps
- **[API Documentation](docs/API.md)** - Contract interaction reference

## 🔧 Configuration

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_STELLAR_NETWORK` | Network (testnet/mainnet) | `testnet` |
| `VITE_STELLAR_HORIZON_URL` | Horizon server URL | `https://horizon-testnet.stellar.org` |
| `VITE_STELLAR_SOROBAN_RPC_URL` | Soroban RPC URL | `https://soroban-testnet.stellar.org` |
| `VITE_LAND_REGISTRY_CONTRACT_ID` | Deployed contract ID | `C4TOGUUMX42QP2LZHUWV3I3YW2MXBCOATDF6E6XJRIMEVFITRTSNRAW` |
| `VITE_STELLAR_NETWORK_PASSPHRASE` | Network passphrase | `Test SDF Network ; September 2015` |

### Smart Contract Deployment

If you need to deploy your own contract:

1. **Build the Rust contract**:
```bash
cd ../land-registry-contract
cargo build --target wasm32-unknown-unknown --release
```

2. **Deploy to Stellar testnet**:
```bash
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/land_registry_contract.wasm \
  --network testnet
```

3. **Update `.env` with your contract ID**

## 📱 Usage Guide

### 1. Connecting Your Wallet

1. Install [Freighter Wallet](https://www.freighter.app/) browser extension
2. Create or import a Stellar account
3. Get testnet XLM from [Stellar Friendbot](https://laboratory.stellar.org/#account-creator)
4. Open the app and click **"Connect Wallet"**
5. Approve the connection in Freighter

### 2. As a Buyer

**Registration**:
- Click "Register as Buyer"
- Fill in personal details (Name, Age, City, Email)
- Provide KYC info (Aadhar, PAN)
- Upload document (optional)
- Submit and wait for inspector verification

**Browse & Purchase**:
- Browse available lands
- Filter by Regular or Fractional
- Click on a land to view details
- For regular land: Click "Request Purchase"
- For fractional land: Specify shares and "Buy Shares"

**Manage Properties**:
- View "My Properties" for owned lands
- Track fractional ownership percentages
- View purchase history in "My Requests"

### 3. As a Seller

**Registration**:
- Click "Register as Seller"
- Provide details (Name, Age, Aadhar, PAN, Lands Owned)
- Upload verification documents
- Submit and wait for verification

**Add Land**:
- Navigate to "Add Land" tab
- Fill in property details:
  - Area (sq. ft.)
  - Location (City, State)
  - Price in XLM
  - Property PID
  - Survey Number
- **For Fractional**:
  - Check "Enable Fractional Ownership"
  - Set total shares
  - Set price per share
- Upload documents and images
- Submit to blockchain

**Manage Listings**:
- View all your listings in "My Listings"
- Approve/reject purchase requests
- Track sales in "Purchase Requests"

### 4. As a Land Inspector

**Verification Workflow**:
- Access Inspector Dashboard
- Review pending verifications:
  - **Buyers**: Verify identity and documents
  - **Sellers**: Verify ownership and documents
  - **Lands**: Verify property details and legitimacy
- Approve or Reject registrations
- All actions recorded on blockchain

## 🛠️ Development

### Project Structure

```
frontend/
├── src/
│   ├── components/        # Reusable components
│   │   ├── Navbar.jsx
│   │   ├── LandCard.jsx
│   │   ├── Loading.jsx
│   │   └── ParticleBackground.jsx
│   ├── contexts/          # React contexts
│   │   ├── AuthContext.jsx
│   │   └── StellarContext.jsx
│   ├── pages/             # Page components
│   │   ├── Landing.jsx
│   │   ├── Login.jsx
│   │   ├── RegisterBuyer.jsx
│   │   ├── RegisterSeller.jsx
│   │   ├── BuyerDashboard.jsx
│   │   ├── SellerDashboard.jsx
│   │   └── InspectorDashboard.jsx
│   ├── routes/            # Routing configuration
│   │   └── AppRoutes.jsx
│   ├── utils/             # Utility functions
│   │   ├── contractInteraction.js
│   │   ├── stellar.js
│   │   ├── ipfs.js
│   │   └── helpers.js
│   ├── App.jsx
│   └── main.jsx
├── public/
├── .env
├── package.json
├── vite.config.js
└── tailwind.config.js
```

### Available Scripts

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Lint code

# Testing
npm test             # Run tests
npm run test:watch   # Run tests in watch mode
```

### Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: TailwindCSS, Framer Motion
- **Blockchain**: Stellar SDK, Soroban
- **Wallet**: Freighter API
- **Storage**: IPFS (Infura)
- **Routing**: React Router v6
- **Notifications**: React Toastify

## 🧪 Testing

Run comprehensive tests:

```bash
# Manual testing
# Follow TESTING_GUIDE.md for complete test suite

# Key test areas:
# - Wallet connection
# - User registration (all roles)
# - Land listing (regular & fractional)
# - Purchase flows
# - Verification workflows
# - Payment integration
# - Fractional ownership display
```

See **[TESTING_GUIDE.md](TESTING_GUIDE.md)** for detailed testing instructions.

## 🚀 Deployment

### Quick Deploy

**Vercel** (Recommended):
```bash
npm install -g vercel
vercel --prod
```

**Netlify**:
```bash
npm install -g netlify-cli
netlify deploy --prod
```

**Build manually**:
```bash
npm run build
# Upload 'dist' folder to your hosting service
```

For complete deployment guide, see **[DEPLOYMENT.md](DEPLOYMENT.md)**

### Production Checklist

- [ ] Update contract ID to mainnet
- [ ] Configure production environment variables
- [ ] Run `npm run build`
- [ ] Test build locally with `npm run preview`
- [ ] Deploy to hosting service
- [ ] Configure custom domain
- [ ] Enable HTTPS/SSL
- [ ] Set up monitoring and analytics

## 🎨 UI/UX Features

- **Stellar Brand Colors**: Purple (#7D4CDB) and Gold (#FFD700)
- **Particle Background**: Animated particles for engaging experience
- **Gradient Effects**: Smooth gradients throughout
- **Responsive Design**: Mobile-first, works on all devices
- **Smooth Animations**: Framer Motion for fluid transitions
- **Toast Notifications**: Real-time feedback
- **Loading States**: Clear loading indicators
- **Error Handling**: Graceful error messages

## 🔒 Security

- **Wallet Security**: Private keys never leave Freighter
- **Transaction Signing**: All transactions require user approval
- **Input Validation**: Client and contract-level validation
- **IPFS Security**: Content-addressed storage
- **Network Security**: HTTPS enforced
- **No Backend**: Fully decentralized (no central server vulnerabilities)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Stellar Development Foundation** for the blockchain infrastructure
- **Freighter Team** for the wallet integration
- **IPFS** for decentralized storage
- **React Team** for the amazing framework
- **Community contributors** and testers

## 📞 Support

- **Documentation**: This README and linked guides
- **Issues**: [GitHub Issues](https://github.com/TusharDarsena/Blockchain-Based-Land-and-Property-Record-Management-System/issues)
- **Stellar Community**: [Stellar Discord](https://discord.gg/stellar)

## 🗺️ Roadmap

- [x] Core land registry features
- [x] Fractional ownership
- [x] Complete dashboards for all roles
- [x] IPFS integration
- [x] Payment integration
- [ ] Advanced search and filters
- [ ] Land transfer history
- [ ] Multi-signature support
- [ ] Mobile app (React Native)
- [ ] Analytics dashboard
- [ ] Email notifications

## 📊 Project Status

**Current Version**: 1.0.0
**Status**: ✅ Production Ready
**Last Updated**: November 2025

---

**Built with ❤️ using Stellar Blockchain**

*Making land ownership transparent, accessible, and fractional*

## 🎨 UI Features

- **Neon Gradients**: Modern gradient backgrounds with Stellar colors
- **Particle Effects**: Animated particle background
- **Smooth Animations**: Framer Motion powered transitions
- **Responsive Design**: Mobile-first, works on all devices
- **Toast Notifications**: Real-time feedback for user actions

## 🛠️ Technology Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Blockchain**: Stellar SDK
- **Wallet**: Freighter API
- **Smart Contract**: Soroban (Rust)

## 📦 Build

```bash
npm run build
```

The production build will be in the `build/` directory.

## 🧪 Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🔗 Links

- [Stellar Documentation](https://developers.stellar.org/)
- [Soroban Documentation](https://soroban.stellar.org/)
- [Freighter Wallet](https://www.freighter.app/)

## 💡 Support

For issues and questions, please open an issue on GitHub.
