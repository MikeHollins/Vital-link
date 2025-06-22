import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Heart, Shield, Smartphone, Activity, Users, Zap, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { VitalLinkLogo } from "@/components/VitalLinkLogo";

export default function Landing() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({ username: "demo", password: "demo" });
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefaul;
    setIsLoading(true);
    
    try {
      // Set authentication state immediately
      localStorage.setItem('vitallink-demo-auth', 'true');
      
      // Force auth state update
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'vitallink-demo-auth',
        newValue: 'true',
        storageArea: localStorage
      }));
      
      // Short delay for smooth UX then navigate
      setTimeou( => {
        setLocation("/");
        setIsLoading(false);
      }, 300);
    } catch (error) {
      console.error("Login failed:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <VitalLinkLogo size={64} />
              <div className="absolute -top-1 -right-1">
                <Badge className="bg-teal-100 text-teal-800 text-xs px-2 py-1">AI</Badge>
              </div>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            VitalLink
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Your Complete Health Data Command Center
          </p>
          
          <p className="text-lg text-gray-500 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            Connect all your health devices and apps in one secure platform. Get AI-powered insights, 
            track your progress, and take control of your wellness journey.
          </p>

          {/* Login Form */}
          <Card className="max-w-md mx-auto shadow-xl border-0 bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                Welcome to VitalLink
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                Sign in to access your unified health dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Username or Email
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username or email"
                    value={credentials.username}
                    onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                    className="h-11 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={credentials.password}
                      onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                      className="h-11 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Signing In...
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Demo Mode: Use any credentials to access the dashboard
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900 rounded-lg flex items-center justify-center mb-4">
                <Activity className="h-6 w-6 text-teal-600 dark:text-teal-400" />
              </div>
              <CardTitle>Unified Health Dashboard</CardTitle>
              <CardDescription>
                Connect Apple Health, Google Fit, Fitbit, and more in one beautiful interface
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle>AI-Powered Insights</CardTitle>
              <CardDescription>
                Get personalized health recommendations and predictive analytics
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle>Enterprise Security</CardTitle>
              <CardDescription>
                HIPAA-compliant with end-to-end encryption and zero-knowledge architecture
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                <Smartphone className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle>Mobile-First Design</CardTitle>
              <CardDescription>
                Progressive Web App with offline capabilities and biometric authentication
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <CardTitle>Family & Social</CardTitle>
              <CardDescription>
                Share health goals with family and compete with friends safely
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center mb-4">
                <Heart className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <CardTitle>NFT Achievements</CardTitle>
              <CardDescription>
                Earn blockchain-verified wellness milestones and achievements
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto border-0 bg-gradient-to-r from-teal-500 to-blue-600 text-white">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Health Journey?</h3>
              <p className="text-teal-100 mb-6">
                Join thousands of users who have taken control of their wellness with VitalLink's 
                comprehensive health platform.
              </p>
              <p className="text-teal-100 text-center">
                Join thousands of users who have transformed their health journey with VitalLink
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}