import { useState } from 'react';
import { Card, CardHeader, CardBody } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Input } from '../components/common/Input';
import WebhookSettings from '../components/WebhookSettings';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('users');

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="animate-slideInUp">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-dark-text-primary mb-2">
          Admin Settings
        </h1>
        <p className="text-neutral-600 dark:text-dark-text-secondary">
          Manage users, accounts, webhooks, and system configuration
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-neutral-200 dark:border-neutral-700 animate-slideInUp animate-stagger-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 border-b-2 font-medium whitespace-nowrap transition ${
            activeTab === 'users'
              ? 'border-primary-500 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-neutral-600 dark:text-dark-text-secondary hover:text-neutral-900'
          }`}
        >
          Users
        </button>
        <button
          onClick={() => setActiveTab('accounts')}
          className={`px-4 py-2 border-b-2 font-medium whitespace-nowrap transition ${
            activeTab === 'accounts'
              ? 'border-primary-500 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-neutral-600 dark:text-dark-text-secondary hover:text-neutral-900'
          }`}
        >
          AWS Accounts
        </button>
        <button
          onClick={() => setActiveTab('webhooks')}
          className={`px-4 py-2 border-b-2 font-medium whitespace-nowrap transition ${
            activeTab === 'webhooks'
              ? 'border-primary-500 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-neutral-600 dark:text-dark-text-secondary hover:text-neutral-900'
          }`}
        >
          Webhooks
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 border-b-2 font-medium whitespace-nowrap transition ${
            activeTab === 'settings'
              ? 'border-primary-500 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-neutral-600 dark:text-dark-text-secondary hover:text-neutral-900'
          }`}
        >
          Settings
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 border-b-2 font-medium whitespace-nowrap transition ${
            activeTab === 'audit'
              ? 'border-primary-500 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-neutral-600 dark:text-dark-text-secondary hover:text-neutral-900'
          }`}
        >
          Audit Logs
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'users' && (
        <div className="animate-slideInUp animate-stagger-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-dark-text-primary">
              User Accounts
            </h2>
            <Button variant="primary" size="sm">+ Add User</Button>
          </div>

          <Card variant="default">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50 dark:bg-dark-bg-tertiary border-b border-neutral-200 dark:border-neutral-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-900 dark:text-dark-text-primary">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-900 dark:text-dark-text-primary">Email</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-900 dark:text-dark-text-primary">Role</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-900 dark:text-dark-text-primary">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-900 dark:text-dark-text-primary">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'John Admin', email: 'john@example.com', role: 'Admin', status: 'Active' },
                    { name: 'Sarah Analyst', email: 'sarah@example.com', role: 'Analyst', status: 'Active' },
                    { name: 'Mike Viewer', email: 'mike@example.com', role: 'Viewer', status: 'Inactive' },
                  ].map((user, idx) => (
                    <tr key={idx} className="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-dark-bg-tertiary">
                      <td className="px-6 py-4 text-neutral-900 dark:text-dark-text-primary">{user.name}</td>
                      <td className="px-6 py-4 text-neutral-600 dark:text-dark-text-secondary">{user.email}</td>
                      <td className="px-6 py-4">
                        <Badge variant="primary" size="sm">{user.role}</Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={user.status === 'Active' ? 'success' : 'default'} size="sm" dot>
                          {user.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 space-x-2">
                        <Button variant="ghost" size="sm">Edit</Button>
                        <Button variant="danger" size="sm">Remove</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'accounts' && (
        <div className="animate-slideInUp animate-stagger-3">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-dark-text-primary">
              Connected AWS Accounts
            </h2>
            <Button variant="primary" size="sm">+ Connect Account</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'Production', id: '123456789012', region: 'us-east-1', status: 'Connected' },
              { name: 'Development', id: '210987654321', region: 'us-west-2', status: 'Connected' },
              { name: 'Staging', id: '111222333444', region: 'eu-west-1', status: 'Pending' },
            ].map((account, idx) => (
              <Card key={idx} variant="default">
                <CardBody className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-neutral-900 dark:text-dark-text-primary">{account.name}</h3>
                    <p className="text-sm text-neutral-600 dark:text-dark-text-secondary font-mono">{account.id}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600 dark:text-dark-text-secondary">{account.region}</span>
                    <Badge variant={account.status === 'Connected' ? 'success' : 'warning'} size="sm">
                      {account.status}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">Edit</Button>
                    <Button variant="danger" size="sm" className="flex-1">Remove</Button>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'webhooks' && (
        <div className="animate-slideInUp animate-stagger-3">
          <WebhookSettings />
        </div>
      )}

      {activeTab === 'settings' && (
        <Card variant="default" className="animate-slideInUp animate-stagger-4">
          <CardHeader divider>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-dark-text-primary">
              System Settings
            </h3>
          </CardHeader>
          <CardBody className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700 dark:text-dark-text-primary">Alert Email</label>
              <Input type="email" placeholder="alerts@example.com" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700 dark:text-dark-text-primary">Report Frequency</label>
              <select className="w-full px-4 py-2 rounded-lg border-2 border-neutral-200 dark:border-neutral-700 bg-white dark:bg-dark-bg-secondary text-neutral-900 dark:text-dark-text-primary focus:border-primary-500">
                <option>Weekly</option>
                <option>Bi-weekly</option>
                <option>Monthly</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                <span className="text-sm text-neutral-700 dark:text-dark-text-primary">
                  Enable 24/7 monitoring alerts
                </span>
              </label>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                <span className="text-sm text-neutral-700 dark:text-dark-text-primary">
                  Send cost anomaly notifications
                </span>
              </label>
            </div>

            <div className="flex gap-2 pt-4 border-t border-neutral-200 dark:border-neutral-700">
              <Button variant="primary" size="md">Save Changes</Button>
              <Button variant="outline" size="md">Cancel</Button>
            </div>
          </CardBody>
        </Card>
      )}

      {activeTab === 'audit' && (
        <Card variant="default" className="animate-slideInUp animate-stagger-4">
          <CardHeader divider>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-dark-text-primary">
              Audit Logs
            </h3>
          </CardHeader>
          <CardBody>
            <p className="text-neutral-600 dark:text-dark-text-secondary">Audit log functionality coming soon.</p>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default Admin;
