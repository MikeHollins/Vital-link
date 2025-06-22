import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Eye, EyeOff, Fingerprint, Zap, Lock, User, Mail, Shield, ArrowLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onRegisterSuccess?: () => void;
  onBackToLogin?: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onRegisterSuccess, onBackToLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [isFaceIdSupported, setIsFaceIdSupported] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  // Check if Face ID is supported
  React.useEffec( => {
    checkBiometricSuppor;
  }, []);

  const checkBiometricSupport = async () => {
    try {
      if (window.PublicKeyCredential && 
          await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()) {
        setIsFaceIdSupported(true);
      }
    } catch (error) {
      console.log('Biometric authentication not supported');
    }
  };

  const handleRegister = async (data: RegisterFormData) => {
    setIsLoading(true);
    setRegisterError(null);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          username: data.username,
          password: data.password,
        }),
      });

      if (response.ok) {
        // Redirect to dashboard
        window.location.href = '/';
        onRegisterSuccess?.();
      } else {
        const error = await response.tex;
        setRegisterError(error || 'Registration failed. Please try again.');
      }
    } catch (error) {
      setRegisterError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const setupBiometricAuth = async () => {
    try {
      // Register biometric credential for the new user
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
        // Save biometric credential to user account
        await fetch('/api/auth/setup-biometric', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            credential: credential,
          }),
        });
      }
    } catch (error) {
      console.log('Biometric setup skipped');
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
            <h1 className="text-3xl font-bold tracking-tight">Join VitalLink</h1>
            <p className="text-muted-foreground mt-2">
              Create your secure health data account
            </p>
          </div>
        </div>

        {/* Registration Card */}
        <Card className="w-full shadow-xl">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl text-center">Create Account</CardTitle>
            <CardDescription className="text-center">
              Start your journey to better health insights
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmihandleRegister} className="space-y-4">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    autoComplete="given-name"
                    autoCapitalize="words"
                    autoCorrect="off"
                    placeholder="John"
                    className="h-12"
                    {...register('firstName')}
                  />
                  {errors.firstName && (
                    <p className="text-sm text-destructive">{errors.firstName.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    autoComplete="family-name"
                    autoCapitalize="words"
                    autoCorrect="off"
                    placeholder="Doe"
                    className="h-12"
                    {...register('lastName')}
                  />
                  {errors.lastName && (
                    <p className="text-sm text-destructive">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck="false"
                    placeholder="john@example.com"
                    className="pl-10 h-12"
                    {...register('email')}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

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
                    placeholder="Choose a username"
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
                    autoComplete="new-password"
                    placeholder="Create a strong password"
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

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="Confirm your password"
                    className="pl-10 pr-12 h-12"
                    {...register('confirmPassword')}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-2 h-8 w-8 p-0"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                )}
              </div>

              {/* Registration Error */}
              {registerError && (
                <Alert variant="destructive">
                  <AlertDescription>{registerError}</AlertDescription>
                </Alert>
              )}

              {/* Create Account Button */}
              <Button 
                type="submit" 
                className="w-full h-12 text-base active:scale-95 transition-transform"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>

            {/* Face ID Setup Option */}
            {isFaceIdSupported && (
              <>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Optional
                    </span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  onClick={setupBiometricAuth}
                  className="w-full h-12 active:scale-95 transition-transform"
                >
                  <Fingerprint className="h-5 w-5 mr-2" />
                  Set up Face ID / Touch ID
                </Button>
              </>
            )}

            {/* Security Notice */}
            <div className="mt-6 p-3 bg-muted/50 rounded-lg">
              <div className="flex items-start space-x-2">
                <Shield className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <div className="text-xs text-muted-foreground">
                  <p className="font-medium text-foreground mb-1">Your Privacy Matters</p>
                  <p>All data is encrypted end-to-end. We never share your personal health information without your explicit consent.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Back to Login */}
        <div className="text-center">
          <Button 
            variant="ghost" 
            onClick={onBackToLogin}
            className="text-sm active:scale-95 transition-transform"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Login
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground space-y-2">
          <p>
            By creating an account, you agree to our{' '}
            <Button variant="link" className="p-0 h-auto text-xs">Terms of Service</Button>{' '}
            and{' '}
            <Button variant="link" className="p-0 h-auto text-xs">Privacy Policy</Button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;