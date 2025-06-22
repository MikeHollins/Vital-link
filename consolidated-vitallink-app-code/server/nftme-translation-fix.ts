import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

// All NFTME-related text that needs translation
const nftmeEnglishTexts = {
  // Page headers and main content
  authenticationRequired: 'Authentication Required',
  pleaseLogInViewNFT: 'Please log in to view your NFT data.',
  nftmeAchievements: 'NFTme Achievements',
  turnHealthMilestones: 'Turn your health milestones into collectible NFTs',
  
  // Stats labels
  totalData: 'Total Data',
  mintedNFTs: 'Minted NFTs',
  shared: 'Shared',
  legendary: 'Legendary',
  
  // Achievement data titles and descriptions
  tenKStepsChampion: '10K Steps Champion',
  achievedTenKSteps: 'Achieved 10,000 steps for 30 consecutive days',
  heartRateMaster: 'Heart Rate Master',
  maintainedOptimalHeart: 'Maintained optimal heart rate zones for 50 workouts',
  sleepConsistencyPro: 'Sleep Consistency Pro',
  maintainedEightHours: 'Maintained 8+ hours of sleep for 21 days',
  platformLinker: 'Platform Linker',
  successfullyLinkedTen: 'Successfully linked 10+ health platforms',
  
  // Rarity levels
  common: 'common',
  rare: 'rare',
  epic: 'epic',
  
  // Progress and actions
  progress: 'Progress',
  share: 'Share',
  mintNFT: 'Mint NFT',
  viewNFT: 'View NFT',
  
  // Upcoming achievements section
  upcomingAchievements: 'Upcoming Achievements',
  marathonMonth: 'Marathon Month',
  completeDays: 'Complete 31 days of 5km+ walks/runs',
  hydrationHero: 'Hydration Hero',
  drinkEightGlasses: 'Drink 8+ glasses of water for 14 consecutive days',
  
  // Privacy section
  privacyProtected: 'Privacy Protected',
  allAchievementData: 'All achievement data is encrypted and HIPAA compliant. You maintain full control over sharing and blockchain minting.',
  
  // Toast messages
  dataShared: 'Data Shared!',
  hasBeenShared: 'has been shared to your profile.',
  nftMintingStarted: 'NFT Minting Started',
  yourDataBeingMinted: 'Your data is being minted as an NFT on the blockchain.',
};

// Function to translate texts to a specific language
async function translateToLanguage(texts: Record<string, string>, targetLanguage: string): Promise<Record<string, string>> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
  const languageNames = {
    'es': 'Spanish',
    'zh': 'Chinese (Simplified)',
    'ms': 'Malay',
    'ta': 'Tamil',
    'ru': 'Russian',
    'de': 'German'
  };
  
  const languageName = languageNames[targetLanguage as keyof typeof languageNames];
  
  const prompt = `
    You are a professional translator specializing in health technology applications.
    
    Translate the following English text keys to ${languageName}. The context is for a health data NFT platform called "VitalLink" where users can convert their health achievements into blockchain NFTs.
    
    Important guidelines:
    1. Maintain technical accuracy for health and blockchain terms
    2. Keep the tone professional yet accessible
    3. Preserve any brand names like "VitalLink", "NFTme", "HIPAA"
    4. For rarity levels (common, rare, epic, legendary), translate appropriately for gaming/collectibles context
    5. Return ONLY a JSON object with the same keys, translated values
    
    English texts to translate:
    ${JSON.stringify(texts, null, 2)}
    
    Return format: JSON object with same keys, translated values in ${languageName}.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean up the response to extract JSON
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    } else {
      throw new Error('No valid JSON found in response');
    }
  } catch (error) {
    console.error(`Error translating to ${languageName}:`, error);
    throw error;
  }
}

// Function to generate all translations
async function generateAllNFTmeTranslations() {
  const languages = ['es', 'zh', 'ms', 'ta', 'ru', 'de'];
  const allTranslations: Record<string, Record<string, string>> = {
    en: nftmeEnglishTexts
  };
  
  console.log('🌐 Starting NFTME translations for all languages...');
  
  for (const lang of languages) {
    try {
      console.log(`📝 Translating to ${lang}...`);
      const translations = await translateToLanguage(nftmeEnglishTexts, lang);
      allTranslations[lang] = translations;
      console.log(`✅ ${lang} translation completed`);
      
      // Add small delay to respect API rate limits
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`❌ Failed to translate to ${lang}:`, error);
    }
  }
  
  return allTranslations;
}

// Function to apply translations to language file
function generateLanguageFileCode(translations: Record<string, Record<string, string>>) {
  let output = '// NFTME Page Translation Keys\n\n';
  
  for (const [langCode, texts] of Object.entries(translations)) {
    output += `// ${langCode.toUpperCase()} NFTME translations\n`;
    output += `${langCode}: {\n`;
    
    for (const [key, value] of Object.entries(texts)) {
      // Escape quotes in the value
      const escapedValue = value.replace(/'/g, "\\'");
      output += `  ${key}: '${escapedValue}',\n`;
    }
    
    output += `},\n\n`;
  }
  
  return output;
}

// Main execution function
export async function fixNFTmeTranslations() {
  try {
    console.log('🚀 Starting NFTME translation fix...');
    
    const translations = await generateAllNFTmeTranslations();
    const languageFileCode = generateLanguageFileCode(translations);
    
    console.log('📄 Generated language file additions:');
    console.log(languageFileCode);
    
    return {
      success: true,
      translations,
      languageFileCode,
      message: '✅ NFTME translations generated successfully!'
    };
  } catch (error) {
    console.error('❌ Error fixing NFTME translations:', error);
    return {
      success: false,
      error: error.message,
      message: '❌ Failed to generate NFTME translations'
    };
  }
}

// Execute the translation fix
fixNFTmeTranslations()
  .then(result => {
    console.log(result.message);
    if (result.success) {
      console.log('\n📋 Copy the following translations to your language.tsx file:');
      console.log(result.languageFileCode);
    }
  })
  .catch(console.error);