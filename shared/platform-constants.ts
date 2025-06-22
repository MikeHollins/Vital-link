// Platform gradients and styling constants
export const PLATFORM_GRADIENTS: Record<string, string> = {
  'general-health': 'bg-gradient-to-br from-blue-500 to-blue-700',
  'wearables': 'bg-gradient-to-br from-green-500 to-green-700',
  'glucose': 'bg-gradient-to-br from-purple-500 to-purple-700',
  'cardiovascular': 'bg-gradient-to-br from-red-500 to-red-700',
  'sleep': 'bg-gradient-to-br from-indigo-500 to-indigo-700',
  'nutrition': 'bg-gradient-to-br from-orange-500 to-orange-700',
  'mental-health': 'bg-gradient-to-br from-pink-500 to-pink-700',
  'ehr': 'bg-gradient-to-br from-gray-500 to-gray-700',
  'default': 'bg-gradient-to-br from-teal-500 to-teal-700'
};

export const DEVICE_TYPE_ICONS = {
  phone: '📱',
  watch: '⌚',
  scale: '⚖️',
  sensor: '🔬',
  monitor: '📊'
};

export const DATA_FREQUENCY_COLORS = {
  'real-time': 'text-green-600 dark:text-green-400',
  'hourly': 'text-blue-600 dark:text-blue-400',
  'daily': 'text-purple-600 dark:text-purple-400'
};

export const getGradientForCategory = (category: string): string => {
  return PLATFORM_GRADIENTS[category] || PLATFORM_GRADIENTS.default;
};