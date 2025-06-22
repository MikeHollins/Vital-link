import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Fingerprint, Smartphone, Shield, Eye, AlertTriangle } from 'lucide-react';

interface BiometricAuthProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (method: string) => void;
  fallbackReason?: string;
}

export const BiometricAuth: React.FC<BiometricAuthProps> = ({
  isOpen,
  onClose,
  onSuccess,
  fallbackReason
}) => {
  const { toast } = useToas;
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [availableMethods, setAvailableMethods] = useState<string[]>([]);
  const [backupCode, setBackupCode] = useState('');

  useEffec( => {
    checkAvailableBiometrics();
  }, []);

  const checkAvailableBiometrics = async () => {
    const methods = [];
    
    // Check for WebAuthn support (Face ID, Touch ID, Windows Hello)
    if (window.PublicKeyCredential) {
      try {
        const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
        if (available) {
          methods.push('biometric');
        }
      } catch (error) {
        console.log('Biometric check failed:', error);
      }
    }

    // Check for device capabilities
    if (navigator.userAgent.includes('iPhone') || navigator.userAgent.includes('iPad')) {
      methods.push('faceid', 'touchid');
    } else if (navigator.userAgent.includes('Android')) {
      methods.push('fingerprint');
    } else if (navigator.userAgent.includes('Windows')) {
      methods.push('windows_hello');
    }

    setAvailableMethods(methods);
  };

  const authenticateWithBiometric = async (method: string) => {
    setIsAuthenticating(true);
    
    try {
      if (window.PublicKeyCredential) {
        // Create credential request options
        const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions = {
          challenge: new Uint8Array(32),
          allowCredentials: [],
          userVerification: 'required',
          timeout: 30000
        };

        // Request authentication
        const credential = await navigator.credentials.get({
          publicKey: publicKeyCredentialRequestOptions
        });

        if (credential) {
          toast({
            title: "Authentication Successful",
            description: `Verified using ${method}`,
          });
          onSuccess(method);
          return;
        }
      }

      // Fallback to simulated biometric for demo
      await simulateBiometricAuth(method);
      
    } catch (error: any) {
      console.error('Biometric authentication failed:', error);
      
      if (error.name === 'NotAllowedError') {
        toast({
          title: "Authentication Cancelled",
          description: "Biometric authentication was cancelled",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Authentication Failed",
          description: "Please try again or use a backup code",
          variant: "destructive"
        });
      }
    } finally {
      setIsAuthenticating(false);
    }
  };

  const simulateBiometricAuth = async (method: string) => {
    // Simulate biometric authentication delay
    await new Promise(resolve => setTimeouresolve, 2000);
    
    // For demo purposes, simulate success
    toast({
      title: "Authentication Successful",
      description: `Verified using ${method} (Demo Mode)`,
    });
    onSuccess(method);
  };

  const handleBackupCode = () => {
    if (backupCode.length === 6) {
      // Validate backup code (in real app, this would be server-side)
      if (backupCode === '123456') {
        toast({
          title: "Backup Code Accepted",
          description: "Access granted using backup code",
        });
        onSuccess('backup_code');
      } else {
        toast({
          title: "Invalid Backup Code",
          description: "Please check your code and try again",
          variant: "destructive"
        });
      }
    }
  };

  const getBiometricIcon = (method: string) => {
    switch (method) {
      case 'faceid':
        return <Eye className="h-8 w-8" />;
      case 'touchid':
      case 'fingerprint':
        return <Fingerprint className="h-8 w-8" />;
      case 'windows_hello':
        return <Shield className="h-8 w-8" />;
      default:
        return <Smartphone className="h-8 w-8" />;
    }
  };

  const getMethodName = (method: string) => {
    switch (method) {
      case 'faceid':
        return 'Face ID';
      case 'touchid':
        return 'Touch ID';
      case 'fingerprint':
        return 'Fingerprint';
      case 'windows_hello':
        return 'Windows Hello';
      case 'biometric':
        return 'Biometric Authentication';
      default:
        return 'Device Authentication';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Multi-Factor Authentication
          </CardTitle>
          {fallbackReason && (
            <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 dark:bg-amber-900/20 p-2 rounded">
              <AlertTriangle className="h-4 w-4" />
              {fallbackReason}
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Choose a secure authentication method to continue:
          </p>

          {/* Biometric Options */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Biometric Authentication</Label>
            <div className="grid grid-cols-2 gap-3">
              {availableMethods.map((method) => (
                <Button
                  key={method}
                  variant="outline"
                  className="h-20 flex-col gap-2 hover:bg-primary/5"
                  onClick={() => authenticateWithBiometric(method)}
                  disabled={isAuthenticating}
                >
                  {getBiometricIcon(method)}
                  <span className="text-xs">{getMethodName(method)}</span>
                </Button>
              ))}
            </div>
            
            {availableMethods.length === 0 && (
              <div className="text-center py-4 text-sm text-muted-foreground">
                No biometric methods available on this device
              </div>
            )}
          </div>

          {/* Backup Code Option */}
          <div className="space-y-3 border-t pt-4">
            <Label className="text-sm font-medium">Backup Authentication</Label>
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Enter 6-digit backup code"
                value={backupCode}
                onChange={(e) => setBackupCode(e.target.value)}
                maxLength={6}
                className="text-center tracking-widest"
              />
              <Button
                variant="outline"
                className="w-full"
                onClick={handleBackupCode}
                disabled={backupCode.length !== 6}
              >
                Verify Backup Code
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Demo backup code: 123456
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
          </div>

          {isAuthenticating && (
            <div className="text-center text-sm text-muted-foreground">
              Authenticating... Please follow the prompts on your device.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BiometricAuth;