import { GoogleGenerativeAI } from '@google/generative-ai';

if (!process.env.GOOGLE_AI_API_KEY) {
  throw new Error('GOOGLE_AI_API_KEY is required for translation analysis');
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

export async function analyzeTranslationSystem(codeContext: {
  languageContext: string;
  components: string[];
  hookImplementation: string;
  translationDict: string;
}) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

  const prompt = `
You are a React internationalization expert. Analyze this translation system implementation and identify why language switching doesn't trigger component re-renders.

CURRENT SYSTEM OVERVIEW:
- React app with Context-based translation system
- 7 languages supported: English, Spanish, Chinese, Malay, Tamil, Russian, German
- LanguageProvider wraps the app with translation context
- useLanguage hook provides t() function and language state
- LanguageSelector component allows users to switch languages
- Issue: When language changes, UI text doesn't update

LANGUAGE CONTEXT IMPLEMENTATION:
${codeContext.languageContext}

HOOK IMPLEMENTATION:
${codeContext.hookImplementation}

TRANSLATION DICTIONARY SAMPLE:
${codeContext.translationDict}

COMPONENTS USING TRANSLATIONS:
${codeContext.components.join('\n\n')}

SPECIFIC ANALYSIS NEEDED:

1. CONTEXT PROVIDER ISSUES:
   - Is the LanguageProvider properly structured?
   - Are all necessary values included in context?
   - Is the context value changing when language updates?

2. RE-RENDER PROBLEMS:
   - Why aren't components re-rendering when language changes?
   - Is the context dependency array correct?
   - Are there any React optimization issues preventing updates?

3. HOOK IMPLEMENTATION:
   - Is useLanguage hook properly subscribing to context changes?
   - Is the translation function t() bound correctly?
   - Are there any closure issues with the translation function?

4. COMPONENT USAGE:
   - Are components using the hook correctly?
   - Any patterns that could prevent re-renders?

5. COMMON REACT i18n PITFALLS:
   - Object reference equality issues
   - Stale closures in translation functions
   - Context value not updating properly
   - Missing dependencies in useEffect/useMemo

PROVIDE:
1. Root cause analysis of why language switching fails
2. Specific code fixes with exact file locations
3. Step-by-step debugging approach
4. Best practices for React translation systems
5. Test cases to verify the fix works

Be extremely specific about the exact problems and solutions.
`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini analysis error:', error);
    throw error;
  }
}

export async function diagnoseComponentTranslations(componentCode: string, componentName: string) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

  const prompt = `
Analyze this React component for translation implementation issues:

COMPONENT: ${componentName}
CODE:
${componentCode}

ANALYSIS CHECKLIST:
1. Is the useLanguage hook imported and used correctly?
2. Are all text strings using the t() function?
3. Are there any hardcoded text strings that should be translated?
4. Is the component properly subscribing to language context changes?
5. Are there any React optimization patterns that could prevent re-renders?
6. Are translation keys consistent and properly named?

PROVIDE:
1. List of specific issues found
2. Line-by-line fixes needed
3. Missing translation keys that should be added
4. Updated component code with proper translation implementation
`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Component analysis error:', error);
    throw error;
  }
}

export async function validateTranslationCompleteness(translations: any) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

  const prompt = `
Analyze this translation dictionary for completeness and consistency:

TRANSLATIONS:
${JSON.stringify(translations, null, 2)}

VALIDATION CHECKS:
1. Are all 7 languages (en, es, zh, ms, ta, ru, de) complete?
2. Does each language have exactly the same keys?
3. Are there any missing translations in any language?
4. Are translation values appropriate for each language/culture?
5. Are there any untranslated English text in non-English languages?
6. Do complex strings with variables translate properly?

PROVIDE:
1. Missing keys per language
2. Inconsistent translations
3. Cultural appropriateness issues
4. Recommendations for improvement
5. Complete missing translations for all languages
`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Translation validation error:', error);
    throw error;
  }
}