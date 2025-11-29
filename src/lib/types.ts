export type BlockchainNetwork = 'ethereum' | 'polygon' | 'bsc' | 'arbitrum' | 'optimism' | 'avalanche';

export type PaymentChannel = 'crypto' | 'stripe' | 'alipay' | 'wechat' | 'unionpay';

export type TransactionStatus = 'pending' | 'signed' | 'broadcasting' | 'confirmed' | 'failed' | 'expired';

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export type UserRole = 'owner' | 'admin' | 'signer' | 'viewer';

export interface Wallet {
  id: string;
  name: string;
  address: string;
  network: BlockchainNetwork;
  type: 'single' | 'multisig';
  signers?: string[];
  requiredSignatures?: number;
  balance: {
    native: string;
    usd: string;
  };
  tokens: TokenBalance[];
  createdAt: number;
}

export interface TokenBalance {
  symbol: string;
  name: string;
  address: string;
  balance: string;
  decimals: number;
  priceUsd: string;
  valueUsd: string;
  logo?: string;
}

export interface Transaction {
  id: string;
  walletId: string;
  from: string;
  to: string;
  value: string;
  token?: string;
  network: BlockchainNetwork;
  status: TransactionStatus;
  hash?: string;
  signatures: Signature[];
  requiredSignatures: number;
  createdAt: number;
  executedAt?: number;
  expiresAt: number;
  description?: string;
  riskAssessment?: RiskAssessment;
}

export interface Signature {
  signer: string;
  signature: string;
  signedAt: number;
}

export interface RiskAssessment {
  level: RiskLevel;
  score: number;
  factors: string[];
  recommendations: string[];
}

export interface PaymentRequest {
  id: string;
  merchantId: string;
  amount: number;
  currency: string;
  channel: PaymentChannel;
  status: 'pending' | 'completed' | 'failed' | 'expired';
  description: string;
  paymentUrl?: string;
  qrCode?: string;
  expiresAt: number;
  createdAt: number;
  completedAt?: number;
}

export interface DeFiPosition {
  id: string;
  protocol: string;
  type: 'lending' | 'staking' | 'liquidity' | 'farming';
  asset: string;
  amount: string;
  valueUsd: string;
  apy: number;
  rewards: string;
  healthFactor?: number;
  network: BlockchainNetwork;
}

export interface DCAStrategy {
  id: string;
  name: string;
  sourceToken: string;
  targetToken: string;
  amountPerInterval: string;
  intervalHours: number;
  lastExecutedAt?: number;
  nextExecutionAt: number;
  totalInvested: string;
  totalReceived: string;
  enabled: boolean;
}

export interface Organization {
  id: string;
  name: string;
  plan: 'starter' | 'professional' | 'enterprise';
  members: OrganizationMember[];
  wallets: string[];
  createdAt: number;
}

export interface OrganizationMember {
  userId: string;
  email: string;
  role: UserRole;
  permissions: string[];
  joinedAt: number;
}

export interface OmniTokenStats {
  price: number;
  marketCap: number;
  totalSupply: string;
  circulatingSupply: string;
  stakedAmount: string;
  stakingApy: number;
  yourBalance: string;
  yourStaked: string;
  yourRewards: string;
}

export interface NotificationItem {
  id: string;
  type: 'transaction' | 'approval' | 'payment' | 'risk' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: number;
  actionUrl?: string;
}

// Enterprise AI Risk Intelligence Types
export interface AIRiskAlert {
  id: string;
  type: 'threat' | 'anomaly' | 'compliance' | 'fraud';
  severity: RiskLevel;
  title: string;
  description: string;
  affectedAssets: string[];
  recommendation: string;
  aiConfidence: number;
  status: 'active' | 'investigating' | 'resolved' | 'dismissed';
  detectedAt: number;
  resolvedAt?: number;
}

export interface AuditLogEntry {
  id: string;
  action: string;
  category: 'transaction' | 'wallet' | 'user' | 'settings' | 'security' | 'defi';
  actor: string;
  actorRole: UserRole;
  details: string;
  ipAddress: string;
  userAgent: string;
  status: 'success' | 'failed' | 'pending';
  timestamp: number;
  metadata?: Record<string, string>;
}

export interface SystemHealthMetric {
  id: string;
  name: string;
  category: 'api' | 'blockchain' | 'security' | 'performance';
  status: 'healthy' | 'degraded' | 'down';
  value: number;
  unit: string;
  threshold: number;
  lastUpdated: number;
}

export interface AIStrategy {
  id: string;
  name: string;
  type: 'yield_optimization' | 'risk_management' | 'rebalancing' | 'dca';
  status: 'active' | 'paused' | 'pending';
  aiScore: number;
  expectedApy: number;
  riskLevel: RiskLevel;
  allocations: {
    protocol: string;
    asset: string;
    percentage: number;
    apy: number;
  }[];
  totalValue: string;
  profit24h: string;
  createdAt: number;
  lastExecuted?: number;
}
