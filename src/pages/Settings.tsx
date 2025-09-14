import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User } from '@/types';
import { 
  ArrowLeft, 
  LogOut, 
  Shield,
  Users,
  Bell,
  Database,
  Palette,
  Plus,
  Trash2,
  Eye,
  Save
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SettingsProps {
  user: User;
  onLogout: () => void;
}

const Settings = ({ user, onLogout }: SettingsProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('users');

  // Mock users data
  const [users, setUsers] = useState([
    { id: '1', name: 'Sarah Mitchell', email: 'sarah.mitchell@minetech.com', role: 'operator', status: 'active' },
    { id: '2', name: 'Mike Rodriguez', email: 'mike.rodriguez@minetech.com', role: 'supervisor', status: 'active' },
    { id: '3', name: 'Emma Chen', email: 'emma.chen@minetech.com', role: 'admin', status: 'active' },
    { id: '4', name: 'James Wilson', email: 'james.wilson@minetech.com', role: 'operator', status: 'inactive' }
  ]);

  // AI Settings
  const [aiSettings, setAiSettings] = useState({
    notificationFrequency: 'medium',
    predictionThreshold: 75,
    autoAcknowledge: false,
    enableWeatherAlerts: true,
    maintenancePredictions: true
  });

  // Data Sources
  const [dataSources, setDataSources] = useState([
    { id: '1', name: 'CCTV System Alpha', type: 'camera', status: 'connected', endpoint: '192.168.1.100' },
    { id: '2', name: 'Sensor Network Beta', type: 'sensor', status: 'connected', endpoint: '192.168.1.101' },
    { id: '3', name: 'Weather Station', type: 'api', status: 'disconnected', endpoint: 'api.weather.com' },
    { id: '4', name: 'Equipment Monitoring', type: 'modbus', status: 'connected', endpoint: '192.168.1.102' }
  ]);

  const handleSaveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  const handleAddUser = () => {
    // Mock add user functionality
    toast({
      title: "User invited",
      description: "An invitation email has been sent to the new user.",
    });
  };

  const handleRemoveUser = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId));
    toast({
      title: "User removed",
      description: "The user has been removed from the system.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'connected':
        return 'alert-safe';
      case 'inactive':
      case 'disconnected':
        return 'alert-high';
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
              <h1 className="text-xl font-bold text-foreground">Settings</h1>
              <p className="text-sm text-muted-foreground">System configuration and preferences</p>
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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-glass/30">
            <TabsTrigger value="users" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Users className="h-4 w-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="ai" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Bell className="h-4 w-4 mr-2" />
              AI Settings
            </TabsTrigger>
            <TabsTrigger value="data" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Database className="h-4 w-4 mr-2" />
              Data Sources
            </TabsTrigger>
            <TabsTrigger value="appearance" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Palette className="h-4 w-4 mr-2" />
              Appearance
            </TabsTrigger>
          </TabsList>

          {/* User Management */}
          <TabsContent value="users" className="space-y-6">
            <Card className="glass-panel border-glass-border/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>Manage operators, supervisors, and administrators</CardDescription>
                  </div>
                  <Button onClick={handleAddUser} className="btn-mining">
                    <Plus className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 bg-glass/30 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                          <span className="text-primary-foreground font-medium text-sm">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline" className="capitalize">{user.role}</Badge>
                        <Badge className={getStatusColor(user.status)}>
                          {user.status}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveUser(user.id)}
                          className="hover:bg-glass/50 text-alert-high hover:text-alert-high"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Settings */}
          <TabsContent value="ai" className="space-y-6">
            <Card className="glass-panel border-glass-border/50">
              <CardHeader>
                <CardTitle>AI Preferences</CardTitle>
                <CardDescription>Configure AI behavior and notification settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="notification-frequency">Notification Frequency</Label>
                    <Select 
                      value={aiSettings.notificationFrequency} 
                      onValueChange={(value) => setAiSettings({...aiSettings, notificationFrequency: value})}
                    >
                      <SelectTrigger className="bg-glass/50 border-glass-border/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low (Critical only)</SelectItem>
                        <SelectItem value="medium">Medium (Important alerts)</SelectItem>
                        <SelectItem value="high">High (All notifications)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="prediction-threshold">Prediction Threshold (%)</Label>
                    <Input
                      id="prediction-threshold"
                      type="number"
                      value={aiSettings.predictionThreshold}
                      onChange={(e) => setAiSettings({...aiSettings, predictionThreshold: parseInt(e.target.value)})}
                      className="bg-glass/50 border-glass-border/50"
                      min="50"
                      max="100"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="auto-acknowledge">Auto-acknowledge low priority alerts</Label>
                      <p className="text-sm text-muted-foreground">Automatically acknowledge alerts below threshold</p>
                    </div>
                    <Switch
                      id="auto-acknowledge"
                      checked={aiSettings.autoAcknowledge}
                      onCheckedChange={(checked) => setAiSettings({...aiSettings, autoAcknowledge: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="weather-alerts">Weather alerts</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications about weather conditions</p>
                    </div>
                    <Switch
                      id="weather-alerts"
                      checked={aiSettings.enableWeatherAlerts}
                      onCheckedChange={(checked) => setAiSettings({...aiSettings, enableWeatherAlerts: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="maintenance-predictions">Maintenance predictions</Label>
                      <p className="text-sm text-muted-foreground">Enable AI-powered maintenance forecasting</p>
                    </div>
                    <Switch
                      id="maintenance-predictions"
                      checked={aiSettings.maintenancePredictions}
                      onCheckedChange={(checked) => setAiSettings({...aiSettings, maintenancePredictions: checked})}
                    />
                  </div>
                </div>

                <Button onClick={handleSaveSettings} className="btn-mining">
                  <Save className="h-4 w-4 mr-2" />
                  Save AI Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Sources */}
          <TabsContent value="data" className="space-y-6">
            <Card className="glass-panel border-glass-border/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Data Sources</CardTitle>
                    <CardDescription>Manage CCTV, sensors, and API connections</CardDescription>
                  </div>
                  <Button className="btn-mining">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Source
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dataSources.map((source) => (
                    <div key={source.id} className="flex items-center justify-between p-4 bg-glass/30 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-glass/50 rounded-lg">
                          {source.type === 'camera' && <Eye className="h-5 w-5 text-primary" />}
                          {source.type === 'sensor' && <Database className="h-5 w-5 text-secondary" />}
                          {source.type === 'api' && <Database className="h-5 w-5 text-accent" />}
                          {source.type === 'modbus' && <Database className="h-5 w-5 text-primary-glow" />}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{source.name}</p>
                          <p className="text-sm text-muted-foreground">{source.endpoint}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline" className="capitalize">{source.type}</Badge>
                        <Badge className={getStatusColor(source.status)}>
                          {source.status}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:bg-glass/50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance */}
          <TabsContent value="appearance" className="space-y-6">
            <Card className="glass-panel border-glass-border/50">
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>Customize the interface appearance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="dark-mode">Dark Mode</Label>
                      <p className="text-sm text-muted-foreground">Toggle between light and dark themes</p>
                    </div>
                    <Switch id="dark-mode" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="animations">Enable Animations</Label>
                      <p className="text-sm text-muted-foreground">Enable smooth transitions and effects</p>
                    </div>
                    <Switch id="animations" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="compact-mode">Compact Mode</Label>
                      <p className="text-sm text-muted-foreground">Reduce spacing for more content on screen</p>
                    </div>
                    <Switch id="compact-mode" />
                  </div>
                </div>

                <Button onClick={handleSaveSettings} className="btn-mining">
                  <Save className="h-4 w-4 mr-2" />
                  Save Appearance Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;