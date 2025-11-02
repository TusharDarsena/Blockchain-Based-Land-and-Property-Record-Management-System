# 🏛️ Land Registry - Decentralized Property Management on Stellar Blockchain

**Transparent, Secure, and Immutable Land Ownership Records**

[![Stellar](https://img.shields.io/badge/Stellar-Testnet-blue)](https://stellar.org)
[![Soroban](https://img.shields.io/badge/Soroban-Smart%20Contracts-purple)](https://soroban.stellar.org)
[![Rust](https://img.shields.io/badge/Rust-1.75+-orange)](https://www.rust-lang.org)

---

## 🎯 Problem Statement

Traditional land registry systems face critical challenges:
- **Fraud and corruption** in manual record-keeping
- **Lengthy bureaucratic processes** taking months or years
- **High costs** for property verification and transfers
- **Lack of transparency** leading to disputes
- **Lost or tampered records** causing ownership conflicts

**Result:** Property disputes, delayed transactions, and loss of trust in land records.

---

## 💡 Our Solution

**Land Registry Smart Contract** is a decentralized, blockchain-based property management system that enables:

- ✅ **Immutable records** - Tamper-proof land ownership data
- ✅ **Transparent verification** - Inspector-approved land validation
- ✅ **Automated workflows** - Smart contract-driven transactions
- ✅ **Fractional ownership** - Support for shared land ownership
- ✅ **Instant verification** - Real-time ownership and status checks
- ✅ **Cost-effective** - Minimal fees compared to traditional systems

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│            Land Inspector                       │
│  - Verifies sellers and buyers                  │
│  - Approves land registrations                  │
│  - Transfers ownership after payment            │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│       Land Registry Smart Contract              │
│  - Stores land records                          │
│  - Manages seller/buyer registrations           │
│  - Processes purchase requests                  │
│  - Handles payments and transfers               │
└────────────────┬────────────────────────────────┘
                 │
     ┌───────────┴───────────┐
     ▼                       ▼
┌─────────────┐      ┌─────────────┐
│   Sellers   │      │   Buyers    │
│  - Register │      │  - Register │
│  - Add land │      │  - Request  │
│  - Approve  │      │  - Pay      │
└─────────────┘      └─────────────┘
```

---

## 🚀 Features

### Core Functionality

1. **Land Inspector Management**
   - Initialize contract with designated inspector
   - Verify sellers and buyers
   - Approve land registrations
   - Control ownership transfers

2. **Seller Registration & Verification**
   - Register with KYC details (Aadhar, PAN)
   - Upload supporting documents
   - Inspector verification required

3. **Buyer Registration & Verification**
   - Register with identification details
   - Inspector approval process
   - Secure buyer verification

4. **Land Registration**
   - Add land parcels with detailed information
   - Area, location, price, and document hashes
   - Inspector approval required for verification

5. **Fractional Ownership**
   - Split land into multiple fractions
   - Allow multiple buyers to own portions
   - Track individual fraction ownership

6. **Purchase Workflow**
   - Buyers request to purchase lands
   - Sellers approve requests
   - Payment tracking
   - Automated ownership transfer

### Security Features

- ✅ **Authorization checks** - Role-based access control
- ✅ **Inspector verification** - Multi-level approval system
- ✅ **Payment validation** - Ensures payment before transfer
- ✅ **Immutable records** - Blockchain-secured data
- ✅ **Comprehensive testing** - 22 unit tests covering all scenarios

---

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| **Smart Contract** | Rust + Soroban SDK v23.1.0 |
| **Blockchain** | Stellar Network (Testnet) |
| **Frontend** | React.js |
| **Storage** | IPFS (for documents) |
| **Wallet** | Freighter Wallet Integration |
| **CLI Tools** | Stellar CLI |
| **Testing** | Rust Unit Tests |

---

## 📦 Installation & Setup

### Prerequisites

```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Add WebAssembly target
rustup target add wasm32-unknown-unknown

# Install Stellar CLI
cargo install --locked stellar-cli --features opt
```

### Clone Repository

```bash
git clone https://github.com/TusharDarsena/land-registry.git
cd land-registry
```

### Build Contract

```bash
cd land-registry-contract
cargo build --target wasm32-unknown-unknown --release
```

### Optimize WASM

```bash
stellar contract optimize --wasm target/wasm32-unknown-unknown/release/land_registry.wasm
```

**Output:** `land_registry.optimized.wasm` (19,232 bytes - 39.2% reduction)

### Run Tests

```bash
cargo test
```

Expected output:
```
running 22 tests
test test::test_initialize ... ok
test test::test_register_seller ... ok
test test::test_verify_seller ... ok
test test::test_register_buyer ... ok
test test::test_verify_buyer ... ok
test test::test_add_land ... ok
test test::test_verify_land ... ok
test test::test_request_land ... ok
test test::test_approve_request ... ok
test test::test_payment ... ok
test test::test_transfer_ownership ... ok
test test::test_fractional_ownership ... ok
[... and more]

test result: ok. 22 passed; 0 failed
```

---

## 🎮 Usage Guide

### 1. Configure Network

```bash
stellar network add --global testnet \
  --rpc-url https://soroban-testnet.stellar.org:443 \
  --network-passphrase "Test SDF Network ; September 2015"
```

### 2. Create and Fund Accounts

```bash
# Create identities
stellar keys generate alice --network testnet
stellar keys generate seller --network testnet
stellar keys generate buyer --network testnet

# Fund accounts
stellar keys fund alice --network testnet
stellar keys fund seller --network testnet
stellar keys fund buyer --network testnet
```

### 3. Deploy Contract

```bash
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/land_registry.optimized.wasm \
  --source alice \
  --network testnet
```

**Output:** Contract ID (save this!)

Example: `CC4TOGUUMX42QP2LZHUWV3I3YW2MXBCOATDF6E6XJRIMEVFITRTSNRAW`


### 4. Initialize Contract

```bash
stellar contract invoke \
  --id CC4TOGUUMX42QP2LZHUWV3I3YW2MXBCOATDF6E6XJRIMEVFITRTSNRAW \
  --source alice \
  --network testnet \
  -- initialize \
  --inspector_address GA6JPHMXDVG3YBILELFB4YXN3UV3XZT3V3I3MJBPZAUJL3LSLGFWZ7EJ \
  --name "Alice Inspector" \
  --age 45 \
  --designation "Chief Land Inspector"
```

### 5. Register Seller

```bash
stellar contract invoke \
  --id CC4TOGUUMX42QP2LZHUWV3I3YW2MXBCOATDF6E6XJRIMEVFITRTSNRAW \
  --source seller \
  --network testnet \
  -- register_seller \
  --caller SELLER_ADDRESS \
  --name "John Seller" \
  --age 35 \
  --aadhar_number "1234-5678-9012" \
  --pan_number "ABCDE1234F" \
  --lands_owned "Plot123" \
  --document "QmDocumentHash"
```

### 6. Verify Seller (Inspector)

```bash
stellar contract invoke \
  --id CC4TOGUUMX42QP2LZHUWV3I3YW2MXBCOATDF6E6XJRIMEVFITRTSNRAW \
  --source alice \
  --network testnet \
  -- verify_seller \
  --seller_address SELLER_ADDRESS
```

### 7. Register Buyer

```bash
stellar contract invoke \
  --id CC4TOGUUMX42QP2LZHUWV3I3YW2MXBCOATDF6E6XJRIMEVFITRTSNRAW \
  --source buyer \
  --network testnet \
  -- register_buyer \
  --caller BUYER_ADDRESS \
  --name "Jane Buyer" \
  --age 30 \
  --city "Mumbai" \
  --aadhar_number "9876-5432-1098" \
  --pan_number "ZYXWV9876E" \
  --document "QmBuyerDocHash"
```

### 8. Verify Buyer (Inspector)

```bash
stellar contract invoke \
  --id CC4TOGUUMX42QP2LZHUWV3I3YW2MXBCOATDF6E6XJRIMEVFITRTSNRAW \
  --source alice \
  --network testnet \
  -- verify_buyer \
  --buyer_address BUYER_ADDRESS
```

### 9. Add Land

```bash
stellar contract invoke \
  --id CC4TOGUUMX42QP2LZHUWV3I3YW2MXBCOATDF6E6XJRIMEVFITRTSNRAW \
  --source seller \
  --network testnet \
  -- add_land \
  --caller SELLER_ADDRESS \
  --area 1000 \
  --city "Mumbai" \
  --state "Maharashtra" \
  --price 5000000 \
  --property_pid "PROP123456" \
  --physical_survey_number "SURVEY789" \
  --document "QmLandDocHash"
```

### 10. Verify Land (Inspector)

```bash
stellar contract invoke \
  --id CC4TOGUUMX42QP2LZHUWV3I3YW2MXBCOATDF6E6XJRIMEVFITRTSNRAW \
  --source alice \
  --network testnet \
  -- verify_land \
  --land_id 1
```

### 11. Request to Purchase

```bash
stellar contract invoke \
  --id CC4TOGUUMX42QP2LZHUWV3I3YW2MXBCOATDF6E6XJRIMEVFITRTSNRAW \
  --source buyer \
  --network testnet \
  -- request_land \
  --caller BUYER_ADDRESS \
  --land_id 1
```

### 12. Approve Request (Seller)

```bash
stellar contract invoke \
  --id CC4TOGUUMX42QP2LZHUWV3I3YW2MXBCOATDF6E6XJRIMEVFITRTSNRAW \
  --source seller \
  --network testnet \
  -- approve_request \
  --request_id 1
```

### 13. Make Payment

```bash
stellar contract invoke \
  --id CC4TOGUUMX42QP2LZHUWV3I3YW2MXBCOATDF6E6XJRIMEVFITRTSNRAW \
  --source buyer \
  --network testnet \
  -- payment \
  --request_id 1
```

### 14. Transfer Ownership (Inspector)

```bash
stellar contract invoke \
  --id CC4TOGUUMX42QP2LZHUWV3I3YW2MXBCOATDF6E6XJRIMEVFITRTSNRAW \
  --source alice \
  --network testnet \
  -- transfer_ownership \
  --land_id 1 \
  --buyer_address BUYER_ADDRESS
```

### 15. Query Functions

**Get Land Information:**
```bash
stellar contract invoke \
  --id CC4TOGUUMX42QP2LZHUWV3I3YW2MXBCOATDF6E6XJRIMEVFITRTSNRAW \
  --source alice \
  --network testnet \
  -- get_land \
  --land_id 1
```

**Get Seller Information:**
```bash
stellar contract invoke \
  --id CC4TOGUUMX42QP2LZHUWV3I3YW2MXBCOATDF6E6XJRIMEVFITRTSNRAW \
  --source alice \
  --network testnet \
  -- get_seller \
  --seller_address SELLER_ADDRESS
```

**Get Buyer Information:**
```bash
stellar contract invoke \
  --id CC4TOGUUMX42QP2LZHUWV3I3YW2MXBCOATDF6E6XJRIMEVFITRTSNRAW \
  --source alice \
  --network testnet \
  -- get_buyer \
  --buyer_address BUYER_ADDRESS
```

---

## 🧪 Demo Deployment

**Live Contract on Stellar Testnet:**

```
Contract ID: CC4TOGUUMX42QP2LZHUWV3I3YW2MXBCOATDF6E6XJRIMEVFITRTSNRAW
Network: Testnet
Status: ✅ Deployed and Tested
WASM Size: 19,232 bytes (optimized)
```

### Demo Workflow

| Action | Status | Description |
|--------|--------|-------------|
| Initialize | ✅ Success | Inspector set up |
| Register Seller | ✅ Success | Seller KYC completed |
| Verify Seller | ✅ Success | Inspector approved |
| Register Buyer | ✅ Success | Buyer KYC completed |
| Verify Buyer | ✅ Success | Inspector approved |
| Add Land | ✅ Success | Land parcel registered |
| Verify Land | ✅ Success | Inspector validated |
| Request Purchase | ✅ Success | Buyer requested land |
| Approve Request | ✅ Success | Seller approved |
| Make Payment | ✅ Success | Payment recorded |
| Transfer Ownership | ✅ Success | Ownership transferred |

View on [Stellar Expert](https://stellar.expert/explorer/testnet/contract/CC4TOGUUMX42QP2LZHUWV3I3YW2MXBCOATDF6E6XJRIMEVFITRTSNRAW)

---

## 📊 Smart Contract Functions

### Public Functions

| Function | Description | Authorization | Parameters |
|----------|-------------|---------------|------------|
| `initialize()` | Set up land inspector | Inspector | inspector_address, name, age, designation |
| `register_seller()` | Register land seller | Seller | caller, name, age, aadhar, pan, lands_owned, document |
| `verify_seller()` | Verify seller | Inspector | seller_address |
| `register_buyer()` | Register land buyer | Buyer | caller, name, age, city, aadhar, pan, document |
| `verify_buyer()` | Verify buyer | Inspector | buyer_address |
| `add_land()` | Add land parcel | Seller | caller, area, city, state, price, pid, survey_no, document |
| `verify_land()` | Verify land | Inspector | land_id |
| `request_land()` | Request to purchase | Buyer | caller, land_id |
| `approve_request()` | Approve purchase | Seller | request_id |
| `payment()` | Record payment | Buyer | request_id |
| `transfer_ownership()` | Transfer land | Inspector | land_id, buyer_address |
| `get_land()` | Get land details | Public | land_id |
| `get_seller()` | Get seller info | Public | seller_address |
| `get_buyer()` | Get buyer info | Public | buyer_address |
| `get_request()` | Get request info | Public | request_id |

### Fractional Ownership Functions

| Function | Description | Authorization | Parameters |
|----------|-------------|---------------|------------|
| `add_fractional_land()` | Add land with fractions | Seller | caller, area, city, state, price_per_fraction, total_fractions, pid, survey_no, document |
| `request_fractional_land()` | Request fraction(s) | Buyer | caller, land_id, num_fractions |
| `get_fractional_ownership()` | Get fraction details | Public | land_id, buyer_address |

---

## 🧪 Testing

### Comprehensive Test Suite

```rust
// Core functionality tests
#[test] fn test_initialize() { ... }
#[test] fn test_register_seller() { ... }
#[test] fn test_verify_seller() { ... }
#[test] fn test_register_buyer() { ... }
#[test] fn test_verify_buyer() { ... }
#[test] fn test_add_land() { ... }
#[test] fn test_verify_land() { ... }
#[test] fn test_request_land() { ... }
#[test] fn test_approve_request() { ... }
#[test] fn test_payment() { ... }
#[test] fn test_transfer_ownership() { ... }

// Fractional ownership tests
#[test] fn test_add_fractional_land() { ... }
#[test] fn test_request_fractional_land() { ... }
#[test] fn test_multiple_buyers_fractional_land() { ... }
#[test] fn test_buyer_cannot_buy_twice() { ... }
#[test] fn test_fractional_land_sold_out() { ... }
#[test] fn test_cannot_transfer_fractional_land() { ... }

// Error condition tests
#[test] fn test_cannot_verify_unregistered_seller() { ... }
#[test] fn test_cannot_add_land_unverified_seller() { ... }
#[test] fn test_cannot_request_unverified_land() { ... }
#[test] fn test_cannot_approve_unpaid_request() { ... }
#[test] fn test_get_fractional_ownership() { ... }
```

**All 22 tests pass ✅**

Run tests:
```bash
cd land-registry-contract
cargo test
```

---

## 🔐 Security Considerations

### Implemented Security Measures

1. **Role-Based Access Control**
   ```rust
   caller.require_auth();  // Ensures authorized caller
   ```

2. **Inspector Verification Required**
   ```rust
   if !seller.is_verified {
       panic!("Seller is not verified by inspector");
   }
   ```

3. **Payment Validation**
   ```rust
   if !request.is_paid {
       panic!("Payment not completed");
   }
   ```

4. **Ownership Validation**
   ```rust
   if land.owner != seller_address {
       panic!("Seller does not own this land");
   }
   ```

5. **Fractional Ownership Limits**
   ```rust
   if land.fractions_sold + num_fractions > land.total_fractions {
       panic!("Not enough fractions available");
   }
   ```

### Future Security Enhancements

- [ ] Multi-signature approval for high-value transactions
- [ ] Time-locked escrow for payment security
- [ ] Integration with government land records
- [ ] Biometric verification for sellers/buyers
- [ ] Automated dispute resolution mechanism

---

## 🌟 Use Cases

### Property Transactions
- Transparent land buying and selling
- Reduced fraud and corruption
- Faster transaction processing

### Government Land Records
- Digital land registry management
- Immutable record-keeping
- Easy verification and auditing

### Real Estate Development
- Fractional ownership for large projects
- Multiple investors in single property
- Simplified ownership transfer

### Rural Land Management
- Bring transparency to rural areas
- Prevent land grabbing
- Easy ownership verification

---

## 📈 Market Opportunity

| Metric | Value |
|--------|-------|
| **Global Real Estate Market** | $326.5 Trillion |
| **Land Registration Fraud** | $1+ Billion annually |
| **Average Transaction Time** | 4-6 months (traditional) |
| **Our Solution Time** | Minutes (blockchain) |
| **Cost Reduction** | 80%+ vs traditional methods |
| **Addressable Market** | 100M+ property transactions/year |

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

### Code Standards
- Follow Rust style guidelines
- Add unit tests for new functions
- Update documentation
- Run `cargo fmt` before committing
- Ensure all tests pass (`cargo test`)

---

## 📦 Project Structure

```
land-registry/
├── land-registry-contract/
│   ├── src/
│   │   ├── lib.rs           # Main contract implementation
│   │   └── test.rs          # Comprehensive unit tests
│   ├── Cargo.toml           # Contract dependencies
│   └── README.md
├── client/                  # React frontend application
│   ├── src/
│   │   ├── layouts/         # Admin, Seller, Buyer dashboards
│   │   ├── views/           # UI components
│   │   └── assets/          # Styling and images
│   └── package.json
├── Cargo.toml               # Workspace configuration
├── README.md                # This file
└── .gitignore
```

---

## Contract Details

**Contract ID:** CC4TOGUUMX42QP2LZHUWV3I3YW2MXBCOATDF6E6XJRIMEVFITRTSNRAW

**Network:** Stellar Testnet

**Deployment Status:** ✅ Live and Functional

**Optimization:** 39.2% size reduction (31,629 → 19,232 bytes)

![Contract Deployment Screenshot](Screenshot%202025-11-02%20151125.png)

---

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

---

## 👥 Team

**Project Creator:** Tushar Darsena  
**GitHub:** [@TusharDarsena](https://github.com/TusharDarsena)  
**Repository:** [land-registry](https://github.com/TusharDarsena/land-registry)

---

## 🙏 Acknowledgments

- **Stellar Development Foundation** - For Soroban smart contract platform
- **Rust Community** - For excellent documentation and tooling
- **Freighter Wallet** - For Web3 wallet infrastructure
- **IPFS** - For decentralized document storage

---

## 🔮 Future Roadmap

### 🌐 Smart Contract Enhancements
- **Multi-jurisdiction support** for international property transactions
- **Advanced fractional ownership** with voting rights and profit sharing
- **Automated valuation system** using oracles for real-time pricing
- **Mortgage integration** with DeFi lending protocols
- **Rental agreement management** with automated payments

---

### 📱 User Experience Improvements
- **Mobile application** with React Native for Android/iOS
- **Document scanning and OCR** for automated KYC
- **Real-time notifications** for transaction updates
- **3D property visualization** using AR/VR technology
- **Multi-language support** for global accessibility

---

### 🔏 Legal & Compliance Integration
- **Government API integration** for official land records sync
- **Legal document templates** for automated contract generation
- **Digital signature support** for legally binding agreements
- **Tax calculation and filing** integration
- **Compliance with local property laws** in multiple jurisdictions

---

### 🌉 Cross-Chain & Interoperability
- **Bridge to Ethereum and Polygon** for broader reach
- **Oracle integration** for real-world data verification
- **API marketplace** for third-party integrations
- **Interoperability with existing property databases**
- **Integration with mapping services** (Google Maps, OpenStreetMap)

---

### 🏢 Enterprise Features
- **White-label solution** for real estate companies
- **Bulk transaction processing** for large portfolios
- **Advanced analytics dashboard** for market insights
- **Automated compliance reporting** for audits
- **Enterprise-grade SLA** with dedicated support

---

**⭐ Star this repo if you found it useful!**

**🚀 Deploy your own Land Registry contract today and revolutionize property management!**

---

## 📞 Support

For questions, issues, or contributions:
- **GitHub Issues:** [Report a bug or request a feature](https://github.com/TusharDarsena/land-registry/issues)
- **Discussions:** [Join the community discussion](https://github.com/TusharDarsena/land-registry/discussions)

---

## 🎯 Quick Links

- [Stellar Developer Documentation](https://developers.stellar.org/)
- [Soroban Documentation](https://soroban.stellar.org/docs)
- [Rust Programming Language](https://www.rust-lang.org/)
- [Stellar CLI Tools](https://developers.stellar.org/docs/tools/stellar-cli)
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
