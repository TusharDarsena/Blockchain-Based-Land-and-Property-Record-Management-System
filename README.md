# Land Registry Smart Contract

A decentralized land registry system built on Stellar blockchain using Soroban smart contracts. This contract enables transparent and secure management of land ownership, verification, and transfers.

## 🌟 Features

- **Land Inspector Management**: Initialize contract with a designated land inspector
- **Seller Registration & Verification**: Register sellers with KYC details and inspector verification
- **Buyer Registration & Verification**: Register buyers with identification and inspector approval
- **Land Registration**: Add land parcels with detailed information (area, location, price, documents)
- **Land Verification**: Inspector-approved land validation
- **Purchase Requests**: Buyers can request to purchase verified lands
- **Approval Workflow**: Seller approval required for purchase requests
- **Payment Processing**: Track payment status for land transactions
- **Ownership Transfer**: Inspector-controlled ownership transfer mechanism
- **Query Functions**: Read land, seller, buyer, and request information

## 📋 Prerequisites

- [Rust](https://www.rust-lang.org/tools/install) (latest stable version)
- [Stellar CLI](https://developers.stellar.org/docs/tools/stellar-cli) (`stellar-cli`)
- Stellar testnet account with XLM balance

## 🚀 Quick Start

### 1. Clone and Build

```bash
cd land-registry-contract
cargo build --target wasm32-unknown-unknown --release
```

### 2. Optimize WASM

```bash
stellar contract optimize --wasm target/wasm32-unknown-unknown/release/land_registry.wasm
```

### 3. Deploy to Testnet

```bash
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/land_registry.optimized.wasm \
  --source <your-identity> \
  --network testnet
```

## 📦 Project Structure

```
land-registry-contract/
├── src/
│   ├── lib.rs           # Main contract implementation
│   └── test.rs          # Unit tests
├── Cargo.toml           # Project dependencies
└── README.md            # This file

land registry project/
├── Cargo.toml           # Workspace configuration
└── land-registry-contract/
```

## 🔧 Contract Functions

### Initialization

```bash
stellar contract invoke \
  --id <CONTRACT_ID> \
  --source <inspector-identity> \
  --network testnet \
  -- initialize \
  --inspector_address <INSPECTOR_ADDRESS> \
  --name "Inspector Name" \
  --age 45 \
  --designation "Land Inspector"
```

### Seller Operations

**Register Seller:**
```bash
stellar contract invoke \
  --id <CONTRACT_ID> \
  --source <seller-identity> \
  --network testnet \
  -- register_seller \
  --caller <SELLER_ADDRESS> \
  --name "John Seller" \
  --age 35 \
  --aadhar_number "1234-5678-9012" \
  --pan_number "ABCDE1234F" \
  --lands_owned "Plot123" \
  --document "QmSellerDoc123"
```

**Verify Seller (Inspector only):**
```bash
stellar contract invoke \
  --id <CONTRACT_ID> \
  --source <inspector-identity> \
  --network testnet \
  -- verify_seller \
  --inspector <INSPECTOR_ADDRESS> \
  --seller_id <SELLER_ADDRESS>
```

**Add Land:**
```bash
stellar contract invoke \
  --id <CONTRACT_ID> \
  --source <seller-identity> \
  --network testnet \
  -- add_land \
  --seller <SELLER_ADDRESS> \
  --area 1000 \
  --city "Pune" \
  --state "Maharashtra" \
  --land_price 5000000 \
  --property_pid 12345 \
  --survey_num 67890 \
  --ipfs_hash "QmLandHash123" \
  --document "QmLandDoc789"
```

### Buyer Operations

**Register Buyer:**
```bash
stellar contract invoke \
  --id <CONTRACT_ID> \
  --source <buyer-identity> \
  --network testnet \
  -- register_buyer \
  --caller <BUYER_ADDRESS> \
  --name "Jane Buyer" \
  --age 28 \
  --city "Mumbai" \
  --aadhar_number "9876-5432-1098" \
  --pan_number "XYZAB9876C" \
  --document "QmBuyerDoc456" \
  --email "jane@example.com"
```

**Verify Buyer (Inspector only):**
```bash
stellar contract invoke \
  --id <CONTRACT_ID> \
  --source <inspector-identity> \
  --network testnet \
  -- verify_buyer \
  --inspector <INSPECTOR_ADDRESS> \
  --buyer_id <BUYER_ADDRESS>
```

**Request Land:**
```bash
stellar contract invoke \
  --id <CONTRACT_ID> \
  --source <buyer-identity> \
  --network testnet \
  -- request_land \
  --buyer <BUYER_ADDRESS> \
  --seller_id <SELLER_ADDRESS> \
  --land_id 1
```

### Transaction Flow

**1. Approve Request (Seller):**
```bash
stellar contract invoke \
  --id <CONTRACT_ID> \
  --source <seller-identity> \
  --network testnet \
  -- approve_request \
  --seller <SELLER_ADDRESS> \
  --req_id 1
```

**2. Make Payment (Buyer):**
```bash
stellar contract invoke \
  --id <CONTRACT_ID> \
  --source <buyer-identity> \
  --network testnet \
  -- payment \
  --buyer <BUYER_ADDRESS> \
  --req_id 1
```

**3. Transfer Ownership (Inspector):**
```bash
stellar contract invoke \
  --id <CONTRACT_ID> \
  --source <inspector-identity> \
  --network testnet \
  -- transfer_ownership \
  --inspector <INSPECTOR_ADDRESS> \
  --land_id 1 \
  --new_owner <BUYER_ADDRESS>
```

### Query Functions

**Get Land Details:**
```bash
stellar contract invoke \
  --id <CONTRACT_ID> \
  --source <any-identity> \
  --network testnet \
  -- get_land \
  --land_id 1
```

**Get Land Owner:**
```bash
stellar contract invoke \
  --id <CONTRACT_ID> \
  --source <any-identity> \
  --network testnet \
  -- get_land_owner \
  --land_id 1
```

**Get Seller Info:**
```bash
stellar contract invoke \
  --id <CONTRACT_ID> \
  --source <any-identity> \
  --network testnet \
  -- get_seller \
  --seller_id <SELLER_ADDRESS>
```

**Get Statistics:**
```bash
# Get total lands count
stellar contract invoke --id <CONTRACT_ID> --source <identity> --network testnet -- get_lands_count

# Get total sellers count
stellar contract invoke --id <CONTRACT_ID> --source <identity> --network testnet -- get_sellers_count

# Get total buyers count
stellar contract invoke --id <CONTRACT_ID> --source <identity> --network testnet -- get_buyers_count

# Check if land is verified
stellar contract invoke --id <CONTRACT_ID> --source <identity> --network testnet -- is_land_verified --land_id 1
```

## 🧪 Testing

Run the test suite:

```bash
cd land-registry-contract
cargo test
```

**Test Coverage:**
- ✅ Contract initialization
- ✅ Seller registration and verification
- ✅ Buyer registration and verification
- ✅ Land addition and verification
- ✅ Purchase request workflow
- ✅ Payment processing
- ✅ Ownership transfer
- ✅ Duplicate registration prevention
- ✅ Double initialization prevention

## 🌐 Live Deployment (Testnet)

**Contract Address:** `CC4TOGUUMX42QP2LZHUWV3I3YW2MXBCOATDF6E6XJRIMEVFITRTSNRAW`

**Explorer:**
- [View Contract](https://stellar.expert/explorer/testnet/contract/CC4TOGUUMX42QP2LZHUWV3I3YW2MXBCOATDF6E6XJRIMEVFITRTSNRAW)

**Test Identities:**
- Inspector: `GCASZ6KP6IDPN7HEBOSIFZKEAUAPZ6QHAJFRIFADHADLUIK4WRQOLMP3`
- Seller: `GA6JPH6WOYFRLJ7KUYYGAVG5ICRSPUOW5JKDL6XPRMILZRMZ42MTZHYY`
- Buyer: `GD2VSFUP4UBTNLYLD2YDWF2QDJGORE7M3XZPKNH6F3LBADOVFD4A3SIG`

## 📊 Contract Stats

- **Original WASM Size:** 31,629 bytes
- **Optimized WASM Size:** 19,232 bytes
- **Size Reduction:** 39.2%
- **SDK Version:** soroban-sdk 23.1.0

## 🔐 Security Features

- **Authentication:** All state-changing functions require caller authentication
- **Authorization:** Inspector-only functions for verification and transfers
- **Validation:** Verified status required for land transactions
- **Duplicate Prevention:** Addresses can only register once

## 📝 Data Structures

### LandReg
- `id`: Unique land identifier
- `area`: Land area in square units
- `city`, `state`: Location details
- `land_price`: Price in stroops
- `property_pid`: Property identification number
- `physical_survey_number`: Survey number
- `ipfs_hash`: IPFS hash for documents
- `document`: Additional document reference

### Seller
- `id`: Seller's address
- `name`, `age`: Personal details
- `aadhar_number`, `pan_number`: KYC information
- `lands_owned`: List of owned land plots
- `document`: IPFS document hash
- `verified`, `rejected`: Status flags

### Buyer
- `id`: Buyer's address
- `name`, `age`, `city`: Personal details
- `aadhar_number`, `pan_number`: KYC information
- `document`: IPFS document hash
- `email`: Contact information
- `verified`, `rejected`: Status flags

### LandRequest
- `req_id`: Unique request identifier
- `seller_id`, `buyer_id`: Transaction parties
- `land_id`: Requested land
- `approved`: Seller approval status
- `payment_received`: Payment completion status

## 🛠️ Development

### Setup Development Environment

1. Install Rust:
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

2. Add WASM target:
```bash
rustup target add wasm32-unknown-unknown
```

3. Install Stellar CLI:
```bash
cargo install --locked stellar-cli --features opt
```

### Build Commands

```bash
# Build for testing
cargo build

# Build WASM for deployment
cargo build --target wasm32-unknown-unknown --release

# Run tests
cargo test

# Optimize WASM
stellar contract optimize --wasm target/wasm32-unknown-unknown/release/land_registry.wasm
```

## 🐛 Troubleshooting

### Common Issues

**Issue:** `Account not found`
**Solution:** Fund your testnet account:
```bash
stellar keys fund <identity-name> --network testnet
```

**Issue:** `Contract already initialized`
**Solution:** The contract can only be initialized once. Deploy a new instance if needed.

**Issue:** `Only Land Inspector can verify`
**Solution:** Ensure you're using the inspector identity that was set during initialization.

## 📄 License

MIT License - See LICENSE file for details

## 👥 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📧 Contact

For questions and support, please open an issue in the repository.

## 🙏 Acknowledgments

- Built with [Soroban SDK](https://github.com/stellar/rs-soroban-sdk)
- Deployed on [Stellar Network](https://stellar.org)
