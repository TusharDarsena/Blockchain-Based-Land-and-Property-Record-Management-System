# 🚀 Quick Reference Guide

Quick commands and tips for working with Fractional.

## 📦 Installation & Setup

```bash
# Clone repository
git clone https://github.com/TusharDarsena/Blockchain-Based-Land-and-Property-Record-Management-System.git
cd "land registry project/frontend"

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🔧 Development Commands

```bash
# Start dev server (with hot reload)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Fix lint issues
npm run lint:fix

# Run all checks (lint + build)
npm run check
```

## 🌐 Deployment Commands

```bash
# Deploy to Vercel
npm run deploy:vercel

# Deploy to Netlify
npm run deploy:netlify

# Manual build
npm run build
# Then upload 'dist' folder
```

## 🔑 Environment Variables

Quick setup for `.env`:

```env
VITE_STELLAR_NETWORK=testnet
VITE_STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org
VITE_STELLAR_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
VITE_LAND_REGISTRY_CONTRACT_ID=C4TOGUUMX42QP2LZHUWV3I3YW2MXBCOATDF6E6XJRIMEVFITRTSNRAW
VITE_STELLAR_NETWORK_PASSPHRASE=Test SDF Network ; September 2015
```

**For Production (Mainnet):**
```env
VITE_STELLAR_NETWORK=mainnet
VITE_STELLAR_HORIZON_URL=https://horizon.stellar.org
VITE_STELLAR_SOROBAN_RPC_URL=https://soroban-rpc.stellar.org
VITE_LAND_REGISTRY_CONTRACT_ID=YOUR_MAINNET_CONTRACT_ID
VITE_STELLAR_NETWORK_PASSPHRASE=Public Global Stellar Network ; September 2015
```

## 🧪 Testing Quick Start

1. **Install Freighter Wallet**: https://www.freighter.app/
2. **Get Testnet XLM**: https://laboratory.stellar.org/#account-creator
3. **Open app**: http://localhost:5173
4. **Connect wallet**: Click "Connect Wallet"
5. **Test features**: Follow TESTING_GUIDE.md

## 📱 User Flows

### As Buyer
1. Connect wallet
2. Register as buyer
3. Wait for inspector verification
4. Browse lands
5. Request purchase / Buy fractional shares
6. View owned properties

### As Seller
1. Connect wallet
2. Register as seller
3. Wait for verification
4. Add land (regular or fractional)
5. Wait for land verification
6. Manage purchase requests

### As Inspector
1. Connect with inspector wallet
2. Navigate to Inspector Dashboard
3. Verify buyers/sellers/lands
4. Approve or reject registrations

## 🔍 Troubleshooting

### Wallet Issues
```bash
# Problem: Wallet won't connect
# Solution: 
# 1. Install Freighter extension
# 2. Reload page (Ctrl+R or Cmd+R)
# 3. Clear cache and cookies
```

### Build Issues
```bash
# Problem: Build fails
# Solution:
rm -rf node_modules dist
npm install
npm run build
```

### Network Issues
```bash
# Problem: Transactions failing
# Solution: Check:
# 1. XLM balance (use Friendbot for testnet)
# 2. Contract ID in .env
# 3. Network configuration
# 4. Freighter connected to correct network
```

## 📚 File Locations

```
Key Files:
├── .env                           # Environment configuration
├── src/
│   ├── contexts/
│   │   ├── StellarContext.jsx    # Wallet & blockchain state
│   │   └── AuthContext.jsx       # User authentication
│   ├── utils/
│   │   ├── contractInteraction.js # Smart contract calls
│   │   ├── stellar.js            # Stellar SDK utilities
│   │   └── ipfs.js               # IPFS upload/download
│   └── pages/
│       ├── BuyerDashboard.jsx    # Buyer interface
│       ├── SellerDashboard.jsx   # Seller interface
│       └── InspectorDashboard.jsx # Inspector interface
```

## 🎨 UI Components

```javascript
// Import components
import Navbar from '../components/Navbar'
import Loading from '../components/Loading'
import LandCard from '../components/LandCard'

// Use Stellar context
import { useStellar } from '../contexts/StellarContext'
const { publicKey, connectWallet, isConnected } = useStellar()

// Use Auth context
import { useAuth } from '../contexts/AuthContext'
const { userData, userRole } = useAuth()

// Show toast notification
import { toast } from 'react-toastify'
toast.success('Success!')
toast.error('Error!')
toast.info('Info!')
```

## 💡 Contract Functions

```javascript
import {
  // Registration
  registerBuyer,
  registerSeller,
  
  // Verification
  verifyBuyer,
  verifySeller,
  verifyLand,
  
  // Land Management
  addLand,
  getAllLands,
  
  // Purchase
  requestLandPurchase,
  approveLandRequest,
  
  // Fractional
  buyFractionalShares,
  getUserFractionalLands,
} from '../utils/contractInteraction'

// Example: Register buyer
await registerBuyer(
  publicKey,
  name,
  age,
  city,
  aadharNumber,
  panNumber,
  documentHash,
  email
)
```

## 📊 Useful URLs

### Stellar Testnet
- **Horizon**: https://horizon-testnet.stellar.org
- **Soroban RPC**: https://soroban-testnet.stellar.org
- **Friendbot**: https://laboratory.stellar.org/#account-creator
- **Explorer**: https://stellar.expert/explorer/testnet

### Stellar Mainnet
- **Horizon**: https://horizon.stellar.org
- **Soroban RPC**: https://soroban-rpc.stellar.org
- **Explorer**: https://stellar.expert/explorer/public

### Tools
- **Freighter Wallet**: https://www.freighter.app/
- **Stellar Laboratory**: https://laboratory.stellar.org/
- **Stellar Docs**: https://developers.stellar.org/

## 🎯 Common Tasks

### Add a new land listing
```javascript
await addLand(
  publicKey,
  {
    area: 2000,
    city: "Mumbai",
    state: "Maharashtra",
    price: 50000,
    propertyPid: "PID123",
    physicalSurveyNumber: "SN456",
    document: documentHash,
    images: imageHashes,
    isFractional: true,
    totalShares: 100,
    pricePerShare: 500
  }
)
```

### Buy fractional shares
```javascript
await buyFractionalShares(
  publicKey,
  landId,
  numberOfShares
)
```

### Verify a user
```javascript
// As inspector
await verifyBuyer(inspectorKey, buyerAddress)
await verifySeller(inspectorKey, sellerAddress)
```

## 🔐 Security Checklist

- [ ] Use HTTPS in production
- [ ] Verify contract ID before transactions
- [ ] Never commit .env files
- [ ] Keep dependencies updated: `npm update`
- [ ] Run security audit: `npm audit`
- [ ] Test on testnet first
- [ ] Use hardware wallet for large transactions

## 📦 Production Deployment

**Quickest way (Vercel):**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

**Manual:**
```bash
# Build
npm run build

# Test locally
npm run preview

# Upload 'dist' folder to hosting
```

## 📞 Get Help

- **Documentation**: README.md, TESTING_GUIDE.md, DEPLOYMENT.md
- **Issues**: GitHub Issues
- **Stellar Discord**: https://discord.gg/stellar
- **Stack Overflow**: Tag with 'stellar' and 'soroban'

## 🎓 Learn More

- **Stellar Docs**: https://developers.stellar.org/
- **Soroban Docs**: https://soroban.stellar.org/docs
- **React Docs**: https://react.dev/
- **Vite Docs**: https://vitejs.dev/
- **TailwindCSS**: https://tailwindcss.com/

---

## 💾 Backup Your Work

```bash
# Create backup
git add .
git commit -m "Backup: $(date)"
git push origin main

# Or manually
zip -r fractional-backup.zip .
```

---

**Quick tip**: Press `Ctrl+C` to stop dev server, `Ctrl+R` to reload browser

**Need help?** Check TESTING_GUIDE.md for detailed walkthroughs!
