import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  Lock, 
  Key, 
  Eye, 
  EyeOff, 
  Globe, 
  MapPin, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Activity,
  Download,
  Trash2,
  UserX,
  Settings,
  Fingerprint,
  Smartphone
} from 'lucide-react';

interface SecurityAuditLog {
  id: string;
  timestamp: string;
  action: string;
  ipAddress: string;
  location: string;
  device: string;
  status: 'success' | 'failed' | 'suspicious';
  details: string;
}

interface DataLocation {
  region: string;
  country: string;
  description: string;
  active: boolean;
  compliance: string[];
}

interface EncryptionStatus {
  inTransit: boolean;
  atRest: boolean;
  endToEnd: boolean;
  keyRotation: string;
  algorithm: string;
}

export const EnhancedSecurityFeatures: React.FC = () => {
  const [auditLogs, setAuditLogs] = useState<SecurityAuditLog[]>([
    {
      id: '1',
      timestamp: '2024-05-23 10:15:00',
      action: 'Login',
      ipAddress: '192.168.1.100',
      location: 'Singapore, SG',
      device: 'iPhone 15 Pro',
      status: 'success',
      details: 'Successful biometric authentication'
    },
    {
      id: '2',
      timestamp: '2024-05-23 09:30:00',
      action: 'Data Export',
      ipAddress: '192.168.1.100',
      location: 'Singapore, SG',
      device: 'MacBook Pro',
      status: 'success',
      details: 'PDF health report exported'
    },
    {
      id: '3',
      timestamp: '2024-05-22 22:45:00',
      action: 'Failed Login',
      ipAddress: '203.0.113.5',
      location: 'Unknown',
      device: 'Unknown Browser',
      status: 'failed',
      details: 'Multiple failed password attempts'
    }
  ]);

  const [encryptionStatus] = useState<EncryptionStatus>({
    inTransit: true,
    atRest: true,
    endToEnd: true,
    keyRotation: 'Every 90 days',
    algorithm: 'AES-256-GCM'
  });

  const [dataLocations] = useState<DataLocation[]>([
    {
      region: 'Singapore',
      country: 'SG',
      description: 'Primary data center in Singapore',
      active: true,
      compliance: ['PDPA', 'ISO 27001', 'SOC 2']
    },
    {
      region: 'European Union',
      country: 'DE',
      description: 'GDPR-compliant EU data center',
      active: false,
      compliance: ['GDPR', 'ISO 27001', 'SOC 2']
    },
    {
      region: 'United States',
      country: 'US',
      description: 'HIPAA-compliant US data center',
      active: false,
      compliance: ['HIPAA', 'SOC 2', 'FedRAMP']
    }
  ]);

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    biometricAuth: true,
    sessionTimeout: 30,
    ipWhitelisting: false,
    deviceTrust: true,
    anonymousAnalytics: false,
    dataRetention: 365,
    autoLogout: true
  });

  const [zeroKnowledgeEnabled, setZeroKnowledgeEnabled] = useState(true);
  const [dataMinimization, setDataMinimization] = useState(true);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'suspicious': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const exportSecurityReport = async () => {
    // Simulate export
    console.log('Exporting security audit report...');
  };

  const revokeAllSessions = async () => {
    // Simulate session revocation
    console.log('Revoking all sessions...');
  };

  const deleteAllData = async () => {
    // Simulate data deletion
    console.log('Initiating secure data deletion...');
  };

  return (
    <div className="space-y-6">
      <Card className="border-green-200 bg-green-50/30 dark:bg-green-950/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
            <Shield className="h-5 w-5" />
            Security Status: Excellent
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">100%</div>
              <div className="text-sm text-muted-foreground">Encrypted</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">0</div>
              <div className="text-sm text-muted-foreground">Breaches</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">A+</div>
              <div className="text-sm text-muted-foreground">Security Grade</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="encryption" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="encryption">Encryption</TabsTrigger>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
          <TabsTrigger value="location">Data Location</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
        </TabsList>

        {/* End-to-End Encryption */}
        <TabsContent value="encryption">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                End-to-End Encryption
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    Your health data is protected with military-grade encryption. Even VitalLink cannot access your raw data.
                  </AlertDescription>
                </Alert>

                <div className="grid gap-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Data in Transit</h4>
                      <p className="text-sm text-muted-foreground">TLS 1.3 encryption for all communications</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-sm font-medium">Active</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Data at Rest</h4>
                      <p className="text-sm text-muted-foreground">{encryptionStatus.algorithm} encryption for stored data</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-sm font-medium">Active</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Zero-Knowledge Architecture</h4>
                      <p className="text-sm text-muted-foreground">Client-side encryption ensures complete privacy</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch 
                        checked={zeroKnowledgeEnabled} 
                        onCheckedChange={setZeroKnowledgeEnabled}
                      />
                      <span className="text-sm font-medium">
                        {zeroKnowledgeEnabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Key Rotation</h4>
                      <p className="text-sm text-muted-foreground">Automatic encryption key updates</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium">{encryptionStatus.keyRotation}</span>
                      <p className="text-xs text-muted-foreground">Next rotation in 45 days</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Audit Logs */}
        <TabsContent value="audit">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Security Audit Logs
                </CardTitle>
                <Button variant="outline" onClick={exportSecurityReport}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {auditLogs.map(log => (
                  <div key={log.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(log.status)}
                      <div>
                        <h4 className="font-medium">{log.action}</h4>
                        <p className="text-sm text-muted-foreground">{log.details}</p>
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <div className="font-medium">{log.timestamp}</div>
                      <div className="text-muted-foreground">
                        {log.ipAddress} • {log.location}
                      </div>
                      <div className="text-muted-foreground">{log.device}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Location Controls */}
        <TabsContent value="location">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Data Residency Controls
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <MapPin className="h-4 w-4" />
                  <AlertDescription>
                    Choose where your health data is stored geographically for compliance and performance.
                  </AlertDescription>
                </Alert>

                {dataLocations.map((location, index) => (
                  <div key={index} className={`p-4 border rounded-lg ${
                    location.active ? 'border-green-200 bg-green-50/30 dark:bg-green-950/10' : ''
                  }`}>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium flex items-center gap-2">
                          {location.region}
                          {location.active && <Badge variant="default">Active</Badge>}
                        </h4>
                        <p className="text-sm text-muted-foreground">{location.description}</p>
                      </div>
                      <Switch 
                        checked={location.active}
                        disabled={location.active} // Prevent disabling active location
                      />
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {location.compliance.map(cert => (
                        <Badge key={cert} variant="outline" className="text-xs">
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Two-Factor Authentication</h4>
                      <p className="text-sm text-muted-foreground">Require a second factor for login</p>
                    </div>
                    <Switch 
                      checked={securitySettings.twoFactorAuth}
                      onCheckedChange={(checked) => 
                        setSecuritySettings(prev => ({ ...prev, twoFactorAuth: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Biometric Authentication</h4>
                      <p className="text-sm text-muted-foreground">Use Face ID or Touch ID for login</p>
                    </div>
                    <Switch 
                      checked={securitySettings.biometricAuth}
                      onCheckedChange={(checked) => 
                        setSecuritySettings(prev => ({ ...prev, biometricAuth: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Device Trust</h4>
                      <p className="text-sm text-muted-foreground">Remember trusted devices</p>
                    </div>
                    <Switch 
                      checked={securitySettings.deviceTrust}
                      onCheckedChange={(checked) => 
                        setSecuritySettings(prev => ({ ...prev, deviceTrust: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Auto Logout</h4>
                      <p className="text-sm text-muted-foreground">Automatically log out after inactivity</p>
                    </div>
                    <Switch 
                      checked={securitySettings.autoLogout}
                      onCheckedChange={(checked) => 
                        setSecuritySettings(prev => ({ ...prev, autoLogout: checked }))
                      }
                    />
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Session Timeout</h4>
                    <div className="flex items-center gap-4">
                      <Input 
                        type="number" 
                        value={securitySettings.sessionTimeout}
                        onChange={(e) => 
                          setSecuritySettings(prev => ({ 
                            ...prev, 
                            sessionTimeout: parseIne.target.value 
                          }))
                        }
                        className="w-20"
                      />
                      <span className="text-sm text-muted-foreground">minutes of inactivity</span>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-medium mb-4 text-destructive">Danger Zone</h3>
                  <div className="space-y-3">
                    <Button variant="destructive" onClick={revokeAllSessions} className="w-full">
                      <UserX className="h-4 w-4 mr-2" />
                      Revoke All Sessions
                    </Button>
                    <Button variant="destructive" onClick={deleteAllData} className="w-full">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete All Data
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Controls */}
        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Privacy Controls
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Data Minimization</h4>
                    <p className="text-sm text-muted-foreground">Only collect essential health data</p>
                  </div>
                  <Switch 
                    checked={dataMinimization}
                    onCheckedChange={setDataMinimization}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Anonymous Analytics</h4>
                    <p className="text-sm text-muted-foreground">Share anonymized usage data for improvements</p>
                  </div>
                  <Switch 
                    checked={securitySettings.anonymousAnalytics}
                    onCheckedChange={(checked) => 
                      setSecuritySettings(prev => ({ ...prev, anonymousAnalytics: checked }))
                    }
                  />
                </div>

                <div>
                  <h4 className="font-medium mb-2">Data Retention Period</h4>
                  <div className="flex items-center gap-4">
                    <Input 
                      type="number" 
                      value={securitySettings.dataRetention}
                      onChange={(e) => 
                        setSecuritySettings(prev => ({ 
                          ...prev, 
                          dataRetention: parseIne.target.value 
                        }))
                      }
                      className="w-20"
                    />
                    <span className="text-sm text-muted-foreground">days to keep deleted data</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Data is permanently deleted after this period
                  </p>
                </div>

                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    Your privacy settings are backed by legal commitments. We cannot access your raw health data even if requested by authorities.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};