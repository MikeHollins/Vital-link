import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { MarketLocalization } from '@/components/MarketLocalization';
import { EnhancedSecurityDashboard } from '@/components/EnhancedSecurityDashboard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe, Shield, TrendingUp, Users } from 'lucide-react';

export default function MarketReadiness() {
  const [activeTab, setActiveTab] = useState<'localization' | 'security' | 'market-analysis'>('localization');

  const tabs = [
    { id: 'localization', label: 'Market Localization', icon: Globe },
    { id: 'security', label: 'Security Readiness', icon: Shield },
    { id: 'market-analysis', label: 'Market Analysis', icon: TrendingUp },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'localization':
        return <MarketLocalization />;
      case 'security':
        return <EnhancedSecurityDashboard />;
      case 'market-analysis':
        return <MarketAnalysis />;
      default:
        return <MarketLocalization />;
    }
  };

  return (
    <Layout>
      <div className="min-h-screen pb-24 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Market Readiness Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Prepare VitalLink for Singapore and US market expansion
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center">
          <div className="flex flex-wrap space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "ghost"}
                  onClick={() => setActiveTab(tab.id as any)}
                  className="flex items-center gap-2 text-xs md:text-sm px-2 md:px-4"
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.id === 'localization' ? 'Market' : tab.id === 'security' ? 'Security' : 'Analysis'}</span>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        {renderConten}
      </div>
    </Layout>
  );
}

const MarketAnalysis: React.FC = () => {
  const marketData = {
    singapore: {
      marketSize: 'S$2.8B',
      growthRate: '12.5%',
      targetAudience: '1.2M health-conscious tech users',
      keyCompetitors: ['HealthHub', 'Doctor Anywhere', 'WhiteCoat'],
      opportunity: 'High smartphone penetration (91%) and government digital health initiatives'
    },
    usa: {
      marketSize: '$350B',
      growthRate: '8.2%',
      targetAudience: '45M health-conscious millennials & Gen Z',
      keyCompetitors: ['Apple Health', 'MyFitnessPal', 'Fitbit Premium', 'Garmin Connect'],
      opportunity: 'Large addressable market with growing demand for integrated health platforms'
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          <TrendingUp className="w-6 h-6 inline mr-2" />
          Market Analysis
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Strategic insights for market entry and expansion
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Singapore Market */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🇸🇬</span>
              Singapore Market
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Market Size</div>
                <div className="text-lg font-semibold">{marketData.singapore.marketSize}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Growth Rate</div>
                <div className="text-lg font-semibold text-green-600">{marketData.singapore.growthRate}</div>
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Target Audience</div>
              <div className="text-sm">{marketData.singapore.targetAudience}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Key Competitors</div>
              <div className="flex flex-wrap gap-1">
                {marketData.singapore.keyCompetitors.map((competitor) => (
                  <span key={competitor} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                    {competitor}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Market Opportunity</div>
              <div className="text-sm">{marketData.singapore.opportunity}</div>
            </div>
          </CardContent>
        </Card>

        {/* US Market */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🇺🇸</span>
              United States Market
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Market Size</div>
                <div className="text-lg font-semibold">{marketData.usa.marketSize}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Growth Rate</div>
                <div className="text-lg font-semibold text-green-600">{marketData.usa.growthRate}</div>
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Target Audience</div>
              <div className="text-sm">{marketData.usa.targetAudience}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Key Competitors</div>
              <div className="flex flex-wrap gap-1">
                {marketData.usa.keyCompetitors.map((competitor) => (
                  <span key={competitor} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                    {competitor}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Market Opportunity</div>
              <div className="text-sm">{marketData.usa.opportunity}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Competitive Advantage */}
      <Card className="border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="text-blue-700 dark:text-blue-300">
            VitalLink Competitive Advantages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Comprehensive Integration</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                102+ health platforms in one unified dashboard - more than any competitor
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Enterprise Security</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Bank-grade encryption and multi-regional compliance (HIPAA + PDPA)
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">AI-Powered Insights</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Advanced health analytics and personalized recommendations
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Launch Strategy */}
      <Card>
        <CardHeader>
          <CardTitle>Go-to-Market Strategy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Singapore Launch (Q2 2025)</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Partner with HealthHub for government integration
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Target health-conscious expats and tech professionals
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  Launch with Mandarin and English support
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  Establish local data center in Singapore
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3">US Launch (Q3 2025)</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  Partner with major health systems (Epic, Cerner)
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  Target health-conscious millennials in major cities
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  Integrate with popular fitness platforms
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  Establish partnerships with insurance providers
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};