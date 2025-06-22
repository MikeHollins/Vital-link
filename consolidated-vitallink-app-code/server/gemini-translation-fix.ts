import { GoogleGenerativeAI } from '@google/generative-ai';

if (!process.env.GOOGLE_AI_API_KEY) {
  throw new Error('GOOGLE_AI_API_KEY is required for translation analysis');
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

export async function analyzeTranslationWithGemini() {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }); // Using faster model to avoid quota

  const prompt = `
You are a React internationalization expert. I have a health platform with translation issues.

CURRENT PROBLEM:
- Only 2% of the privacy page is translating
- Navigation menu has hardcoded English text
- Language switching works but most text stays in English

PRIVACY PAGE HARDCODED TEXT (needs translation keys):
- "Authentication Required"
- "Please log in to manage your privacy settings"
- "Security Settings"
- "Two-Factor Authentication"
- "Add an extra layer of security to your account"
- "Biometric Authentication"
- "Use fingerprint or face recognition for quick access"
- "Data Sharing Preferences"
- "Analytics & Performance"
- "Help improve app performance with anonymous usage data"
- "Health Research"
- "Contribute anonymized data to health research studies"
- "Marketing Communications"
- "Receive personalized health tips and product updates"
- "Third-Party Integrations"
- "Allow data sharing with connected health platforms"
- "Profile Visibility"
- "Public Profile"
- "Make your profile visible to other VitalLink users"
- "Achievement Sharing"
- "Share your health achievements and NFTs publicly"
- "Health Metrics"
- "Display basic health statistics on your profile"
- "Export My Data"
- "Delete All Data"
- "Settings Updated"
- "Your privacy preferences have been saved"
- "Data Export Started"
- "Your health data export will be ready for download shortly"

NEEDED SOLUTION:
1. Create Spanish translations for all these keys
2. Create Chinese translations for all these keys  
3. Create Malay translations for all these keys
4. Create Tamil translations for all these keys
5. Create Russian translations for all these keys
6. Create German translations for all these keys

Provide complete translation objects for all 6 languages (Spanish, Chinese, Malay, Tamil, Russian, German).
Format as JSON objects with camelCase keys.
`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini translation analysis error:', error);
    return null;
  }
}

export async function runGeminiTranslationFix() {
  console.log('🔧 Running Gemini AI translation analysis...\n');
  
  try {
    const analysis = await analyzeTranslationWithGemini();
    
    if (analysis) {
      console.log('📋 GEMINI AI TRANSLATION ANALYSIS:');
      console.log(analysis);
      return analysis;
    } else {
      console.log('❌ Gemini AI analysis failed - implementing manual fix');
      return null;
    }
    
  } catch (error) {
    console.error('Translation analysis error:', error);
    return null;
  }
}

// Run if called directly
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  runGeminiTranslationFix().then(result => {
    if (result) {
      console.log('\n✅ Analysis complete - ready to implement translations');
    } else {
      console.log('\n⚠️ Analysis incomplete - manual implementation needed');
    }
  });
}