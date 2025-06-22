import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
            <Label htmlFor="firstName">{t('settings:firstName')}</Label>
            <Input
              id="firstName"
              value={profile.firstName}
              onChange={(e) => setProfile({...profile, firstName: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">{t('settings:lastName')}</Label>
            <Input
              id="lastName"
              value={profile.lastName}
              onChange={(e) => setProfile({...profile, lastName: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">{t('settings:email')}</Label>
            <Input
              id="email"
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({...profile, email: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">{t('settings:phoneNumber')}</Label>
            <Input
              id="phone"
              value={profile.phone}
              onChange={(e) => setProfile({...profile, phone: e.target.value})}
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">{t('settings:locationTime')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="timezone">{t('settings:timezone')}</Label>
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
        <h3 className="text-lg font-semibold mb-4">{t('settings:notificationChannels')}</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center space-x-3">
              <Mail className="h-4 w-4 text-blue-500" />
              <div>
                <div className="font-medium">{t('settings:emailNotifications')}</div>
                <div className="text-sm text-muted-foreground">{t('settings:receiveUpdatesViaEmail')}</div>
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
                <div className="font-medium">{t('settings:pushNotifications')}</div>
                <div className="text-sm text-muted-foreground">{t('settings:mobileAppNotifications')}</div>
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
                <div className="font-medium">{t('settings:smsNotifications')}</div>
                <div className="text-sm text-muted-foreground">{t('settings:textMessageAlerts')}</div>
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
        <h3 className="text-lg font-semibold mb-4">{t('settings:notificationTypes')}</h3>
        <div className="space-y-3">
          {[
            { key: 'insights', label: t('settings:healthInsights'), desc: t('settings:aiGeneratedInsights') },
            { key: 'goalReminders', label: t('settings:goalReminders'), desc: t('settings:remindersToReachGoals') },
            { key: 'weeklyReports', label: t('settings:weeklyReports'), desc: t('settings:weeklySummaryProgress') },
            { key: 'marketingEmails', label: t('settings:marketingUpdates'), desc: t('settings:productUpdatesContent') }
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
        <h3 className="text-lg font-semibold mb-4">{t('settings:soundVibration')}</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50">
            <div className="flex items-center space-x-3">
              {notifications.soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              <span className="font-medium">{t('settings:notificationSounds')}</span>
            </div>
            <Switch
              checked={notifications.soundEnabled}
              onCheckedChange={(checked) => setNotifications({...notifications, soundEnabled: checked})}
            />
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50">
            <div className="flex items-center space-x-3">
              <Smartphone className="h-4 w-4" />
              <span className="font-medium">{t('settings:vibration')}</span>
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
        <h3 className="text-lg font-semibold mb-4">{t('settings:dataPrivacy')}</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <div className="font-medium">{t('settings:anonymousDataSharing')}</div>
              <div className="text-sm text-muted-foreground">{t('settings:helpImproveVitalLink')}</div>
            </div>
            <Switch
              checked={privacy.dataSharing}
              onCheckedChange={(checked) => setPrivacy({...privacy, dataSharing: checked})}
            />
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <div className="font-medium">{t('settings:analyticsOptIn')}</div>
              <div className="text-sm text-muted-foreground">{t('settings:allowUsageAnalytics')}</div>
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
        <h3 className="text-lg font-semibold mb-4">{t('settings:securitySettings')}</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center space-x-3">
              <Shield className="h-4 w-4 text-blue-500" />
              <div>
                <div className="font-medium">{t('settings:twoFactorAuth')}</div>
                <div className="text-sm text-muted-foreground">{t('settings:addExtraSecurity')}</div>
              </div>
              {privacy.twoFactorAuth && <Badge className="bg-green-100 text-green-800">{t('settings:enabled')}</Badge>}
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
                <div className="font-medium">{t('settings:biometricAuth')}</div>
                <div className="text-sm text-muted-foreground">{t('settings:useFaceIdTouchId')}</div>
              </div>
            </div>
            <Switch
              checked={privacy.biometricAuth}
              onCheckedChange={(checked) => setPrivacy({...privacy, biometricAuth: checked})}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sessionTimeout">{t('settings:sessionTimeoutMinutes')}</Label>
            <Select value={privacy.sessionTimeout} onValueChange={(value) => setPrivacy({...privacy, sessionTimeout: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
                <SelectItem value="240">4 hours</SelectItem>
                <SelectItem value="never">{t('settings:never')}</SelectItem>
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
        <h3 className="text-lg font-semibold mb-4">{t('settings:theme')}</h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: 'light', label: t('settings:light'), icon: <Sun className="h-4 w-4" /> },
            { value: 'dark', label: t('settings:dark'), icon: <Moon className="h-4 w-4" /> },
            { value: 'system', label: t('settings:system'), icon: <Monitor className="h-4 w-4" /> }
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
        <h3 className="text-lg font-semibold mb-4">{t('settings:display')}</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>{t('settings:fontSize')}</Label>
            <Select value={appearance.fontSize} onValueChange={(value) => setAppearance({...appearance, fontSize: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">{t('settings:small')}</SelectItem>
                <SelectItem value="medium">{t('settings:medium')}</SelectItem>
                <SelectItem value="large">{t('settings:large')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">{t('settings:animations')}</div>
              <div className="text-sm text-muted-foreground">{t('settings:enableSmoothTransitions')}</div>
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
        <h3 className="text-lg font-semibold mb-4">{t('settings:dataExport')}</h3>
        <p className="text-muted-foreground mb-4">{t('settings:downloadPersonalData')}</p>
        <Button variant="outline" className="w-full sm:w-auto">
          <Download className="h-4 w-4 mr-2" />
          {t('settings:requestDataExport')}
        </Button>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-semibold mb-4 text-red-600">{t('settings:dangerZone')}</h3>
        <div className="border border-red-200 rounded-lg p-4 bg-red-50 dark:bg-red-950/20">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-red-800 dark:text-red-200">{t('settings:deleteAccount')}</h4>
              <p className="text-sm text-red-600 dark:text-red-400">
                {t('settings:permanentlyDeleteAccount')}
              </p>
            </div>
            <Button variant="destructive" size="sm">
              <Trash2 className="h-4 w-4 mr-2" />
              {t('settings:deleteAccount')}
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