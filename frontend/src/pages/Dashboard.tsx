import React from 'react';
import { Card, CardBody, CardHeader } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Alert } from '../components/common/Alert';
import { Button } from '../components/common/Button';
import { CostCard } from '../components/dashboard/CostCard';
import { ConfidenceBar } from '../components/dashboard/ConfidenceBar';

const Dashboard = () => {
  const [notificationCount, setNotificationCount] = React.useState(3);

  const costData = [
    { service: 'EC2', amount: 2450.50, trend: 'up' as const, trendPercent: 12, status: 'high' },
    { service: 'S3', amount: 580.25, trend: 'down' as const, trendPercent: 8, status: 'low' },
    { service: 'Lambda', amount: 120.75, trend: 'neutral' as const, trendPercent: 0, status: 'low' },
    { service: 'RDS', amount: 890.30, trend: 'up' as const, trendPercent: 5, status: 'medium' },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="animate-slideInUp">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-dark-text-primary mb-2">
          Dashboard
        </h1>
        <p className="text-neutral-600 dark:text-dark-text-secondary">
          Welcome back! Here's your AWS cost and security overview.
        </p>
      </div>

      {/* Alerts */}
      <Alert
        variant="warning"
        title="Cost Spike Detected"
        className="animate-slideInUp animate-stagger-1"
      >
        Your EC2 costs increased by 15% compared to last week. Review your instances to optimize spending.
      </Alert>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-slideInUp animate-stagger-2">
        <Card variant="elevated">
          <CardBody>
            <div className="space-y-2">
              <p className="text-sm font-medium text-neutral-500 dark:text-dark-text-secondary">
                Total Monthly Cost
              </p>
              <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                $4,041.80
              </p>
              <div className="flex items-center gap-2 text-xs text-danger-600">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
                </svg>
                +12% vs last month
              </div>
            </div>
          </CardBody>
        </Card>

        <Card variant="elevated">
          <CardBody>
            <div className="space-y-2">
              <p className="text-sm font-medium text-neutral-500 dark:text-dark-text-secondary">
                Active Resources
              </p>
              <p className="text-2xl font-bold text-secondary-600 dark:text-secondary-400">
                247
              </p>
              <Badge variant="success" size="sm">✓ Healthy</Badge>
            </div>
          </CardBody>
        </Card>

        <Card variant="elevated">
          <CardBody>
            <div className="space-y-2">
              <p className="text-sm font-medium text-neutral-500 dark:text-dark-text-secondary">
                Security Issues
              </p>
              <p className="text-2xl font-bold text-danger-600 dark:text-danger-400">
                3
              </p>
              <Badge variant="danger" size="sm">High Priority</Badge>
            </div>
          </CardBody>
        </Card>

        <Card variant="elevated">
          <CardBody>
            <div className="space-y-2">
              <p className="text-sm font-medium text-neutral-500 dark:text-dark-text-secondary">
                Optimization Score
              </p>
              <ConfidenceBar value={72} showLabel={false} />
              <p className="text-xs text-neutral-500 dark:text-dark-text-tertiary">
                72/100
              </p>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Cost Breakdown */}
      <div className="animate-slideInUp animate-stagger-3">
        <h2 className="text-xl font-bold text-neutral-900 dark:text-dark-text-primary mb-4">
          Service Costs
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {costData.map((item, idx) => (
            <div key={idx} className="animate-fadeIn" style={{ animationDelay: `${idx * 0.1}s` }}>
              <CostCard {...item} badge={item.status === 'high' ? 'Alert' : undefined} />
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slideInUp animate-stagger-4">
        <Card variant="default" className="lg:col-span-2">
          <CardHeader divider>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-dark-text-primary">
              Recent Alerts
            </h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-start gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-700 last:border-b-0">
                  <div className="w-2 h-2 rounded-full bg-danger-500 mt-2 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium text-neutral-900 dark:text-dark-text-primary">
                      EC2 Instance Security Group
                    </p>
                    <p className="text-sm text-neutral-600 dark:text-dark-text-secondary mt-1">
                      Open port 22 detected on public instance
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" className="w-full mt-4">
              View All Alerts
            </Button>
          </CardBody>
        </Card>

        <Card variant="default">
          <CardHeader divider>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-dark-text-primary">
              Recommendations
            </h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              <div className="p-3 bg-secondary-50 dark:bg-green-900/20 rounded-lg border border-secondary-200 dark:border-green-800">
                <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
                  Scale Down EC2
                </p>
                <p className="text-xs text-secondary-700 dark:text-secondary-300 mt-1">
                  Estimated savings: $400/mo
                </p>
              </div>
              <div className="p-3 bg-warning-50 dark:bg-yellow-900/20 rounded-lg border border-warning-200 dark:border-yellow-800">
                <p className="text-sm font-medium text-warning-900 dark:text-warning-100">
                  Enable S3 Lifecycle
                </p>
                <p className="text-xs text-warning-700 dark:text-warning-300 mt-1">
                  Estimated savings: $120/mo
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
