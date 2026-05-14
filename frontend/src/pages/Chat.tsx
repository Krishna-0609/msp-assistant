import React from 'react';
import { Card, CardHeader, CardBody } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { ChatWindow } from '../components/chat/ChatWindow';
import { Badge } from '../components/common/Badge';
import type { ChatMessage } from '../types/models';

const Chat = () => {
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your MSP Assistant. I can help you analyze AWS costs, identify security issues, and optimize your infrastructure. What would you like to know?',
      timestamp: new Date(Date.now() - 300000).toISOString(),
      confidence: 95,
    },
  ]);
  const [input, setInput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response delay
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: `I understand you asked about "${input}". I'm analyzing your AWS infrastructure to provide the best recommendations. In a production environment, I would connect to AWS Bedrock with Claude 3.5 Sonnet to give you detailed insights.`,
        timestamp: new Date().toISOString(),
        confidence: 78,
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="animate-slideInUp">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-dark-text-primary mb-2">
          AI Assistant
        </h1>
        <p className="text-neutral-600 dark:text-dark-text-secondary">
          Chat with Claude 3.5 Sonnet powered by AWS Bedrock
        </p>
      </div>

      {/* Main Chat Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-slideInUp animate-stagger-1">
        {/* Chat Window */}
        <div className="lg:col-span-3 space-y-4">
          <ChatWindow messages={messages} isLoading={isLoading} />

          {/* Input */}
          <div className="flex gap-2">
            <Input
              placeholder="Ask about costs, security, performance..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              }
            />
            <Button
              variant="primary"
              size="md"
              onClick={handleSend}
              isLoading={isLoading}
              disabled={!input.trim() || isLoading}
            >
              Send
            </Button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Quick Actions */}
          <Card variant="default">
            <CardHeader divider>
              <h3 className="font-semibold text-neutral-900 dark:text-dark-text-primary">
                Quick Actions
              </h3>
            </CardHeader>
            <CardBody className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                💰 Analyze Costs
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                🔒 Security Audit
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                ⚡ Performance Tips
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                📊 Generate Report
              </Button>
            </CardBody>
          </Card>

          {/* Capabilities */}
          <Card variant="default">
            <CardHeader divider>
              <h3 className="font-semibold text-neutral-900 dark:text-dark-text-primary">
                Capabilities
              </h3>
            </CardHeader>
            <CardBody className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-primary-500">✓</span>
                <span className="text-neutral-600 dark:text-dark-text-secondary">Cost analysis</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-primary-500">✓</span>
                <span className="text-neutral-600 dark:text-dark-text-secondary">Security recommendations</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-primary-500">✓</span>
                <span className="text-neutral-600 dark:text-dark-text-secondary">Performance optimization</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-primary-500">✓</span>
                <span className="text-neutral-600 dark:text-dark-text-secondary">Compliance checks</span>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Chat;
