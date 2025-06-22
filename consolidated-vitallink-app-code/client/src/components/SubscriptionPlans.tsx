import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Check, Star, Zap, Shield, Crown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';


interface Plan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  description: string;
  features: string[];
  popular?: boolean;
  icon: React.ReactNode;
  color: string;
}

const createPlans = (t: (key: string) => string): Plan[] => [
  {
    id: 'basic',
    name: 'basicPlan',
    price: 19,
    currency: 'SGD',
    interval: 'month',
    description: 'basicPlanDesc',
    features: [
      'Connect up to 3 platforms',
      'Basic health insights',
      'Data export',
      'Email support',
      'Basic dashboard'
    ],
    icon: <Shield className="h-5 w-5" />,
    color: 'text-blue-600'
  },
  {
    id: 'pro',
    name: 'Professional',
    price: 39,
    currency: 'SGD',
    interval: 'month',
    description: 'Advanced features for health enthusiasts',
    features: [
      'Unlimited platform connections',
      'AI-powered health insights',
      'Predictive analytics',
      'Priority support',
      'Custom dashboard',
      'Data correlation analysis',
      'Health goal tracking'
    ],
    popular: true,
    icon: <Star className="h-5 w-5" />,
    color: 'text-yellow-600'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 99,
    currency: 'SGD',
    interval: 'month',
    description: 'Full-featured solution for organizations',
    features: [
      'Everything in Professional',
      'White-label solution',
      'API access',
      'Advanced security',
      'Dedicated support',
      'Custom integrations',
      'Team management',
      'Compliance reporting'
    ],
    icon: <Crown className="h-5 w-5" />,
    color: 'text-purple-600'
  }
];

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: string;
  available: boolean;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'paynow',
    name: 'PayNow',
    description: 'Instant bank transfer',
    icon: '🏦',
    available: true
  },
  {
    id: 'nets',
    name: 'NETS',
    description: 'Singapore national payment',
    icon: '💳',
    available: true
  },
  {
    id: 'crypto',
    name: 'Cryptocurrency',
    description: 'Pay with crypto wallet',
    icon: '₿',
    available: true
  },
  {
    id: 'grabpay',
    name: 'GrabPay',
    description: 'Digital wallet payment',
    icon: '📱',
    available: false
  }
];

export const SubscriptionPlans: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<string>('');
  const { toast } = useToast();

  const plans = createPlans(() => 'English');

  const handlePlanSelect = (plan: Plan) => {
    setSelectedPlan(plan);
    setShowPayment(true);
  };

  const handlePayment = () => {
    if (!selectedPayment) {
      toast({
        title: 'paymentMethodRequired',
        description: 'pleaseSelectPaymentMethod',
        variant: "destructive"
      });
      return;
    }

    // Simulate payment processing
    toast({
      title: 'paymentInitiated',
      description: `${'redirectingTo'} ${paymentMethods.find(p => p.id === selectedPayment)?.name} ${'payment'}...`,
    });

    // In production, would redirect to actual payment processor
    setTimeout(() => {
      toast({
        title: 'subscriptionActivated',
        description: `${'welcomeToVitalLink'} ${selectedPlan?.name}!`,
      });
      setShowPayment(false);
      setSelectedPlan(null);
    }, 2000);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card 
            key={plan.id} 
            className={`relative ${plan.popular ? 'ring-2 ring-primary shadow-lg' : ''}`}
          >
            {plan.popular && (
              <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-primary">
                {'mostPopular'}
              </Badge>
            )}
            
            <CardHeader className="text-center">
              <div className={`mx-auto p-3 rounded-full bg-muted w-fit ${plan.color}`}>
                {plan.icon}
              </div>
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="text-3xl font-bold">
                ${plan.price}
                <span className="text-base font-normal text-muted-foreground">
                  /{plan.interval}
                </span>
              </div>
              <div className="text-sm text-muted-foreground">{plan.currency}</div>
            </CardHeader>

            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                onClick={() => handlePlanSelect(plan)}
                className={`w-full ${plan.popular ? 'bg-primary hover:bg-primary/90' : ''}`}
                variant={plan.popular ? 'default' : 'outline'}
              >
                {'choose'} {plan.name}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Payment Dialog */}
      <Dialog open={showPayment} onOpenChange={setShowPayment}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              {'completeSubscription'}
            </DialogTitle>
            <DialogDescription>
              {selectedPlan && (
                <span>
                  {'subscribeToVitalLink'} {selectedPlan.name} {'for'} ${selectedPlan.price} {selectedPlan.currency}/{selectedPlan.interval}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-3">{'selectPaymentMethod'}</h4>
              <div className="space-y-2">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                      !method.available ? 'opacity-50 cursor-not-allowed' : 
                      selectedPayment === method.id ? 'border-primary bg-primary/5' : 'hover:border-muted-foreground'
                    }`}
                    onClick={() => method.available && setSelectedPayment(method.id)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{method.icon}</span>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{method.name}</div>
                        <div className="text-xs text-muted-foreground">{method.description}</div>
                      </div>
                      {!method.available && (
                        <Badge variant="outline" className="text-xs">{'comingSoon'}</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowPayment(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handlePayment} className="flex-1">
                {'completePayment'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};