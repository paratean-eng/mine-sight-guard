import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { User, AINotification } from '@/types';
import { mockAlerts, mockAINotifications } from '@/data/mockData';
import { 
  ArrowLeft, 
  Send, 
  Bot, 
  User as UserIcon, 
  Bell, 
  Filter,
  AlertTriangle,
  Info,
  TrendingUp,
  LogOut,
  Shield
} from 'lucide-react';

interface AIChatProps {
  user: User;
  onLogout: () => void;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  message: string;
  timestamp: Date;
}

const AIChat = ({ user, onLogout }: AIChatProps) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'ai',
      message: `Hello ${user.name}! I'm your AI mining assistant. I can help you analyze sensor data, predict equipment failures, and monitor safety conditions. What would you like to know?`,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [filter, setFilter] = useState<'all' | 'prediction' | 'alert' | 'info'>('all');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      message: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        message: generateAIResponse(inputMessage),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('sensor') || lowerMessage.includes('temperature') || lowerMessage.includes('gas')) {
      return 'Based on current sensor readings, all environmental conditions are within normal parameters. Temperature is stable at 24.5°C, and gas levels are well below safety thresholds. I recommend continuing regular monitoring intervals.';
    }
    
    if (lowerMessage.includes('equipment') || lowerMessage.includes('conveyor') || lowerMessage.includes('vibration')) {
      return 'I detected anomalous vibration patterns in Conveyor CB-15. The frequency has increased by 15% over the past 2 hours. I predict potential bearing failure within 4-6 hours. Recommend immediate inspection and prepare replacement parts.';
    }
    
    if (lowerMessage.includes('prediction') || lowerMessage.includes('forecast')) {
      return 'Current AI predictions show: 87% chance of equipment maintenance needed in Sector 7-B within 24 hours, weather conditions favorable for next 48 hours, and production targets on track to exceed daily quota by 12%.';
    }
    
    if (lowerMessage.includes('safety') || lowerMessage.includes('alert')) {
      return 'Current safety status: 2 medium-priority alerts requiring attention. Gas monitoring in Sector 7-B shows slight elevation but within safe limits. All emergency systems are operational. No immediate safety concerns detected.';
    }
    
    return 'I\'m analyzing your request. Based on current mine operations data, I can provide insights on equipment status, environmental conditions, safety alerts, and predictive maintenance. Could you be more specific about what information you need?';
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'prediction': return <TrendingUp className="h-4 w-4" />;
      case 'alert': return <AlertTriangle className="h-4 w-4" />;
      case 'info': return <Info className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'prediction': return 'bg-secondary text-secondary-foreground';
      case 'alert': return 'bg-alert-high text-white';
      case 'info': return 'bg-accent text-accent-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const filteredNotifications = filter === 'all' 
    ? mockAINotifications 
    : mockAINotifications.filter(notif => notif.type === filter);

  const filteredAlerts = mockAlerts.filter(alert => !alert.acknowledged);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-glass/20 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              className="hover:bg-glass/50"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="p-2 bg-gradient-to-r from-primary to-primary-glow rounded-lg">
              <Shield className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">AI Chat & Notifications</h1>
              <p className="text-sm text-muted-foreground">Real-time assistance and alerts</p>
            </div>
          </div>
          
          <Button
            variant="outline"
            size="icon"
            onClick={onLogout}
            className="border-glass-border/50 hover:bg-glass/50"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-140px)]">
          {/* Chat Panel */}
          <div className="lg:col-span-2">
            <Card className="glass-panel border-glass-border/50 h-full flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bot className="h-5 w-5 text-primary" />
                  <span>AI Assistant</span>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col">
                <ScrollArea className="flex-1 pr-4 mb-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex items-start space-x-2 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                          <div className={`p-2 rounded-full ${message.type === 'user' ? 'bg-primary' : 'bg-secondary'}`}>
                            {message.type === 'user' ? (
                              <UserIcon className="h-4 w-4 text-primary-foreground" />
                            ) : (
                              <Bot className="h-4 w-4 text-secondary-foreground" />
                            )}
                          </div>
                          <div className={`p-3 rounded-lg ${message.type === 'user' 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-glass/50 text-foreground'}`}>
                            <p className="text-sm">{message.message}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {message.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                <form onSubmit={handleSendMessage} className="flex space-x-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Ask about sensors, equipment, safety, or predictions..."
                    className="bg-glass/50 border-glass-border/50 focus:border-primary"
                  />
                  <Button type="submit" className="btn-mining">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Notifications Panel */}
          <div className="space-y-6">
            {/* AI Notifications */}
            <Card className="glass-panel border-glass-border/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Bell className="h-5 w-5 text-primary" />
                    <span>AI Notifications</span>
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setFilter(filter === 'all' ? 'prediction' : 'all')}
                    className="hover:bg-glass/50"
                  >
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent>
                <ScrollArea className="h-64">
                  <div className="space-y-3">
                    {filteredNotifications.map((notification) => (
                      <div key={notification.id} className="p-3 bg-glass/30 rounded-lg">
                        <div className="flex items-start space-x-2">
                          <Badge className={getNotificationColor(notification.type)}>
                            {getNotificationIcon(notification.type)}
                          </Badge>
                          <div className="flex-1">
                            <p className="text-sm text-foreground">{notification.message}</p>
                            <div className="flex items-center justify-between mt-2">
                              <p className="text-xs text-muted-foreground">
                                {notification.timestamp.toLocaleTimeString()}
                              </p>
                              <Badge variant="outline" className="text-xs">
                                {notification.confidence}% confidence
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Active Alerts */}
            <Card className="glass-panel border-glass-border/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-alert-high" />
                  <span>Active Alerts</span>
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <ScrollArea className="h-48">
                  <div className="space-y-3">
                    {filteredAlerts.map((alert) => (
                      <div key={alert.id} className="p-3 bg-glass/30 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <Badge className={
                                alert.severity === 'high' ? 'alert-high' :
                                alert.severity === 'medium' ? 'alert-medium' : 'alert-safe'
                              }>
                                {alert.severity.toUpperCase()}
                              </Badge>
                            </div>
                            <p className="text-sm font-medium text-foreground">{alert.title}</p>
                            <p className="text-xs text-muted-foreground">{alert.location}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {alert.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChat;