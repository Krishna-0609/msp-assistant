import React from 'react';
import { Card, CardBody } from '../common/Card';
import { Badge } from '../common/Badge';

interface CostCardProps {
  service: string;
  amount: number;
  currency?: string;
  trend?: 'up' | 'down' | 'neutral' | string;
  trendPercent?: number;
  status?: 'low' | 'medium' | 'high' | string;
  badge?: string;
}

const getStatusColor = (status?: string) => {
  switch (status) {
    case 'low':
      return 'success';
    case 'high':
      return 'danger';
    default:
      return 'warning';
  }
};

const getTrendIcon = (trend?: string) => {
  switch (trend) {
    case 'up':
      return (
        <svg className="w-4 h-4 text-danger-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
          <path d="M3.293 9.293a1 1 0 011.414 0L10 14.586l5.293-5.293a1 1 0 111.414 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414z" />
        </svg>
      );
    case 'down':
      return (
        <svg className="w-4 h-4 text-secondary-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
          <path d="M16.707 10.707a1 1 0 01-1.414 0L10 5.414 4.707 10.707a1 1 0 01-1.414-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 010 1.414z" />
        </svg>
      );
    default:
      return (
        <svg className="w-4 h-4 text-neutral-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M5.5 12a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM12.5 12a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
        </svg>
      );
  }
};

export const CostCard: React.FC<CostCardProps> = ({
  service,
  amount,
  currency = '$',
  trend,
  trendPercent,
  status,
  badge,
}) => {
  return (
    <Card variant="default" className="h-full hover:shadow-lg transition-shadow">
      <CardBody>
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-dark-text-primary">
                {service}
              </h3>
              <p className="text-3xl font-bold text-primary-500 mt-2">
                {currency}{amount.toFixed(2)}
              </p>
            </div>
            {badge && (
              <Badge variant={getStatusColor(status)} size="sm">
                {badge}
              </Badge>
            )}
          </div>

          {trend && trendPercent !== undefined && (
            <div className="flex items-center gap-2 text-sm">
              {getTrendIcon(trend)}
              <span className={
                trend === 'up' ? 'text-danger-600 dark:text-danger-400' :
                trend === 'down' ? 'text-secondary-600 dark:text-secondary-400' :
                'text-neutral-600 dark:text-neutral-400'
              }>
                {trend === 'up' ? '+' : trend === 'down' ? '-' : ''}{trendPercent}% this month
              </span>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
};
