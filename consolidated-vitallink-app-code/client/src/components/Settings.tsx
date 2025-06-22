import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Download, 
  Trash2,
  Moon,
  Sun,
  Monitor,
  Smartphone,
  Mail,
  MessageSquare,
  Volume2,
  VolumeX,
  Eye,
  EyeOff
} from 'lucide-react';

interface SettingsProps {
  onClose?: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ onClose }) => {
  const { t } = useTranslation(['settings', 'common']);
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState('profile');
  
  // Settings state
  const [profile, setProfile] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+65 9123 4567',
    timezone: 'Asia/Singapore',
    language: 'en'
  });

  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    insights: true,
    goalReminders: true,
    weeklyReports: true,
    marketingEmails: false,
    soundEnabled: true,
    vibrationEnabled: true
  });

  const [privacy, setPrivacy] = useState({
    dataSharing: false,
    analyticsOptIn: true,
    profileVisibility: 'private',
    twoFactorAuth: false,
    biometricAuth: true,
    sessionTimeout: '30'
  });

  const [appearance, setAppearance] = useState({
    theme: 'system',
    fontSize: 'medium',
    animations: true,
    colorScheme: 'default'
  });

  const sections = [
    { id: 'profile', name: t('settings:profile'), icon: <User className="h-4 w-4" /> },
    { id: 'notifications', name: t('settings:notifications'), icon: <Bell className="h-4 w-4" /> },
    { id: 'privacy', name: t('settings:privacy'), icon: <Shield className="h-4 w-4" /> },
    { id: 'appearance', name: t('settings:appearance'), icon: <Palette className="h-4 w-4" /> },
    { id: 'language', name: t('settings:language'), icon: <Globe className="h-4 w-4" /> },
    { id: 'data', name: t('settings:backup'), icon: <Download className="h-4 w-4" /> }
  ];

  const handleSave = () => {
    toast({
      title: t('common:success'),
      description: t('settings:saveChanges'),
    });
    onClose?.();
  };

  const renderProfileSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">{t('settings:personalInformation')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">{'firstName'}</Label>
            <Input
              id="firstName"
              value={profile.firstName}
              onChange={(e) => setProfile({...profile, firstName: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">{'lastName'}</Label>
            <Input
              id="lastName"
              value={profile.lastName}
              onChange={(e) => setProfile({...profile, lastName: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">{'email'}</Label>
            <Input
              id="email"
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({...profile, email: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">{'phoneNumber'}</Label>
            <Input
              id="phone"
              value={profile.phone}
              onChange={(e) => setProfile({...profile, phone: e.target.value})}
            />
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">{'locationTime'}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="timezone">{'timezone'}</Label>
            <Select value={profile.timezone} onValueChange={(value) => setProfile({...profile, timezone: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Asia/Singapore">Singapore (GMT+8)</SelectItem>
                <SelectItem value="Asia/Kuala_Lumpur">Kuala Lumpur (GMT+8)</SelectItem>
                <SelectItem value="Asia/Jakarta">Jakarta (GMT+7)</SelectItem>
                <SelectItem value="Asia/Bangkok">Bangkok (GMT+7)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">{'notificationChannels'}</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center space-x-3">
              <Mail className="h-4 w-4 text-blue-500" />
              <div>
                <div className="font-medium">{'emailNotifications'}</div>
                <div className="text-sm text-muted-foreground">{'receiveUpdatesViaEmail'}</div>
              </div>
            </div>
            <Switch
              checked={notifications.email}
              onCheckedChange={(checked) => setNotifications({...notifications, email: checked})}
            />
          </div>
          
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center space-x-3">
              <Smartphone className="h-4 w-4 text-green-500" />
              <div>
                <div className="font-medium">Push Notifications</div>
                <div className="text-sm text-muted-foreground">Mobile app notifications</div>
              </div>
            </div>
            <Switch
              checked={notifications.push}
              onCheckedChange={(checked) => setNotifications({...notifications, push: checked})}
            />
          </div>
          
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center space-x-3">
              <MessageSquare className="h-4 w-4 text-purple-500" />
              <div>
                <div className="font-medium">SMS Notifications</div>
                <div className="text-sm text-muted-foreground">Text message alerts</div>
              </div>
            </div>
            <Switch
              checked={notifications.sms}
              onCheckedChange={(checked) => setNotifications({...notifications, sms: checked})}
            />
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-semibold mb-4">Notification Types</h3>
        <div className="space-y-3">
          {[
            { key: 'insights', label: 'Health Insights', desc: 'AI-generated health insights and recommendations' },
            { key: 'goalReminders', label: 'Goal Reminders', desc: 'Reminders to help you reach your health goals' },
            { key: 'weeklyReports', label: 'Weekly Reports', desc: 'Weekly summary of your health progress' },
            { key: 'marketingEmails', label: 'Marketing Updates', desc: 'Product updates and promotional content' }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50">
              <div>
                <div className="font-medium">{item.label}</div>
                <div className="text-sm text-muted-foreground">{item.desc}</div>
              </div>
              <Switch
                checked={notifications[item.key as keyof typeof notifications] as boolean}
                onCheckedChange={(checked) => setNotifications({...notifications, [item.key]: checked})}
              />
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-semibold mb-4">Sound & Vibration</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50">
            <div className="flex items-center space-x-3">
              {notifications.soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              <span className="font-medium">Notification Sounds</span>
            </div>
            <Switch
              checked={notifications.soundEnabled}
              onCheckedChange={(checked) => setNotifications({...notifications, soundEnabled: checked})}
            />
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50">
            <div className="flex items-center space-x-3">
              <Smartphone className="h-4 w-4" />
              <span className="font-medium">Vibration</span>
            </div>
            <Switch
              checked={notifications.vibrationEnabled}
              onCheckedChange={(checked) => setNotifications({...notifications, vibrationEnabled: checked})}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Data Privacy</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <div className="font-medium">Anonymous Data Sharing</div>
              <div className="text-sm text-muted-foreground">Help improve VitalLink by sharing anonymized data</div>
            </div>
            <Switch
              checked={privacy.dataSharing}
              onCheckedChange={(checked) => setPrivacy({...privacy, dataSharing: checked})}
            />
          </div>
          
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <div className="font-medium">Analytics Opt-in</div>
              <div className="text-sm text-muted-foreground">Allow usage analytics to improve app experience</div>
            </div>
            <Switch
              checked={privacy.analyticsOptIn}
              onCheckedChange={(checked) => setPrivacy({...privacy, analyticsOptIn: checked})}
            />
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-semibold mb-4">Security Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center space-x-3">
              <Shield className="h-4 w-4 text-blue-500" />
              <div>
                <div className="font-medium">Two-Factor Authentication</div>
                <div className="text-sm text-muted-foreground">Add extra security to your account</div>
              </div>
              {privacy.twoFactorAuth && <Badge className="bg-green-100 text-green-800">Enabled</Badge>}
            </div>
            <Switch
              checked={privacy.twoFactorAuth}
              onCheckedChange={(checked) => setPrivacy({...privacy, twoFactorAuth: checked})}
            />
          </div>
          
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center space-x-3">
              {privacy.biometricAuth ? <Eye className="h-4 w-4 text-green-500" /> : <EyeOff className="h-4 w-4 text-gray-500" />}
              <div>
                <div className="font-medium">Biometric Authentication</div>
                <div className="text-sm text-muted-foreground">Use Face ID or Touch ID to unlock</div>
              </div>
            </div>
            <Switch
              checked={privacy.biometricAuth}
              onCheckedChange={(checked) => setPrivacy({...privacy, biometricAuth: checked})}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
            <Select value={privacy.sessionTimeout} onValueChange={(value) => setPrivacy({...privacy, sessionTimeout: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
                <SelectItem value="240">4 hours</SelectItem>
                <SelectItem value="never">Never</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Theme</h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: 'light', label: 'Light', icon: <Sun className="h-4 w-4" /> },
            { value: 'dark', label: 'Dark', icon: <Moon className="h-4 w-4" /> },
            { value: 'system', label: 'System', icon: <Monitor className="h-4 w-4" /> }
          ].map((theme) => (
            <button
              key={theme.value}
              onClick={() => setAppearance({...appearance, theme: theme.value})}
              className={`p-4 border rounded-lg flex flex-col items-center space-y-2 transition-colors ${
                appearance.theme === theme.value ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
              }`}
            >
              {theme.icon}
              <span className="text-sm font-medium">{theme.label}</span>
            </button>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-semibold mb-4">Display</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Font Size</Label>
            <Select value={appearance.fontSize} onValueChange={(value) => setAppearance({...appearance, fontSize: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Animations</div>
              <div className="text-sm text-muted-foreground">Enable smooth transitions and animations</div>
            </div>
            <Switch
              checked={appearance.animations}
              onCheckedChange={(checked) => setAppearance({...appearance, animations: checked})}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderDataSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Data Export</h3>
        <p className="text-muted-foreground mb-4">Download your personal data in compliance with PDPA regulations</p>
        <Button variant="outline" className="w-full sm:w-auto">
          <Download className="h-4 w-4 mr-2" />
          Request Data Export
        </Button>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-semibold mb-4 text-red-600">Danger Zone</h3>
        <div className="border border-red-200 rounded-lg p-4 bg-red-50 dark:bg-red-950/20">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-red-800 dark:text-red-200">Delete Account</h4>
              <p className="text-sm text-red-600 dark:text-red-400">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
            </div>
            <Button variant="destructive" size="sm">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return renderProfileSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'privacy':
        return renderPrivacySettings();
      case 'appearance':
        return renderAppearanceSettings();
      case 'data':
        return renderDataSettings();
      default:
        return renderProfileSettings();
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('settings:accountSettings')}</h1>
        <p className="text-muted-foreground">{t('settings:manageAccountPreferences')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <Card className="lg:col-span-1">
          <CardContent className="p-0">
            <nav className="space-y-1 p-4">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeSection === section.id
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {section.icon}
                  <span className="font-medium">{section.name}</span>
                </button>
              ))}
            </nav>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Card className="lg:col-span-3">
          <CardContent className="p-6">
            {renderContent()}
            
            <div className="flex justify-end space-x-3 mt-8 pt-6 border-t">
              <Button variant="outline" onClick={onClose}>
                {t('common:cancel')}
              </Button>
              <Button onClick={handleSave}>
                {t('common:save')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};