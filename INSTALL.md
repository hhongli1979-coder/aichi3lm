# OmniCore Wallet - 安装部署指南

## 项目简介

OmniCore Wallet 是一个企业级多链智能钱包平台，使用现代 Web 技术栈构建：
- **前端框架**: React 19
- **构建工具**: Vite 7
- **开发语言**: TypeScript
- **UI 框架**: Tailwind CSS v4 + shadcn/ui + Radix UI
- **特殊框架**: GitHub Spark

## 系统要求

### 开发环境

- **Node.js**: 18.x 或更高版本（推荐 20.x LTS）
- **npm**: 9.x 或更高版本
- **操作系统**: Windows 10+, macOS 10.15+, Linux (Ubuntu 20.04+)
- **内存**: 最低 4GB RAM（推荐 8GB）
- **磁盘空间**: 至少 2GB 可用空间

### 浏览器支持

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- 不支持 IE

## 快速开始

### 1. 克隆仓库

```bash
git clone https://github.com/hhongli1979-coder/aichi3lm.git
cd aichi3lm
```

### 2. 安装依赖

由于项目使用的 `@github/spark` 框架与 Vite 7 存在 peer dependency 版本冲突，需要使用 `--legacy-peer-deps` 标志：

```bash
npm install --legacy-peer-deps
```

**注意**: 这是正常的，不会影响项目功能。GitHub Spark 框架将在未来版本中更新以支持 Vite 7。

### 3. 启动开发服务器

```bash
npm run dev
```

开发服务器将在 `http://localhost:5173` 启动（如果端口被占用会自动使用其他端口）。

### 4. 构建生产版本

```bash
npm run build
```

构建产物将输出到 `dist/` 目录。

### 5. 预览生产构建

```bash
npm run preview
```

预览服务器将在 `http://localhost:4173` 启动。

## 可用命令

```bash
# 启动开发服务器（热重载）
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview

# 运行 ESLint 代码检查
npm run lint

# 优化依赖
npm run optimize

# 结束占用 5000 端口的进程（如果需要）
npm run kill
```

## 项目结构

```
aichi3lm/
├── src/                      # 源代码
│   ├── components/           # React 组件
│   │   ├── ui/              # shadcn/ui 基础组件
│   │   ├── dashboard/       # 仪表板组件
│   │   ├── wallet/          # 钱包管理组件
│   │   ├── transaction/     # 交易相关组件
│   │   ├── defi/            # DeFi 功能组件
│   │   ├── token/           # OMNI 代币组件
│   │   ├── organization/    # 组织管理组件
│   │   ├── addressbook/     # 地址簿组件
│   │   └── ai-assistant/    # AI 助手组件
│   ├── lib/                 # 工具库和类型定义
│   │   ├── types.ts         # TypeScript 类型定义
│   │   ├── mock-data.ts     # 模拟数据生成器
│   │   └── utils.ts         # 工具函数
│   ├── styles/              # 样式文件
│   │   └── theme.css        # 主题 CSS 变量
│   ├── App.tsx              # 主应用组件
│   └── main.tsx             # 应用入口
├── public/                   # 静态资源
├── dist/                     # 构建输出（.gitignore）
├── node_modules/            # 依赖包（.gitignore）
├── index.html               # HTML 入口
├── vite.config.ts           # Vite 配置
├── tailwind.config.js       # Tailwind CSS 配置
├── tsconfig.json            # TypeScript 配置
├── components.json          # shadcn/ui 配置
├── package.json             # 项目依赖和脚本
├── PRD.md                   # 产品需求文档
└── README.md                # 项目说明
```

## 重要配置文件说明

### vite.config.ts

Vite 构建配置，包含：
- GitHub Spark 插件（**不要删除**）
- Phosphor 图标代理插件（**不要删除**）
- Tailwind CSS 插件
- 路径别名配置（`@/` 映射到 `src/`）

### tailwind.config.js

Tailwind CSS 配置，定义了：
- 自定义颜色主题
- 间距比例
- 字体配置
- 响应式断点

### components.json

shadcn/ui 组件库配置：
- 样式风格：new-york
- 组件路径：`src/components/ui`
- 别名：`@/` 映射到 `src/`

## 依赖说明

### 核心依赖

- **@github/spark**: GitHub Spark 框架，提供增强的组件行为和主题系统
- **react**: React 19 核心库
- **react-dom**: React DOM 渲染
- **vite**: 下一代前端构建工具

### UI 框架

- **@radix-ui/***: 无样式的可访问组件原语
- **@phosphor-icons/react**: 图标库
- **tailwindcss**: 实用优先的 CSS 框架
- **sonner**: Toast 通知组件
- **framer-motion**: 动画库

### 工具库

- **date-fns**: 日期处理
- **zod**: 模式验证
- **react-hook-form**: 表单管理
- **clsx**: 类名工具
- **tailwind-merge**: Tailwind 类名合并

## 开发注意事项

### 1. 图标使用

项目主要使用 Phosphor 图标库，不是 Lucide。导入图标时：

```typescript
import { Wallet, Bell, ChartLine } from '@phosphor-icons/react';
```

### 2. 路径别名

使用 `@/` 别名引用 `src/` 目录：

```typescript
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/mock-data';
```

### 3. 样式系统

- 使用 CSS 变量（在 `src/styles/theme.css` 中定义）
- 通过 Tailwind 工具类引用 CSS 变量
- 颜色主题：primary (蓝色), accent (青色), destructive (红色)
- 间距基数：4px（使用 4, 8, 12, 16, 24, 32, 48）

### 4. 类型安全

- 所有类型定义在 `src/lib/types.ts` 中
- 始终从类型文件导入，避免重复定义
- 使用 TypeScript 严格模式

## 常见问题

### Q: npm install 失败，提示 peer dependency 冲突

**A**: 使用 `npm install --legacy-peer-deps` 安装依赖。这是因为 @github/spark 尚未更新以支持 Vite 7。

### Q: 开发服务器启动失败，提示端口被占用

**A**: 运行 `npm run kill` 杀死占用 5000 端口的进程，或者 Vite 会自动使用其他端口。

### Q: 构建时出现图标警告

**A**: 这是正常的。GitHub Spark 的图标代理插件会将不存在的图标替换为 Question 图标。

### Q: 如何添加新的 UI 组件

**A**: 组件已预装在 `src/components/ui/` 中。直接导入使用，不要通过 shadcn CLI 重新安装。

### Q: 暗色模式如何工作

**A**: 暗色模式通过 `[data-appearance="dark"]` 选择器实现，不是基于 class。

## 下一步

查看 [DEPLOYMENT.md](./DEPLOYMENT.md) 了解如何部署应用到生产环境。

查看 [PRD.md](./PRD.md) 了解完整的产品需求和功能说明。

## 技术支持

如有问题，请提交 Issue 到 GitHub 仓库。
