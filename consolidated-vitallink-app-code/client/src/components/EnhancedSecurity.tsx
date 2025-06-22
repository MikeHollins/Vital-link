import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Shield, Lock, Eye, AlertTriangle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SecurityFeature {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  critical: boolean;
  icon: React.ReactNode;
}

export const EnhancedSecurity: React.FC = () => {
  const { toast } = useToas;
  const [securityScore, setSecurityScore] = useState(78);
  const [features, setFeatures] = useState<SecurityFeature[]>([
    {
      id: 'encryption',
      name: 'End-to-End Encryption',
      description: 'All health data is encrypted before storage',
      enabled: true,
      critical: true,
      icon: <Lock className="h-4 w-4" />
    },
    {
      id: 'blockchain',
      name: 'Blockchain Storage',
      description: 'Data stored on immutable blockchain',
      enabled: false,
      critical: false,
      icon: <Shield className="h-4 w-4" />
    },
    {
      id: 'zeroKnowledge',
      name: 'Zero-Knowledge Proofs',
      description: 'Verify data without revealing content',
      enabled: false,
      critical: false,
      icon: <Eye className="h-4 w-4" />
    },
    {
      id: 'biometric',
      name: 'Biometric Authentication',
      description: 'Face ID / Touch ID for device access',
      enabled: true,
      critical: false,
      icon: <CheckCircle className="h-4 w-4" />
    }
  ]);

  const toggleFeature = (featureId: string) => {
    if (featureId === 'encryption') {
      toast({
        title: "Critical Security Feature",
        description: "End-to-end encryption cannot be disabled",
        variant: "destructive"
      });
      return;
    }

    setFeatures(prev => prev.map(feature => {
      if (feature.id === featureId) {
        const newEnabled = !feature.enabled;
        
        // Update security score
        const scoreChange = newEnabled ? 10 : -10;
        setSecurityScore(current => Math.max(0, Math.min(100, current + scoreChange)));
        
        toast({
          title: `${feature.name} ${newEnabled ? 'Enabled' : 'Disabled'}`,
          description: `Security feature has been ${newEnabled ? 'activated' : 'deactivated'}`,
        });
        
        return { ...feature, enabled: newEnabled };
      }
      return feature;
    }));
  };

  const getSecurityLevel = () => {
    if (securityScore >= 90) return { level: 'Excellent', color: 'text-green-600', bgColor: 'bg-green-100' };
    if (securityScore >= 70) return { level: 'Good', color: 'text-blue-600', bgColor: 'bg-blue-100' };
    if (securityScore >= 50) return { level: 'Fair', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    return { level: 'Needs Improvement', color: 'text-red-600', bgColor: 'bg-red-100' };
  };

  const securityLevel = getSecurityLevel();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Enhanced Security
          <Badge className={`${securityLevel.bgColor} ${securityLevel.color} border-transparent`}>
            {securityLevel.level}
          </Badge>
        </CardTitle>
        <CardDescription>
          Advanced security features to protect your health data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Security Score */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Security Score</span>
            <span className="text-sm font-bold">{securityScore}/100</span>
          </div>
          <Progress value={securityScore} className="h-2" />
          <p className="text-xs text-muted-foreground">
            Your data protection level based on enabled security features
          </p>
        </div>

        {/* Security Features */}
        <div className="space-y-4">
          <h4 className="font-medium">Security Features</h4>
          {features.map((feature) => (
            <div key={feature.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-start gap-3">
                <div className={`p-1 rounded ${feature.enabled ? 'text-green-600' : 'text-muted-foreground'}`}>
                  {feature.icon}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{feature.name}</span>
                    {feature.critical && (
                      <Badge variant="outline" className="text-xs">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Critical
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                </div>
              </div>
              <Switch
                checked={feature.enabled}
                onCheckedChange={() => toggleFeature(feature.id)}
                disabled={feature.critical && feature.enabled}
              />
            </div>
          ))}
        </div>

        {/* Security Recommendations */}
        <div className="bg-muted p-4 rounded-lg">
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            Security Recommendations
          </h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Enable blockchain storage for immutable health records</li>
            <li>• Use zero-knowledge proofs for privacy-preserving analytics</li>
            <li>• Regularly review and update your privacy settings</li>
            <li>• Keep your devices updated with latest security patches</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};