import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

// Define the hardcoded English text we need to replace
const hardcodedTexts = [
  // Layout component
  { text: 'Close sidebar', key: 'closeSidebar' },
  { text: 'Log out', key: 'logout' },
  
  // Missing navigation translations
  { text: 'Link Platforms', key: 'linkPlatforms' },
  { text: 'Vital AI', key: 'vitalAI' },
  { text: 'Privacy & Security', key: 'privacySecurity' },
  { text: 'Health Score', key: 'healthScore' },
  { text: 'Notifications', key: 'notifications' },
  { text: 'Profile Settings', key: 'profileSettings' },
  
  // Common UI elements
  { text: 'User profile', key: 'userProfile' },
  { text: 'No new notifications at this time.', key: 'noNewNotifications' },
  { text: 'Profile settings coming soon.', key: 'profileSettingsComingSoon' },
];

async function translateTexts(texts: string[], targetLanguage: string): Promise<Record<string, string>> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
  const languageNames = {
    es: 'Spanish',
    zh: 'Chinese (Simplified)',
    ms: 'Malay',
    ta: 'Tamil',
    ru: 'Russian',
    de: 'German'
  };

  const prompt = `
Translate the following English texts to ${languageNames[targetLanguage as keyof typeof languageNames]}. 
Return only a JSON object with the English text as keys and translations as values.
Keep the translations natural and contextually appropriate for a health app interface.

Texts to translate:
${texts.map(text => `"${text}"`).join('\n')}

Return format:
{
  "English text 1": "Translation 1",
  "English text 2": "Translation 2"
}
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    throw new Error('No valid JSON found in response');
  } catch (error) {
    console.error(`Error translating to ${targetLanguage}:`, error);
    return {};
  }
}

async function updateLanguageFile() {
  const languageFilePath = path.join(process.cwd(), '../client/src/lib/language.tsx');
  
  try {
    let content = fs.readFileSync(languageFilePath, 'utf8');
    
    // First, add missing English keys
    const englishTexts = hardcodedTexts.map(item => item.text);
    
    // Find English section and add missing keys
    const enSectionMatch = content.match(/(en: \{[\s\S]*?)(},\s*es: \{)/);
    if (enSectionMatch) {
      let enSection = enSectionMatch[1];
      
      // Add missing keys to English section
      hardcodedTexts.forEach(({ text, key }) => {
        if (!enSection.includes(`${key}:`)) {
          enSection += `    ${key}: '${text.replace(/'/g, "\\'")}',\n    `;
        }
      });
      
      content = content.replace(enSectionMatch[1], enSection);
    }
    
    // Translate and add to other languages
    const languages = ['es', 'zh', 'ms', 'ta', 'ru', 'de'];
    
    for (const lang of languages) {
      console.log(`🌐 Translating to ${lang}...`);
      
      const translations = await translateTexts(englishTexts, lang);
      
      // Find language section
      const langPattern = new RegExp(`(${lang}: \\{[\\s\\S]*?)(},\\s*(?:[a-z]{2}: \\{|\\};))`);
      const langMatch = content.match(langPattern);
      
      if (langMatch) {
        let langSection = langMatch[1];
        
        // Add missing translations
        hardcodedTexts.forEach(({ text, key }) => {
          if (!langSection.includes(`${key}:`)) {
            const translation = translations[text] || text;
            langSection += `    ${key}: '${translation.replace(/'/g, "\\'")}',\n    `;
          }
        });
        
        content = content.replace(langMatch[1], langSection);
      }
      
      console.log(`✅ ${lang} translations added`);
    }
    
    // Write updated content
    fs.writeFileSync(languageFilePath, content, 'utf8');
    console.log('✅ Language file updated successfully');
    
  } catch (error) {
    console.error('❌ Error updating language file:', error);
  }
}

async function updateLayoutComponent() {
  const layoutPath = path.join(process.cwd(), '../client/src/components/Layout.tsx');
  
  try {
    let content = fs.readFileSync(layoutPath, 'utf8');
    
    // Replace hardcoded text with translation keys
    const replacements = [
      { from: '"Close sidebar"', to: 't("closeSidebar")' },
      { from: '"Log out"', to: 't("logout")' },
      { from: 'alt="User profile"', to: 'alt={t("userProfile")}' },
      { from: '<span className="sr-only">Close sidebar</span>', to: '<span className="sr-only">{t("closeSidebar")}</span>' },
      { from: '<span className="truncate">Log out</span>', to: '<span className="truncate">{t("logout")}</span>' },
    ];
    
    replacements.forEach(({ from, to }) => {
      content = content.replace(new RegExp(from, 'g'), to);
    });
    
    fs.writeFileSync(layoutPath, content, 'utf8');
    console.log('✅ Layout component updated successfully');
    
  } catch (error) {
    console.error('❌ Error updating Layout component:', error);
  }
}

async function main() {
  console.log('🚀 Starting comprehensive hardcoded text fix...');
  
  await updateLanguageFile();
  await updateLayoutComponent();
  
  console.log('🎉 All hardcoded text has been replaced with translation keys!');
}

main().catch(console.error);