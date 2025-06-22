import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  Lock, 
  Key, 
  Eye, 
  AlertTriangle, 
  CheckCircle,
  Globe,
  Database,
  FileText,
  UserCheck
} from 'lucide-react';

interface SecurityMetric {
  category: string;
  score: number;
  status: 'excellent' | 'good' | 'warning' | 'critical';
  items: {
    name: string;
    status: 'active' | 'pending' | 'inactive';
    description: string;
  }[];
}

const securityMetrics: SecurityMetric[] = [
  {
    category: 'Data Encryption',
    score: 98,
    status: 'excellent',
    items: [
      { name: 'AES-256 Encryption', status: 'active', description: 'All data encrypted at rest and in transit' },
      { name: 'TLS 1.3', status: 'active', description: 'Latest transport layer security' },
      { name: 'End-to-End Encryption', status: 'active', description: 'Zero-knowledge architecture' },
      { name: 'Key Rotation', status: 'active', description: 'Automatic 90-day key rotation' }
    ]
  },
  {
    category: 'Access Control',
    score: 95,
    status: 'excellent',
    items: [
      { name: 'Multi-Factor Authentication', status: 'active', description: 'Biometric and token-based MFA' },
      { name: 'Role-Based Access', status: 'active', description: 'Granular permission system' },
      { name: 'Session Management', status: 'active', description: 'Secure session handling' },
      { name: 'Zero Trust Architecture', status: 'pending', description: 'Enhanced verification protocols' }
    ]
  },
  {
    category: 'Compliance',
    score: 100,
    status: 'excellent',
    items: [
      { name: 'HIPAA Compliance', status: 'active', description: 'Full healthcare data protection' },
      { name: 'PDPA Compliance', status: 'active', description: 'Singapore data protection' },
      { name: 'SOC 2 Type II', status: 'pending', description: 'Security audit certification' },
      { name: 'ISO 27001', status: 'pending', description: 'Information security management' }
    ]
  },
  {
    category: 'Monitoring',
    score: 92,
    status: 'excellent',
    items: [
      { name: 'Real-time Threat Detection', status: 'active', description: 'AI-powered security monitoring' },
      { name: 'Audit Logging', status: 'active', description: 'Complete activity tracking' },
      { name: 'Vulnerability Scanning', status: 'active', description: 'Automated security scans' },
      { name: 'Incident Response', status: 'active', description: '24/7 security response team' }
    ]
  }
];

export const EnhancedSecurityDashboard: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Data Encryption');
  
  const overallScore = Math.round(securityMetrics.reduce((acc, metric) => acc + metric.score, 0) / securityMetrics.length);
  const selectedMetric = securityMetrics.find(m => m.category === selectedCategory) || securityMetrics[0];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 dark:text-green-400';
      case 'good': return 'text-blue-600 dark:text-blue-400';
      case 'warning': return 'text-yellow-600 dark:text-yellow-400';
      case 'critical': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'inactive': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <AlertTriangle className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          <Shield className="w-6 h-6 inline mr-2" />
          Security Dashboard
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Enterprise-grade security for international healthcare data
        </p>
      </div>

      {/* Overall Security Score */}
      <Card className="border-green-200 dark:border-green-800">
        <CardHeader className="text-center">
          <CardTitle className="text-green-700 dark:text-green-300">
            Overall Security Score
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="relative w-32 h-32 mx-auto mb-4">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="50"
                stroke="currentColor"
                strokeWidth="10"
                fill="none"
                className="text-gray-200 dark:text-gray-700"
              />
              <circle
                cx="60"
                cy="60"
                r="50"
                stroke="currentColor"
                strokeWidth="10"
                fill="none"
                strokeDasharray={`${overallScore * 3.14} 314`}
                className="text-green-500"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold text-green-600 dark:text-green-400">
                {overallScore}%
              </span>
            </div>
          </div>
          <p className="text-lg font-semibold text-green-700 dark:text-green-300">
            Excellent Security Rating
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Ready for Singapore and US markets
          </p>
        </CardContent>
      </Card>

      {/* Security Categories */}
      <div className="grid md:grid-cols-4 gap-4">
        {securityMetrics.map((metric) => (
          <Card
            key={metric.category}
            className={`cursor-pointer transition-all duration-200 ${
              selectedCategory === metric.category 
                ? 'ring-2 ring-blue-500 dark:ring-blue-400' 
                : 'hover:shadow-lg'
            }`}
            onClick={() => setSelectedCategory(metric.category)}
          >
            <CardContent className="p-4">
              <div className="text-center space-y-2">
                <div className="text-2xl font-bold">
                  {metric.score}%
                </div>
                <div className="text-sm font-medium">
                  {metric.category}
                </div>
                <Progress value={metric.score} className="h-2" />
                <Badge 
                  variant="secondary" 
                  className={getStatusColor(metric.status)}
                >
                  {metric.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Security Features */}
      <Card>
        <CardHeader>
          <CardTitle>{selectedMetric.category} Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {selectedMetric.items.map((item) => (
              <div key={item.name} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(item.status)}
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {item.description}
                    </div>
                  </div>
                </div>
                <Badge variant={item.status === 'active' ? 'default' : 'secondary'}>
                  {item.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Regional Compliance Status */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Singapore Compliance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span>PDPA Compliance</span>
              <Badge variant="default" className="bg-green-600">Complete</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Medical Device Act</span>
              <Badge variant="default" className="bg-green-600">Complete</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>HealthHub Integration</span>
              <Badge variant="secondary">Ready</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Local Data Residency</span>
              <Badge variant="default" className="bg-green-600">Configured</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              US Compliance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span>HIPAA Compliance</span>
              <Badge variant="default" className="bg-green-600">Complete</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>FDA 21 CFR Part 820</span>
              <Badge variant="default" className="bg-green-600">Complete</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>FHIR R4 Support</span>
              <Badge variant="secondary">Ready</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>State Privacy Laws</span>
              <Badge variant="default" className="bg-green-600">Compliant</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Items */}
      <Card className="border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="text-blue-700 dark:text-blue-300">
            Security Enhancement Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div>
                <div className="font-medium">SOC 2 Type II Certification</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Enhance enterprise customer confidence
                </div>
              </div>
              <Button size="sm" variant="outline">
                Schedule Audit
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div>
                <div className="font-medium">Zero Trust Architecture</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Implement advanced verification protocols
                </div>
              </div>
              <Button size="sm" variant="outline">
                Plan Implementation
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};