import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User } from '@/types';
import {
  mockAlerts,
  mockSensorData,
  mockAINotifications,
} from '@/data/mockData';
import {
  MessageSquare,
  Monitor,
  Settings,
  LogOut,
  AlertTriangle,
  TrendingUp,
  Activity,
  Bell,
  Shield,
} from 'lucide-react';

interface WelcomePageProps {
  user: User;
  onLogout: () => void;
}

const WelcomePage = ({ user, onLogout }: WelcomePageProps) => {
  const navigate = useNavigate();

  const highAlerts = mockAlerts.filter((alert) => alert.severity === 'high').length;
  const mediumAlerts = mockAlerts.filter((alert) => alert.severity === 'medium').length;

  const activeSensors = mockSensorData.filter(
    (sensor) => sensor.status !== 'critical'
  ).length;
  const totalSensors = mockSensorData.length;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'alert-high';
      case 'medium':
        return 'alert-medium';
      case 'safe':
        return 'alert-safe';
      default:
        return 'muted';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-glass/20 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-gradient-to-r from-primary to-primary-glow rounded-lg">
              <Shield className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Mine Monitoring AI</h1>
              <p className="text-sm text-muted-foreground">Operations Dashboard</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="font-medium text-foreground">{user.name}</p>
              <p className="text-sm text-muted-foreground capitalize">{user.role}</p>
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
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-foreground mb-2">
            Hello, {user.name.split(' ')[0]}! 👋
          </h2>
          <p className="text-xl text-muted-foreground mb-6">
            Welcome back to your mining operations dashboard
          </p>

          {/* Quick Actions - moved here */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card
              className="glass-panel border-glass-border/50 cursor-pointer hover:shadow-mining transition-mining"
              onClick={() => navigate('/ai-chat')}
            >
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-secondary to-secondary-dark rounded-lg">
                    <MessageSquare className="h-6 w-6 text-secondary-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-foreground">AI Chat & Notifications</CardTitle>
                    <CardDescription>Real-time AI assistant and alerts</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card
              className="glass-panel border-glass-border/50 cursor-pointer hover:shadow-mining transition-mining"
              onClick={() => navigate('/monitoring')}
            >
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-primary to-primary-glow rounded-lg">
                    <Monitor className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-foreground">Monitoring Dashboard</CardTitle>
                    <CardDescription>Live feeds, predictions & controls</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card
              className="glass-panel border-glass-border/50 cursor-pointer hover:shadow-mining transition-mining"
              onClick={() => navigate('/settings')}
            >
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-accent to-accent rounded-lg">
                    <Settings className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-foreground">Settings</CardTitle>
                    <CardDescription>User management & preferences</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* Status Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="glass-panel border-glass-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2" /> Active Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <div className="text-3xl font-bold text-foreground">
                  {highAlerts + mediumAlerts}
                </div>
                <div className="flex space-x-1">
                  {highAlerts > 0 && (
                    <Badge className="alert-high text-xs">{highAlerts} High</Badge>
                  )}
                  {mediumAlerts > 0 && (
                    <Badge className="alert-medium text-xs">{mediumAlerts} Med</Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-panel border-glass-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <Activity className="h-4 w-4 mr-2" /> Sensor Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground mb-1">
                {activeSensors}/{totalSensors}
              </div>
              <p className="text-sm text-muted-foreground">Active sensors</p>
            </CardContent>
          </Card>

          <Card className="glass-panel border-glass-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <Bell className="h-4 w-4 mr-2" /> AI Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground mb-1">
                {mockAINotifications.length}
              </div>
              <p className="text-sm text-muted-foreground">New predictions</p>
            </CardContent>
          </Card>

          <Card className="glass-panel border-glass-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <TrendingUp className="h-4 w-4 mr-2" /> System Health
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-alert-safe mb-1">98%</div>
              <p className="text-sm text-muted-foreground">Operational</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Alerts */}
        <Card className="glass-panel border-glass-border/50 mb-8">
          <CardHeader>
            <CardTitle className="text-foreground">Recent Alerts</CardTitle>
            <CardDescription>Latest safety and operational notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockAlerts.slice(0, 3).map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between p-3 bg-glass/30 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <Badge className={getSeverityColor(alert.severity)}>
                      {alert.severity.toUpperCase()}
                    </Badge>
                    <div>
                      <p className="font-medium text-foreground">{alert.title}</p>
                      <p className="text-sm text-muted-foreground">{alert.location}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      {new Date(alert.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WelcomePage;
