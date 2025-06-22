import React from 'react';
import { SubscriptionPlans } from '@/components/SubscriptionPlans';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { ArrowLeft } from 'lucide-react';

export default function SubscriptionPage() {
  const [, setLocation] = useLocation();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Button 
          onClick={() => setLocation('/')} 
          variant="ghost" 
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <h1 className="text-3xl font-bold mb-2">Choose Your Plan</h1>
        <p className="text-muted-foreground">
          Select the VitalLink subscription that best fits your health data needs
        </p>
      </div>

      <SubscriptionPlans />
      
      <div className="mt-12 text-center">
        <div className="bg-muted p-6 rounded-lg max-w-2xl mx-auto">
          <h3 className="font-semibold mb-2">Singapore Launch Special</h3>
          <p className="text-sm text-muted-foreground">
            As one of our first Singapore users, you'll receive priority support and 
            early access to new features. All plans include PDPA compliance and 
            blockchain security at no extra cost.
          </p>
        </div>
      </div>
    </div>
  );
}