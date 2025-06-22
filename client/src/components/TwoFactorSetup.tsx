import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { QrCode, Smartphone, Key, Shield, CheckCircle, Copy } from 'lucide-react';

interface TwoFactorSetupProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export const TwoFactorSetup: React.FC<TwoFactorSetupProps> = ({
  isOpen,
  onClose,
  onComplete
}) => {
  const { toast } = useToas;
  const [step, setStep] = useState(1);
  const [verificationCode, setVerificationCode] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [secretKey] = useState('JBSWY3DPEHPK3PXP'); // Demo key
  const [qrCodeUrl] = useState(
    `otpauth://totp/VitalLink:demo@vitallink.app?secret=${secretKey}&issuer=VitalLink`
  );

  const handleVerifyCode = () => {
    // Demo verification - in real app, verify with server
    if (verificationCode === '123456') {
      generateBackupCodes();
      setStep(3);
    } else {
      toast({
        title: "Invalid Code",
        description: "Please check your authenticator app and try again",
        variant: "destructive"
      });
    }
  };

  const generateBackupCodes = () => {
    // Generate 10 backup codes
    const codes = [];
    for (let i = 0; i < 10; i++) {
      codes.push(Math.random().toString(36).substr(2, 8).toUpperCase());
    }
    setBackupCodes(codes);
  };

  const copyBackupCodes = () => {
    const codesText = backupCodes.join('\n');
    navigator.clipboard.writeTexcodesText;
    toast({
      title: "Backup Codes Copied",
      description: "Save these codes in a secure location",
    });
  };

  const handleComplete = () => {
    toast({
      title: "2FA Setup Complete",
      description: "Your account is now secured with multi-factor authentication",
    });
    onComplete();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Set Up Two-Factor Authentication
          </CardTitle>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-medium mb-2">Step 1: Install Authenticator App</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Install an authenticator app on your phone to generate verification codes.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <Smartphone className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <h4 className="font-medium">Google Authenticator</h4>
                  <p className="text-xs text-muted-foreground">iOS & Android</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Key className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <h4 className="font-medium">Microsoft Authenticator</h4>
                  <p className="text-xs text-muted-foreground">iOS & Android</p>
                </div>
              </div>

              <Button className="w-full" onClick={() => setStep(2)}>
                I've Installed an App
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-medium mb-2">Step 2: Scan QR Code</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Scan this QR code with your authenticator app, then enter the 6-digit code.
                </p>
              </div>

              {/* QR Code Placeholder */}
              <div className="flex justify-center">
                <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300">
                  <QrCode className="h-32 w-32 text-gray-400" />
                  <p className="text-xs text-center mt-2 text-gray-500">QR Code</p>
                </div>
              </div>

              {/* Manual Entry Option */}
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-2">
                  Can't scan? Enter this code manually:
                </p>
                <div className="bg-muted p-2 rounded font-mono text-sm">
                  {secretKey}
                </div>
              </div>

              {/* Verification Code Input */}
              <div className="space-y-2">
                <Label>Enter verification code from your app:</Label>
                <Input
                  type="text"
                  placeholder="000000"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  maxLength={6}
                  className="text-center tracking-widest"
                />
                <p className="text-xs text-muted-foreground text-center">
                  Demo code: 123456
                </p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button 
                  className="flex-1" 
                  onClick={handleVerifyCode}
                  disabled={verificationCode.length !== 6}
                >
                  Verify & Continue
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                <h3 className="text-lg font-medium mb-2">2FA Successfully Enabled!</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Save these backup codes in a secure location. You can use them to access your account if your phone is unavailable.
                </p>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm">Backup Codes</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyBackupCodes}
                    className="h-auto p-1"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-1 font-mono text-xs">
                  {backupCodes.map((code, index) => (
                    <div key={index} className="bg-background p-1 rounded text-center">
                      {code}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg border border-amber-200 dark:border-amber-800">
                <p className="text-xs text-amber-800 dark:text-amber-200">
                  <strong>Important:</strong> Store these codes safely. Each code can only be used once and they're your only way to access your account if you lose your phone.
                </p>
              </div>

              <Button className="w-full" onClick={handleComplete}>
                Complete Setup
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TwoFactorSetup;