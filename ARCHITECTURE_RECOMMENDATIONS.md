# OmniCore Wallet - 架构建议和实施路线图
# Architecture Recommendations and Implementation Roadmap

## 目录 (Table of Contents)

1. [推荐的技术架构](#1-推荐的技术架构)
2. [后端实施方案](#2-后端实施方案)
3. [区块链集成方案](#3-区块链集成方案)
4. [数据库设计](#4-数据库设计)
5. [安全架构](#5-安全架构)
6. [API 设计规范](#6-api-设计规范)
7. [部署架构](#7-部署架构)
8. [实施时间表](#8-实施时间表)

---

## 1. 推荐的技术架构 (Recommended Technical Architecture)

### 整体架构图

```
┌─────────────────────────────────────────────────────────────┐
│                        用户界面层                              │
│  React 19 + TypeScript + Tailwind CSS + shadcn/ui          │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTPS/WSS
┌────────────────────▼────────────────────────────────────────┐
│                      API 网关层                               │
│    ASP.NET Core Web API / Node.js + Express                │
│    - JWT 认证         - 速率限制                              │
│    - 请求验证         - 负载均衡                              │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
┌───────▼──────┐ ┌──▼─────────┐ ┌▼──────────────┐
│  业务逻辑层    │ │  区块链服务  │ │  第三方服务    │
│              │ │            │ │              │
│ - 钱包管理    │ │ - Web3     │ │ - 支付网关    │
│ - 交易处理    │ │ - 多签合约  │ │ - KYC/AML    │
│ - DeFi策略    │ │ - RPC节点  │ │ - 通知服务    │
│ - 用户管理    │ │ - 事件监听  │ │ - AI 服务    │
└───────┬──────┘ └────────────┘ └──────────────┘
        │
┌───────▼──────────────────────────────────────┐
│              数据持久层                        │
│  PostgreSQL / MongoDB + Redis Cache         │
│  - 用户数据    - 交易记录    - 审计日志        │
└─────────────────────────────────────────────┘
```

### 技术栈选择

#### 方案 A: .NET 生态系统 (推荐用于企业级应用)
```
后端: ASP.NET Core 8.0+ Web API
区块链: Nethereum (Ethereum .NET 库)
数据库: PostgreSQL + Entity Framework Core
缓存: Redis
消息队列: RabbitMQ
容器: Docker + Kubernetes
```

**优点**:
- 强类型语言，减少运行时错误
- 优秀的性能和可扩展性
- 企业级支持和安全性
- 与现有 ASP.NET Core 模板对齐

**缺点**:
- 区块链生态系统相对较小
- 开发者社区较 Node.js 小

#### 方案 B: Node.js 生态系统 (推荐用于快速开发)
```
后端: Node.js + Express/Fastify + TypeScript
区块链: ethers.js / web3.js / viem
数据库: MongoDB + Prisma ORM
缓存: Redis
消息队列: Bull
容器: Docker + Kubernetes
```

**优点**:
- 与前端共享 TypeScript 代码
- 丰富的区块链库生态系统
- 快速开发和迭代
- 大量的社区资源

**缺点**:
- 单线程限制
- 需要更多性能调优

---

## 2. 后端实施方案 (Backend Implementation Plan)

### 项目结构 (ASP.NET Core)

```
OmniCore.Backend/
├── OmniCore.API/                   # Web API 层
│   ├── Controllers/
│   │   ├── WalletsController.cs
│   │   ├── TransactionsController.cs
│   │   ├── DeFiController.cs
│   │   ├── PaymentsController.cs
│   │   └── OmniTokenController.cs
│   ├── Middleware/
│   │   ├── JwtMiddleware.cs
│   │   ├── RateLimitMiddleware.cs
│   │   └── ErrorHandlerMiddleware.cs
│   ├── Filters/
│   │   └── ValidationFilter.cs
│   └── Program.cs
├── OmniCore.Core/                  # 核心业务逻辑
│   ├── Services/
│   │   ├── WalletService.cs
│   │   ├── TransactionService.cs
│   │   ├── DeFiService.cs
│   │   └── AuthService.cs
│   ├── Interfaces/
│   ├── Models/
│   │   ├── Domain/
│   │   └── DTOs/
│   └── Validators/
├── OmniCore.Infrastructure/        # 基础设施层
│   ├── Blockchain/
│   │   ├── Web3Provider.cs
│   │   ├── MultiSigWalletContract.cs
│   │   └── TokenContract.cs
│   ├── Data/
│   │   ├── ApplicationDbContext.cs
│   │   ├── Repositories/
│   │   └── Migrations/
│   ├── ExternalServices/
│   │   ├── PaymentGateway/
│   │   ├── KYCProvider/
│   │   └── NotificationService/
│   └── Security/
│       ├── KeyManagement/
│       └── Encryption/
├── OmniCore.Contracts/             # 智能合约
│   ├── MultiSigWallet.sol
│   ├── OmniToken.sol
│   ├── DeFiStrategy.sol
│   └── scripts/
└── OmniCore.Tests/
    ├── UnitTests/
    ├── IntegrationTests/
    └── E2ETests/
```

### 核心服务实现示例

```csharp
// WalletService.cs
public class WalletService : IWalletService
{
    private readonly IWeb3Provider _web3Provider;
    private readonly IWalletRepository _walletRepository;
    private readonly IKeyManagementService _keyManagement;
    
    public async Task<WalletDto> CreateMultiSigWalletAsync(
        CreateWalletRequest request)
    {
        // 1. 验证签名者地址
        ValidateSigners(request.Signers);
        
        // 2. 生成钱包地址
        var walletAddress = await _web3Provider
            .DeployMultiSigWalletAsync(
                request.Signers, 
                request.RequiredSignatures
            );
        
        // 3. 存储到数据库
        var wallet = new Wallet
        {
            Address = walletAddress,
            Network = request.Network,
            Type = WalletType.MultiSig,
            Signers = request.Signers,
            RequiredSignatures = request.RequiredSignatures,
            OrganizationId = request.OrganizationId
        };
        
        await _walletRepository.CreateAsync(wallet);
        
        // 4. 返回 DTO
        return mapper.Map<WalletDto>(wallet);
    }
    
    public async Task<decimal> GetBalanceAsync(
        string walletAddress, 
        string network)
    {
        // 从区块链读取余额
        var balance = await _web3Provider
            .GetBalanceAsync(walletAddress, network);
        
        return Web3.Convert.FromWei(balance);
    }
}
```

---

## 3. 区块链集成方案 (Blockchain Integration)

### 多链支持架构

```csharp
// IWeb3Provider.cs
public interface IWeb3Provider
{
    Task<string> DeployMultiSigWalletAsync(
        List<string> signers, 
        int threshold);
    Task<decimal> GetBalanceAsync(
        string address, 
        string network);
    Task<string> SendTransactionAsync(
        TransactionRequest request);
    Task<TransactionReceipt> GetTransactionReceiptAsync(
        string txHash);
}

// Web3Provider.cs (使用 Nethereum)
public class Web3Provider : IWeb3Provider
{
    private readonly Dictionary<string, Web3> _web3Instances;
    
    public Web3Provider(IConfiguration config)
    {
        _web3Instances = new Dictionary<string, Web3>
        {
            ["ethereum"] = new Web3(config["RPC:Ethereum"]),
            ["polygon"] = new Web3(config["RPC:Polygon"]),
            ["bsc"] = new Web3(config["RPC:BSC"]),
            ["arbitrum"] = new Web3(config["RPC:Arbitrum"]),
        };
    }
    
    public async Task<decimal> GetBalanceAsync(
        string address, 
        string network)
    {
        var web3 = _web3Instances[network];
        var balance = await web3.Eth.GetBalance
            .SendRequestAsync(address);
        return Web3.Convert.FromWei(balance.Value);
    }
}
```

### 智能合约集成

```solidity
// MultiSigWallet.sol
pragma solidity ^0.8.19;

contract MultiSigWallet {
    event Deposit(address indexed sender, uint amount);
    event SubmitTransaction(
        address indexed owner,
        uint indexed txIndex,
        address indexed to,
        uint value,
        bytes data
    );
    event ConfirmTransaction(
        address indexed owner, 
        uint indexed txIndex
    );
    event ExecuteTransaction(
        address indexed owner, 
        uint indexed txIndex
    );
    
    address[] public owners;
    mapping(address => bool) public isOwner;
    uint public numConfirmationsRequired;
    
    struct Transaction {
        address to;
        uint value;
        bytes data;
        bool executed;
        uint numConfirmations;
    }
    
    Transaction[] public transactions;
    mapping(uint => mapping(address => bool)) public isConfirmed;
    
    modifier onlyOwner() {
        require(isOwner[msg.sender], "not owner");
        _;
    }
    
    constructor(address[] memory _owners, uint _numConfirmationsRequired) {
        require(_owners.length > 0, "owners required");
        require(
            _numConfirmationsRequired > 0 && 
            _numConfirmationsRequired <= _owners.length,
            "invalid number of required confirmations"
        );
        
        for (uint i = 0; i < _owners.length; i++) {
            address owner = _owners[i];
            require(owner != address(0), "invalid owner");
            require(!isOwner[owner], "owner not unique");
            
            isOwner[owner] = true;
            owners.push(owner);
        }
        
        numConfirmationsRequired = _numConfirmationsRequired;
    }
    
    function submitTransaction(
        address _to,
        uint _value,
        bytes memory _data
    ) public onlyOwner {
        uint txIndex = transactions.length;
        
        transactions.push(Transaction({
            to: _to,
            value: _value,
            data: _data,
            executed: false,
            numConfirmations: 0
        }));
        
        emit SubmitTransaction(msg.sender, txIndex, _to, _value, _data);
    }
    
    function confirmTransaction(uint _txIndex) public onlyOwner {
        require(_txIndex < transactions.length, "tx does not exist");
        require(!isConfirmed[_txIndex][msg.sender], "tx already confirmed");
        require(!transactions[_txIndex].executed, "tx already executed");
        
        Transaction storage transaction = transactions[_txIndex];
        transaction.numConfirmations += 1;
        isConfirmed[_txIndex][msg.sender] = true;
        
        emit ConfirmTransaction(msg.sender, _txIndex);
    }
    
    function executeTransaction(uint _txIndex) public onlyOwner {
        require(_txIndex < transactions.length, "tx does not exist");
        Transaction storage transaction = transactions[_txIndex];
        require(!transaction.executed, "tx already executed");
        require(
            transaction.numConfirmations >= numConfirmationsRequired,
            "cannot execute tx"
        );
        
        transaction.executed = true;
        
        (bool success, ) = transaction.to.call{value: transaction.value}(
            transaction.data
        );
        require(success, "tx failed");
        
        emit ExecuteTransaction(msg.sender, _txIndex);
    }
    
    receive() external payable {
        emit Deposit(msg.sender, msg.value);
    }
}
```

---

## 4. 数据库设计 (Database Design)

### PostgreSQL Schema

```sql
-- 用户表
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    two_factor_enabled BOOLEAN DEFAULT false,
    two_factor_secret VARCHAR(255),
    kyc_status VARCHAR(50) DEFAULT 'unverified',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 组织表
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    owner_id UUID REFERENCES users(id),
    subscription_tier VARCHAR(50),
    api_key_hash VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 组织成员表
CREATE TABLE organization_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL,
    permissions JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(organization_id, user_id)
);

-- 钱包表
CREATE TABLE wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    network VARCHAR(50) NOT NULL,
    wallet_type VARCHAR(50) NOT NULL,
    signers TEXT[], -- 签名者地址数组
    required_signatures INTEGER,
    encrypted_private_key TEXT, -- 仅用于单签钱包
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(address, network)
);

-- 交易表
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_id UUID REFERENCES wallets(id) ON DELETE CASCADE,
    tx_hash VARCHAR(255) UNIQUE,
    from_address VARCHAR(255) NOT NULL,
    to_address VARCHAR(255) NOT NULL,
    value DECIMAL(30, 18) NOT NULL,
    token_address VARCHAR(255),
    token_symbol VARCHAR(20),
    network VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    gas_used DECIMAL(30, 0),
    gas_price DECIMAL(30, 0),
    nonce INTEGER,
    block_number BIGINT,
    required_signatures INTEGER,
    current_signatures INTEGER DEFAULT 0,
    risk_score DECIMAL(5, 2),
    risk_level VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    executed_at TIMESTAMP
);

-- 交易签名表
CREATE TABLE transaction_signatures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID REFERENCES transactions(id) ON DELETE CASCADE,
    signer_address VARCHAR(255) NOT NULL,
    signature TEXT NOT NULL,
    signed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(transaction_id, signer_address)
);

-- DeFi 仓位表
CREATE TABLE defi_positions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_id UUID REFERENCES wallets(id) ON DELETE CASCADE,
    protocol VARCHAR(100) NOT NULL,
    position_type VARCHAR(50) NOT NULL,
    token_address VARCHAR(255) NOT NULL,
    token_symbol VARCHAR(20) NOT NULL,
    amount DECIMAL(30, 18) NOT NULL,
    value_usd DECIMAL(30, 2),
    apy DECIMAL(8, 4),
    health_factor DECIMAL(8, 4),
    network VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- OMNI 质押表
CREATE TABLE omni_staking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(30, 18) NOT NULL,
    lock_period INTEGER, -- 锁定天数
    apy DECIMAL(8, 4),
    rewards_earned DECIMAL(30, 18) DEFAULT 0,
    staked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    unlock_at TIMESTAMP,
    status VARCHAR(50) DEFAULT 'active'
);

-- 支付请求表
CREATE TABLE payment_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    payment_link VARCHAR(255) UNIQUE NOT NULL,
    amount DECIMAL(30, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    description TEXT,
    payment_methods TEXT[], -- ['crypto', 'card', 'alipay']
    status VARCHAR(50) DEFAULT 'pending',
    paid_at TIMESTAMP,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 地址簿表
CREATE TABLE address_book (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    network VARCHAR(50),
    label VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 通知表
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT false,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 审计日志表
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    organization_id UUID REFERENCES organizations(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID,
    changes JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 索引
CREATE INDEX idx_wallets_org ON wallets(organization_id);
CREATE INDEX idx_transactions_wallet ON transactions(wallet_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_hash ON transactions(tx_hash);
CREATE INDEX idx_defi_positions_wallet ON defi_positions(wallet_id);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, read);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);
```

---

## 5. 安全架构 (Security Architecture)

### 密钥管理方案

```csharp
public interface IKeyManagementService
{
    // 生成新的加密密钥对
    Task<KeyPair> GenerateKeyPairAsync();
    
    // 加密私钥
    Task<string> EncryptPrivateKeyAsync(string privateKey, string userId);
    
    // 解密私钥
    Task<string> DecryptPrivateKeyAsync(string encryptedKey, string userId);
    
    // 签名交易
    Task<string> SignTransactionAsync(string txData, string walletId);
}

// Azure Key Vault 实现
public class AzureKeyVaultService : IKeyManagementService
{
    private readonly KeyClient _keyClient;
    private readonly SecretClient _secretClient;
    
    public async Task<string> EncryptPrivateKeyAsync(
        string privateKey, 
        string userId)
    {
        // 使用用户特定的主密钥加密
        var masterKey = await GetUserMasterKeyAsync(userId);
        var encrypted = AesEncrypt(privateKey, masterKey);
        
        // 存储到 Key Vault
        await _secretClient.SetSecretAsync(
            $"wallet-key-{userId}", 
            encrypted
        );
        
        return encrypted;
    }
    
    private async Task<byte[]> GetUserMasterKeyAsync(string userId)
    {
        // 从 Key Vault 获取或创建用户主密钥
        var keyName = $"master-key-{userId}";
        var key = await _keyClient.GetKeyAsync(keyName);
        return key.Value.Key.K;
    }
}
```

### JWT 认证实现

```csharp
// appsettings.json
{
  "Jwt": {
    "Secret": "your-super-secret-key-min-32-chars",
    "Issuer": "omnicore-wallet",
    "Audience": "omnicore-wallet-api",
    "ExpirationMinutes": 60,
    "RefreshTokenExpirationDays": 7
  }
}

// JwtService.cs
public class JwtService : IJwtService
{
    private readonly IConfiguration _config;
    
    public string GenerateToken(User user, Organization org)
    {
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim("organizationId", org.Id.ToString()),
            new Claim(ClaimTypes.Role, user.Role)
        };
        
        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_config["Jwt:Secret"])
        );
        var creds = new SigningCredentials(
            key, 
            SecurityAlgorithms.HmacSha256
        );
        
        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(
                int.Parse(_config["Jwt:ExpirationMinutes"])
            ),
            signingCredentials: creds
        );
        
        return new JwtSecurityTokenHandler().WriteToken(token);
    }
    
    public string GenerateRefreshToken()
    {
        var randomBytes = new byte[32];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomBytes);
        return Convert.ToBase64String(randomBytes);
    }
}
```

---

## 6. API 设计规范 (API Design Specification)

### RESTful API 端点

```
基础 URL: https://api.omnicore.io/v1

认证
POST   /auth/register              - 注册新用户
POST   /auth/login                 - 登录
POST   /auth/refresh               - 刷新令牌
POST   /auth/logout                - 登出
POST   /auth/2fa/enable            - 启用 2FA
POST   /auth/2fa/verify            - 验证 2FA

钱包
GET    /wallets                    - 获取钱包列表
POST   /wallets                    - 创建新钱包
GET    /wallets/:id                - 获取钱包详情
PATCH  /wallets/:id                - 更新钱包
DELETE /wallets/:id                - 删除钱包
GET    /wallets/:id/balance        - 获取余额
GET    /wallets/:id/tokens         - 获取代币余额

交易
GET    /transactions               - 获取交易列表
POST   /transactions               - 创建新交易
GET    /transactions/:id           - 获取交易详情
POST   /transactions/:id/sign      - 签名交易
POST   /transactions/:id/execute   - 执行交易
DELETE /transactions/:id           - 取消交易

DeFi
GET    /defi/positions             - 获取 DeFi 仓位
POST   /defi/strategies            - 创建自动化策略
GET    /defi/strategies            - 获取策略列表
PATCH  /defi/strategies/:id        - 更新策略
DELETE /defi/strategies/:id        - 删除策略
GET    /defi/protocols             - 获取支持的协议

OMNI 代币
GET    /omni/stats                 - 获取 OMNI 统计
POST   /omni/stake                 - 质押 OMNI
GET    /omni/stakes                - 获取质押记录
POST   /omni/unstake               - 取消质押
GET    /omni/rewards               - 获取奖励
POST   /omni/claim-rewards         - 领取奖励

支付
GET    /payments                   - 获取支付列表
POST   /payments/links             - 创建支付链接
GET    /payments/links/:id         - 获取支付链接详情
POST   /payments/process           - 处理支付

组织
GET    /organizations              - 获取组织信息
PATCH  /organizations/:id          - 更新组织
GET    /organizations/:id/members  - 获取成员列表
POST   /organizations/:id/members  - 添加成员
DELETE /organizations/:id/members/:userId - 删除成员
PATCH  /organizations/:id/members/:userId - 更新成员权限

地址簿
GET    /addressbook                - 获取地址簿
POST   /addressbook                - 添加地址
PATCH  /addressbook/:id            - 更新地址
DELETE /addressbook/:id            - 删除地址

通知
GET    /notifications              - 获取通知列表
PATCH  /notifications/:id/read     - 标记为已读
DELETE /notifications/:id          - 删除通知
```

### API 响应格式

```json
// 成功响应
{
  "success": true,
  "data": {
    "id": "wallet-123",
    "name": "Treasury Vault",
    "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    "network": "ethereum",
    "balance": {
      "native": "45.2341",
      "usd": "125432.18"
    }
  },
  "meta": {
    "timestamp": "2025-12-02T21:53:16.770Z",
    "requestId": "req-abc123"
  }
}

// 错误响应
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_BALANCE",
    "message": "Insufficient balance for transaction",
    "details": {
      "required": "100.00",
      "available": "50.00"
    }
  },
  "meta": {
    "timestamp": "2025-12-02T21:53:16.770Z",
    "requestId": "req-abc123"
  }
}
```

---

## 7. 部署架构 (Deployment Architecture)

### Docker Compose 配置

```yaml
version: '3.8'

services:
  # 前端
  frontend:
    build: .
    ports:
      - "3000:3000"
    environment:
      - VITE_API_URL=http://backend:5000
    depends_on:
      - backend
    networks:
      - omnicore-network

  # 后端 API
  backend:
    build: ./OmniCore.Backend
    ports:
      - "5000:5000"
    environment:
      - ConnectionStrings__DefaultConnection=Host=postgres;Database=omnicore;Username=postgres;Password=postgres
      - Redis__ConnectionString=redis:6379
      - Jwt__Secret=${JWT_SECRET}
      - Blockchain__Ethereum__RPC=${ETH_RPC_URL}
      - Blockchain__Polygon__RPC=${POLYGON_RPC_URL}
    depends_on:
      - postgres
      - redis
    networks:
      - omnicore-network

  # PostgreSQL 数据库
  postgres:
    image: postgres:16-alpine
    environment:
      - POSTGRES_DB=omnicore
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
    volumes:
      - postgres-data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    networks:
      - omnicore-network

  # Redis 缓存
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    networks:
      - omnicore-network

  # Nginx 反向代理
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - frontend
      - backend
    networks:
      - omnicore-network

volumes:
  postgres-data:
  redis-data:

networks:
  omnicore-network:
    driver: bridge
```

### Kubernetes 部署

```yaml
# kubernetes/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: omnicore-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: omnicore-backend
  template:
    metadata:
      labels:
        app: omnicore-backend
    spec:
      containers:
      - name: backend
        image: omnicore/backend:latest
        ports:
        - containerPort: 5000
        env:
        - name: ConnectionStrings__DefaultConnection
          valueFrom:
            secretKeyRef:
              name: omnicore-secrets
              key: db-connection
        - name: Jwt__Secret
          valueFrom:
            secretKeyRef:
              name: omnicore-secrets
              key: jwt-secret
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "1Gi"
            cpu: "1000m"
        livenessProbe:
          httpGet:
            path: /health
            port: 5000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 5000
          initialDelaySeconds: 5
          periodSeconds: 5
```

---

## 8. 实施时间表 (Implementation Timeline)

### 第 1-2 周: 基础设施搭建
- [ ] 设置开发环境
- [ ] 创建 ASP.NET Core Web API 项目
- [ ] 设置 PostgreSQL 数据库
- [ ] 实现基本的项目结构
- [ ] 配置 Docker 和 Docker Compose
- [ ] 设置 CI/CD 流水线

### 第 3-4 周: 认证和授权
- [ ] 实现用户注册和登录
- [ ] JWT 令牌生成和验证
- [ ] 角色和权限系统
- [ ] 2FA 认证
- [ ] 密码重置功能

### 第 5-6 周: 钱包功能
- [ ] 集成 Nethereum 库
- [ ] 实现钱包创建 API
- [ ] 多签钱包部署
- [ ] 余额查询
- [ ] 密钥管理和加密

### 第 7-8 周: 交易处理
- [ ] 交易创建 API
- [ ] 多签审批流程
- [ ] 交易签名
- [ ] 交易广播
- [ ] 交易状态追踪

### 第 9-10 周: DeFi 集成
- [ ] 集成 Aave, Compound
- [ ] DeFi 仓位查询
- [ ] 自动化策略引擎
- [ ] 收益计算

### 第 11-12 周: 支付网关
- [ ] 集成 Stripe
- [ ] 集成 Alipay/WeChat Pay
- [ ] 支付链接生成
- [ ] 支付处理和确认

### 第 13-14 周: 测试和优化
- [ ] 单元测试
- [ ] 集成测试
- [ ] E2E 测试
- [ ] 性能优化
- [ ] 安全审计

### 第 15-16 周: 部署准备
- [ ] 生产环境配置
- [ ] 监控和日志
- [ ] 文档完善
- [ ] Beta 测试
- [ ] 正式发布

---

## 总结 (Conclusion)

本文档提供了将 OmniCore Wallet 从前端原型转变为完整生产应用的详细架构建议。实施此计划预计需要 **3-4 个月** 的全职开发时间（2-3 名开发人员）。

### 关键里程碑
1. **MVP (8 周)**: 基本钱包和交易功能
2. **Beta (12 周)**: 完整功能集 + 测试
3. **Production (16 周)**: 生产就绪 + 文档

### 预算估算
- **开发成本**: $80,000 - $120,000
- **基础设施成本**: $2,000 - $5,000/月
- **第三方服务**: $1,000 - $3,000/月
- **审计成本**: $20,000 - $50,000

建议分阶段实施，先完成 MVP，获得用户反馈后再扩展功能。
