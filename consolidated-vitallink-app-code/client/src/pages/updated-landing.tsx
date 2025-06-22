import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Lock, 
  Zap, 
  Trophy, 
  Heart, 
  Smartphone, 
  Activity, 
  Star,
  CheckCircle,
  Globe,
  Users,
  TrendingUp,
  Award,
  Eye,
  Database
} from "lucide-react";

export default function UpdatedLanding() {
  const handleLogin = () => {
    // For demo purposes, set authentication
    localStorage.setItem('vitallink-demo-auth', 'true');
    window.location.reload();
  };

  const platforms = [
    { name: "Apple Health", icon: "🍎", users: "1B+" },
    { name: "Google Fit", icon: "🔵", users: "500M+" },
    { name: "Fitbit", icon: "⚫", users: "120M+" },
    { name: "Samsung Health", icon: "📱", users: "100M+" },
    { name: "Garmin", icon: "🔷", users: "25M+" },
    { name: "Strava", icon: "🟠", users: "100M+" },
  ];

  const features = [
    {
      icon: <Shield className="h-8 w-8 text-blue-600" />,
      title: "Zero-Knowledge Privacy",
      description: "Prove you ran a marathon without sharing your embarrassing 3 AM midnight snack data. Your secrets stay secret.",
      highlight: "Patent-Protected Technology"
    },
    {
      icon: <Database className="h-8 w-8 text-green-600" />,
      title: "100+ Platform Integration",
      description: "Finally! Your Apple Watch, Fitbit, and that random health app can all talk to each other without drama.",
      highlight: "Universal Compatibility"
    },
    {
      icon: <Trophy className="h-8 w-8 text-purple-600" />,
      title: "NFTme Health Data Verification",
      description: "Turn your 10,000 steps into actual digital gold. Who knew being healthy could be this profitable?",
      highlight: "Blockchain Innovation"
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-orange-600" />,
      title: "AI Health Insights",
      description: "Get AI recommendations smarter than your fitness trainer and less judgmental than your doctor.",
      highlight: "Smart Analytics"
    }
  ];

  const securityFeatures = [
    "HIPAA Compliant Data Handling",
    "GDPR & PDPA Privacy Standards", 
    "End-to-End Encryption",
    "Zero-Knowledge Proof Technology",
    "Blockchain Security",
    "Real-time Audit Logging"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-blue-100 text-blue-800 hover:bg-blue-200">
              🚀 Now Live: Advanced Health Data Integration Platform
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              VitalLink
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Secure Health Data Platform
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Connect 100+ health platforms, protect your privacy with Zero-Knowledge technology, 
              and turn your health data into valuable NFTs. All while maintaining complete data security.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg"
                onClick={handleLogin}
              >
                <Zap className="h-5 w-5 mr-2" />
                Start Secure Integration
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="px-8 py-4 text-lg"
              >
                <Eye className="h-5 w-5 mr-2" />
                View Platform Demo
              </Button>
            </div>

            {/* Security Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Shield className="h-4 w-4 text-green-600" />
                <span>HIPAA Compliant</span>
              </div>
              <div className="flex items-center gap-1">
                <Lock className="h-4 w-4 text-blue-600" />
                <span>Zero-Knowledge Privacy</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-purple-600" />
                <span>Patent-Protected Technology</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Integration Showcase */}
      <div className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Connect All Your Health Platforms
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Seamlessly integrate with over 100 health platforms and devices for a complete view of your wellness data
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
            {platforms.map((platform, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="text-4xl mb-3">{platform.icon}</div>
                  <h3 className="font-semibold mb-1">{platform.name}</h3>
                  <p className="text-sm text-gray-500">{platform.users}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Badge variant="outline" className="text-lg px-4 py-2">
              <Globe className="h-4 w-4 mr-2" />
              100+ Platforms Supported
            </Badge>
          </div>
        </div>
      </div>

      {/* Core Features */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Revolutionary Health Technology
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Advanced features that set VitalLink apart from traditional health platforms
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-xl transition-shadow border-l-4 border-l-blue-500">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {feature.icon}
                      <div>
                        <CardTitle className="text-xl">{feature.title}</CardTitle>
                        <Badge variant="secondary" className="mt-1">
                          {feature.highlight}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Security & Privacy Section */}
      <div className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Maximum Security & Privacy Protection
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Your health data is protected by multiple layers of advanced security technology
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="border-2 border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-6 w-6 text-green-600" />
                    Zero-Knowledge Proofs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Prove your health data without revealing your actual health data. 
                    Our patent-protected technology ensures complete privacy.
                  </p>
                  <Badge className="bg-green-100 text-green-800">
                    Patent-Protected Innovation
                  </Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-6 w-6 text-blue-600" />
                    Compliance & Standards
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {securityFeatures.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* NFTme Showcase */}
      <div className="py-16 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              NFTme: Health Data Verification
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Turn your health milestones into valuable NFTs while keeping your personal data completely private
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-white/80 dark:bg-gray-800/80">
                <CardContent className="p-6 text-center">
                  <Trophy className="h-12 w-12 text-yellow-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Earn Data NFTs</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Reach health milestones and unlock unique data NFTs
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-white/80 dark:bg-gray-800/80">
                <CardContent className="p-6 text-center">
                  <Lock className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Privacy Protected</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Zero-Knowledge proofs verify data without exposing data
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-white/80 dark:bg-gray-800/80">
                <CardContent className="p-6 text-center">
                  <Star className="h-12 w-12 text-purple-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Valuable Assets</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Trade and showcase your verified health data
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <Badge className="bg-purple-100 text-purple-800 text-lg px-6 py-2">
              <Award className="h-4 w-4 mr-2" />
              Available on OpenSea & Major NFT Marketplaces
            </Badge>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-blue-600 dark:bg-blue-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Secure Your Health Data?
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who trust VitalLink to protect their health data while unlocking 
            the full potential of their wellness journey.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg"
              onClick={handleLogin}
            >
              <Shield className="h-5 w-5 mr-2" />
              Start Secure Integration Now
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg"
            >
              <Users className="h-5 w-5 mr-2" />
              Learn About Our Security
            </Button>
          </div>
          
          <div className="mt-8 text-blue-200 text-sm">
            <p>✓ No credit card required ✓ HIPAA compliant ✓ Zero-Knowledge privacy</p>
          </div>
        </div>
      </div>
    </div>
  );
}