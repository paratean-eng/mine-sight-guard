import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, MonitoringMode, SensorData } from '@/types';
import { mockSensorData, mockVideoFeeds, generateRandomSensorValue } from '@/data/mockData';
import { 
  ArrowLeft, 
  LogOut, 
  Shield,
  Eye,
  Brain,
  History,
  Settings as SettingsIcon,
  Play,
  Pause,
  Maximize,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';

interface MonitoringDashboardProps {
  user: User;
  onLogout: () => void;
}

const monitoringModes: MonitoringMode[] = [
  { id: 'live', name: 'Live Monitoring', description: 'Real-time feeds and sensors', icon: 'Eye' },
  { id: 'predictions', name: 'AI Predictions', description: 'ML risk predictions', icon: 'Brain' },
  { id: 'historical', name: 'Historical Analysis', description: 'Past data and trends', icon: 'History' },
  { id: 'manual', name: 'Manual Controls', description: 'Override and actions', icon: 'SettingsIcon' }
];

const MonitoringDashboard = ({ user, onLogout }: MonitoringDashboardProps) => {
  const navigate = useNavigate();
  const [activeMode, setActiveMode] = useState<MonitoringMode['id']>('live');
  const [sensorData, setSensorData] = useState<SensorData[]>(mockSensorData);
  const [isLiveUpdating, setIsLiveUpdating] = useState(true);

  // Simulate real-time sensor updates
  useEffect(() => {
    if (activeMode === 'live' && isLiveUpdating) {
      const interval = setInterval(() => {
        setSensorData(prev => prev.map(generateRandomSensorValue));
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [activeMode, isLiveUpdating]);

  const handleModeSwitch = (modeId: MonitoringMode['id']) => {
    setActiveMode(modeId);
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    const keyToMode: { [key: string]: MonitoringMode['id'] } = {
      '1': 'live',
      '2': 'predictions',
      '3': 'historical',
      '4': 'manual'
    };
    
    if (keyToMode[e.key]) {
      handleModeSwitch(keyToMode[e.key]);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'alert-high';
      case 'warning': return 'alert-medium';
      case 'normal': return 'alert-safe';
      default: return 'muted';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-alert-medium" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-alert-safe" />;
      default: return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const renderModeContent = () => {
    switch (activeMode) {
      case 'live':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Live Monitoring</h2>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsLiveUpdating(!isLiveUpdating)}
                  className="border-glass-border/50 hover:bg-glass/50"
                >
                  {isLiveUpdating ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                  {isLiveUpdating ? 'Pause' : 'Resume'}
                </Button>
                <div className={`px-2 py-1 rounded-full text-xs ${isLiveUpdating ? 'bg-alert-safe text-white' : 'bg-alert-medium text-background'}`}>
                  {isLiveUpdating ? 'LIVE' : 'PAUSED'}
                </div>
              </div>
            </div>

            {/* Video Feeds */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {mockVideoFeeds.map((feed) => (
                <Card key={feed.id} className="glass-panel border-glass-border/50">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm">{feed.name}</CardTitle>
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          feed.status === 'online' ? 'bg-alert-safe pulse-mining' :
                          feed.status === 'offline' ? 'bg-alert-high' : 'bg-alert-medium'
                        }`} />
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <Maximize className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video bg-glass/30 rounded-lg flex items-center justify-center mb-2">
                      <div className="text-center">
                        <Eye className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-xs text-muted-foreground">Camera Feed</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">{feed.location}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Live Sensors */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {sensorData.map((sensor) => (
                <Card key={sensor.id} className="glass-panel border-glass-border/50">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className={getStatusColor(sensor.status)}>
                        {sensor.status.toUpperCase()}
                      </Badge>
                      {getTrendIcon(sensor.trend)}
                    </div>
                    <div className="text-2xl font-bold text-foreground">
                      {sensor.value} {sensor.unit}
                    </div>
                    <p className="text-sm font-medium text-foreground">{sensor.name}</p>
                    <p className="text-xs text-muted-foreground">{sensor.location}</p>
                    {isLiveUpdating && (
                      <div className="w-full h-1 bg-glass/30 rounded-full mt-2 overflow-hidden">
                        <div className="h-full bg-primary animate-pulse" style={{ width: `${Math.random() * 100}%` }} />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'predictions':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">AI Predictions</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="glass-panel border-glass-border/50">
                <CardHeader>
                  <CardTitle className="text-primary">Equipment Failure Risk</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-alert-high-bg rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Conveyor CB-15</span>
                        <Badge className="alert-high">87% Risk</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Predicted failure in 4-6 hours</p>
                    </div>
                    <div className="p-3 bg-alert-medium-bg rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Pump Station P-03</span>
                        <Badge className="alert-medium">42% Risk</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Monitor vibration patterns</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-panel border-glass-border/50">
                <CardHeader>
                  <CardTitle className="text-primary">Environmental Forecasts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-alert-safe-bg rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Air Quality</span>
                        <Badge className="alert-safe">Stable</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Next 24 hours</p>
                    </div>
                    <div className="p-3 bg-alert-medium-bg rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Weather Impact</span>
                        <Badge className="alert-medium">Rain Expected</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">2 hours - check drainage</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-panel border-glass-border/50">
                <CardHeader>
                  <CardTitle className="text-primary">Production Forecast</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-alert-safe-bg rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Daily Target</span>
                        <Badge className="alert-safe">+12% Over</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Exceeding quota</p>
                    </div>
                    <div className="p-3 bg-glass/30 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Weekly Outlook</span>
                        <Badge variant="outline">On Track</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">95% confidence</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'historical':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Historical Analysis</h2>
            
            <Card className="glass-panel border-glass-border/50">
              <CardHeader>
                <CardTitle>Sensor Data Trends (Last 30 Days)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-glass/30 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Historical charts and analytics would be displayed here</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="glass-panel border-glass-border/50">
                <CardHeader>
                  <CardTitle>Anomaly Detection</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-glass/30 rounded-lg">
                      <p className="text-sm font-medium">Pattern Analysis Complete</p>
                      <p className="text-xs text-muted-foreground">3 anomalies detected in past week</p>
                    </div>
                    <div className="p-3 bg-glass/30 rounded-lg">
                      <p className="text-sm font-medium">Correlation Analysis</p>
                      <p className="text-xs text-muted-foreground">Temperature vs. Equipment performance</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-panel border-glass-border/50">
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-glass/30 rounded-lg">
                      <p className="text-sm font-medium">Uptime: 98.2%</p>
                      <p className="text-xs text-muted-foreground">Above target (95%)</p>
                    </div>
                    <div className="p-3 bg-glass/30 rounded-lg">
                      <p className="text-sm font-medium">Efficiency: 94.7%</p>
                      <p className="text-xs text-muted-foreground">Consistent performance</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'manual':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Manual Controls</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="glass-panel border-glass-border/50">
                <CardHeader>
                  <CardTitle>Emergency Controls</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button className="w-full btn-mining">
                      Emergency Shutdown
                    </Button>
                    <Button className="w-full btn-secondary-mining">
                      Trigger Evacuation Alert
                    </Button>
                    <Button variant="outline" className="w-full border-glass-border/50 hover:bg-glass/50">
                      Reset All Alarms
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-panel border-glass-border/50">
                <CardHeader>
                  <CardTitle>System Overrides</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button variant="outline" className="w-full border-glass-border/50 hover:bg-glass/50">
                      Override Conveyor CB-15
                    </Button>
                    <Button variant="outline" className="w-full border-glass-border/50 hover:bg-glass/50">
                      Manual Ventilation Control
                    </Button>
                    <Button variant="outline" className="w-full border-glass-border/50 hover:bg-glass/50">
                      Disable AI Predictions
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-panel border-glass-border/50 md:col-span-2">
                <CardHeader>
                  <CardTitle>Operator Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <textarea 
                    className="w-full h-32 p-3 bg-glass/30 border border-glass-border/50 rounded-lg text-foreground placeholder-muted-foreground resize-none focus:outline-none focus:border-primary"
                    placeholder="Add operational notes, maintenance requests, or incident reports..."
                  />
                  <Button className="mt-3 btn-mining">
                    Save Notes
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

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
              <h1 className="text-xl font-bold text-foreground">Monitoring Dashboard</h1>
              <p className="text-sm text-muted-foreground">Multi-mode operations center</p>
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

      {/* Mode Switch Bar */}
      <div className="sticky top-0 z-10 bg-glass/40 backdrop-blur-md border-b border-glass-border/30">
        <div className="container mx-auto px-6 py-4">
          <div className="flex space-x-2 overflow-x-auto">
            {monitoringModes.map((mode, index) => (
              <Button
                key={mode.id}
                variant={activeMode === mode.id ? "default" : "outline"}
                onClick={() => handleModeSwitch(mode.id)}
                className={`flex-shrink-0 transition-mining ${
                  activeMode === mode.id 
                    ? 'btn-mining' 
                    : 'border-glass-border/50 hover:bg-glass/50'
                }`}
              >
                <span className="mr-2">{index + 1}</span>
                {mode.name}
              </Button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Use keyboard shortcuts 1-4 to switch modes quickly
          </p>
        </div>
      </div>

      {/* Mode Content */}
      <div className="container mx-auto px-6 py-6">
        <div className="mode-transition">
          {renderModeContent()}
        </div>
      </div>
    </div>
  );
};

export default MonitoringDashboard;