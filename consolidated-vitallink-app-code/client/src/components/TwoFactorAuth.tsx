import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Shield, Smartphone, Mail, CheckCircle, AlertCircle, Key } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TwoFactorAuthProps {
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export const TwoFactorAuth: React.FC<TwoFactorAuthProps> = ({ isEnabled, onToggle }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [method, setMethod] = useState<'sms' | 'email' | 'app'>('sms');
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [step, setStep] = useState<'setup' | 'verify' | 'confirm'>('setup');
  const { toast } = useToas;

  const handleEnable = () => {
    setIsOpen(true);
    setStep('setup');
  };

  const handleSetupMethod = async () => {
    setIsVerifying(true);
    
    try {
      // Simulate sending verification code
      await new Promise(resolve => setTimeouresolve, 1500);
      
      toast({
        title: "Verification Code Sent",
        description: `A 6-digit code has been sent to your ${method === 'sms' ? 'phone' : method === 'email' ? 'email' : 'authenticator app'}`,
      });
      
      setStep('verify');
    } catch (error) {
      toast({
        title: "Setup Failed",
        description: "Failed to send verification code. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleVerify = async () => {
    if (verificationCode.length !== 6) {
      toast({
        title: "Invalid Code",
        description: "Please enter a 6-digit verification code",
        variant: "destructive"
      });
      return;
    }

    setIsVerifying(true);
    
    try {
      // Simulate verification
      await new Promise(resolve => setTimeouresolve, 1000);
      
      // For demo, accept any 6-digit code
      onToggle(true);
      setIsOpen(false);
      
      toast({
        title: "2FA Enabled",
        description: "Two-factor authentication has been successfully enabled for your account",
      });
      
      setStep('setup');
      setVerificationCode('');
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: "Invalid verification code. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleDisable = async () => {
    try {
      onToggle(false);
      toast({
        title: "2FA Disabled",
        description: "Two-factor authentication has been disabled for your account",
        variant: "destructive"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to disable 2FA. Please try again.",
        variant: "destructive"
      });
    }
  };

  const methods = [
    {
      id: 'sms' as const,
      name: 'SMS',
      description: 'Receive codes via text message',
      icon: <Smartphone className="h-4 w-4" />,
      available: true
    },
    {
      id: 'email' as const,
      name: 'Email',
      description: 'Receive codes via email',
      icon: <Mail className="h-4 w-4" />,
      available: true
    },
    {
      id: 'app' as const,
      name: 'Authenticator App',
      description: 'Use Google Authenticator or similar',
      icon: <Key className="h-4 w-4" />,
      available: false
    }
  ];

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Two-Factor Authentication
            <Badge variant={isEnabled ? "default" : "outline"} className={isEnabled ? "bg-green-100 text-green-800" : ""}>
              {isEnabled ? (
                <>
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Enabled
                </>
              ) : (
                <>
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Disabled
                </>
              )}
            </Badge>
          </CardTitle>
          <CardDescription>
            Add an extra layer of security to your account by requiring a second form of verification
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isEnabled ? (
            <div className="space-y-4">
              <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                <p className="text-sm text-green-800 dark:text-green-200">
                  Your account is protected with two-factor authentication via SMS
                </p>
              </div>
              <Button variant="outline" onClick={handleDisable} className="w-full">
                Disable 2FA
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  Your account is not protected with two-factor authentication. Enable it now for better security.
                </p>
              </div>
              <Button onClick={handleEnable} className="w-full">
                <Shield className="h-4 w-4 mr-2" />
                Enable 2FA
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              {step === 'setup' && 'Setup Two-Factor Authentication'}
              {step === 'verify' && 'Verify Your Identity'}
              {step === 'confirm' && 'Confirmation'}
            </DialogTitle>
            <DialogDescription>
              {step === 'setup' && 'Choose your preferred verification method'}
              {step === 'verify' && 'Enter the verification code we sent you'}
              {step === 'confirm' && 'Two-factor authentication is now enabled'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {step === 'setup' && (
              <>
                <div className="space-y-3">
                  {methods.map((methodOption) => (
                    <div
                      key={methodOption.id}
                      className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                        !methodOption.available ? 'opacity-50 cursor-not-allowed' : 
                        method === methodOption.id ? 'border-primary bg-primary/5' : 'hover:border-muted-foreground'
                      }`}
                      onClick={() => methodOption.available && setMethod(methodOption.id)}
                    >
                      <div className="flex items-center gap-3">
                        {methodOption.icon}
                        <div className="flex-1">
                          <div className="font-medium text-sm">{methodOption.name}</div>
                          <div className="text-xs text-muted-foreground">{methodOption.description}</div>
                        </div>
                        {!methodOption.available && (
                          <Badge variant="outline" className="text-xs">Coming Soon</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSetupMethod} 
                    disabled={isVerifying}
                    className="flex-1"
                  >
                    {isVerifying ? 'Sending...' : 'Send Code'}
                  </Button>
                </div>
              </>
            )}

            {step === 'verify' && (
              <>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Verification Code</label>
                    <Input
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="Enter 6-digit code"
                      className="text-center text-lg tracking-widest"
                      maxLength={6}
                    />
                  </div>

                  <div className="text-xs text-muted-foreground text-center">
                    Code sent to your {method === 'sms' ? 'phone number' : method === 'email' ? 'email address' : 'authenticator app'}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setStep('setup')} className="flex-1">
                    Back
                  </Button>
                  <Button 
                    onClick={handleVerify} 
                    disabled={isVerifying || verificationCode.length !== 6}
                    className="flex-1"
                  >
                    {isVerifying ? 'Verifying...' : 'Verify'}
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};