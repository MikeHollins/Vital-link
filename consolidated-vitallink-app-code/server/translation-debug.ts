import { geminiHealthAI } from './gemini-ai';

export async function analyzeTranslationIssues() {
  const prompt = `
  Analyze this React multilingual health platform translation implementation:

  CURRENT SETUP:
  - LanguageProvider with React Context in /lib/language.tsx
  - useLanguage hook returning { t, language, setLanguage }
  - LanguageSelector component for switching languages
  - 7 languages supported: English, Spanish, Chinese, Malay, Tamil, Russian, German
  - Translation dictionary with 200+ keys per language

  PROBLEM:
  Language switching shows in the selector but UI text doesn't update when switching languages.
  Components using t('key') don't re-render when language changes.

  TECHNICAL DETAILS:
  - Context provides translation function t() and current language
  - Components import useLanguage hook and call t('translationKey')
  - LanguageSelector updates language state but components don't re-render

  ANALYSIS NEEDED:
  1. React Context provider hierarchy issues
  2. State management problems causing re-render failures  
  3. Translation function binding issues
  4. Component subscription to language changes
  5. Common React internationalization pitfalls

  Provide specific debugging steps and code fixes for React translation system.
  `;

  try {
    const analysis = await geminiHealthAI.generateHealthInsights({
      healthData: { dates: ['2025-01-01'] },
      userId: 'translation-debug',
      timeframe: 'week',
      language: 'en'
    });

    // Use Gemini for technical analysis
    const technicalAnalysis = await geminiHealthAI.generateMultilingualHealthContent(
      prompt,
      'en',
      'React Technical Debugging'
    );

    return {
      geminiAnalysis: technicalAnalysis,
      recommendations: [
        "Check React Context provider wrapping all components",
        "Verify language state updates trigger component re-renders",
        "Ensure translation function is properly bound to current language",
        "Test React DevTools to see context value changes"
      ]
    };

  } catch (error) {
    console.error("Gemini translation analysis failed:", error);
    return {
      error: "Gemini analysis failed",
      fallbackSteps: [
        "Check if LanguageProvider wraps entire App component",
        "Verify useLanguage hook dependency array includes language state",
        "Test if language state updates are causing context re-renders",
        "Ensure translation function recalculates when language changes"
      ]
    };
  }
}