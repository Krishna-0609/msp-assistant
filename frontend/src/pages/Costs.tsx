
import { Card, CardHeader, CardBody } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { DataTable } from '../components/data-display/DataTable';
import { CostCard } from '../components/dashboard/CostCard';

const Costs = () => {
  const costData = [
    { service: 'EC2', amount: 2450.50, trend: 'up' as const, trendPercent: 12, status: 'high' },
    { service: 'S3', amount: 580.25, trend: 'down' as const, trendPercent: 8, status: 'low' },
    { service: 'Lambda', amount: 120.75, trend: 'neutral' as const, trendPercent: 0, status: 'low' },
    { service: 'RDS', amount: 890.30, trend: 'up' as const, trendPercent: 5, status: 'medium' },
    { service: 'CloudFront', amount: 450.00, trend: 'down' as const, trendPercent: 3, status: 'medium' },
    { service: 'ECS', amount: 320.15, trend: 'neutral' as const, trendPercent: 0, status: 'low' },
  ];

  const tableColumns = [
    { key: 'service' as const, label: 'Service' },
    { key: 'amount' as const, label: 'Monthly Cost', render: (val: any) => `$${val.toFixed(2)}` },
    { key: 'trend' as const, label: 'Trend', render: (val: any) => (
      <Badge variant={val === 'up' ? 'danger' : val === 'down' ? 'success' : 'default'}>
        {val === 'up' ? '📈' : val === 'down' ? '📉' : '➡️'} {val}
      </Badge>
    )},
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="animate-slideInUp">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-dark-text-primary mb-2">
          Costs Analysis
        </h1>
        <p className="text-neutral-600 dark:text-dark-text-secondary">
          Monitor and optimize your AWS spending
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 animate-slideInUp animate-stagger-1">
        <Button variant="primary" size="sm">Last 30 Days</Button>
        <Button variant="outline" size="sm">Last 90 Days</Button>
        <Button variant="outline" size="sm">Last Year</Button>
        <Button variant="outline" size="sm" className="ml-auto">📊 Export</Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-slideInUp animate-stagger-2">
        <Card variant="elevated">
          <CardBody>
            <div className="space-y-2">
              <p className="text-sm font-medium text-neutral-500 dark:text-dark-text-secondary">Total Cost</p>
              <p className="text-2xl font-bold text-primary-600">$4,811.95</p>
              <p className="text-xs text-danger-600">+8% vs last month</p>
            </div>
          </CardBody>
        </Card>

        <Card variant="elevated">
          <CardBody>
            <div className="space-y-2">
              <p className="text-sm font-medium text-neutral-500 dark:text-dark-text-secondary">Highest Cost</p>
              <p className="text-2xl font-bold text-danger-600">EC2</p>
              <p className="text-xs text-neutral-600">$2,450.50/month</p>
            </div>
          </CardBody>
        </Card>

        <Card variant="elevated">
          <CardBody>
            <div className="space-y-2">
              <p className="text-sm font-medium text-neutral-500 dark:text-dark-text-secondary">Potential Savings</p>
              <p className="text-2xl font-bold text-secondary-600">$520</p>
              <p className="text-xs text-secondary-600">Per month</p>
            </div>
          </CardBody>
        </Card>

        <Card variant="elevated">
          <CardBody>
            <div className="space-y-2">
              <p className="text-sm font-medium text-neutral-500 dark:text-dark-text-secondary">Services</p>
              <p className="text-2xl font-bold text-primary-600">12</p>
              <p className="text-xs text-neutral-600">Active services</p>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Cost Cards Grid */}
      <div className="animate-slideInUp animate-stagger-3">
        <h2 className="text-xl font-bold text-neutral-900 dark:text-dark-text-primary mb-4">
          Service Breakdown
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {costData.map((item, idx) => (
            <div key={idx} className="animate-fadeIn" style={{ animationDelay: `${idx * 0.1}s` }}>
              <CostCard {...item} badge={item.status === 'high' ? 'Alert' : undefined} />
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Table */}
      <div className="animate-slideInUp animate-stagger-4">
        <h2 className="text-xl font-bold text-neutral-900 dark:text-dark-text-primary mb-4">
          Detailed History
        </h2>
        <DataTable columns={tableColumns} data={costData} />
      </div>

      {/* Recommendations */}
      <Card variant="default" className="animate-slideInUp animate-stagger-5">
        <CardHeader>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-dark-text-primary">
            💡 Optimization Recommendations
          </h3>
        </CardHeader>
        <CardBody>
          <div className="space-y-3">
            {[
              { title: 'Reserved Instances', savings: 400, desc: 'Save 40% on EC2 with 1-year commits' },
              { title: 'Idle Resources', savings: 120, desc: 'Terminate unused instances' },
              { title: 'Storage Optimization', savings: 150, desc: 'Archive old S3 objects to Glacier' },
            ].map((rec, idx) => (
              <div key={idx} className="flex items-start gap-4 pb-3 border-b border-neutral-200 dark:border-neutral-700 last:border-b-0">
                <div className="flex-1">
                  <p className="font-medium text-neutral-900 dark:text-dark-text-primary">{rec.title}</p>
                  <p className="text-sm text-neutral-600 dark:text-dark-text-secondary mt-1">{rec.desc}</p>
                </div>
                <Badge variant="success">Save ${rec.savings}</Badge>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default Costs;
