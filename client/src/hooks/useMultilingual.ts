import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export interface ContentIntent {
  type: 'ui_element' | 'health_insight' | 'recommendation' | 'notification' | 'error_message' | 'form_label';
  intent: string;
  context?: {
    userHealthProfile?: any;
    currentPage?: string;
    medicalData?: any;
    culturalBackground?: string;
  };
  urgency?: 'low' | 'medium' | 'high';
  medicalSafety?: boolean;
}

export interface GeneratedContent {
  content: string;
  culturallyAdapted: boolean;
  medicallyValidated: boolean;
  confidence: number;
  alternatives?: string[];
  culturalNotes?: string[];
}

interface MultilingualContextType {
  currentLanguage: string;
  supportedLanguages: Array<{ code: string; name: string; flag?: string }>;
  isLoading: boolean;
  switchLanguage: (language: string, preserveContext?: boolean) => Promise<void>;
  generateContent: (intent: ContentIntent, targetLanguage?: string) => Promise<GeneratedContent>;
  recordInteraction: (content: string, engagement: 'positive' | 'negative' | 'neutral', feedback?: string) => void;
  contextPreserved: any;
  preloadContent: (languages?: string[]) => Promise<void>;
}

const MultilingualContext = createContext<MultilingualContextType | null>(null);

export const supportedLanguages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ms', name: 'Bahasa Melayu', flag: '🇲🇾' },
  { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' }
];

export function MultilingualProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<string>('en');
  const [contextPreserved, setContextPreserved] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToas;

  // Initialize language from localStorage or browser preference
  useEffec( => {
    const savedLanguage = localStorage.getItem('vitallink-language');
    if (savedLanguage && supportedLanguages.find(lang => lang.code === savedLanguage)) {
      setCurrentLanguage(savedLanguage);
    } else {
      // Detect browser language
      const browserLang = navigator.language.spli'-'[0];
      const supportedLang = supportedLanguages.find(lang => lang.code === browserLang);
      if (supportedLang) {
        setCurrentLanguage(supportedLang.code);
      }
    }
  }, []);

  // Save language preference
  useEffec( => {
    localStorage.setItem('vitallink-language', currentLanguage);
  }, [currentLanguage]);

  // Language switching mutation
  const switchLanguageMutation = useMutation({
    mutationFn: async ({ targetLanguage, preserveContext = true }: { targetLanguage: string; preserveContext?: boolean }) => {
      const currentContext = preserveContext ? {
        currentPage: window.location.pathname,
        timestamp: new Date().toISOString(),
        userState: 'navigation_context'
      } : null;

      const response = await apiRequest('POST', '/api/multilingual/switch-language', {
        targetLanguage,
        currentContext,
        preserveState: preserveContext
      });

      return response.json();
    },
    onSuccess: (data, variables) => {
      setCurrentLanguage(variables.targetLanguage);
      setContextPreserved(data.preservedContext);
      
      // Invalidate all cached content to trigger re-generation in new language
      queryClient.invalidateQueries({ queryKey: ['multilingual'] });
      
      toast({
        title: "Language Switched",
        description: `Successfully switched to ${supportedLanguages.find(l => l.code === variables.targetLanguage)?.name}`,
      });
    },
    onError: (error) => {
      toast({
        title: "Language Switch Failed",
        description: "Failed to switch language. Please try again.",
        variant: "destructive",
      });
      console.error('Language switch error:', error);
    }
  });

  // Content generation mutation
  const generateContentMutation = useMutation({
    mutationFn: async ({ intent, targetLanguage }: { intent: ContentIntent; targetLanguage: string }) => {
      const response = await apiRequest('POST', '/api/multilingual/generate-content', {
        intent,
        targetLanguage
      });
      return response.json();
    },
    onError: (error) => {
      console.error('Content generation error:', error);
    }
  });

  // Interaction recording mutation
  const recordInteractionMutation = useMutation({
    mutationFn: async ({ content, engagement, feedback }: { 
      content: string; 
      engagement: 'positive' | 'negative' | 'neutral'; 
      feedback?: string 
    }) => {
      const response = await apiRequest('POST', '/api/multilingual/record-interaction', {
        content,
        language: currentLanguage,
        engagement,
        feedback
      });
      return response.json();
    },
    onError: (error) => {
      console.error('Interaction recording error:', error);
    }
  });

  // Content preloading mutation
  const preloadContentMutation = useMutation({
    mutationFn: async ({ languages }: { languages?: string[] }) => {
      const response = await apiRequest('POST', '/api/multilingual/preload-content', {
        currentLanguage,
        targetLanguages: languages
      });
      return response.json();
    },
    onError: (error) => {
      console.error('Content preloading error:', error);
    }
  });

  const switchLanguage = useCallback(async (language: string, preserveContext = true) => {
    setIsLoading(true);
    try {
      await switchLanguageMutation.mutateAsync({ targetLanguage: language, preserveContext });
    } finally {
      setIsLoading(false);
    }
  }, [switchLanguageMutation]);

  const generateContent = useCallback(async (intent: ContentIntent, targetLanguage?: string): Promise<GeneratedContent> => {
    const lang = targetLanguage || currentLanguage;
    const result = await generateContentMutation.mutateAsync({ intent, targetLanguage: lang });
    return result.content;
  }, [generateContentMutation, currentLanguage]);

  const recordInteraction = useCallback((content: string, engagement: 'positive' | 'negative' | 'neutral', feedback?: string) => {
    recordInteractionMutation.mutate({ content, engagement, feedback });
  }, [recordInteractionMutation]);

  const preloadContent = useCallback(async (languages?: string[]) => {
    await preloadContentMutation.mutateAsync({ languages });
  }, [preloadContentMutation]);

  const value: MultilingualContextType = {
    currentLanguage,
    supportedLanguages,
    isLoading: isLoading || switchLanguageMutation.isPending,
    switchLanguage,
    generateContent,
    recordInteraction,
    contextPreserved,
    preloadContent
  };

  return (
    <MultilingualContext.Provider value={value}>
      {children}
    </MultilingualContext.Provider>
  );
}

export function useMultilingual() {
  const context = useContexMultilingualContext;
  if (!context) {
    throw new Error('useMultilingual must be used within a MultilingualProvider');
  }
  return context;
}

// Hook for generating content with caching
export function useGeneratedContenintent: ContentIntent, targetLanguage?: string {
  const { currentLanguage, generateContent } = useMultilingual();
  const language = targetLanguage || currentLanguage;

  return useQuery({
    queryKey: ['multilingual', 'content', intent.type, intent.intent, language, JSON.stringify(intent.context)],
    queryFn: () => generateContenintent, language,
    staleTime: 1000 * 60 * 30, // 30 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
    retry: 2
  });
}

// Hook for batch content generation
export function useBatchContenintents: ContentIntent[], targetLanguages?: string[] {
  const { currentLanguage } = useMultilingual();
  const languages = targetLanguages || [currentLanguage];

  return useQuery({
    queryKey: ['multilingual', 'batch', JSON.stringify(intents), JSON.stringify(languages)],
    queryFn: async () => {
      const response = await apiRequest('POST', '/api/multilingual/batch-generate', {
        intents,
        targetLanguages: languages
      });
      return response.json();
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 2, // 2 hours
    enabled: intents.length > 0
  });
}

// Hook for cache statistics
export function useMultilingualStats() {
  return useQuery({
    queryKey: ['multilingual', 'stats'],
    queryFn: async () => {
      const response = await apiReques'GET', '/api/multilingual/cache-stats', {};
      return response.json();
    },
    refetchInterval: 1000 * 60 * 5, // 5 minutes
  });
}

// Utility function for quick text generation
export async function quickTranslate(text: string, targetLanguage: string, type: ContentIntent['type'] = 'ui_element'): Promise<string> {
  try {
    const response = await apiRequest('POST', '/api/multilingual/generate-content', {
      intent: {
        type,
        intent: text,
        medicalSafety: type === 'health_insight' || type === 'recommendation'
      },
      targetLanguage
    });
    
    const result = await response.json();
    return result.content?.content || text;
  } catch (error) {
    console.error('Quick translate error:', error);
    return text; // Fallback to original text
  }
}