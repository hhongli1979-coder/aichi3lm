# OmniCore Wallet - Deployment Guide

## Overview

This guide covers multiple deployment options for the OmniCore Wallet application. Choose the deployment method that best fits your infrastructure and requirements.

## Pre-Deployment Checklist

- [ ] All tests pass
- [ ] Code is linted and follows project standards
- [ ] Environment variables are configured
- [ ] Build succeeds without errors
- [ ] Preview build has been tested locally
- [ ] Assets are optimized for production
- [ ] Security vulnerabilities have been addressed

## Build for Production

### 1. Install Dependencies

```bash
npm install --legacy-peer-deps
```

### 2. Create Production Build

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory with:
- Minified JavaScript and CSS
- Asset optimization
- Tree-shaking of unused code
- Code splitting for better performance

### 3. Test Production Build Locally

```bash
npm run preview
```

Visit `http://localhost:4173` to verify the production build works correctly.

## Deployment Options

### Option 1: Static Hosting (Recommended for SPA)

The application is a Single Page Application (SPA) and can be deployed to any static hosting service.

#### GitHub Pages

1. **Update Repository Settings**:
   - Go to repository Settings → Pages
   - Select source: GitHub Actions

2. **Create GitHub Actions Workflow**:

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm install --legacy-peer-deps
      
      - name: Build
        run: npm run build
      
      - name: Setup Pages
        uses: actions/configure-pages@v4
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'
      
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

3. **Push to trigger deployment**:

```bash
git add .github/workflows/deploy.yml
git commit -m "Add GitHub Pages deployment workflow"
git push origin main
```

Your site will be available at: `https://<username>.github.io/<repository>/`

#### Vercel

1. **Install Vercel CLI**:

```bash
npm install -g vercel
```

2. **Deploy**:

```bash
vercel
```

Follow the prompts to link your project and deploy.

3. **Configure for SPA**:

Create `vercel.json` in project root:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install --legacy-peer-deps"
}
```

#### Netlify

1. **Install Netlify CLI**:

```bash
npm install -g netlify-cli
```

2. **Deploy**:

```bash
netlify deploy --prod
```

3. **Configure for SPA**:

Create `netlify.toml` in project root:

```toml
[build]
  command = "npm run build"
  publish = "dist"
  
[build.environment]
  NODE_VERSION = "20"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### Cloudflare Pages

1. **Create Cloudflare Pages Project**:
   - Go to Cloudflare Dashboard → Pages
   - Connect to your Git repository

2. **Configure Build Settings**:
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Environment variable: `NODE_VERSION=20`
   - Install command: `npm install --legacy-peer-deps`

3. **Configure SPA Routing**:

Create `_redirects` file in `public/`:

```
/* /index.html 200
```

### Option 2: Docker Deployment

#### Create Dockerfile

Create `Dockerfile` in project root:

```dockerfile
# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

#### Create nginx.conf

Create `nginx.conf` in project root:

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # Enable gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

#### Build and Run Docker Container

```bash
# Build image
docker build -t omnicore-wallet .

# Run container
docker run -d -p 80:80 --name omnicore omnicore-wallet
```

Access the application at `http://localhost`

#### Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "80:80"
    restart: unless-stopped
    environment:
      - NODE_ENV=production
```

Run with:

```bash
docker-compose up -d
```

### Option 3: AWS S3 + CloudFront

1. **Build the application**:

```bash
npm run build
```

2. **Create S3 Bucket**:

```bash
aws s3 mb s3://omnicore-wallet
```

3. **Configure bucket for static website hosting**:

```bash
aws s3 website s3://omnicore-wallet --index-document index.html --error-document index.html
```

4. **Upload files**:

```bash
aws s3 sync dist/ s3://omnicore-wallet --delete
```

5. **Set up CloudFront distribution**:

```bash
aws cloudfront create-distribution \
  --origin-domain-name omnicore-wallet.s3.amazonaws.com \
  --default-root-object index.html
```

6. **Configure error pages for SPA routing**:
   - In CloudFront, add custom error response
   - HTTP Error Code: 403, 404
   - Response Page Path: /index.html
   - HTTP Response Code: 200

## Environment Configuration

### Production Environment Variables

Create `.env.production` file (if needed for future API integration):

```env
VITE_API_URL=https://api.omnicore.example.com
VITE_APP_ENV=production
```

**Important**: Never commit `.env.production` with sensitive data to Git.

### Build-time Configuration

The application currently uses mock data. For production with real APIs:

1. Update `src/lib/mock-data.ts` to use environment variables
2. Add API base URL configuration
3. Implement proper error handling and loading states

## Performance Optimization

### 1. Enable Compression

All static hosting providers should enable gzip/brotli compression.

### 2. Configure Caching

Set cache headers for static assets:
- HTML: `no-cache` or short TTL
- JS/CSS/Images: Long TTL (1 year) with content hashing

### 3. CDN Integration

Use a CDN for global distribution and improved performance:
- CloudFlare
- AWS CloudFront
- Azure CDN
- Fastly

### 4. Analyze Bundle Size

```bash
npm run build -- --mode analyze
```

Look for opportunities to:
- Code split large components
- Lazy load routes
- Remove unused dependencies

## Monitoring and Logging

### Recommended Tools

1. **Error Tracking**: Sentry, Rollbar
2. **Analytics**: Google Analytics, Plausible, PostHog
3. **Performance**: Lighthouse CI, WebPageTest
4. **Uptime**: UptimeRobot, Pingdom

### Integration Example (Sentry)

```bash
npm install @sentry/react --legacy-peer-deps
```

In `src/main.tsx`:

```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: import.meta.env.MODE,
  tracesSampleRate: 1.0,
});
```

## Security Considerations

### 1. HTTPS Only

Always use HTTPS in production. Most hosting providers offer free SSL certificates via Let's Encrypt.

### 2. Content Security Policy

Add CSP headers via hosting configuration:

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' fonts.googleapis.com; font-src 'self' fonts.gstatic.com;
```

### 3. Security Headers

Ensure these headers are set:
- `X-Frame-Options: SAMEORIGIN`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`

### 4. Dependency Auditing

Regularly check for vulnerabilities:

```bash
npm audit
npm audit fix
```

## Rollback Strategy

### Quick Rollback

Most platforms support instant rollback:

- **Vercel**: Use deployment history in dashboard
- **Netlify**: Use deployment history
- **GitHub Pages**: Revert commit or redeploy previous build

### Manual Rollback

If using custom deployment:

```bash
# Tag releases
git tag v1.0.0
git push origin v1.0.0

# Rollback to previous version
git checkout v0.9.9
npm install --legacy-peer-deps
npm run build
# Deploy dist/ directory
```

## CI/CD Pipeline

### Example GitHub Actions Workflow

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm install --legacy-peer-deps
      - run: npm run lint
      - run: npm run build

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm install --legacy-peer-deps
      - run: npm run build
      - name: Deploy to Production
        run: |
          # Add your deployment commands here
```

## Post-Deployment Verification

1. **Smoke Tests**:
   - [ ] Homepage loads
   - [ ] All tabs are accessible
   - [ ] Mock data displays correctly
   - [ ] Responsive design works on mobile

2. **Performance Tests**:
   - [ ] Lighthouse score > 90
   - [ ] First Contentful Paint < 1.8s
   - [ ] Time to Interactive < 3.8s

3. **Browser Compatibility**:
   - [ ] Chrome (latest)
   - [ ] Firefox (latest)
   - [ ] Safari (latest)
   - [ ] Edge (latest)

## Troubleshooting

### Build Fails on CI/CD

**Issue**: npm install fails with peer dependency errors

**Solution**: Ensure `--legacy-peer-deps` flag is used in CI/CD scripts

### 404 Errors on Direct URL Access

**Issue**: Refreshing or directly accessing routes returns 404

**Solution**: Configure SPA fallback to redirect all routes to index.html

### Large Bundle Size Warning

**Issue**: Build output shows chunks larger than 500 KB

**Solution**: Implement code splitting:

```typescript
const DeFiPositions = lazy(() => import('@/components/defi/DeFiPositions'));
```

## Support and Resources

- **GitHub Repository**: [aichi3lm](https://github.com/hhongli1979-coder/aichi3lm)
- **Issues**: Submit issues on GitHub
- **Documentation**: See [INSTALL.md](./INSTALL.md) for development setup

## Maintenance

### Regular Updates

1. **Weekly**: Check for security updates
   ```bash
   npm audit
   ```

2. **Monthly**: Update dependencies
   ```bash
   npm update --legacy-peer-deps
   npm run build
   npm test
   ```

3. **Quarterly**: Major version updates
   - Review breaking changes
   - Test thoroughly before deploying

### Backup Strategy

1. Keep Git repository synchronized
2. Tag releases before deployment
3. Maintain deployment artifacts for rollback
4. Document configuration changes

---

**Last Updated**: December 2025  
**Version**: 1.0.0
