import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

const i18nConfig = `
// i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    ns: ['common', 'dashboard', 'health', 'privacy', 'settings'],
    defaultNS: 'common',
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
    supportedLngs: ['en', 'es', 'zh', 'ms', 'ta', 'ru', 'de'],
    nonExplicitSupportedLngs: true,
  });
`;

const languageSwitcher = `
// LanguageSwitcher.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const supportedLanguages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
];

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
  };

  const currentLanguage = supportedLanguages.find(lang => lang.code === i18n.language) || supportedLanguages[0];

  return (
    <Select value={i18n.language} onValueChange={changeLanguage}>
      <SelectTrigger className="w-[150px]">
        <SelectValue>
          <div className="flex items-center space-x-2">
            <span>{currentLanguage.flag}</span>
            <span className="text-sm">{currentLanguage.name}</span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {supportedLanguages.map((language) => (
          <SelectItem key={language.code} value={language.code}>
            <div className="flex items-center space-x-2">
              <span>{language.flag}</span>
              <span>{language.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
`;

const componentUsage = `
// health-dashboard.tsx
import { useTranslation } from "react-i18next";

export default function HealthDashboard() {
  const { t } = useTranslation(['dashboard', 'health', 'common']);
  
  return (
    <h1>{t('dashboard:welcomeMessage')}</h1>
    <p>{t('dashboard:healthOverview')}</p>
    <span>{t('common:connected')}</span>
  );
}
`;

async function diagnoseI18nIssue() {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  
  const prompt = `
You are a React i18next debugging expert. Analyze this i18next implementation where the language switcher appears but changing languages doesn't update the UI text.

PROBLEM: Language switcher is visible but switching languages doesn't change text in components.

CONFIGURATION:
${i18nConfig}

LANGUAGE SWITCHER:
${languageSwitcher}

COMPONENT USAGE:
${componentUsage}

TRANSLATION FILES EXIST:
- /locales/en/common.json
- /locales/en/dashboard.json
- /locales/es/common.json
- /locales/es/dashboard.json
- /locales/zh/common.json
- /locales/zh/dashboard.json

COMMON CAUSES & SOLUTIONS:
1. Translation files not loading properly
2. Component not re-rendering on language change
3. Translation keys not found
4. i18n instance not properly initialized
5. React context not updating

Provide specific debugging steps and exact code fixes to resolve this issue.

Format response as JSON:
{
  "diagnosis": "Root cause analysis",
  "commonIssues": ["issue1", "issue2"],
  "debugSteps": ["step1", "step2"],
  "codeFixes": [
    {
      "file": "filename",
      "issue": "description",
      "fix": "exact code solution"
    }
  ],
  "testingSteps": ["test1", "test2"]
}
`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    return { error: "Failed to parse Gemini response" };
  } catch (error) {
    console.error('Gemini diagnosis error:', error);
    return { error: "Gemini API call failed", details: error };
  }
}

export async function runI18nDiagnosis() {
  console.log('🔍 Diagnosing i18next issue with Gemini AI...\n');
  
  const diagnosis = await diagnoseI18nIssue();
  
  if (diagnosis.error) {
    console.log('❌ Diagnosis failed:', diagnosis.error);
    return null;
  }
  
  console.log('📋 GEMINI AI DIAGNOSIS:');
  console.log('Diagnosis:', diagnosis.diagnosis);
  console.log('\nCommon Issues:', diagnosis.commonIssues);
  console.log('\nDebug Steps:', diagnosis.debugSteps);
  console.log('\nCode Fixes:', diagnosis.codeFixes);
  console.log('\nTesting Steps:', diagnosis.testingSteps);
  
  return diagnosis;
}

// Run diagnosis
runI18nDiagnosis().catch(console.error);