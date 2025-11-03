# Production Deployment Guide

Complete guide for deploying Fractional to production.

## Pre-Deployment Checklist

### 1. Code Quality
- [ ] All features implemented and tested
- [ ] No console errors or warnings
- [ ] Code linted and formatted
- [ ] Dependencies up to date
- [ ] Security vulnerabilities checked

### 2. Configuration
- [ ] Environment variables configured
- [ ] Contract deployed to mainnet (if applicable)
- [ ] IPFS gateway configured
- [ ] API endpoints verified

### 3. Testing
- [ ] All unit tests passing
- [ ] Integration tests passing
- [ ] Manual testing completed
- [ ] Cross-browser testing done
- [ ] Mobile responsive verified

---

## Build for Production

### 1. Update Environment Variables

Create `.env.production`:

```env
# Stellar Network Configuration (MAINNET for production)
VITE_STELLAR_NETWORK=mainnet
VITE_STELLAR_HORIZON_URL=https://horizon.stellar.org
VITE_STELLAR_SOROBAN_RPC_URL=https://soroban-rpc.stellar.org

# Contract ID (Use your mainnet contract ID)
VITE_LAND_REGISTRY_CONTRACT_ID=YOUR_MAINNET_CONTRACT_ID_HERE

# Network Passphrase
VITE_STELLAR_NETWORK_PASSPHRASE=Public Global Stellar Network ; September 2015

# IPFS Configuration
VITE_IPFS_HOST=ipfs.infura.io
VITE_IPFS_PORT=5001
VITE_IPFS_PROTOCOL=https

# Application Configuration
VITE_APP_NAME=Fractional
VITE_APP_VERSION=1.0.0
```

### 2. Build the Application

```bash
# Install dependencies
npm install

# Run production build
npm run build

# Preview build locally (optional)
npm run preview
```

The build output will be in the `dist` folder.

---

## Deployment Options

### Option 1: Vercel (Recommended)

**Advantages:** Easy deployment, automatic SSL, CDN, serverless functions

#### Deploy via CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

#### Deploy via Git

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Configure:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Add environment variables
7. Click "Deploy"

#### Environment Variables in Vercel

Add in Project Settings → Environment Variables:
- `VITE_STELLAR_NETWORK` = `mainnet`
- `VITE_STELLAR_HORIZON_URL` = `https://horizon.stellar.org`
- `VITE_STELLAR_SOROBAN_RPC_URL` = `https://soroban-rpc.stellar.org`
- `VITE_LAND_REGISTRY_CONTRACT_ID` = `YOUR_CONTRACT_ID`
- `VITE_STELLAR_NETWORK_PASSPHRASE` = `Public Global Stellar Network ; September 2015`

---

### Option 2: Netlify

**Advantages:** Continuous deployment, form handling, serverless functions

#### Deploy via CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

#### Deploy via Git

1. Push code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click "New site from Git"
4. Choose repository
5. Configure:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Add environment variables
7. Click "Deploy site"

#### netlify.toml Configuration

Create `netlify.toml` in project root:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

---

### Option 3: GitHub Pages

**Advantages:** Free, simple, version controlled

#### Configuration

1. Update `vite.config.js`:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/your-repo-name/', // Add this line
})
```

2. Install gh-pages:

```bash
npm install --save-dev gh-pages
```

3. Add scripts to `package.json`:

```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

4. Deploy:

```bash
npm run deploy
```

---

### Option 4: AWS S3 + CloudFront

**Advantages:** Scalable, custom domain, CDN

#### Steps

1. Create S3 bucket
2. Enable static website hosting
3. Upload `dist` folder contents
4. Create CloudFront distribution
5. Configure custom domain (optional)
6. Add SSL certificate

#### AWS CLI Deployment

```bash
# Build
npm run build

# Upload to S3
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

---

### Option 5: Docker + Cloud Provider

**Advantages:** Containerized, portable, scalable

#### Dockerfile

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### nginx.conf

Create `nginx.conf`:

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

#### Build and Deploy

```bash
# Build Docker image
docker build -t fractional-app .

# Run locally
docker run -p 80:80 fractional-app

# Deploy to cloud
# (Docker Hub, AWS ECS, Google Cloud Run, etc.)
```

---

## Custom Domain Setup

### Vercel
1. Go to Project Settings → Domains
2. Add your domain
3. Configure DNS records as shown
4. Wait for verification

### Netlify
1. Go to Domain Settings
2. Add custom domain
3. Update DNS records
4. Enable HTTPS

### General DNS Configuration
```
Type: A
Name: @
Value: [Provider IP]

Type: CNAME
Name: www
Value: [Provider domain]
```

---

## SSL/HTTPS

All recommended providers (Vercel, Netlify) provide free SSL automatically.

For manual setup:
- Use Let's Encrypt (free)
- Use Cloudflare (free)
- Purchase SSL certificate

---

## Post-Deployment

### 1. Verification

- [ ] Visit production URL
- [ ] Test wallet connection
- [ ] Test registration flows
- [ ] Test transactions
- [ ] Check all pages load
- [ ] Verify responsive design
- [ ] Test on multiple browsers
- [ ] Check console for errors

### 2. Monitoring

#### Analytics
Add Google Analytics:

```javascript
// In index.html or main.jsx
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

#### Error Tracking
Add Sentry:

```bash
npm install @sentry/react
```

```javascript
// In main.jsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: "production",
});
```

### 3. Performance

#### Optimize Images
- Use WebP format
- Lazy load images
- Compress assets

#### Code Splitting
Already handled by Vite, but verify:
- Route-based splitting
- Component lazy loading
- Dynamic imports

#### CDN
- Ensure static assets served via CDN
- Enable compression (gzip/brotli)
- Set cache headers

---

## Environment-Specific Configuration

### Development
```env
VITE_STELLAR_NETWORK=testnet
VITE_STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org
```

### Staging
```env
VITE_STELLAR_NETWORK=testnet
VITE_STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org
```

### Production
```env
VITE_STELLAR_NETWORK=mainnet
VITE_STELLAR_HORIZON_URL=https://horizon.stellar.org
```

---

## Continuous Deployment

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test
        
      - name: Build
        run: npm run build
        env:
          VITE_STELLAR_NETWORK: ${{ secrets.VITE_STELLAR_NETWORK }}
          VITE_LAND_REGISTRY_CONTRACT_ID: ${{ secrets.VITE_LAND_REGISTRY_CONTRACT_ID }}
          
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

---

## Rollback Strategy

### Vercel/Netlify
- Automatic rollback to previous deployment
- Use deployment history in dashboard

### Manual
1. Keep previous build artifacts
2. Have rollback script ready
3. Test rollback procedure

---

## Security Best Practices

### 1. Environment Variables
- Never commit `.env` files
- Use secrets management
- Rotate keys regularly

### 2. Dependencies
```bash
# Check for vulnerabilities
npm audit

# Fix automatically
npm audit fix

# Update dependencies
npm update
```

### 3. HTTPS
- Always use HTTPS
- Enable HSTS
- Configure CSP headers

### 4. Rate Limiting
- Implement API rate limiting
- Use CAPTCHA for forms
- Monitor for abuse

---

## Maintenance

### Regular Updates
- Update dependencies monthly
- Security patches immediately
- Monitor Stellar network updates
- Update contract if needed

### Backups
- Database backups (if applicable)
- Configuration backups
- Code versioning (Git)

### Monitoring
- Uptime monitoring (UptimeRobot, Pingdom)
- Error tracking (Sentry)
- Analytics (Google Analytics)
- Performance monitoring (Lighthouse)

---

## Troubleshooting

### Build Fails
```bash
# Clear cache
rm -rf node_modules dist
npm install
npm run build
```

### Environment Variables Not Working
- Verify variable names start with `VITE_`
- Restart dev server after changes
- Check provider environment config

### Deployment Timeout
- Increase timeout limits
- Optimize build process
- Use build cache

---

## Cost Estimation

### Free Tier Options
- **Vercel**: Free for hobby projects
- **Netlify**: 100GB bandwidth/month free
- **GitHub Pages**: Free for public repos

### Paid Options
- **Vercel Pro**: $20/month
- **Netlify Pro**: $19/month
- **AWS**: Pay-as-you-go (~$5-50/month)

---

## Success Metrics

Track these KPIs:
- Page load time < 3 seconds
- Transaction success rate > 95%
- User registrations per day
- Land listings per day
- Transaction volume
- Error rate < 1%

---

## Support & Documentation

### User Documentation
- Create user guide
- Video tutorials
- FAQ section
- Contact support

### Developer Documentation
- API documentation
- Smart contract docs
- Contribution guidelines
- Code comments

---

## Launch Checklist

Final checks before going live:

- [ ] All tests passing
- [ ] Production build successful
- [ ] Environment variables configured
- [ ] Contract deployed to mainnet
- [ ] SSL certificate active
- [ ] Custom domain configured
- [ ] Analytics configured
- [ ] Error tracking active
- [ ] Monitoring set up
- [ ] Documentation complete
- [ ] Backup strategy in place
- [ ] Support channels ready
- [ ] Marketing materials ready
- [ ] Legal compliance checked
- [ ] Security audit done

---

## Launch! 🚀

Once all checks are complete:
1. Deploy to production
2. Verify all features work
3. Monitor for first 24 hours
4. Announce launch
5. Collect user feedback
6. Iterate and improve

**Congratulations on your deployment!**

---

## Quick Deploy Commands

### Vercel
```bash
npm run build && vercel --prod
```

### Netlify
```bash
npm run build && netlify deploy --prod
```

### GitHub Pages
```bash
npm run deploy
```

---

For questions or issues, refer to:
- [Stellar Documentation](https://developers.stellar.org/)
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
