import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { AlertCircle, CheckCircle, Copy, Eye, EyeOff, ExternalLink } from 'lucide-react';
export const WebhookSettings = ({ onClose }) => {
    const [teamsUrl, setTeamsUrl] = useState('');
    const [slackUrl, setSlackUrl] = useState('');
    const [teamsEnabled, setTeamsEnabled] = useState(false);
    const [slackEnabled, setSlackEnabled] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [testing, setTesting] = useState(null);
    const [message, setMessage] = useState(null);
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
        }
        catch (error) {
            console.error('Failed to load webhook settings:', error);
            setMessage({ type: 'error', text: 'Failed to load webhook settings' });
        }
        finally {
            setLoading(false);
        }
    };
    const handleSave = async (webhookType) => {
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
            const response = await axios.post(`${API_URL}/api/settings/webhooks/configure`, {
                webhook_type: webhookType,
                webhook_url: url,
                enabled
            }, { headers: { Authorization: `Bearer ${token}` } });
            if (response.data.success) {
                setMessage({ type: 'success', text: response.data.message });
                setTimeout(() => setMessage(null), 3000);
            }
        }
        catch (error) {
            setMessage({
                type: 'error',
                text: error.response?.data?.detail || 'Failed to save webhook settings'
            });
        }
        finally {
            setSaving(false);
        }
    };
    const handleTest = async (webhookType) => {
        try {
            setTesting(webhookType);
            const token = localStorage.getItem('access_token');
            const response = await axios.post(`${API_URL}/api/settings/webhooks/test`, { webhook_type: webhookType }, { headers: { Authorization: `Bearer ${token}` } });
            if (response.data.success) {
                setMessage({
                    type: 'success',
                    text: `✅ Test message sent to ${webhookType}!`
                });
            }
            else {
                setMessage({
                    type: 'error',
                    text: response.data.message
                });
            }
            setTimeout(() => setMessage(null), 4000);
        }
        catch (error) {
            setMessage({
                type: 'error',
                text: 'Failed to test webhook'
            });
        }
        finally {
            setTesting(null);
        }
    };
    const copyToClipboard = (text, webhookType) => {
        navigator.clipboard.writeText(text);
        setMessage({ type: 'success', text: `${webhookType} webhook URL copied!` });
        setTimeout(() => setMessage(null), 2000);
    };
    if (loading) {
        return _jsx("div", { className: "text-center py-8", children: "Loading webhook settings..." });
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: "Webhook Integrations" }), _jsx("p", { className: "text-gray-600 dark:text-gray-300 mt-2", children: "Configure webhooks to receive notifications in Teams or Slack" })] }), message && (_jsxs("div", { className: `p-4 rounded-lg flex items-start gap-3 ${message.type === 'success'
                    ? 'bg-green-50 dark:bg-green-900/20'
                    : 'bg-red-50 dark:bg-red-900/20'}`, children: [message.type === 'success' ? (_jsx(CheckCircle, { className: "w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" })) : (_jsx(AlertCircle, { className: "w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" })), _jsx("p", { className: message.type === 'success' ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300', children: message.text })] })), _jsxs("div", { className: "border border-gray-200 dark:border-gray-700 rounded-lg p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center", children: _jsx("span", { className: "text-lg font-bold text-blue-600 dark:text-blue-400", children: "T" }) }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-gray-900 dark:text-white", children: "Microsoft Teams" }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Send alerts to Teams channel" })] })] }), _jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: teamsEnabled, onChange: (e) => setTeamsEnabled(e.target.checked), className: "w-4 h-4 rounded" }), _jsx("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: teamsEnabled ? 'Enabled' : 'Disabled' })] })] }), teamsEnabled && (_jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "relative", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Webhook URL" }), _jsxs("div", { className: "flex gap-2", children: [_jsxs("div", { className: "flex-1 relative", children: [_jsx("input", { type: showTeamsUrl ? 'text' : 'password', value: teamsUrl, onChange: (e) => setTeamsUrl(e.target.value), placeholder: "https://outlook.webhook.office.com/...", className: "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" }), _jsx("button", { type: "button", onClick: () => setShowTeamsUrl(!showTeamsUrl), className: "absolute right-3 top-8 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300", children: showTeamsUrl ? (_jsx(EyeOff, { className: "w-4 h-4" })) : (_jsx(Eye, { className: "w-4 h-4" })) })] }), teamsUrl && (_jsx("button", { type: "button", onClick: () => copyToClipboard(teamsUrl, 'Teams'), className: "px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white", title: "Copy URL", children: _jsx(Copy, { className: "w-4 h-4" }) }))] }), _jsx("p", { className: "text-xs text-gray-500 dark:text-gray-400 mt-2", children: _jsxs("a", { href: "https://docs.microsoft.com/en-us/outlook/actionable-messages/send-via-connectors", target: "_blank", rel: "noopener noreferrer", className: "text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1", children: ["How to get Teams webhook URL ", _jsx(ExternalLink, { className: "w-3 h-3" })] }) })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => handleSave('teams'), disabled: saving, className: "flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition", children: saving ? 'Saving...' : 'Save' }), _jsx("button", { onClick: () => handleTest('teams'), disabled: testing === 'teams' || !teamsUrl, className: "flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 text-gray-900 dark:text-white rounded-lg font-medium transition", children: testing === 'teams' ? 'Testing...' : 'Test' })] })] })), !teamsEnabled && (_jsx("button", { onClick: () => {
                            setTeamsEnabled(true);
                            handleSave('teams');
                        }, className: "w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition", children: "Enable Teams Webhook" }))] }), _jsxs("div", { className: "border border-gray-200 dark:border-gray-700 rounded-lg p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center", children: _jsx("span", { className: "text-lg font-bold text-purple-600 dark:text-purple-400", children: "S" }) }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-gray-900 dark:text-white", children: "Slack" }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Send alerts to Slack channel" })] })] }), _jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: slackEnabled, onChange: (e) => setSlackEnabled(e.target.checked), className: "w-4 h-4 rounded" }), _jsx("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: slackEnabled ? 'Enabled' : 'Disabled' })] })] }), slackEnabled && (_jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "relative", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Webhook URL" }), _jsxs("div", { className: "flex gap-2", children: [_jsxs("div", { className: "flex-1 relative", children: [_jsx("input", { type: showSlackUrl ? 'text' : 'password', value: slackUrl, onChange: (e) => setSlackUrl(e.target.value), placeholder: "https://hooks.slack.com/services/...", className: "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" }), _jsx("button", { type: "button", onClick: () => setShowSlackUrl(!showSlackUrl), className: "absolute right-3 top-8 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300", children: showSlackUrl ? (_jsx(EyeOff, { className: "w-4 h-4" })) : (_jsx(Eye, { className: "w-4 h-4" })) })] }), slackUrl && (_jsx("button", { type: "button", onClick: () => copyToClipboard(slackUrl, 'Slack'), className: "px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white", title: "Copy URL", children: _jsx(Copy, { className: "w-4 h-4" }) }))] }), _jsx("p", { className: "text-xs text-gray-500 dark:text-gray-400 mt-2", children: _jsxs("a", { href: "https://api.slack.com/messaging/webhooks", target: "_blank", rel: "noopener noreferrer", className: "text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1", children: ["How to get Slack webhook URL ", _jsx(ExternalLink, { className: "w-3 h-3" })] }) })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => handleSave('slack'), disabled: saving, className: "flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition", children: saving ? 'Saving...' : 'Save' }), _jsx("button", { onClick: () => handleTest('slack'), disabled: testing === 'slack' || !slackUrl, className: "flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 text-gray-900 dark:text-white rounded-lg font-medium transition", children: testing === 'slack' ? 'Testing...' : 'Test' })] })] })), !slackEnabled && (_jsx("button", { onClick: () => {
                            setSlackEnabled(true);
                            handleSave('slack');
                        }, className: "w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition", children: "Enable Slack Webhook" }))] }), _jsxs("div", { className: "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4", children: [_jsx("h4", { className: "font-semibold text-blue-900 dark:text-blue-300 mb-2", children: "\uD83D\uDCA1 Tips" }), _jsxs("ul", { className: "text-sm text-blue-800 dark:text-blue-300 space-y-1", children: [_jsx("li", { children: "\u2713 URLs are masked for security in storage" }), _jsx("li", { children: "\u2713 Click \"Test\" to verify webhook is working" }), _jsx("li", { children: "\u2713 You can use both Teams and Slack at the same time" }), _jsx("li", { children: "\u2713 Alerts will be sent automatically once configured" })] })] }), onClose && (_jsx("button", { onClick: onClose, className: "w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium transition", children: "Close" }))] }));
};
export default WebhookSettings;
