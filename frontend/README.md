# Fractional - Stellar Land Registry

Fractional is a decentralized land registry application built on the Stellar blockchain with support for fractional land ownership.

## 🌟 Features

- **Decentralized Land Registry**: Register and manage land ownership on Stellar blockchain
- **Fractional Ownership**: Buy and sell fractional shares of land properties
- **Role-Based Access**: Separate interfaces for Buyers, Sellers, and Land Inspectors
- **Freighter Wallet Integration**: Secure wallet connection using Freighter
- **Modern UI**: Beautiful, responsive interface with Stellar brand colors and animations

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Freighter Wallet Extension ([Download here](https://www.freighter.app/))

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your Stellar contract ID and network configuration.

4. Start the development server:
```bash
npm run dev
```

The application will open at `http://localhost:3000`

## 🔧 Configuration

### Environment Variables

- `VITE_STELLAR_NETWORK`: Network to use (testnet/mainnet)
- `VITE_STELLAR_HORIZON_URL`: Stellar Horizon server URL
- `VITE_STELLAR_SOROBAN_RPC_URL`: Soroban RPC server URL
- `VITE_LAND_REGISTRY_CONTRACT_ID`: Your deployed contract ID

### Deploying the Smart Contract

1. Build the Rust contract:
```bash
cd ../land-registry-contract
cargo build --target wasm32-unknown-unknown --release
```

2. Deploy to Stellar testnet:
```bash
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/land_registry_contract.wasm \
  --network testnet
```

3. Copy the contract ID to your `.env` file

## 📱 Usage

### Connecting Wallet

1. Install Freighter wallet extension
2. Create or import a Stellar account
3. Click "Connect Wallet" in the application
4. Approve the connection in Freighter

### User Roles

#### Buyer
- Register as a buyer
- Browse available lands (regular and fractional)
- Request to purchase land or land fractions
- View owned properties

#### Seller
- Register as a seller
- Add new land listings (regular or fractional)
- Approve buyer requests
- Manage land portfolio

#### Land Inspector
- Verify buyer and seller registrations
- Approve land listings
- Verify land ownership transfers

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
