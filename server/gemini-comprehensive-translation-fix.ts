import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

export async function generateComprehensiveTranslations() {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const prompt = `
You are a professional i18next translation expert working on a React health platform called VitalLink. 

TASK: Generate comprehensive translation files for ALL user-facing text in the application.

CURRENT COMPONENT STRUCTURE:
1. Navigation (home, dashboard, profile, settings, health, nftme)
2. Authentication (login, signup, password reset)
3. Dashboard (welcome, stats, health metrics)
4. Health Platform (data connections, metrics, charts)
5. NFT Me (health achievements, blockchain verification)
6. Settings (preferences, language, privacy)
7. Profile (user info, medical data, connections)
8. Wallet Connection (crypto wallets, verification)

LANGUAGES NEEDED:
- English (en) - primary
- Spanish (es) 
- Chinese (zh)
- Malay (ms)
- Tamil (ta)
- Russian (ru)
- German (de)

TRANSLATION FILE STRUCTURE NEEDED:
/public/locales/{lang}/common.json - Basic UI elements, navigation, buttons
/public/locales/{lang}/dashboard.json - Dashboard specific content
/public/locales/{lang}/health.json - Health platform content
/public/locales/{lang}/privacy.json - Privacy and security content
/public/locales/{lang}/settings.json - Settings page content

REQUIREMENTS:
1. Create COMPLETE translation objects with nested structure
2. Include interpolation placeholders like {{name}}, {{count}}, {{date}}
3. Handle pluralization where needed
4. Include error messages, success messages, validation text
5. Medical terminology should be accurate
6. Privacy/security terms must be precise
7. Use professional, clear language appropriate for healthcare

Generate the COMPLETE English (en) translation files first, with comprehensive coverage of ALL possible UI text for a health platform.

Focus on:
- Authentication flows
- Health data management
- Privacy controls
- Dashboard analytics
- NFT achievement system
- Wallet connections
- Settings and preferences
- Error handling
- Success confirmations
- Loading states
- Form validation
- Medical terminology
- Legal/compliance text

Provide the JSON structure with proper nesting and interpolation support.
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini AI translation generation error:', error);
    throw error;
  }
}

export async function generateSpecificLanguageTranslations(baseTranslations: string, targetLanguage: string) {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const prompt = `
You are a professional medical translator specializing in health platform applications.

TASK: Translate the following English i18next translation files to ${targetLanguage}.

REQUIREMENTS:
1. Maintain exact JSON structure and key names
2. Translate ONLY the values, never the keys
3. Keep interpolation placeholders like {{name}}, {{count}} unchanged
4. Use medical terminology appropriate for ${targetLanguage}
5. Maintain professional healthcare language standards
6. Preserve pluralization structures
7. Keep technical terms (like "API", "NFT", "blockchain") as-is when appropriate
8. Use culturally appropriate greetings and phrases

LANGUAGE SPECIFIC NOTES:
- Chinese (zh): Use simplified Chinese, formal medical terms
- Spanish (es): Use formal medical Spanish, neutral Latin American dialect
- Malay (ms): Use standard Bahasa Malaysia with medical terminology
- Tamil (ta): Use formal Tamil with appropriate medical vocabulary
- Russian (ru): Use formal Russian with medical terminology
- German (de): Use formal German with medical terminology

BASE ENGLISH TRANSLATIONS:
${baseTranslations}

Return ONLY the translated JSON with exact same structure, no explanations.
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error(`Gemini AI translation error for ${targetLanguage}:`, error);
    throw error;
  }
}

export async function analyzeComponentsForMissingTranslations() {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const prompt = `
You are a React i18next code auditor specializing in finding untranslated strings.

TASK: Analyze React components and identify ALL hardcoded strings that need translation.

COMMON PATTERNS TO FIND:
1. JSX text content: <div>Hardcoded Text</div>
2. String literals in attributes: placeholder="Hardcoded"
3. Alert/toast messages: toast.success("Hardcoded message")
4. Button text: <Button>Hardcoded Button</Button>
5. Form labels and validation messages
6. Error messages and success confirmations
7. Loading states and placeholders
8. Chart labels and tooltips
9. Medical terminology and units
10. Date/time formatting text

PROVIDE:
1. List of all hardcoded strings found
2. Suggested translation key structure
3. Recommended namespace organization
4. Priority level (HIGH/MEDIUM/LOW) based on user visibility

Focus particularly on:
- Authentication components
- Dashboard elements  
- Health platform interfaces
- Settings pages
- NFT components
- Wallet connection flows
- Privacy/security sections

Return a structured analysis with specific file locations and recommended fixes.
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini AI component analysis error:', error);
    throw error;
  }
}