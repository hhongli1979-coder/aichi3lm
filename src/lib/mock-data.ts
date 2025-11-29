import type { Wallet, Transaction, DeFiPosition, PaymentRequest, DCAStrategy, OmniTokenStats, NotificationItem, TokenBalance, AIRiskAlert, AuditLogEntry, SystemHealthMetric, AIStrategy } from './types';

export const NETWORKS = {
  ethereum: { name: 'Ethereum', color: '#627EEA', icon: '⟠' },
  polygon: { name: 'Polygon', color: '#8247E5', icon: '⬡' },
  bsc: { name: 'BNB Chain', color: '#F3BA2F', icon: '◆' },
  arbitrum: { name: 'Arbitrum', color: '#28A0F0', icon: '◭' },
  optimism: { name: 'Optimism', color: '#FF0420', icon: '◉' },
  avalanche: { name: 'Avalanche', color: '#E84142', icon: '▲' },
};

export function generateMockWallets(): Wallet[] {
  return [
    {
      id: 'wallet-1',
      name: 'Treasury Vault',
      address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
      network: 'ethereum',
      type: 'multisig',
      signers: ['0x1234...5678', '0x8765...4321', '0xabcd...efgh'],
      requiredSignatures: 2,
      balance: {
        native: '45.2341',
        usd: '125,432.18',
      },
      tokens: [
        {
          symbol: 'USDC',
          name: 'USD Coin',
          address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
          balance: '50000.00',
          decimals: 6,
          priceUsd: '1.00',
          valueUsd: '50000.00',
        },
        {
          symbol: 'OMNI',
          name: 'Omni Token',
          address: '0x1234567890abcdef',
          balance: '10000.00',
          decimals: 18,
          priceUsd: '2.45',
          valueUsd: '24500.00',
        },
      ],
      createdAt: Date.now() - 90 * 24 * 60 * 60 * 1000,
    },
    {
      id: 'wallet-2',
      name: 'Operating Account',
      address: '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
      network: 'polygon',
      type: 'multisig',
      signers: ['0x1234...5678', '0x8765...4321'],
      requiredSignatures: 1,
      balance: {
        native: '12500.8834',
        usd: '8,234.42',
      },
      tokens: [
        {
          symbol: 'USDT',
          name: 'Tether USD',
          address: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
          balance: '15000.00',
          decimals: 6,
          priceUsd: '1.00',
          valueUsd: '15000.00',
        },
      ],
      createdAt: Date.now() - 60 * 24 * 60 * 60 * 1000,
    },
    {
      id: 'wallet-3',
      name: 'DeFi Strategy Wallet',
      address: '0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed',
      network: 'arbitrum',
      type: 'single',
      balance: {
        native: '2.8934',
        usd: '8,024.15',
      },
      tokens: [],
      createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
    },
  ];
}

export function generateMockTransactions(): Transaction[] {
  return [
    {
      id: 'tx-1',
      walletId: 'wallet-1',
      from: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
      to: '0x9876543210fedcba',
      value: '5000.00',
      token: 'USDC',
      network: 'ethereum',
      status: 'pending',
      signatures: [
        {
          signer: '0x1234...5678',
          signature: '0xabcdef...',
          signedAt: Date.now() - 2 * 60 * 60 * 1000,
        },
      ],
      requiredSignatures: 2,
      createdAt: Date.now() - 3 * 60 * 60 * 1000,
      expiresAt: Date.now() + 4 * 24 * 60 * 60 * 1000,
      description: 'Supplier payment for Q4 services',
      riskAssessment: {
        level: 'low',
        score: 15,
        factors: ['Known counterparty', 'Regular transaction pattern'],
        recommendations: [],
      },
    },
    {
      id: 'tx-2',
      walletId: 'wallet-1',
      from: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
      to: '0x1234567890abcdef',
      value: '1.5',
      network: 'ethereum',
      status: 'confirmed',
      hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
      signatures: [
        {
          signer: '0x1234...5678',
          signature: '0xabcdef...',
          signedAt: Date.now() - 5 * 60 * 60 * 1000,
        },
        {
          signer: '0x8765...4321',
          signature: '0x123456...',
          signedAt: Date.now() - 4 * 60 * 60 * 1000,
        },
      ],
      requiredSignatures: 2,
      createdAt: Date.now() - 6 * 60 * 60 * 1000,
      executedAt: Date.now() - 4 * 60 * 60 * 1000,
      expiresAt: Date.now() + 1 * 24 * 60 * 60 * 1000,
      description: 'Employee bonus payout',
      riskAssessment: {
        level: 'low',
        score: 10,
        factors: ['Internal transfer', 'Below threshold'],
        recommendations: [],
      },
    },
    {
      id: 'tx-3',
      walletId: 'wallet-2',
      from: '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
      to: '0xhighriskabc123',
      value: '25000.00',
      token: 'USDT',
      network: 'polygon',
      status: 'pending',
      signatures: [],
      requiredSignatures: 1,
      createdAt: Date.now() - 1 * 60 * 60 * 1000,
      expiresAt: Date.now() + 6 * 24 * 60 * 60 * 1000,
      description: 'Large transfer to new address',
      riskAssessment: {
        level: 'high',
        score: 85,
        factors: ['First-time recipient', 'Large amount', 'Address flagged by threat intelligence'],
        recommendations: ['Verify recipient identity', 'Consider splitting transaction', 'Enable time lock'],
      },
    },
  ];
}

export function generateMockDeFiPositions(): DeFiPosition[] {
  return [
    {
      id: 'defi-1',
      protocol: 'Aave V3',
      type: 'lending',
      asset: 'USDC',
      amount: '25000.00',
      valueUsd: '25000.00',
      apy: 5.2,
      rewards: '1.42',
      healthFactor: 2.5,
      network: 'ethereum',
    },
    {
      id: 'defi-2',
      protocol: 'Lido',
      type: 'staking',
      asset: 'ETH',
      amount: '10.5',
      valueUsd: '29,115.00',
      apy: 3.8,
      rewards: '0.045',
      network: 'ethereum',
    },
    {
      id: 'defi-3',
      protocol: 'Uniswap V3',
      type: 'liquidity',
      asset: 'ETH-USDC',
      amount: '50000.00',
      valueUsd: '50000.00',
      apy: 12.5,
      rewards: '68.50',
      network: 'ethereum',
    },
  ];
}

export function generateMockPayments(): PaymentRequest[] {
  return [
    {
      id: 'pay-1',
      merchantId: 'merchant-1',
      amount: 299.99,
      currency: 'USD',
      channel: 'stripe',
      status: 'completed',
      description: 'Enterprise Plan - Annual',
      completedAt: Date.now() - 2 * 60 * 60 * 1000,
      createdAt: Date.now() - 3 * 60 * 60 * 1000,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
    },
    {
      id: 'pay-2',
      merchantId: 'merchant-1',
      amount: 5000,
      currency: 'CNY',
      channel: 'alipay',
      status: 'pending',
      description: 'Product Purchase Order #12345',
      paymentUrl: 'https://payment.omnicore.io/pay-2',
      qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANS...',
      createdAt: Date.now() - 30 * 60 * 1000,
      expiresAt: Date.now() + 30 * 60 * 1000,
    },
  ];
}

export function generateMockDCAStrategies(): DCAStrategy[] {
  return [
    {
      id: 'dca-1',
      name: 'ETH Accumulation',
      sourceToken: 'USDC',
      targetToken: 'ETH',
      amountPerInterval: '1000.00',
      intervalHours: 168,
      lastExecutedAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
      nextExecutionAt: Date.now() + 2 * 24 * 60 * 60 * 1000,
      totalInvested: '12000.00',
      totalReceived: '4.523',
      enabled: true,
    },
    {
      id: 'dca-2',
      name: 'BTC Monthly Buy',
      sourceToken: 'USDT',
      targetToken: 'WBTC',
      amountPerInterval: '2500.00',
      intervalHours: 720,
      lastExecutedAt: Date.now() - 15 * 24 * 60 * 60 * 1000,
      nextExecutionAt: Date.now() + 15 * 24 * 60 * 60 * 1000,
      totalInvested: '25000.00',
      totalReceived: '0.285',
      enabled: true,
    },
  ];
}

export function generateMockOmniStats(): OmniTokenStats {
  return {
    price: 2.45,
    marketCap: 245000000,
    totalSupply: '1000000000',
    circulatingSupply: '400000000',
    stakedAmount: '150000000',
    stakingApy: 8.5,
    yourBalance: '10000.00',
    yourStaked: '5000.00',
    yourRewards: '42.50',
  };
}

export function generateMockNotifications(): NotificationItem[] {
  return [
    {
      id: 'notif-1',
      type: 'approval',
      title: 'Signature Required',
      message: 'Treasury Vault transaction needs your approval (5000 USDC to supplier)',
      read: false,
      createdAt: Date.now() - 30 * 60 * 1000,
      actionUrl: '/transactions/tx-1',
    },
    {
      id: 'notif-2',
      type: 'risk',
      title: 'High Risk Transaction Detected',
      message: 'Large transfer to flagged address - immediate review recommended',
      read: false,
      createdAt: Date.now() - 15 * 60 * 1000,
      actionUrl: '/transactions/tx-3',
    },
    {
      id: 'notif-3',
      type: 'transaction',
      title: 'Transaction Confirmed',
      message: 'Employee bonus payout completed successfully',
      read: true,
      createdAt: Date.now() - 4 * 60 * 60 * 1000,
      actionUrl: '/transactions/tx-2',
    },
    {
      id: 'notif-4',
      type: 'payment',
      title: 'Payment Received',
      message: 'Enterprise Plan subscription renewed - $299.99',
      read: true,
      createdAt: Date.now() - 2 * 60 * 60 * 1000,
    },
  ];
}

export function formatAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

export function formatCurrency(amount: string | number, currency = 'USD'): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

export function formatLargeNumber(num: number): string {
  if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
  return num.toFixed(2);
}

export function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function getRiskColor(level: string): string {
  switch (level) {
    case 'low': return 'text-green-600';
    case 'medium': return 'text-yellow-600';
    case 'high': return 'text-orange-600';
    case 'critical': return 'text-red-600';
    default: return 'text-gray-600';
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'confirmed':
    case 'completed': return 'text-green-600';
    case 'pending':
    case 'signed': return 'text-yellow-600';
    case 'broadcasting': return 'text-blue-600';
    case 'failed':
    case 'expired': return 'text-red-600';
    default: return 'text-gray-600';
  }
}

// Enterprise AI Risk Intelligence Mock Data
export function generateMockAIRiskAlerts(): AIRiskAlert[] {
  return [
    {
      id: 'alert-1',
      type: 'threat',
      severity: 'high',
      title: 'Suspicious Outbound Transfer Pattern Detected',
      description: 'AI detected unusual transfer pattern: Multiple small transactions to unverified addresses within 24h period.',
      affectedAssets: ['Treasury Vault', 'Operating Account'],
      recommendation: 'Review recent transactions and verify recipient addresses. Consider enabling additional security measures.',
      aiConfidence: 94,
      status: 'active',
      detectedAt: Date.now() - 30 * 60 * 1000,
    },
    {
      id: 'alert-2',
      type: 'anomaly',
      severity: 'medium',
      title: 'Abnormal Gas Price Spike',
      description: 'Network gas prices are 340% above 7-day average. Consider delaying non-urgent transactions.',
      affectedAssets: ['All Ethereum Wallets'],
      recommendation: 'Wait for gas prices to normalize or use Layer 2 solutions for cost optimization.',
      aiConfidence: 99,
      status: 'investigating',
      detectedAt: Date.now() - 2 * 60 * 60 * 1000,
    },
    {
      id: 'alert-3',
      type: 'compliance',
      severity: 'low',
      title: 'OFAC Sanctions List Updated',
      description: 'New addresses added to sanctions list. All existing contacts verified as compliant.',
      affectedAssets: [],
      recommendation: 'No action required. Continue standard monitoring procedures.',
      aiConfidence: 100,
      status: 'resolved',
      detectedAt: Date.now() - 12 * 60 * 60 * 1000,
      resolvedAt: Date.now() - 11 * 60 * 60 * 1000,
    },
    {
      id: 'alert-4',
      type: 'fraud',
      severity: 'critical',
      title: 'Potential Phishing Address Detected',
      description: 'Recipient address 0xDeAd000000000000000000000000000000000123 matches known phishing wallet patterns with 98% confidence.',
      affectedAssets: ['Operating Account'],
      recommendation: 'URGENT: Cancel pending transaction TX-3 immediately. Do not interact with this address.',
      aiConfidence: 98,
      status: 'active',
      detectedAt: Date.now() - 15 * 60 * 1000,
    },
  ];
}

export function generateMockAuditLog(): AuditLogEntry[] {
  return [
    {
      id: 'audit-1',
      action: 'Transaction Created',
      category: 'transaction',
      actor: 'admin@omnicore.io',
      actorRole: 'owner',
      details: 'Created outbound transaction of 5000 USDC to supplier payment address',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64)',
      status: 'success',
      timestamp: Date.now() - 30 * 60 * 1000,
      metadata: { txId: 'tx-1', amount: '5000', token: 'USDC' },
    },
    {
      id: 'audit-2',
      action: 'Transaction Signed',
      category: 'transaction',
      actor: 'john@company.com',
      actorRole: 'admin',
      details: 'Signed multi-sig transaction TX-1 (1/2 signatures)',
      ipAddress: '10.0.0.55',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X)',
      status: 'success',
      timestamp: Date.now() - 25 * 60 * 1000,
      metadata: { txId: 'tx-1', signatureNumber: '1' },
    },
    {
      id: 'audit-3',
      action: 'User Role Changed',
      category: 'user',
      actor: 'admin@omnicore.io',
      actorRole: 'owner',
      details: 'Changed role of sarah@company.com from Viewer to Signer',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64)',
      status: 'success',
      timestamp: Date.now() - 2 * 60 * 60 * 1000,
    },
    {
      id: 'audit-4',
      action: 'DeFi Strategy Activated',
      category: 'defi',
      actor: 'admin@omnicore.io',
      actorRole: 'owner',
      details: 'Enabled AI-powered yield optimization strategy with $50,000 allocation',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64)',
      status: 'success',
      timestamp: Date.now() - 4 * 60 * 60 * 1000,
    },
    {
      id: 'audit-5',
      action: 'Security Alert Dismissed',
      category: 'security',
      actor: 'john@company.com',
      actorRole: 'admin',
      details: 'Dismissed low-severity compliance alert after verification',
      ipAddress: '10.0.0.55',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X)',
      status: 'success',
      timestamp: Date.now() - 6 * 60 * 60 * 1000,
    },
    {
      id: 'audit-6',
      action: 'Wallet Created',
      category: 'wallet',
      actor: 'admin@omnicore.io',
      actorRole: 'owner',
      details: 'Created new multi-sig wallet "DeFi Strategy Wallet" on Arbitrum',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64)',
      status: 'success',
      timestamp: Date.now() - 24 * 60 * 60 * 1000,
    },
    {
      id: 'audit-7',
      action: 'Failed Login Attempt',
      category: 'security',
      actor: 'unknown@external.com',
      actorRole: 'viewer',
      details: 'Multiple failed login attempts from suspicious IP address',
      ipAddress: '185.234.12.45',
      userAgent: 'Python-urllib/3.8',
      status: 'failed',
      timestamp: Date.now() - 12 * 60 * 60 * 1000,
    },
  ];
}

export function generateMockSystemHealth(): SystemHealthMetric[] {
  return [
    {
      id: 'health-1',
      name: 'Ethereum RPC',
      category: 'blockchain',
      status: 'healthy',
      value: 45,
      unit: 'ms',
      threshold: 200,
      lastUpdated: Date.now() - 30 * 1000,
    },
    {
      id: 'health-2',
      name: 'Polygon RPC',
      category: 'blockchain',
      status: 'healthy',
      value: 32,
      unit: 'ms',
      threshold: 200,
      lastUpdated: Date.now() - 30 * 1000,
    },
    {
      id: 'health-3',
      name: 'Price Oracle',
      category: 'api',
      status: 'healthy',
      value: 99.9,
      unit: '%',
      threshold: 99,
      lastUpdated: Date.now() - 60 * 1000,
    },
    {
      id: 'health-4',
      name: 'Risk Analysis API',
      category: 'security',
      status: 'healthy',
      value: 120,
      unit: 'ms',
      threshold: 500,
      lastUpdated: Date.now() - 45 * 1000,
    },
    {
      id: 'health-5',
      name: 'Transaction Processing',
      category: 'performance',
      status: 'healthy',
      value: 2.3,
      unit: 's',
      threshold: 5,
      lastUpdated: Date.now() - 15 * 1000,
    },
    {
      id: 'health-6',
      name: 'Arbitrum RPC',
      category: 'blockchain',
      status: 'degraded',
      value: 180,
      unit: 'ms',
      threshold: 200,
      lastUpdated: Date.now() - 30 * 1000,
    },
  ];
}

export function generateMockAIStrategies(): AIStrategy[] {
  return [
    {
      id: 'strategy-1',
      name: 'AI Yield Optimizer',
      type: 'yield_optimization',
      status: 'active',
      aiScore: 92,
      expectedApy: 8.5,
      riskLevel: 'low',
      allocations: [
        { protocol: 'Aave V3', asset: 'USDC', percentage: 40, apy: 5.2 },
        { protocol: 'Lido', asset: 'stETH', percentage: 35, apy: 3.8 },
        { protocol: 'Compound', asset: 'DAI', percentage: 25, apy: 4.1 },
      ],
      totalValue: '75000.00',
      profit24h: '+142.50',
      createdAt: Date.now() - 14 * 24 * 60 * 60 * 1000,
      lastExecuted: Date.now() - 4 * 60 * 60 * 1000,
    },
    {
      id: 'strategy-2',
      name: 'Smart Rebalancer',
      type: 'rebalancing',
      status: 'active',
      aiScore: 88,
      expectedApy: 12.3,
      riskLevel: 'medium',
      allocations: [
        { protocol: 'Uniswap V3', asset: 'ETH-USDC', percentage: 50, apy: 15.2 },
        { protocol: 'Curve', asset: '3pool', percentage: 30, apy: 6.8 },
        { protocol: 'Balancer', asset: 'wstETH-ETH', percentage: 20, apy: 9.4 },
      ],
      totalValue: '50000.00',
      profit24h: '+89.20',
      createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
      lastExecuted: Date.now() - 2 * 60 * 60 * 1000,
    },
    {
      id: 'strategy-3',
      name: 'Risk-Adjusted DCA',
      type: 'dca',
      status: 'paused',
      aiScore: 95,
      expectedApy: 0,
      riskLevel: 'low',
      allocations: [
        { protocol: 'Market', asset: 'ETH', percentage: 60, apy: 0 },
        { protocol: 'Market', asset: 'BTC', percentage: 40, apy: 0 },
      ],
      totalValue: '25000.00',
      profit24h: '+0.00',
      createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
      lastExecuted: Date.now() - 7 * 24 * 60 * 60 * 1000,
    },
  ];
}
