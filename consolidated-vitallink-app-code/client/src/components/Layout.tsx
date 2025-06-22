import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { VitalLinkLogo } from "@/components/VitalLinkLogo";
import { useToast } from "@/hooks/use-toast";
import { 
  Home, 
  HardDrive, 
  Shield, 
  Settings, 
  User, 
  BarChart2,
  Menu,
  Bell,
  Check,
  Zap,
  Link2,
  Trophy,
  Award,
  LogOut,
  Brain,
  Activity,
  Heart
} from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [location, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { toast } = useToast();


  // Prevent background scrolling when sidebar is open
  React.useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [sidebarOpen]);

  // Translation system is already declared above

  // List of sidebar menu items
  const menuItems = [
    { path: '/', label: 'Dashboard', icon: <Home className="h-5 w-5" />, dataTour: 'dashboard' },
    { path: '/platforms', label: 'Platforms', icon: <Link2 className="h-5 w-5" />, dataTour: 'platforms' },
    { path: '/ai-insights', label: 'AI Insights', icon: <Brain className="h-5 w-5" />, dataTour: 'ai-insights' },
    { path: '/nftme', label: 'NFTme', icon: <Trophy className="h-5 w-5" />, dataTour: 'nftme' },
    { path: '/privacy', label: 'Privacy', icon: <Shield className="h-5 w-5" />, dataTour: 'privacy' },
    { path: '/settings', label: 'Settings', icon: <Settings className="h-5 w-5" />, dataTour: 'settings' },
  ];

  const handleLogout = () => {
    // Clear demo authentication
    localStorage.removeItem('vitallink-demo-auth');
    localStorage.removeItem('vitallink-onboarding-completed');
    // Force immediate re-render by updating state
    window.dispatchEvent(new Event('storage'));
    // Navigate to landing page
    setLocation('/');
    // Small delay to ensure state updates
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  const connectedDevices = [
    { name: 'Apple Health', connected: true },
    { name: 'Fitbit', connected: true },
    { name: 'Google Fit', connected: true },
  ];



  // Get the current page title
  const getCurrentPageTitle = () => {
    const currentItem = menuItems.find(item => item.path === location);
    return currentItem ? currentItem.label : 'Not Found';
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header - Fixed positioning */}
      <header className="bg-white dark:bg-gray-800 shadow-sm z-50 flex-shrink-0 fixed top-0 left-0 right-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center min-w-0 flex-1">
              {/* Mobile menu button - iOS optimized touch target */}
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)} 
                className="lg:hidden inline-flex items-center justify-center p-3 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white focus:outline-none active:bg-gray-100 dark:active:bg-gray-700 transition-colors"
                style={{ minWidth: '44px', minHeight: '44px' }}
              >
                <Menu className="h-5 w-5" />
              </button>
              
              {/* Logo - responsive sizing */}
              <div className="flex-shrink-0 flex items-center ml-2 lg:ml-0" data-tour="logo">
                <div className="flex items-center">
                  <VitalLinkLogo size={40} />
                  <span className="ml-2 text-lg sm:text-xl font-semibold truncate">VitalLink</span>
                </div>
              </div>
            </div>
            
            {/* Right side of navbar - iOS optimized */}
            <div className="flex items-center space-x-1 sm:space-x-3 flex-shrink-0">

              
              {/* Language switcher */}
              <div className="hidden sm:flex items-center justify-center flex-shrink-0">
                <LanguageSwitcher />
              </div>
              
              {/* Dark mode toggle */}
              <div className="flex items-center justify-center flex-shrink-0" style={{ minWidth: '44px', minHeight: '44px' }}>
                <ThemeToggle />
              </div>
              
              {/* Notifications - iOS touch target */}
              <button 
                onClick={() => {
                  toast({
                    title: "Notifications",
                    description: "No new notifications",
                  });
                }}
                className="p-3 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white focus:outline-none relative active:bg-gray-100 dark:active:bg-gray-700 transition-colors"
                style={{ minWidth: '44px', minHeight: '44px' }}
              >
                <Bell className="h-5 w-5" />
              </button>
              
              {/* Profile dropdown - iOS optimized */}
              {isAuthenticated && (
                <div className="ml-2 relative flex-shrink-0">
                  <button 
                    onClick={() => {
                      toast({
                        title: "Profile Settings",
                        description: "Profile settings coming soon",
                      });
                    }}
                    className="p-2 rounded-lg active:bg-gray-100 dark:active:bg-gray-700 transition-colors"
                    style={{ minWidth: '44px', minHeight: '44px' }}
                  >
                    <Avatar className="h-7 w-7 sm:h-8 sm:w-8 rounded-full">
                      {user?.profileImageUrl ? (
                        <AvatarImage src={user.profileImageUrl} alt="User profile" />
                      ) : (
                        <AvatarFallback className="bg-primary/20 text-primary text-sm">
                          {user?.firstName?.charA0 || user?.email?.charA0 || 'V'}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      
      <div className="flex flex-1 pt-14 sm:pt-16">
        {/* Sidebar for desktop */}
        <div className="hidden lg:flex lg:flex-shrink-0">
          <div className="flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <nav className="mt-5 flex-1 px-3 space-y-1">
                {menuItems.map((item) => (
                  <div key={item.path} onClick={() => setLocation(item.path)}>
                    <div 
                      className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer ${
                        location === item.path 
                          ? 'bg-primary-50 dark:bg-gray-700 text-primary dark:text-primary' 
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                      data-tour={item.dataTour}
                    >
                      <span 
                        className={`mr-3 h-6 w-6 ${
                          location === item.path 
                            ? 'text-primary dark:text-primary' 
                            : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300'
                        }`}
                      >
                        {item.icon}
                      </span>
                      {item.label}
                    </div>
                  </div>
                ))}
                
                {/* Logout Button */}
                <div onClick={handleLogout}>
                  <div className="group flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                    <span className="mr-3 h-6 w-6 text-red-600 dark:text-red-400">
                      <LogOut className="h-5 w-5" />
                    </span>
                    Logout
                  </div>
                </div>
              </nav>
            </div>
            
            {/* Health score display */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="bg-primary-50 dark:bg-gray-700 rounded-lg p-3">
                <div className="flex items-center">
                  <div className="mr-3">
                    <Shield className="h-8 w-8 text-primary-500" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Health Score
                    </div>
                    <div className="font-bold text-primary-600 dark:text-primary-400 text-xl">84</div>
                  </div>
                  <div className="ml-auto flex items-center text-success-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                    <span className="text-xs font-medium ml-0.5">+3</span>
                  </div>
                </div>
                <div className="mt-2 h-1.5 w-full bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                  <div className="bg-primary-500 h-full rounded-full" style={{ width: '84%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile sidebar - Fixed positioning */}
        {sidebarOpen && (
          <div className="fixed inset-0 flex z-50 lg:hidden" role="dialog" aria-modal="true">
            <div 
              className="fixed inset-0 bg-gray-600 bg-opacity-75"
              onClick={() => setSidebarOpen(false)}
              aria-hidden="true"
            ></div>
            
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-gray-800">
              <div className="absolute top-2 right-0 -mr-12 pt-2">
                <button 
                  className="ml-1 flex items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white active:bg-gray-700 transition-colors"
                  onClick={() => setSidebarOpen(false)}
                  style={{ minWidth: '44px', minHeight: '44px' }}
                >
                  <span className="sr-only">Close sidebar</span>
                  <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                <div className="flex-shrink-0 flex items-center px-4">
                  <div className="flex items-center">
                    <VitalLinkLogo size={32} />
                    <span className="ml-2 text-xl font-semibold">VitalLink</span>
                  </div>
                </div>
                
                <nav className="mt-5 px-2 space-y-2">
                  {menuItems.map((item) => (
                    <div key={item.path} 
                      onClick={() => {
                        setLocation(item.path);
                        setSidebarOpen(false);
                      }}
                    >
                      <div 
                        className={`group flex items-center px-4 py-3 text-base font-medium rounded-lg cursor-pointer transition-colors active:scale-95 ${
                          location === item.path 
                            ? 'bg-primary-50 dark:bg-gray-700 text-primary dark:text-primary' 
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 active:bg-gray-100 dark:active:bg-gray-600'
                        }`}
                        style={{ minHeight: '48px' }}
                      >
                        <span 
                          className={`mr-4 h-5 w-5 flex-shrink-0 ${
                            location === item.path 
                              ? 'text-primary dark:text-primary' 
                              : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300'
                          }`}
                        >
                          {item.icon}
                        </span>
                        <span className="truncate">{item.label}</span>
                      </div>
                    </div>
                  ))}
                  
                  {/* Mobile Logout Button */}
                  <div onClick={() => {
                    handleLogout();
                    setSidebarOpen(false);
                  }}>
                    <div className="group flex items-center px-4 py-3 text-base font-medium rounded-lg cursor-pointer transition-colors active:scale-95 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 active:bg-red-100 dark:active:bg-red-900/30"
                         style={{ minHeight: '48px' }}>
                      <span className="mr-4 h-5 w-5 flex-shrink-0 text-red-600 dark:text-red-400">
                        <LogOut className="h-5 w-5" />
                      </span>
                      <span className="truncate">Log out</span>
                    </div>
                  </div>
                </nav>
              </div>
              
              {/* Health score display for mobile */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="bg-primary-50 dark:bg-gray-700 rounded-lg p-3">
                  <div className="flex items-center">
                    <div className="mr-3">
                      <Shield className="h-8 w-8 text-primary-500" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Health Score</div>
                      <div className="font-bold text-primary-600 dark:text-primary-400 text-xl">84</div>
                    </div>
                    <div className="ml-auto flex items-center text-success-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
                      <span className="text-xs font-medium ml-0.5">+3</span>
                    </div>
                  </div>
                  <div className="mt-2 h-1.5 w-full bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                    <div className="bg-primary-500 h-full rounded-full" style={{ width: '84%' }}></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex-shrink-0 w-14" aria-hidden="true">
              {/* Force sidebar to shrink to fit close icon */}
            </div>
          </div>
        )}
        
        {/* Main content - Responsive */}
        <div className="flex-1 flex flex-col w-full">
          <main className="flex-1 bg-gray-50 dark:bg-gray-900 w-full">
            <div className="w-full max-w-none px-3 py-4 sm:px-4 sm:py-6 md:px-6 lg:px-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
