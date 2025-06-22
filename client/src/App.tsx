import React, { useState } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import LogoDemo from "@/pages/logo-demo";
import SubscriptionPage from "@/pages/subscription";
import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/Layout";
import Dashboard from "@/components/Dashboard";
import { DragDropDashboard } from "@/components/DragDropDashboard";
import Devices from "@/components/Devices";
import NFTmePage from "@/pages/nftme";
import PrivacyPage from "@/pages/privacy";
import MarketReadinessPage from "@/pages/market-readiness";
import AIInsightsPage from "@/pages/ai-insights-page";
import { Settings } from "@/components/Settings";
import Landing from "@/pages/landing";
import UpdatedLanding from "@/pages/updated-landing";
import HealthDashboard from "@/pages/health-dashboard";
import PlatformConnections from "@/pages/platform-connections";
import PlatformsPage from "@/pages/platforms";
import SecureNFTme from "@/pages/secure-nftme";
import SecureHealthDashboard from "@/pages/secure-health-dashboard";
import LoadingScreen from "@/components/LoadingScreen";
import EnvironmentalConstraintDemo from "@/components/EnvironmentalConstraintDemo";
import ZKProofGenerator from "@/components/ZKProofGenerator";
// import OnboardingTour from "@/components/OnboardingTour";
import { ThemeProvider } from "@/hooks/useDarkMode";

// Import i18n configuration
import './i18n';

function AuthenticatedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const [showDevLogin, setShowDevLogin] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Enable demo authentication for zero-knowledge proof demonstration
    localStorage.setItem('vitallink-demo-auth', 'true');
    window.location.reload();
    return <>{children}</>;
  }

  return <>{children}</>;
}

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <UpdatedLanding />;
  }

  return (
    <Layout>
      <Switch>
        <Route path="/" component={HealthDashboard} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/platforms" component={PlatformsPage} />
        <Route path="/devices" component={Devices} />
        <Route path="/privacy" component={PrivacyPage} />
        <Route path="/ai-insights" component={AIInsightsPage} />
        <Route path="/secure" component={SecureHealthDashboard} />
        <Route path="/nftme" component={SecureNFTme} />
        <Route path="/nftme-old" component={NFTmePage} />
        <Route path="/market-readiness" component={MarketReadinessPage} />
        <Route path="/environmental-constraints" component={EnvironmentalConstraintDemo} />
        <Route path="/zk-proof-generator" component={ZKProofGenerator} />
        <Route path="/custom-dashboard" component={() => <DragDropDashboard />} />
        <Route path="/subscription" component={SubscriptionPage} />
        <Route path="/settings" component={() => <Settings />} />
        <Route path="/logo-demo" component={LogoDemo} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="w-full min-h-screen overflow-x-hidden">
      <Toaster />
      <Router />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <AppContent />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;