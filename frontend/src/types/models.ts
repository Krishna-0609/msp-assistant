export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'analyst' | 'viewer';
  avatar?: string;
  createdAt: string;
}

export interface AWSAccount {
  id: string;
  name: string;
  accountId: string;
  region: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface CostData {
  service: string;
  amount: number;
  currency: string;
  date: string;
  trend: 'up' | 'down' | 'neutral';
  trendPercent: number;
}

export interface Alert {
  id: string;
  type: 'vulnerability' | 'cost_spike' | 'performance';
  severity: 'critical' | 'high' | 'medium' | 'low';
  message: string;
  service?: string;
  timestamp: string;
  read: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  confidence?: number;
}

export interface Report {
  id: string;
  name: string;
  type: 'cost' | 'performance' | 'security';
  generatedAt: string;
  period: 'weekly' | 'monthly' | 'quarterly';
}
