import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

async function diagnosePartialTranslationIssue() {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  
  const consoleOutput = `
CURRENT STATUS - Translation files now loading successfully:
- "Translation test: Welcome to your health dashboard" (English working)
- "Translation test: 欢迎使用您的健康仪表板" (Chinese working)
- "i18next::backendConnector: loaded namespace dashboard for language en"
- All namespaces loading: common, dashboard, health, privacy, settings

PROBLEM: Only some UI text translates while other elements remain untranslated
- Language switcher works and console shows correct translations
- Some components show translated text, others don't update
- Translation keys work in console but not all UI components re-render
`;

  const implementationDetails = `
WORKING: Translation files load correctly, some text translates
NOT WORKING: Many UI components don't update when language changes

Implementation Pattern:
- Components use: const { t } = useTranslation(['dashboard', 'health', 'common'])
- Translation calls: t('dashboard:welcomeMessage')
- Some components show translations, others remain in original language

Possible Issues:
- Components not re-rendering when language changes
- Missing useTranslation hooks in some components
- Incorrect translation key references
- Component memoization preventing updates
`;

  const prompt = `
You are a React i18next expert. Analyze this partial translation issue:

PROBLEM: Translation files load successfully but only some UI components update when language changes.

CONSOLE OUTPUT:
${consoleOutput}

IMPLEMENTATION:
${implementationDetails}

Provide specific diagnosis and complete fix. Return ONLY valid JSON without any markdown formatting:

{"rootCause": "Why only some components translate", "componentIssue": "What prevents components from re-rendering", "solution": "Complete fix with specific code changes", "missingImplementation": "What components need translation hooks", "testSteps": ["step1", "step2", "step3"], "codeChangesRequired": "Exact code modifications needed"}
`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    // Clean the response to remove any markdown formatting
    const cleanResponse = response.replace(/```json|```/g, '').trim();
    
    try {
      return JSON.parse(cleanResponse);
    } catch (parseError) {
      console.log('Raw response:', response);
      console.log('Clean response:', cleanResponse);
      return { error: "Failed to parse Gemini response", rawResponse: response };
    }
  } catch (error) {
    console.error('Gemini diagnosis error:', error);
    return { error: "Gemini API call failed", details: error };
  }
}

export async function runUITranslationDiagnosis() {
  console.log('🔍 Gemini AI analyzing partial translation issue...\n');
  
  const diagnosis = await diagnosePartialTranslationIssue();
  
  if (diagnosis.error) {
    console.log('❌ Diagnosis failed:', diagnosis.error);
    return null;
  }
  
  console.log('📋 GEMINI AI UI TRANSLATION DIAGNOSIS:');
  console.log('\nRoot Cause:', diagnosis.rootCause);
  console.log('\nComponent Issue:', diagnosis.componentIssue);
  console.log('\nSolution:', diagnosis.solution);
  console.log('\nMissing Implementation:', diagnosis.missingImplementation);
  console.log('\nCode Changes Required:', diagnosis.codeChangesRequired);
  console.log('\nTest Steps:', diagnosis.testSteps);
  
  return diagnosis;
}

runUITranslationDiagnosis().catch(console.error);