import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Globe, DollarSign, Shield, Building2, Heart, Flag } from 'lucide-react';

interface MarketConfig {
  id: string;
  name: string;
  currency: string;
  currencySymbol: string;
  languages: string[];
  regulatoryFramework: string[];
  popularPlatforms: string[];
  healthcareIntegrations: string[];
  flag: string;
}

const marketConfigs: MarketConfig[] = [
  {
    id: 'singapore',
    name: 'Singapore',
    currency: 'SGD',
    currencySymbol: 'S$',
    languages: ['English', 'Mandarin', 'Malay', 'Tamil'],
    regulatoryFramework: ['PDPA', 'HIPAA', 'Medical Device Act'],
    popularPlatforms: ['HealthHub', 'SingHealth', 'Apple Health', 'Google Fit'],
    healthcareIntegrations: ['National Electronic Health Record', 'HealthHub API', 'SingHealth Connect'],
    flag: '🇸🇬'
  },
  {
    id: 'usa',
    name: 'United States',
    currency: 'USD',
    currencySymbol: '$',
    languages: ['English', 'Spanish'],
    regulatoryFramework: ['HIPAA', 'FDA 21 CFR Part 820', 'HITECH Act'],
    popularPlatforms: ['Epic MyChart', 'Cerner HealtheLife', 'MyFitnessPal', 'Strava', 'Peloton'],
    healthcareIntegrations: ['Epic FHIR', 'Cerner SMART', 'Allscripts', 'athenahealth'],
    flag: '🇺🇸'
  }
];

export const MarketLocalization: React.FC = () => {
  const [selectedMarket, setSelectedMarket] = useState<string>('singapore');
  
  const currentMarket = marketConfigs.find(m => m.id === selectedMarket) || marketConfigs[0];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          <Globe className="w-6 h-6 inline mr-2" />
          Market Localization
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Configure VitalLink for specific regional markets
        </p>
      </div>

      {/* Market Selection */}
      <div className="flex gap-4 justify-center">
        {marketConfigs.map((market) => (
          <Button
            key={market.id}
            variant={selectedMarket === market.id ? "default" : "outline"}
            onClick={() => setSelectedMarkemarket.id}
            className="flex items-center gap-2"
          >
            <span className="text-lg">{market.flag}</span>
            {market.name}
          </Button>
        ))}
      </div>

      {/* Market Details */}
      <div className="grid md:grid-cols-1 gap-6">

        {/* Regulatory Compliance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Regulatory Framework
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {currentMarket.regulatoryFramework.map((framework) => (
                <Badge key={framework} variant="outline" className="text-xs">
                  {framework}
                </Badge>
              ))}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {currentMarket.id === 'singapore' 
                ? 'Compliant with Singapore\'s PDPA and international HIPAA standards'
                : 'Full HIPAA compliance with FDA medical device regulations'
              }
            </div>
          </CardContent>
        </Card>

        {/* Healthcare Integrations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Healthcare Systems
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              {currentMarket.healthcareIntegrations.map((integration) => (
                <div key={integration} className="flex items-center justify-between">
                  <span className="text-sm">{integration}</span>
                  <Badge variant="secondary" className="text-xs">Ready</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Popular Platforms */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Popular Health Platforms
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              {currentMarket.popularPlatforms.map((platform) => (
                <Badge key={platform} variant="outline" className="text-xs justify-center py-1">
                  {platform}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Language Support */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flag className="w-5 h-5" />
            Language Support
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {currentMarket.languages.map((language) => (
              <Badge key={language} variant="secondary">
                {language}
              </Badge>
            ))}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
            Multi-language interface with cultural adaptations for local health practices
          </p>
        </CardContent>
      </Card>

      {/* Implementation Status */}
      <Card className="border-green-200 dark:border-green-800">
        <CardHeader>
          <CardTitle className="text-green-700 dark:text-green-300">
            Implementation Roadmap
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Phase 1: Foundation</h4>
              <ul className="text-sm space-y-1">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Currency Support
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Basic Compliance
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  Language Framework
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Phase 2: Integration</h4>
              <ul className="text-sm space-y-1">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  Healthcare APIs
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  Payment Gateways
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  Local Partnerships
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Phase 3: Launch</h4>
              <ul className="text-sm space-y-1">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  Market Testing
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  Regulatory Approval
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  Commercial Launch
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};