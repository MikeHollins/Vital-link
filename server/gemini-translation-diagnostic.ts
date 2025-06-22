import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

export async function analyzeTranslationIssues() {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const translationAnalysisPrompt = `
  As a React i18next expert, analyze this VitalLink health platform translation implementation:

  CURRENT SETUP:
  - i18next with react-i18next
  - HTTP backend loading from /locales/{{lng}}/{{ns}}.json
  - LanguageDetector for browser detection
  - Supported languages: en, es, zh, ms, ta, ru, de
  - Namespaces: common, dashboard, health, privacy, settings

  OBSERVED ISSUES:
  1. Some UI text not translating when language is switched
  2. Console shows i18next loading translations successfully
  3. Mixed usage of useTranslation hook vs hardcoded strings
  4. React components showing "Functions are not valid as React child" errors

  ANALYZE AND PROVIDE FIXES FOR:
  1. Missing useTranslation hook implementations
  2. Hardcoded strings that should use translation keys
  3. Incorrect translation key usage patterns
  4. React component rendering issues with translation functions
  5. i18next configuration improvements

  Focus on practical code fixes for React components that will ensure all text translates properly.
  `;

  try {
    const result = await model.generateContent(translationAnalysisPrompt);
    const response = await result.response;
    const analysis = response.text();

    console.log('🔍 Gemini AI Translation Analysis:');
    console.log(analysis);

    return analysis;
  } catch (error) {
    console.error('Gemini AI analysis failed:', error);
    return null;
  }
}

export async function generateTranslationFixes(componentCode: string, componentName: string) {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const fixPrompt = `
  Fix this React component to properly use i18next translations:

  COMPONENT: ${componentName}
  CODE:
  ${componentCode}

  REQUIREMENTS:
  1. Import useTranslation from 'react-i18next'
  2. Replace hardcoded strings with translation keys
  3. Fix any "Functions are not valid as React child" errors
  4. Use proper translation key patterns
  5. Ensure all user-visible text is translatable

  Return the corrected component code with proper i18next integration.
  `;

  try {
    const result = await model.generateContent(fixPrompt);
    const response = await result.response;
    const fixes = response.text();

    console.log(`🔧 Gemini AI fixes for ${componentName}:`);
    console.log(fixes);

    return fixes;
  } catch (error) {
    console.error(`Gemini AI fix generation failed for ${componentName}:`, error);
    return null;
  }
}

export async function validateTranslationKeys(translationKeys: string[], namespace: string) {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const validationPrompt = `
  Validate these i18next translation keys for a health platform:

  NAMESPACE: ${namespace}
  KEYS: ${translationKeys.join(', ')}

  PROVIDE:
  1. Missing translation keys for common health platform UI elements
  2. Suggested key naming improvements
  3. Additional keys needed for complete multilingual support
  4. Best practices for health/medical terminology translation keys

  Focus on comprehensive coverage for a health data verification platform.
  `;

  try {
    const result = await model.generateContent(validationPrompt);
    const response = await result.response;
    const validation = response.text();

    console.log(`📋 Gemini AI translation key validation for ${namespace}:`);
    console.log(validation);

    return validation;
  } catch (error) {
    console.error('Gemini AI key validation failed:', error);
    return null;
  }
}

export default {
  analyzeTranslationIssues,
  generateTranslationFixes,
  validateTranslationKeys
};