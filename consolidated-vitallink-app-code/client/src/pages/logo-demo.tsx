import React from 'react';
import { VitalLinkLogo } from '@/components/VitalLinkLogo';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';

export default function LogoDemo() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Button 
            onClick={() => setLocation('/')} 
            variant="outline"
            className="mb-4"
          >
            ← Back to App
          </Button>
          <h1 className="text-3xl font-bold mb-2 text-teal-700 dark:text-teal-300">VitalLink Official Logo</h1>
          <p className="text-muted-foreground">The official VitalLink brand logo in different sizes</p>
        </div>

        {/* Logo showcase in different sizes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg text-center">
            <h3 className="text-lg font-semibold mb-4 text-teal-700 dark:text-teal-300">Small (80px)</h3>
            <VitalLinkLogo size={80} />
          </div>
          
          <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg text-center">
            <h3 className="text-lg font-semibold mb-4 text-teal-700 dark:text-teal-300">Medium (150px)</h3>
            <VitalLinkLogo size={150} />
          </div>
          
          <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg text-center">
            <h3 className="text-lg font-semibold mb-4 text-teal-700 dark:text-teal-300">Large (250px)</h3>
            <VitalLinkLogo size={250} />
          </div>
        </div>

        {/* Full size showcase */}
        <div className="bg-white dark:bg-slate-800 p-12 rounded-xl shadow-lg text-center">
          <h3 className="text-2xl font-semibold mb-8 text-teal-700 dark:text-teal-300">
            Official VitalLink Logo
          </h3>
          <VitalLinkLogo size={400} />
          <p className="text-muted-foreground mt-6">
            Secure health data aggregation with blockchain technology
          </p>
        </div>
      </div>
    </div>
  );
}