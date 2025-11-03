# Fractional - Comprehensive Testing Guide

This guide covers testing all features of the Fractional Land Registry application.

## Prerequisites

Before testing, ensure you have:

1. ✅ **Freighter Wallet** installed ([Download](https://www.freighter.app/))
2. ✅ **Testnet XLM** in your wallet ([Get from Friendbot](https://laboratory.stellar.org/#account-creator))
3. ✅ **Contract deployed** on Stellar testnet
4. ✅ **Environment configured** (.env file with correct contract ID)

## Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Environment

Edit `.env` file:
```env
VITE_STELLAR_NETWORK=testnet
VITE_STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org
VITE_STELLAR_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
VITE_LAND_REGISTRY_CONTRACT_ID=C4TOGUUMX42QP2LZHUWV3I3YW2MXBCOATDF6E6XJRIMEVFITRTSNRAW
VITE_STELLAR_NETWORK_PASSPHRASE=Test SDF Network ; September 2015
```

### 3. Start Development Server

```bash
npm run dev
```

Application will be available at `http://localhost:5173`

## Testing Checklist

### ✅ Part 1: Wallet Connection

- [ ] Open the application
- [ ] Click "Connect Wallet" button
- [ ] Freighter popup appears
- [ ] Approve connection
- [ ] Wallet address displays in navbar
- [ ] Disconnect wallet works correctly

**Expected Result:** Wallet connects successfully, address displayed

---

### ✅ Part 2: Buyer Registration Flow

#### 2.1 Register as Buyer

- [ ] Click "Register as Buyer"
- [ ] Fill in the form:
  - Name: Test Buyer
  - Age: 30
  - City: Mumbai
  - Email: buyer@test.com
  - Aadhar: 123456789012
  - PAN: ABCDE1234F
- [ ] Upload document (optional)
- [ ] Click "Register"
- [ ] Freighter popup for transaction approval
- [ ] Sign transaction
- [ ] Success notification appears
- [ ] Redirected to Buyer Dashboard

**Expected Result:** Buyer registered, pending verification banner shows

#### 2.2 Browse Lands

- [ ] Navigate to "Browse Lands" tab
- [ ] See list of available properties
- [ ] Filter by "All Properties"
- [ ] Filter by "Regular Lands"
- [ ] Filter by "Fractional Lands"
- [ ] Click on a land card
- [ ] View land details

**Expected Result:** Can browse and filter properties

#### 2.3 Request Purchase (After Verification)

- [ ] Wait for inspector verification
- [ ] Select a regular land
- [ ] Click "Request Purchase"
- [ ] Confirm transaction
- [ ] Check "My Requests" tab
- [ ] See pending request

**Expected Result:** Purchase request created successfully

#### 2.4 Buy Fractional Share

- [ ] Select a fractional property
- [ ] Specify number of shares to buy
- [ ] Click "Buy Shares"
- [ ] Approve transaction
- [ ] Check "My Properties" tab
- [ ] See fractional ownership

**Expected Result:** Fractional shares purchased and displayed

#### 2.5 View Owned Properties

- [ ] Navigate to "My Properties" tab
- [ ] See owned lands (full ownership)
- [ ] See fractional shares with percentage
- [ ] View property details

**Expected Result:** All owned properties displayed correctly

---

### ✅ Part 3: Seller Registration Flow

#### 3.1 Register as Seller

- [ ] Use different wallet/account
- [ ] Click "Register as Seller"
- [ ] Fill in the form:
  - Name: Test Seller
  - Age: 35
  - Aadhar: 987654321098
  - PAN: XYZAB9876C
  - Lands Owned: 5
- [ ] Upload document (optional)
- [ ] Click "Register"
- [ ] Approve transaction
- [ ] Success notification
- [ ] Redirected to Seller Dashboard

**Expected Result:** Seller registered, pending verification

#### 3.2 Add Regular Land

- [ ] Navigate to "Add Land" tab
- [ ] Fill in land details:
  - Area: 2000 sq.ft
  - City: Bangalore
  - State: Karnataka
  - Price: 50000 XLM
  - Property PID: PID123456
  - Survey Number: SN789012
- [ ] DO NOT check "Enable Fractional Ownership"
- [ ] Upload documents (optional)
- [ ] Upload images (optional)
- [ ] Click "Add Land"
- [ ] Approve transaction
- [ ] Success notification

**Expected Result:** Regular land added successfully

#### 3.3 Add Fractional Land

- [ ] Navigate to "Add Land" tab
- [ ] Fill in land details:
  - Area: 5000 sq.ft
  - City: Delhi
  - State: Delhi
  - Price: 100000 XLM
  - Property PID: PID234567
  - Survey Number: SN890123
- [ ] CHECK "Enable Fractional Ownership"
- [ ] Set Total Shares: 100
- [ ] Set Price Per Share: 1000 XLM
- [ ] Upload files
- [ ] Click "Add Land"
- [ ] Approve transaction
- [ ] Success notification

**Expected Result:** Fractional land added successfully

#### 3.4 View My Listings

- [ ] Navigate to "My Listings" tab
- [ ] See all added lands
- [ ] Verify details are correct
- [ ] Check fractional/regular badges

**Expected Result:** All seller's lands displayed

#### 3.5 Manage Purchase Requests

- [ ] Navigate to "Purchase Requests" tab
- [ ] See pending buyer requests
- [ ] Approve a request
- [ ] Reject a request
- [ ] Verify status updates

**Expected Result:** Can manage purchase requests

---

### ✅ Part 4: Inspector Verification Flow

#### 4.1 Access Inspector Dashboard

- [ ] Use Land Inspector wallet
- [ ] Navigate to "/inspector"
- [ ] See welcome banner
- [ ] Three tabs visible

**Expected Result:** Inspector dashboard loads

#### 4.2 Verify Buyers

- [ ] Navigate to "Buyer Verifications"
- [ ] Filter by "Pending"
- [ ] See list of unverified buyers
- [ ] Click "Approve" on a buyer
- [ ] Approve transaction
- [ ] Success notification
- [ ] Buyer moves to "Verified" filter

**Expected Result:** Buyer verified successfully

#### 4.3 Verify Sellers

- [ ] Navigate to "Seller Verifications"
- [ ] Filter by "Pending"
- [ ] See list of unverified sellers
- [ ] Click "Approve" on a seller
- [ ] Approve transaction
- [ ] Success notification
- [ ] Seller verified

**Expected Result:** Seller verified successfully

#### 4.4 Verify Lands

- [ ] Navigate to "Land Verifications"
- [ ] Filter by "Pending"
- [ ] See list of unverified lands
- [ ] Review land details
- [ ] Click "Approve" on a land
- [ ] Approve transaction
- [ ] Success notification
- [ ] Land verified

**Expected Result:** Land verified and available for purchase

#### 4.5 Test Rejection

- [ ] Find pending buyer/seller/land
- [ ] Click "Reject"
- [ ] Approve transaction
- [ ] Item moves to "Rejected" filter
- [ ] Verify rejection status

**Expected Result:** Items can be rejected

---

### ✅ Part 5: Payment Integration

#### 5.1 Full Land Purchase

- [ ] Buyer selects verified land
- [ ] Click "Purchase"
- [ ] Payment modal appears
- [ ] Shows total price in XLM
- [ ] Confirm payment
- [ ] XLM transferred from buyer to seller
- [ ] Ownership transferred
- [ ] Land appears in buyer's properties
- [ ] Land removed from marketplace

**Expected Result:** Full purchase completed with payment

#### 5.2 Fractional Purchase

- [ ] Buyer selects fractional land
- [ ] Specify shares to purchase
- [ ] View total cost calculation
- [ ] Confirm purchase
- [ ] XLM transferred
- [ ] Shares allocated
- [ ] Available shares decreased
- [ ] Ownership recorded

**Expected Result:** Fractional purchase with proportional payment

---

### ✅ Part 6: UI/UX Testing

#### 6.1 Responsive Design

- [ ] Test on desktop (1920x1080)
- [ ] Test on tablet (768x1024)
- [ ] Test on mobile (375x667)
- [ ] All elements responsive
- [ ] Navigation works on mobile
- [ ] Forms usable on all devices

**Expected Result:** UI works on all screen sizes

#### 6.2 Animations & Interactions

- [ ] Page transitions smooth
- [ ] Cards have hover effects
- [ ] Buttons animate on click
- [ ] Loading states display
- [ ] Particle background animates
- [ ] Gradients and effects work

**Expected Result:** Smooth animations throughout

#### 6.3 Toast Notifications

- [ ] Success toasts appear (green)
- [ ] Error toasts appear (red)
- [ ] Info toasts appear (blue)
- [ ] Loading toasts show progress
- [ ] Toasts auto-dismiss
- [ ] Multiple toasts stack properly

**Expected Result:** All notifications work correctly

---

### ✅ Part 7: Error Handling

#### 7.1 Wallet Errors

- [ ] Try connecting without Freighter
- [ ] See install prompt
- [ ] Cancel Freighter transaction
- [ ] See cancellation message
- [ ] Try action with insufficient XLM
- [ ] See error notification

**Expected Result:** Graceful error handling

#### 7.2 Validation Errors

- [ ] Submit form with empty required fields
- [ ] See validation messages
- [ ] Enter invalid values
- [ ] See format validation
- [ ] Try negative numbers
- [ ] Prevented

**Expected Result:** All forms validate properly

#### 7.3 Network Errors

- [ ] Disconnect internet
- [ ] Try transaction
- [ ] See network error
- [ ] Reconnect
- [ ] Retry successfully

**Expected Result:** Network errors handled

---

### ✅ Part 8: Edge Cases

#### 8.1 Multiple Ownership

- [ ] Buy full land
- [ ] Try to buy same land again
- [ ] Should be prevented
- [ ] Buy multiple fractional shares
- [ ] Track total ownership percentage

**Expected Result:** Ownership rules enforced

#### 8.2 Concurrent Transactions

- [ ] Two buyers request same land
- [ ] First approval succeeds
- [ ] Second is rejected
- [ ] Only one owner

**Expected Result:** Race conditions handled

#### 8.3 Maximum Limits

- [ ] Try to buy more fractional shares than available
- [ ] Should be prevented
- [ ] Try to add land with invalid data
- [ ] Validation prevents

**Expected Result:** Limits enforced

---

## Performance Testing

### Load Times
- [ ] Initial page load < 3 seconds
- [ ] Dashboard load < 2 seconds
- [ ] Transaction submission < 5 seconds
- [ ] IPFS upload < 10 seconds per file

### Optimization
- [ ] Images lazy load
- [ ] Code splitting works
- [ ] No memory leaks
- [ ] Smooth scrolling

---

## Browser Compatibility

Test in:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

---

## Security Testing

- [ ] Private keys never exposed
- [ ] Transactions require user approval
- [ ] Input sanitization works
- [ ] IPFS hashes validated
- [ ] Contract addresses verified

---

## Production Readiness Checklist

### Pre-deployment
- [ ] All tests passing
- [ ] No console errors
- [ ] No console warnings
- [ ] Environment variables configured
- [ ] Contract ID correct
- [ ] Build succeeds: `npm run build`
- [ ] Preview works: `npm run preview`

### Deployment
- [ ] Choose hosting service (Vercel/Netlify/etc)
- [ ] Configure environment variables in hosting
- [ ] Deploy build
- [ ] Test production URL
- [ ] SSL/HTTPS enabled
- [ ] DNS configured

### Post-deployment
- [ ] Smoke test all features
- [ ] Monitor error logs
- [ ] Check analytics
- [ ] User feedback collection

---

## Troubleshooting

### Common Issues

**Issue:** Wallet won't connect
- **Solution:** Install Freighter, reload page, clear cache

**Issue:** Transaction fails
- **Solution:** Check XLM balance, verify network, check contract ID

**Issue:** IPFS upload fails
- **Solution:** Check file size, verify IPFS gateway, try different gateway

**Issue:** Verification not working
- **Solution:** Ensure inspector account initialized, check permissions

---

## Test Data

### Test Accounts Needed
1. **Buyer Account** - For purchasing land
2. **Seller Account** - For listing land
3. **Inspector Account** - For verification
4. **Additional Buyer** - For fractional testing

### Sample Land Data
```javascript
{
  area: 2000,
  city: "Bangalore",
  state: "Karnataka",
  price: 50000,
  propertyPid: "PID123456",
  physicalSurveyNumber: "SN789012"
}
```

### Sample Fractional Land
```javascript
{
  area: 5000,
  city: "Mumbai",
  state: "Maharashtra",
  price: 100000,
  propertyPid: "PID234567",
  physicalSurveyNumber: "SN890123",
  isFractional: true,
  totalShares: 100,
  pricePerShare: 1000
}
```

---

## Success Criteria

✅ **All tests passing**
✅ **No critical bugs**
✅ **Responsive on all devices**
✅ **Fast load times**
✅ **Secure transactions**
✅ **Good UX feedback**
✅ **Production deployed**

---

## Next Steps

After completing all tests:
1. Document any bugs found
2. Fix critical issues
3. Optimize performance
4. Deploy to production
5. Monitor and iterate

---

**Happy Testing! 🚀**
