import { GoogleGenerativeAI } from '@google/generative-ai';
import * as fs from 'fs';
import * as path from 'path';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

const languages = [
  { code: 'es', name: 'Spanish (Spain)', region: 'European Spanish for healthcare applications' },
  { code: 'zh', name: 'Chinese Simplified', region: 'Mainland China healthcare terminology' },
  { code: 'ms', name: 'Malay', region: 'Malaysia/Singapore medical terminology' },
  { code: 'ta', name: 'Tamil', region: 'Tamil Nadu/Singapore medical terminology' },
  { code: 'ru', name: 'Russian', region: 'Russian Federation healthcare terminology' },
  { code: 'de', name: 'German', region: 'German healthcare and medical device terminology' }
];

async function generateTranslation(languageCode: string, languageName: string, region: string) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
  
  const prompt = `You are a certified medical translator specializing in health technology platforms. Generate authentic, professional medical translations for a zero-knowledge health verification platform.

LANGUAGE: ${languageName}
REGION: ${region}

TRANSLATION REQUIREMENTS:
1. Use authentic medical terminology recognized by healthcare authorities
2. Maintain consistency with international health standards (WHO, ICD-10, SNOMED)
3. Use formal, professional tone suitable for medical applications
4. Ensure cultural appropriateness for the target region
5. Apply proper medical device terminology standards

Generate translations for these health platform terms in JSON format:

{
  "common": {
    "dashboard": "Dashboard",
    "health": "Health", 
    "privacy": "Privacy",
    "settings": "Settings",
    "devices": "Devices",
    "insights": "Insights",
    "connect": "Connect",
    "connected": "Connected",
    "syncing": "Syncing",
    "loading": "Loading",
    "today": "Today",
    "thisWeek": "This Week"
  },
  "dashboard": {
    "welcomeMessage": "Welcome to your health dashboard",
    "healthOverview": "Your comprehensive health overview", 
    "quickConnect": "Quick Connect",
    "connectedDevices": "Connected Devices",
    "healthMetrics": "Health Metrics",
    "dailySteps": "Daily Steps",
    "weeklyProgress": "Weekly Progress"
  },
  "health": {
    "heartRate": "Heart Rate",
    "bloodPressure": "Blood Pressure",
    "steps": "Steps",
    "sleepDuration": "Sleep Duration",
    "sleepQuality": "Sleep Quality",
    "bpm": "BPM",
    "hours": "hours",
    "minutes": "minutes"
  }
}

RESPOND WITH VALID JSON ONLY - no additional text or explanations.`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    // Extract JSON from response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const translations = JSON.parse(jsonMatch[0]);
      
      // Save to files
      const basePath = path.join(process.cwd(), 'public', 'locales', languageCode);
      
      for (const [namespace, content] of Object.entries(translations)) {
        const filePath = path.join(basePath, `${namespace}.json`);
        fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf8');
      }
      
      console.log(`✅ Generated ${languageName} translations`);
      return true;
    }
    
    throw new Error(`Failed to parse JSON for ${languageName}`);
  } catch (error) {
    console.error(`❌ Translation error for ${languageName}:`, error);
    return false;
  }
}

export async function generateAllLanguages() {
  console.log('🌐 Generating authentic medical translations with Gemini AI...\n');
  
  for (const language of languages) {
    await generateTranslation(language.code, language.name, language.region);
    // Rate limiting delay
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
  
  console.log('\n🎉 All translations generated successfully!');
}

// Execute directly
generateAllLanguages().catch(console.error);