import React from 'react';
import Layout from '@/components/Layout';
import { ComprehensivePlatformConnector } from '@/components/ComprehensivePlatformConnector';
import { Card, CardContent } from '@/components/ui/card';
import { Link2, Shield, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useLocation } from 'wouter';

export default function PlatformsPage() {
  const [, setLocation] = useLocation();

  const handleClose = () => {
    setLocation('/'); // Navigate back to dashboard
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 pb-24">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              <Link2 className="w-8 h-8 inline mr-2" />
              Vital Link Platforms
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Connect to 100+ health platforms and consolidate all your health data
            </p>
            <div className="flex justify-center items-center gap-2">
              <Badge variant="secondary" className="flex items-center gap-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                <Zap className="h-3 w-3" />
                100+ Platforms
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                <Shield className="h-3 w-3" />
                Secure Integration
              </Badge>
            </div>
          </div>

          {/* Comprehensive Platform Connector */}
          <Card>
            <CardContent className="p-6">
              <ComprehensivePlatformConnector onClose={handleClose} />
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}