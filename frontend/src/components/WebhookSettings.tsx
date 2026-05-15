import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AlertCircle, CheckCircle, Copy, Eye, EyeOff, ExternalLink } from 'lucide-react';

interface WebhookSettingsProps {
  onClose?: () => void;
}

export const WebhookSettings: React.FC<WebhookSettingsProps> = ({ onClose }) => {
  const [teamsUrl, setTeamsUrl] = useState('');
  const [slackUrl, setSlackUrl] = useState('');
  const [teamsEnabled, setTeamsEnabled] = useState(false);
  const [slackEnabled, setSlackEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showTeamsUrl, setShowTeamsUrl] = useState(false);
  const [showSlackUrl, setShowSlackUrl] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

  // Load webhook settings
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      const response = await axios.get(`${API_URL}/api/settings/webhooks`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.teams_webhook) {
        setTeamsEnabled(response.data.teams_webhook.configured);
      }
      if (response.data.slack_webhook) {
        setSlackEnabled(response.data.slack_webhook.configured);
      }
    } catch (error) {
      console.error('Failed to load webhook settings:', error);
      setMessage({ type: 'error', text: 'Failed to load webhook settings' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (webhookType: 'teams' | 'slack') => {
    const url = webhookType === 'teams' ? teamsUrl : slackUrl;
    const enabled = webhookType === 'teams' ? teamsEnabled : slackEnabled;

    if (enabled && !url) {
      setMessage({ type: 'error', text: `Please enter ${webhookType} webhook URL` });
      return;
    }

    if (enabled && !url.startsWith('https://')) {
      setMessage({ type: 'error', text: `${webhookType} webhook URL must start with https://` });
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem('access_token');
      const response = await axios.post(
        `${API_URL}/api/settings/webhooks/configure`,
        {
          webhook_type: webhookType,
          webhook_url: url,
          enabled
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setMessage({ type: 'success', text: response.data.message });
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.response?.data?.detail || 'Failed to save webhook settings'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async (webhookType: 'teams' | 'slack') => {
    try {
      setTesting(webhookType);
      const token = localStorage.getItem('access_token');
      const response = await axios.post(
        `${API_URL}/api/settings/webhooks/test`,
        { webhook_type: webhookType },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setMessage({
          type: 'success',
          text: `✅ Test message sent to ${webhookType}!`
        });
      } else {
        setMessage({
          type: 'error',
          text: response.data.message
        });
      }
      setTimeout(() => setMessage(null), 4000);
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: 'Failed to test webhook'
      });
    } finally {
      setTesting(null);
    }
  };

  const copyToClipboard = (text: string, webhookType: string) => {
    navigator.clipboard.writeText(text);
    setMessage({ type: 'success', text: `${webhookType} webhook URL copied!` });
    setTimeout(() => setMessage(null), 2000);
  };

  if (loading) {
    return <div className="text-center py-8">Loading webhook settings...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Webhook Integrations
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Configure webhooks to receive notifications in Teams or Slack
        </p>
      </div>

      {/* Message Alert */}
      {message && (
        <div className={`p-4 rounded-lg flex items-start gap-3 ${
          message.type === 'success'
            ? 'bg-green-50 dark:bg-green-900/20'
            : 'bg-red-50 dark:bg-red-900/20'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          )}
          <p className={message.type === 'success' ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'}>
            {message.text}
          </p>
        </div>
      )}

      {/* Teams Webhook */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <span className="text-lg font-bold text-blue-600 dark:text-blue-400">T</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Microsoft Teams
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Send alerts to Teams channel
              </p>
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={teamsEnabled}
              onChange={(e) => setTeamsEnabled(e.target.checked)}
              className="w-4 h-4 rounded"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {teamsEnabled ? 'Enabled' : 'Disabled'}
            </span>
          </label>
        </div>

        {teamsEnabled && (
          <div className="space-y-3">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Webhook URL
              </label>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <input
                    type={showTeamsUrl ? 'text' : 'password'}
                    value={teamsUrl}
                    onChange={(e) => setTeamsUrl(e.target.value)}
                    placeholder="https://outlook.webhook.office.com/..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowTeamsUrl(!showTeamsUrl)}
                    className="absolute right-3 top-8 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    {showTeamsUrl ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {teamsUrl && (
                  <button
                    type="button"
                    onClick={() => copyToClipboard(teamsUrl, 'Teams')}
                    className="px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    title="Copy URL"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                <a
                  href="https://docs.microsoft.com/en-us/outlook/actionable-messages/send-via-connectors"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                >
                  How to get Teams webhook URL <ExternalLink className="w-3 h-3" />
                </a>
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleSave('teams')}
                disabled={saving}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={() => handleTest('teams')}
                disabled={testing === 'teams' || !teamsUrl}
                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 text-gray-900 dark:text-white rounded-lg font-medium transition"
              >
                {testing === 'teams' ? 'Testing...' : 'Test'}
              </button>
            </div>
          </div>
        )}

        {!teamsEnabled && (
          <button
            onClick={() => {
              setTeamsEnabled(true);
              handleSave('teams');
            }}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
          >
            Enable Teams Webhook
          </button>
        )}
      </div>

      {/* Slack Webhook */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <span className="text-lg font-bold text-purple-600 dark:text-purple-400">S</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Slack
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Send alerts to Slack channel
              </p>
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={slackEnabled}
              onChange={(e) => setSlackEnabled(e.target.checked)}
              className="w-4 h-4 rounded"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {slackEnabled ? 'Enabled' : 'Disabled'}
            </span>
          </label>
        </div>

        {slackEnabled && (
          <div className="space-y-3">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Webhook URL
              </label>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <input
                    type={showSlackUrl ? 'text' : 'password'}
                    value={slackUrl}
                    onChange={(e) => setSlackUrl(e.target.value)}
                    placeholder="https://hooks.slack.com/services/..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSlackUrl(!showSlackUrl)}
                    className="absolute right-3 top-8 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    {showSlackUrl ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {slackUrl && (
                  <button
                    type="button"
                    onClick={() => copyToClipboard(slackUrl, 'Slack')}
                    className="px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    title="Copy URL"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                <a
                  href="https://api.slack.com/messaging/webhooks"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                >
                  How to get Slack webhook URL <ExternalLink className="w-3 h-3" />
                </a>
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleSave('slack')}
                disabled={saving}
                className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={() => handleTest('slack')}
                disabled={testing === 'slack' || !slackUrl}
                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 text-gray-900 dark:text-white rounded-lg font-medium transition"
              >
                {testing === 'slack' ? 'Testing...' : 'Test'}
              </button>
            </div>
          </div>
        )}

        {!slackEnabled && (
          <button
            onClick={() => {
              setSlackEnabled(true);
              handleSave('slack');
            }}
            className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition"
          >
            Enable Slack Webhook
          </button>
        )}
      </div>

      {/* Info */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
          💡 Tips
        </h4>
        <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
          <li>✓ URLs are masked for security in storage</li>
          <li>✓ Click "Test" to verify webhook is working</li>
          <li>✓ You can use both Teams and Slack at the same time</li>
          <li>✓ Alerts will be sent automatically once configured</li>
        </ul>
      </div>

      {/* Close button */}
      {onClose && (
        <button
          onClick={onClose}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium transition"
        >
          Close
        </button>
      )}
    </div>
  );
};

export default WebhookSettings;
