import { GoogleGenerativeAI } from '@google/generative-ai';
import * as fs from 'fs';
import * as path from 'path';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

interface TranslationNamespace {
  [key: string]: string;
}

interface LanguageTranslations {
  [namespace: string]: TranslationNamespace;
}

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'zh', name: 'Chinese (Simplified)' },
  { code: 'ms', name: 'Malay' },
  { code: 'ta', name: 'Tamil' },
  { code: 'ru', name: 'Russian' },
  { code: 'de', name: 'German' }
];

const baseTranslations = {
  common: {
    // Navigation & General
    dashboard: "Dashboard",
    health: "Health",
    privacy: "Privacy",
    settings: "Settings",
    devices: "Devices",
    insights: "Insights",
    
    // Actions
    connect: "Connect",
    disconnect: "Disconnect",
    save: "Save",
    cancel: "Cancel",
    submit: "Submit",
    delete: "Delete",
    edit: "Edit",
    view: "View",
    
    // Status
    connected: "Connected",
    disconnected: "Disconnected",
    syncing: "Syncing",
    error: "Error",
    success: "Success",
    loading: "Loading",
    
    // Time
    today: "Today",
    yesterday: "Yesterday",
    thisWeek: "This Week",
    thisMonth: "This Month",
    lastUpdated: "Last Updated"
  },
  
  dashboard: {
    welcomeMessage: "Welcome to your health dashboard",
    healthOverview: "Your comprehensive health overview",
    quickConnect: "Quick Connect",
    connectedDevices: "Connected Devices",
    recentActivity: "Recent Activity",
    healthMetrics: "Health Metrics",
    dailyGoals: "Daily Goals",
    weeklyProgress: "Weekly Progress"
  },
  
  health: {
    // Vital Signs
    heartRate: "Heart Rate",
    bloodPressure: "Blood Pressure",
    temperature: "Temperature",
    oxygenSaturation: "Oxygen Saturation",
    respiratoryRate: "Respiratory Rate",
    
    // Activity Metrics
    steps: "Steps",
    distance: "Distance",
    calories: "Calories",
    activeMinutes: "Active Minutes",
    
    // Sleep & Recovery
    sleepDuration: "Sleep Duration",
    sleepQuality: "Sleep Quality",
    restingHeartRate: "Resting Heart Rate",
    
    // Units
    bpm: "BPM",
    mmHg: "mmHg",
    celsius: "°C",
    fahrenheit: "°F",
    percent: "%",
    hours: "hours",
    minutes: "minutes",
    kilometers: "km",
    miles: "miles"
  },
  
  privacy: {
    dataPrivacy: "Data Privacy",
    zeroKnowledge: "Zero-Knowledge Verification",
    encryptedStorage: "Encrypted Storage",
    consentManagement: "Consent Management",
    dataAccess: "Data Access",
    privacySettings: "Privacy Settings",
    secureSharing: "Secure Sharing"
  },
  
  settings: {
    accountSettings: "Account Settings",
    notifications: "Notifications",
    dataSync: "Data Synchronization",
    languageSettings: "Language Settings",
    units: "Units",
    preferences: "Preferences",
    backup: "Backup",
    export: "Export Data"
  }
};

async function generateTranslationsForLanguage(targetLanguage: string, targetLanguageName: string): Promise<LanguageTranslations> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
  
  const prompt = `
You are a professional medical translator specializing in health technology applications. 
Translate the following health platform interface text from English to ${targetLanguageName}.

Requirements:
1. Use authentic medical terminology appropriate for healthcare applications
2. Maintain consistency with international health standards (WHO, FDA, etc.)
3. Ensure translations are culturally appropriate for ${targetLanguageName} speakers
4. Use formal, professional tone suitable for medical/health contexts
5. Preserve technical accuracy for health metrics and medical terms

Source text in JSON format:
${JSON.stringify(baseTranslations, null, 2)}

Provide the complete translation in the same JSON structure. Ensure all keys remain in English (unchanged) and only translate the values to ${targetLanguageName}.

Response format: Valid JSON only, no additional text or explanations.
`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    // Extract JSON from response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    throw new Error(`Failed to parse JSON response for ${targetLanguageName}`);
  } catch (error) {
    console.error(`Translation error for ${targetLanguageName}:`, error);
    throw error;
  }
}

async function saveTranslationsToFiles(languageCode: string, translations: LanguageTranslations) {
  const basePath = path.join(process.cwd(), 'public', 'locales', languageCode);
  
  // Ensure directory exists
  if (!fs.existsSync(basePath)) {
    fs.mkdirSync(basePath, { recursive: true });
  }
  
  // Save each namespace to its own file
  for (const [namespace, content] of Object.entries(translations)) {
    const filePath = path.join(basePath, `${namespace}.json`);
    fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf8');
    console.log(`Saved ${languageCode}/${namespace}.json`);
  }
}

export async function generateAllTranslations() {
  console.log('Generating translations using Gemini AI...\n');
  
  // Save English as base
  await saveTranslationsToFiles('en', baseTranslations);
  console.log('✅ Saved English translations (base)');
  
  // Generate translations for other languages
  for (const language of languages.slice(1)) { // Skip English
    try {
      console.log(`\n🔄 Generating ${language.name} translations...`);
      const translations = await generateTranslationsForLanguage(language.code, language.name);
      await saveTranslationsToFiles(language.code, translations);
      console.log(`✅ Completed ${language.name} translations`);
      
      // Add delay to respect API rate limits
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(`❌ Failed to generate ${language.name} translations:`, error);
    }
  }
  
  console.log('\n🎉 Translation generation complete!');
}

// Run if called directly
if (require.main === module) {
  generateAllTranslations().catch(console.error);
}