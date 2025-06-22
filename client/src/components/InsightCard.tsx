import { ReactNode } from 'react';
import { Activity, Moon, Droplets } from 'lucide-react';

interface InsightCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  type?: 'primary' | 'indigo' | 'yellow' | 'red' | 'green';
}

export const InsightCard = ({ 
  title, 
  description, 
  icon,
  type = 'primary' 
}: InsightCardProps) => {
  const getBgColor = () => {
    switch (type) {
      case 'primary':
        return 'bg-primary-50 dark:bg-primary-900/20';
      case 'indigo':
        return 'bg-indigo-50 dark:bg-indigo-900/20';
      case 'yellow':
        return 'bg-yellow-50 dark:bg-yellow-900/20';
      case 'red':
        return 'bg-red-50 dark:bg-red-900/20';
      case 'green':
        return 'bg-green-50 dark:bg-green-900/20';
      default:
        return 'bg-primary-50 dark:bg-primary-900/20';
    }
  };

  const getIconBgColor = () => {
    switch (type) {
      case 'primary':
        return 'bg-primary-100 dark:bg-primary-800';
      case 'indigo':
        return 'bg-indigo-100 dark:bg-indigo-800';
      case 'yellow':
        return 'bg-yellow-100 dark:bg-yellow-800';
      case 'red':
        return 'bg-red-100 dark:bg-red-800';
      case 'green':
        return 'bg-green-100 dark:bg-green-800';
      default:
        return 'bg-primary-100 dark:bg-primary-800';
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'primary':
        return 'text-primary-600 dark:text-primary-300';
      case 'indigo':
        return 'text-indigo-600 dark:text-indigo-300';
      case 'yellow':
        return 'text-yellow-600 dark:text-yellow-300';
      case 'red':
        return 'text-red-600 dark:text-red-300';
      case 'green':
        return 'text-green-600 dark:text-green-300';
      default:
        return 'text-primary-600 dark:text-primary-300';
    }
  };

  const getTitleColor = () => {
    switch (type) {
      case 'primary':
        return 'text-primary-800 dark:text-primary-300';
      case 'indigo':
        return 'text-indigo-800 dark:text-indigo-300';
      case 'yellow':
        return 'text-yellow-800 dark:text-yellow-300';
      case 'red':
        return 'text-red-800 dark:text-red-300';
      case 'green':
        return 'text-green-800 dark:text-green-300';
      default:
        return 'text-primary-800 dark:text-primary-300';
    }
  };

  const getTextColor = () => {
    switch (type) {
      case 'primary':
        return 'text-primary-700 dark:text-primary-400';
      case 'indigo':
        return 'text-indigo-700 dark:text-indigo-400';
      case 'yellow':
        return 'text-yellow-700 dark:text-yellow-400';
      case 'red':
        return 'text-red-700 dark:text-red-400';
      case 'green':
        return 'text-green-700 dark:text-green-400';
      default:
        return 'text-primary-700 dark:text-primary-400';
    }
  };

  return (
    <div className={`flex space-x-4 p-4 ${getBgColor()} rounded-lg`}>
      <div className="flex-shrink-0">
        <div className={`w-10 h-10 rounded-full ${getIconBgColor()} flex items-center justify-center ${getIconColor()}`}>
          {icon}
        </div>
      </div>
      <div>
        <h3 className={`text-base font-medium ${getTitleColor()}`}>{title}</h3>
        <p className={`mt-1 text-sm ${getTextColor()}`}>{description}</p>
      </div>
    </div>
  );
};
