import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

async function generateEnglishTranslations() {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `
Generate comprehensive English translation files for a React health platform called VitalLink with i18next.

Create 5 complete JSON files with proper nesting:

1. common.json - Basic UI elements
2. dashboard.json - Dashboard specific content  
3. health.json - Health platform content
4. privacy.json - Privacy and security content
5. settings.json - Settings page content

Requirements:
- Include ALL possible UI text for a health platform
- Use nested structure for organization
- Include interpolation like {{name}}, {{count}}
- Cover authentication, health data, NFTs, wallets, privacy
- Medical terminology must be accurate
- Include error/success messages, validation text
- Professional healthcare language

Return 5 separate JSON objects labeled clearly:

### common.json
### dashboard.json  
### health.json
### privacy.json
### settings.json
`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

async function translateToLanguage(englishContent: string, targetLang: string, langName: string) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `
Translate these English i18next JSON files to ${langName} (${targetLang}).

CRITICAL REQUIREMENTS:
1. Maintain exact JSON structure and key names
2. Translate ONLY the values, never the keys
3. Keep interpolation {{placeholders}} unchanged
4. Use professional medical terminology
5. Maintain formal healthcare language
6. Keep technical terms like "API", "NFT", "blockchain" as appropriate

ENGLISH CONTENT:
${englishContent}

Return the same 5 JSON files translated to ${langName}, maintaining exact structure.
`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

async function parseAndSaveTranslations(content: string, language: string) {
  const sections = content.split('###').filter(section => section.trim());
  
  for (const section of sections) {
    const lines = section.trim().split('\n');
    const filename = lines[0].trim();
    
    if (filename.endsWith('.json')) {
      const jsonStart = section.indexOf('{');
      if (jsonStart !== -1) {
        const jsonContent = section.substring(jsonStart);
        const cleanJson = jsonContent.replace(/```json|```/g, '').trim();
        
        try {
          // Validate JSON
          JSON.parse(cleanJson);
          
          const filePath = path.join(__dirname, '..', 'public', 'locales', language, filename);
          const dir = path.dirname(filePath);
          
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }
          
          fs.writeFileSync(filePath, cleanJson, 'utf8');
          console.log(`✅ Created ${language}/${filename}`);
        } catch (error) {
          console.error(`❌ Invalid JSON for ${language}/${filename}:`, error);
        }
      }
    }
  }
}

async function generateAllTranslations() {
  try {
    console.log('🤖 Generating English translations with Gemini AI...');
    const englishContent = await generateEnglishTranslations();
    
    console.log('💾 Saving English translations...');
    await parseAndSaveTranslations(englishContent, 'en');
    
    const languages = [
      { code: 'es', name: 'Spanish' },
      { code: 'zh', name: 'Chinese (Simplified)' },
      { code: 'ms', name: 'Malay' },
      { code: 'ta', name: 'Tamil' },
      { code: 'ru', name: 'Russian' },
      { code: 'de', name: 'German' }
    ];
    
    for (const lang of languages) {
      console.log(`🌍 Translating to ${lang.name}...`);
      const translatedContent = await translateToLanguage(englishContent, lang.code, lang.name);
      await parseAndSaveTranslations(translatedContent, lang.code);
    }
    
    console.log('🎉 All translations generated successfully!');
    
  } catch (error) {
    console.error('❌ Translation generation failed:', error);
    throw error;
  }
}

// Run if called directly
generateAllTranslations().catch(console.error);

export { generateAllTranslations };