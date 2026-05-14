export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
export const WS_URL = process.env.REACT_APP_WS_URL || 'ws://localhost:8000/ws';

export const AWS_REGIONS = [
  'us-east-1',
  'us-west-2',
  'eu-west-1',
  'ap-southeast-1',
  'ap-northeast-1',
];

export const AWS_SERVICES = [
  'EC2',
  'S3',
  'Lambda',
  'DynamoDB',
  'RDS',
  'CloudFront',
  'ECS',
  'EKS',
  'SNS',
  'SQS',
];

export const ALERT_TYPES = {
  VULNERABILITY: 'vulnerability',
  COST_SPIKE: 'cost_spike',
  PERFORMANCE: 'performance',
} as const;

export const SEVERITY_LEVELS = {
  CRITICAL: 'critical',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
} as const;

export const USER_ROLES = {
  ADMIN: 'admin',
  ANALYST: 'analyst',
  VIEWER: 'viewer',
} as const;

export const REPORT_TYPES = {
  COST: 'cost',
  PERFORMANCE: 'performance',
  SECURITY: 'security',
} as const;

export const REPORT_PERIODS = {
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  QUARTERLY: 'quarterly',
} as const;

export const PAGINATION_DEFAULTS = {
  PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;

export const REQUEST_TIMEOUT = 30000; // 30 seconds
export const RETRY_ATTEMPTS = 3;
export const RETRY_DELAY = 1000; // 1 second
