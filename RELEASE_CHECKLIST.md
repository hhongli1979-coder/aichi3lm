# 发布检查清单 / Release Checklist

## 发布前检查 / Pre-Release Checks

### 代码质量 / Code Quality
- [ ] 所有代码已提交到 Git / All code committed to Git
- [ ] 代码已通过 lint 检查 / Code passes lint checks
- [ ] 构建成功无错误 / Build succeeds without errors
- [ ] 无 TypeScript 类型错误 / No TypeScript errors
- [ ] 移除所有 console.log 和调试代码 / Remove console.log and debug code
- [ ] 代码已审查 / Code reviewed

### 测试 / Testing
- [ ] 本地开发环境测试通过 / Local dev environment tested
- [ ] 生产构建预览测试通过 / Production build preview tested
- [ ] 功能测试完成 / Functional tests completed
- [ ] 浏览器兼容性测试 / Browser compatibility tested
  - [ ] Chrome/Edge
  - [ ] Firefox
  - [ ] Safari
- [ ] 响应式设计测试 / Responsive design tested
  - [ ] 桌面 / Desktop
  - [ ] 平板 / Tablet
  - [ ] 手机 / Mobile
- [ ] 性能测试 / Performance testing
  - [ ] Lighthouse 分数 > 90 / Lighthouse score > 90
  - [ ] 加载时间 < 3s / Load time < 3s

### 安全 / Security
- [ ] 依赖安全审计完成 / Dependencies audited (`npm audit`)
- [ ] 无高危漏洞 / No critical vulnerabilities
- [ ] 环境变量配置检查 / Environment variables checked
- [ ] 敏感信息未提交 / No sensitive data committed
- [ ] HTTPS 配置就绪 / HTTPS configured
- [ ] 安全头部配置 / Security headers configured

### 文档 / Documentation
- [ ] README.md 更新 / README.md updated
- [ ] INSTALL.md 准确无误 / INSTALL.md accurate
- [ ] DEPLOYMENT.md 准确无误 / DEPLOYMENT.md accurate
- [ ] CHANGELOG.md 更新 / CHANGELOG.md updated
- [ ] 版本号更新 / Version number updated
- [ ] API 文档更新（如有）/ API docs updated (if applicable)

### 配置 / Configuration
- [ ] package.json 版本号更新 / package.json version updated
- [ ] 生产环境变量配置 / Production environment variables set
- [ ] 构建配置验证 / Build configuration verified
- [ ] 部署配置验证 / Deployment configuration verified
- [ ] DNS 配置（如需要）/ DNS configuration (if needed)
- [ ] SSL 证书配置 / SSL certificate configured

## 构建步骤 / Build Steps

### 1. 准备发布 / Prepare Release

```bash
# 更新版本号 / Update version
npm version patch  # 或 minor, major

# 安装依赖 / Install dependencies
npm install --legacy-peer-deps

# 运行检查 / Run checks
npm run lint
npm audit
```

### 2. 构建 / Build

```bash
# 清理旧构建 / Clean old build
rm -rf dist

# 构建生产版本 / Build for production
npm run build

# 验证构建 / Verify build
ls -lh dist/
npm run preview
```

### 3. 测试构建 / Test Build

```bash
# 启动预览服务器 / Start preview server
npm run preview

# 在浏览器中测试 / Test in browser
# - 检查所有页面 / Check all pages
# - 测试所有功能 / Test all features
# - 验证资源加载 / Verify asset loading
```

## 发布步骤 / Release Steps

### GitHub Release

```bash
# 创建 Git 标签 / Create Git tag
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0

# 创建 GitHub Release
# 1. 访问 GitHub repository
# 2. 点击 "Releases"
# 3. 点击 "Create a new release"
# 4. 选择标签并填写发布说明
# 5. 上传构建产物（可选）
```

### 静态托管部署 / Static Hosting Deployment

#### Vercel
```bash
npm install -g vercel
vercel --prod
```

#### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

#### GitHub Pages
```bash
# 推送到 main 分支会自动触发部署
git push origin main
```

### Docker 部署 / Docker Deployment

```bash
# 构建镜像 / Build image
docker build -t omnicore-wallet:v1.0.0 .
docker tag omnicore-wallet:v1.0.0 omnicore-wallet:latest

# 推送到仓库（可选）/ Push to registry (optional)
# docker push your-registry/omnicore-wallet:v1.0.0

# 部署 / Deploy
docker-compose up -d
```

## 发布后验证 / Post-Release Verification

### 生产环境检查 / Production Checks
- [ ] 网站可访问 / Site accessible
- [ ] 所有页面正常加载 / All pages load correctly
- [ ] 功能正常工作 / Features work correctly
- [ ] 资源正确加载 / Assets load correctly
- [ ] 控制台无错误 / No console errors
- [ ] 性能正常 / Performance acceptable
- [ ] 移动端正常 / Mobile works correctly

### 监控设置 / Monitoring Setup
- [ ] 错误追踪配置（如 Sentry）/ Error tracking configured
- [ ] 分析工具配置 / Analytics configured
- [ ] 正常运行时间监控 / Uptime monitoring set up
- [ ] 性能监控 / Performance monitoring

### 通知 / Notifications
- [ ] 通知团队发布完成 / Notify team of release
- [ ] 更新项目状态 / Update project status
- [ ] 发布公告（如需要）/ Publish announcement (if needed)

## 回滚计划 / Rollback Plan

如果发现严重问题 / If critical issues found:

### 静态托管 / Static Hosting
- Vercel/Netlify: 使用控制面板回滚到之前的部署
- GitHub Pages: 恢复到之前的提交并重新部署

### Docker
```bash
# 停止当前容器 / Stop current container
docker-compose down

# 回滚到之前版本 / Rollback to previous version
docker run -d -p 80:80 omnicore-wallet:v0.9.9

# 或使用备份镜像 / Or use backup image
```

### Git
```bash
# 回滚提交 / Revert commit
git revert HEAD
git push origin main

# 或恢复到特定版本 / Or reset to specific version
git checkout v0.9.9
```

## 紧急联系 / Emergency Contacts

- 技术负责人 / Tech Lead: [添加联系方式]
- DevOps: [添加联系方式]
- 产品负责人 / Product Owner: [添加联系方式]

## 备注 / Notes

- 保持此检查清单更新 / Keep this checklist updated
- 记录每次发布的问题和改进 / Document issues and improvements for each release
- 持续改进发布流程 / Continuously improve release process
