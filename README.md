# OmniCore Wallet - Enterprise Multi-Chain Smart Wallet Platform

[![CI Pipeline](https://github.com/hhongli1979-coder/aichi3lm/workflows/CI%20Pipeline/badge.svg)](https://github.com/hhongli1979-coder/aichi3lm/actions)
[![Deploy](https://github.com/hhongli1979-coder/aichi3lm/workflows/Deploy%20to%20GitHub%20Pages/badge.svg)](https://github.com/hhongli1979-coder/aichi3lm/actions)

An enterprise-grade SaaS platform for managing crypto assets, multi-signature wallets, global payments, and DeFi integrations with native OMNI token economy.

## 🚀 Quick Start

```bash
# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📚 Documentation

- **[INSTALL.md](./INSTALL.md)** - 完整的安装指南（中文）/ Complete installation guide (Chinese)
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Comprehensive deployment guide (English)
- **[PRD.md](./PRD.md)** - Product requirements and features
- **[RELEASE_CHECKLIST.md](./RELEASE_CHECKLIST.md)** - Release checklist (Bilingual)
- **[DEPLOYMENT_SUMMARY.md](./DEPLOYMENT_SUMMARY.md)** - Deployment documentation summary
- **[CHANGELOG.md](./CHANGELOG.md)** - Version history

## ✨ Features

- 🔐 **Multi-Signature Wallet Management** - Enterprise-grade security with customizable approval thresholds
- 📊 **Real-Time Dashboard** - Comprehensive view of assets across multiple chains
- 💱 **Global Payment Gateway** - Accept crypto, credit cards, Alipay, WeChat Pay, UnionPay
- 🤖 **AI Risk Intelligence** - Real-time transaction risk analysis and fraud prevention
- 🏦 **DeFi Treasury Automation** - Automated yield farming and staking strategies
- 💎 **OMNI Token Economy** - Platform token for fee discounts and governance
- 👥 **Organization Management** - Multi-tenant SaaS with role-based permissions
- 📱 **Responsive Design** - Full mobile and desktop support

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS v4, Radix UI, shadcn/ui
- **Framework**: GitHub Spark
- **Icons**: Phosphor Icons
- **State Management**: React Hooks
- **Forms**: React Hook Form + Zod
- **Animations**: Framer Motion

## 🚢 Deployment Options

### Static Hosting
- ✅ **GitHub Pages** (workflow included)
- ✅ **Vercel** (configuration included)
- ✅ **Netlify** (configuration included)
- ✅ **Cloudflare Pages** (configuration included)

### Containerized
- ✅ **Docker** (Dockerfile included)
- ✅ **Docker Compose** (configuration included)

### Cloud Services
- ✅ **AWS S3 + CloudFront** (documented)
- ✅ **Azure Static Web Apps** (compatible)
- ✅ **Google Cloud Storage** (compatible)

### Quick Deploy

```bash
# Using the deployment script
chmod +x deploy.sh
./deploy.sh

# Using Docker Compose
docker-compose up -d

# Manual build and deploy
npm run build
# Upload dist/ to your hosting service
```

## 📋 System Requirements

- **Node.js**: 18.x or higher (20.x LTS recommended)
- **npm**: 9.x or higher
- **Browsers**: Chrome/Edge 90+, Firefox 88+, Safari 14+

## 🔒 Security

All security vulnerabilities have been addressed:
- ✅ Removed deprecated X-XSS-Protection header
- ✅ Added modern Permissions-Policy header
- ✅ Explicit GitHub Actions permissions
- ✅ CodeQL scanning: 0 alerts
- ✅ Security headers follow current best practices

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete security configuration.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

The Spark Template files and resources from GitHub are licensed under the terms of the MIT license, Copyright GitHub, Inc.

## 🙏 Acknowledgments

- Built with [GitHub Spark](https://githubnext.com/projects/spark)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Phosphor Icons](https://phosphoricons.com/)

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/hhongli1979-coder/aichi3lm/issues)
- **Documentation**: See docs folder
- **Product Details**: See [PRD.md](./PRD.md)

---

**Version**: 1.0.0  
**Last Updated**: December 2025
