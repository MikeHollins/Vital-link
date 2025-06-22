import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Eye, EyeOff, Fingerprint, Zap, Lock, User, Shield } from 'lucide-react';
import { SiApple, SiGoogle } from 'react-icons/si';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import RegisterForm from '@/components/RegisterForm';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onLoginSuccess?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFaceIdSupported, setIsFaceIdSupported] = useState(false);
  const [isFaceIdLoading, setIsFaceIdLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showRegister, setShowRegister] = useState(false);
  const { toast } = useToas;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Check if Face ID is supported
  React.useEffec( => {
    checkBiometricSuppor;
  }, []);

  const checkBiometricSupport = async () => {
    try {
      // Check if Web Authentication API is available
      if (window.PublicKeyCredential && 
          await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()) {
        setIsFaceIdSupported(true);
      }
    } catch (error) {
      console.log('Biometric authentication not supported');
    }
  };

  const handleUsernamePasswordLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    setLoginError(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (response.ok) {
        // Redirect to dashboard
        window.location.href = '/';
        onLoginSuccess?.();
      } else {
        const error = await response.tex;
        setLoginError(error || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      setLoginError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFaceIdLogin = async () => {
    setIsFaceIdLoading(true);
    setLoginError(null);

    try {
      // Create credential request for Face ID
      const credential = await navigator.credentials.create({
        publicKey: {
          challenge: new Uint8Array(32),
          rp: {
            name: "VitalLink",
            id: window.location.hostname,
          },
          user: {
            id: new Uint8Array(16),
            name: "user@vitallink.app",
            displayName: "VitalLink User",
          },
          pubKeyCredParams: [{alg: -7, type: "public-key"}],
          authenticatorSelection: {
            authenticatorAttachment: "platform",
            userVerification: "required"
          },
          timeout: 60000,
          attestation: "direct"
        }
      });

      if (credential) {
        // Send biometric authentication to server
        const response = await fetch('/api/auth/biometric-login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            credential: credential,
            type: 'face-id'
          }),
        });

        if (response.ok) {
          onLoginSuccess?.();
          window.location.reload();
        } else {
          setLoginError('Biometric authentication failed.');
        }
      }
    } catch (error) {
      setLoginError('Face ID authentication cancelled or failed.');
    } finally {
      setIsFaceIdLoading(false);
    }
  };

  const handleAppleLogin = async () => {
    try {
      // In a real app, this would integrate with Apple's Sign in with Apple
      console.log('Apple login initiated');
      toast({
        title: "Apple Login",
        description: "Apple Sign-In integration would be implemented here",
      });
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Apple login is not yet configured",
        variant: "destructive",
      });
    }
  };

  const handleGoogleLogin = async () => {
    try {
      // In a real app, this would integrate with Google OAuth
      console.log('Google login initiated');
      toast({
        title: "Google Login",
        description: "Google OAuth integration would be implemented here",
      });
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Google login is not yet configured",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 ios-safe-top ios-safe-bottom">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Header */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="bg-primary text-white p-4 rounded-2xl shadow-lg">
            <Zap className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome to VitalLink</h1>
            <p className="text-muted-foreground mt-2">
              Secure access to your personal health dashboard
            </p>
          </div>
        </div>

        {/* Login Card */}
        <Card className="w-full shadow-xl">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl text-center">Sign In</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your health data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Social Login Options */}
            <div className="space-y-3">
              <Button
                type="button"
                variant="outline"
                className="w-full h-12 relative overflow-hidden group bg-black hover:bg-gray-900 text-white border-gray-800"
                onClick={handleAppleLogin}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-black opacity-0 group-hover:opacity-100 transition-opacity" />
                <SiApple className="w-5 h-5 mr-3 relative z-10" />
                <span className="relative z-10">Continue with Apple</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full h-12 relative overflow-hidden group bg-white hover:bg-gray-50 text-gray-900 border-gray-300 dark:bg-gray-100 dark:hover:bg-gray-200"
                onClick={handleGoogleLogin}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-red-50 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10 mr-3">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </div>
                <span className="relative z-10">Continue with Google</span>
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmihandleUsernamePasswordLogin} className="space-y-4">
              {/* Username Field */}
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck="false"
                    placeholder="Enter your username"
                    className="pl-10 h-12"
                    {...register('username')}
                  />
                </div>
                {errors.username && (
                  <p className="text-sm text-destructive">{errors.username.message}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="Demo password: VitalLink2024!"
                    className="pl-10 pr-12 h-12"
                    {...register('password')}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-2 h-8 w-8 p-0"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
              </div>

              {/* Login Error */}
              {loginError && (
                <Alert variant="destructive">
                  <AlertDescription>{loginError}</AlertDescription>
                </Alert>
              )}

              {/* Login Button */}
              <Button 
                type="submit" 
                className="w-full h-12 text-base active:scale-95 transition-transform"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            {/* Face ID Option */}
            {isFaceIdSupported && (
              <>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  onClick={handleFaceIdLogin}
                  disabled={isFaceIdLoading}
                  className="w-full h-12 active:scale-95 transition-transform"
                >
                  {isFaceIdLoading ? (
                    <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2" />
                  ) : (
                    <Fingerprint className="h-5 w-5 mr-2" />
                  )}
                  {isFaceIdLoading ? 'Authenticating...' : 'Use Face ID / Touch ID'}
                </Button>
              </>
            )}

            {/* Security Notice */}
            <div className="mt-6 p-3 bg-muted/50 rounded-lg">
              <div className="flex items-start space-x-2">
                <Shield className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <div className="text-xs text-muted-foreground">
                  <p className="font-medium text-foreground mb-1">Secure & Private</p>
                  <p>Your credentials are encrypted and your health data is protected with enterprise-grade security.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground space-y-2">
          <p>Don't have an account? <Button variant="link" className="p-0 h-auto text-xs" onClick={() => setShowRegister(true)}>Create Account</Button></p>
          <p>
            By signing in, you agree to our{' '}
            <Button variant="link" className="p-0 h-auto text-xs">Terms of Service</Button>{' '}
            and{' '}
            <Button variant="link" className="p-0 h-auto text-xs">Privacy Policy</Button>
          </p>
        </div>
      </div>

      {/* Registration Form */}
      {showRegister && (
        <div className="fixed inset-0 bg-background z-50">
          <RegisterForm 
            onRegisterSuccess={onLoginSuccess}
            onBackToLogin={() => setShowRegister(false)}
          />
        </div>
      )}
    </div>
  );
};

export default LoginForm;