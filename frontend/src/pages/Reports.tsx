import React from 'react';
import { Card, CardHeader, CardBody } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

const Reports = () => {
  const reports = [
    {
      id: '1',
      name: 'Monthly Cost Report',
      type: 'cost',
      period: 'May 2026',
      generatedAt: '2026-05-14',
      pages: 12,
      status: 'ready',
    },
    {
      id: '2',
      name: 'Security Findings',
      type: 'security',
      period: 'May 2026',
      generatedAt: '2026-05-13',
      pages: 8,
      status: 'ready',
    },
    {
      id: '3',
      name: 'Performance Analysis',
      type: 'performance',
      period: 'May 2026',
      generatedAt: '2026-05-10',
      pages: 15,
      status: 'ready',
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="animate-slideInUp">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-dark-text-primary mb-2">
          Reports
        </h1>
        <p className="text-neutral-600 dark:text-dark-text-secondary">
          View and download your analysis reports
        </p>
      </div>

      {/* Generate New Report */}
      <Card variant="primary" className="bg-gradient-to-r from-primary-500 to-primary-600 border-0 animate-slideInUp animate-stagger-1">
        <CardBody className="text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-1">Generate New Report</h3>
              <p className="text-primary-100">Create a comprehensive analysis of your AWS infrastructure</p>
            </div>
            <Button variant="ghost" size="lg" className="text-white hover:bg-white/10">
              Generate →
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Report Type Filters */}
      <div className="flex flex-wrap gap-2 animate-slideInUp animate-stagger-2">
        <Button variant="primary" size="sm">All Reports</Button>
        <Button variant="outline" size="sm">Cost</Button>
        <Button variant="outline" size="sm">Security</Button>
        <Button variant="outline" size="sm">Performance</Button>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-slideInUp animate-stagger-3">
        {reports.map((report, idx) => (
          <Card
            key={report.id}
            variant="default"
            interactive
            className="animate-fadeIn"
            style={{ animationDelay: `${idx * 0.1}s` }}
          >
            <CardBody className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-neutral-900 dark:text-dark-text-primary">
                    {report.name}
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-dark-text-secondary mt-1">
                    {report.period}
                  </p>
                </div>
                <Badge variant={
                  report.type === 'cost' ? 'primary' :
                  report.type === 'security' ? 'danger' :
                  'warning'
                }>
                  {report.type}
                </Badge>
              </div>

              {/* Info */}
              <div className="flex items-center gap-4 text-sm text-neutral-600 dark:text-dark-text-secondary">
                <div>📄 {report.pages} pages</div>
                <div>✓ {report.status}</div>
              </div>

              {/* Date */}
              <p className="text-xs text-neutral-500 dark:text-dark-text-tertiary">
                Generated {report.generatedAt}
              </p>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  View
                </Button>
                <Button variant="primary" size="sm" className="flex-1">
                  ⬇️ Download
                </Button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Scheduled Reports */}
      <Card variant="default" className="animate-slideInUp animate-stagger-4">
        <CardHeader>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-dark-text-primary">
            Scheduled Reports
          </h3>
        </CardHeader>
        <CardBody>
          <div className="space-y-3">
            {[
              { name: 'Weekly Cost Summary', schedule: 'Every Monday at 9:00 AM', next: 'May 20, 2026' },
              { name: 'Monthly Security Audit', schedule: 'First day of month at 2:00 PM', next: 'June 1, 2026' },
              { name: 'Quarterly Business Review', schedule: 'Last day of quarter', next: 'June 30, 2026' },
            ].map((sched, idx) => (
              <div key={idx} className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-700 last:border-b-0">
                <div>
                  <p className="font-medium text-neutral-900 dark:text-dark-text-primary">{sched.name}</p>
                  <p className="text-sm text-neutral-600 dark:text-dark-text-secondary mt-1">{sched.schedule}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-neutral-600 dark:text-dark-text-secondary">Next: {sched.next}</p>
                  <Button variant="ghost" size="sm" className="mt-2">Edit</Button>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default Reports;
