# Document Storage Solution for Stellar dApp

## Overview

This Stellar-based land registry dApp uses a simplified document storage approach that doesn't require IPFS or any external storage service.

## How It Works

### Document Processing

1. **Local Hashing**: When a user uploads a document (Aadhar/PAN/Passport), the application generates a SHA-256 hash of the file locally in the browser.

2. **On-Chain Storage**: Only the document hash is stored on the Stellar blockchain as part of the buyer/seller registration.

3. **Off-Chain Verification**: The Land Inspector verifies the actual documents through a separate off-chain process (email, portal, or in-person verification).

### Benefits

- ✅ **No External Dependencies**: No need for IPFS, Infura, or other third-party services
- ✅ **Cost Effective**: No additional storage costs
- ✅ **Privacy**: Sensitive documents are not uploaded to public networks
- ✅ **Simple**: Pure client-side hashing using Web Crypto API
- ✅ **Fast**: Instant hash generation without network uploads

### Technical Implementation

The `uploadToIPFS()` function in `src/utils/ipfs.js` now:
- Takes a file as input
- Generates a SHA-256 hash using `crypto.subtle.digest()`
- Returns a document identifier prefixed with `doc_`
- Displays user-friendly progress messages

```javascript
// Example document hash stored on-chain
const documentHash = "doc_a1b2c3d4e5f6..." // SHA-256 hash of the file
```

### Security Considerations

1. **Hash Integrity**: The SHA-256 hash ensures document integrity and can be verified later
2. **No Public Exposure**: Actual documents are never uploaded to public networks
3. **Inspector Verification**: Land Inspector manually verifies documents before approving users
4. **Blockchain Immutability**: Once stored, document hashes cannot be altered

### Future Enhancements

If needed, you can add:
- Backend service for secure document storage
- Encrypted document upload to private cloud storage
- Integration with government identity verification APIs
- QR code generation for document verification

## For Developers

### File Structure
- `src/utils/ipfs.js` - Document hashing utilities
- `src/pages/RegisterBuyer.jsx` - Buyer registration with document processing
- `src/pages/RegisterSeller.jsx` - Seller registration with document processing
- `src/pages/AddLand.jsx` - Land registration with image processing

### No Configuration Required
Unlike the previous IPFS implementation, no environment variables or external service configuration is needed.

### Testing
Simply upload any document (PDF, JPG, PNG) during registration and check the browser console to see the generated document hash.
