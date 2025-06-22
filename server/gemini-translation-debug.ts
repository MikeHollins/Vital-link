import { geminiHealthAI } from './gemini-ai';

export async function analyzeTranslationKeys() {
  const prompt = `
  Analyze this React component translation issue:

  COMPONENT: OneClickConnector.tsx
  PROBLEM: Translation keys like t('appleHealthDesc') showing as literal text instead of translated content

  CODE ANALYSIS:
  \`\`\`tsx
  <p className="text-xs text-gray-500 dark:text-gray-400">
    {platform.name === 'Apple Health' ? t('appleHealthDesc') : 
     platform.name === 'Google Fit' ? t('googleFitDesc') : 
     platform.name === 'Fitbit' ? t('fitbitDesc') : 
     platform.name === 'Samsung Health' ? t('samsungHealthDesc') : 
     platform.name === 'MyFitnessPal' ? t('myFitnessPalDesc') : 
     platform.name === 'Strava' ? t('stravaDesc') : 
     platform.name}
  </p>
  \`\`\`

  TECHNICAL CONTEXT:
  - Component imports: import { useLanguage } from '@/lib/language';
  - Hook usage: const { t } = useLanguage();
  - Translation system uses React Context with provider
  - Some translation keys work (t('connect'), t('connecting')) but platform descriptions don't

  DIAGNOSIS NEEDED:
  1. Why do some t() calls work while others return the key instead of translation?
  2. Are the translation keys missing from the dictionary?
  3. Is there a component re-rendering issue?
  4. Could it be a timing/loading issue with the translation context?

  Provide specific debugging steps and solutions for this React translation issue.
  `;

  try {
    const analysis = await geminiHealthAI.generateMultilingualHealthContent(
      prompt,
      'en',
      'React Translation Debugging'
    );

    return {
      geminiDiagnosis: analysis,
      debugSteps: [
        "Check if translation keys exist in all language dictionaries",
        "Verify useLanguage hook is properly imported and called",
        "Test if language context is providing correct translation function",
        "Examine component mounting order vs translation provider"
      ]
    };

  } catch (error) {
    console.error("Gemini translation analysis failed:", error);
    return {
      error: "Gemini analysis failed",
      fallbackDiagnosis: "Translation keys likely missing from dictionary or context provider issue"
    };
  }
}