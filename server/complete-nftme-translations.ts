import fs from 'fs';
import path from 'path';

// Define the missing NFTME translation keys that need to be added
const missingNFTMEKeys = {
  // Core NFTME keys
  pleaseLogInViewNFT: 'Please log in to view your NFT data.',
  nftmeAchievements: 'NFTme Achievements',
  turnHealthMilestones: 'Turn your health milestones into collectible NFTs',
  totalData: 'Total Data',
  mintedNFTs: 'Minted NFTs',
  
  // Rarity levels
  common: 'common',
  rare: 'rare',
  epic: 'epic',
  legendary: 'legendary',
  
  // Actions
  shared: 'Shared',
  share: 'Share',
  nftProgress: 'Progress',
  mintNFT: 'Mint NFT',
  viewNFT: 'View NFT',
  
  // Achievement data
  tenKStepsChampion: '10K Steps Champion',
  achievedTenKSteps: 'Achieved 10,000 steps for 30 consecutive days',
  heartRateMaster: 'Heart Rate Master',
  maintainedOptimalHeart: 'Maintained optimal heart rate zones for 50 workouts',
  sleepConsistencyPro: 'Sleep Consistency Pro',
  maintainedEightHours: 'Maintained 8+ hours of sleep for 21 days',
  platformLinker: 'Platform Linker',
  successfullyLinkedTen: 'Successfully linked 10+ health platforms',
  
  // Upcoming achievements
  upcomingAchievements: 'Upcoming Achievements',
  marathonMonth: 'Marathon Month',
  completeDays: 'Complete 31 days of 5km+ walks/runs',
  hydrationHero: 'Hydration Hero',
  drinkEightGlasses: 'Drink 8+ glasses of water for 14 consecutive days',
  
  // Messages
  allAchievementData: 'All achievement data is encrypted and HIPAA compliant. You maintain full control over sharing and blockchain minting.',
  dataShared: 'Data Shared!',
  hasBeenShared: 'has been shared to your profile.',
  nftMintingStarted: 'NFT Minting Started',
  yourDataBeingMinted: 'Your data is being minted as an NFT on the blockchain.'
};

// Translation mappings for each language
const translations = {
  es: {
    pleaseLogInViewNFT: 'Por favor, inicia sesión para ver tus datos NFT.',
    nftmeAchievements: 'Logros NFTme',
    turnHealthMilestones: 'Convierte tus hitos de salud en NFTs coleccionables',
    totalData: 'Datos Totales',
    mintedNFTs: 'NFTs Acuñados',
    common: 'común',
    rare: 'raro',
    epic: 'épico',
    legendary: 'legendario',
    shared: 'Compartido',
    share: 'Compartir',
    nftProgress: 'Progreso',
    mintNFT: 'Acuñar NFT',
    viewNFT: 'Ver NFT',
    tenKStepsChampion: 'Campeón de 10K Pasos',
    achievedTenKSteps: 'Logró 10,000 pasos durante 30 días consecutivos',
    heartRateMaster: 'Maestro del Ritmo Cardíaco',
    maintainedOptimalHeart: 'Mantuvo zonas óptimas de ritmo cardíaco durante 50 entrenamientos',
    sleepConsistencyPro: 'Pro de Consistencia del Sueño',
    maintainedEightHours: 'Mantuvo 8+ horas de sueño durante 21 días',
    platformLinker: 'Conector de Plataformas',
    successfullyLinkedTen: 'Conectó exitosamente 10+ plataformas de salud',
    upcomingAchievements: 'Próximos Logros',
    marathonMonth: 'Mes de Maratón',
    completeDays: 'Completa 31 días de caminatas/carreras de 5km+',
    hydrationHero: 'Héroe de Hidratación',
    drinkEightGlasses: 'Bebe 8+ vasos de agua durante 14 días consecutivos',
    allAchievementData: 'Todos los datos de logros están encriptados y cumplen con HIPAA. Mantienes control total sobre compartir y acuñar blockchain.',
    dataShared: '¡Datos Compartidos!',
    hasBeenShared: 'ha sido compartido en tu perfil.',
    nftMintingStarted: 'Acuñado de NFT Iniciado',
    yourDataBeingMinted: 'Tus datos están siendo acuñados como NFT en blockchain.'
  },
  zh: {
    pleaseLogInViewNFT: '请登录查看您的NFT数据。',
    nftmeAchievements: 'NFTme成就',
    turnHealthMilestones: '将您的健康里程碑转化为可收藏的NFT',
    totalData: '总数据',
    mintedNFTs: '已铸造NFT',
    common: '普通',
    rare: '稀有',
    epic: '史诗',
    legendary: '传奇',
    shared: '已分享',
    share: '分享',
    nftProgress: '进度',
    mintNFT: '铸造NFT',
    viewNFT: '查看NFT',
    tenKStepsChampion: '万步冠军',
    achievedTenKSteps: '连续30天达到10,000步',
    heartRateMaster: '心率大师',
    maintainedOptimalHeart: '在50次锻炼中保持最佳心率区间',
    sleepConsistencyPro: '睡眠一致性专家',
    maintainedEightHours: '21天保持8+小时睡眠',
    platformLinker: '平台连接器',
    successfullyLinkedTen: '成功连接10+个健康平台',
    upcomingAchievements: '即将到来的成就',
    marathonMonth: '马拉松月',
    completeDays: '完成31天5公里+步行/跑步',
    hydrationHero: '水分英雄',
    drinkEightGlasses: '连续14天喝8+杯水',
    allAchievementData: '所有成就数据都经过加密且符合HIPAA标准。您对分享和区块链铸造拥有完全控制权。',
    dataShared: '数据已分享！',
    hasBeenShared: '已分享到您的个人资料。',
    nftMintingStarted: 'NFT铸造已开始',
    yourDataBeingMinted: '您的数据正在区块链上铸造为NFT。'
  },
  ms: {
    pleaseLogInViewNFT: 'Sila log masuk untuk melihat data NFT anda.',
    nftmeAchievements: 'Pencapaian NFTme',
    turnHealthMilestones: 'Tukarkan pencapaian kesihatan anda kepada NFT yang boleh dikumpul',
    totalData: 'Jumlah Data',
    mintedNFTs: 'NFT yang Ditempa',
    common: 'biasa',
    rare: 'jarang',
    epic: 'epik',
    legendary: 'legenda',
    shared: 'Dikongsi',
    share: 'Kongsi',
    nftProgress: 'Kemajuan',
    mintNFT: 'Tempa NFT',
    viewNFT: 'Lihat NFT',
    tenKStepsChampion: 'Juara 10K Langkah',
    achievedTenKSteps: 'Mencapai 10,000 langkah selama 30 hari berturut-turut',
    heartRateMaster: 'Ahli Kadar Jantung',
    maintainedOptimalHeart: 'Mengekalkan zon kadar jantung optimum untuk 50 senaman',
    sleepConsistencyPro: 'Pro Konsistensi Tidur',
    maintainedEightHours: 'Mengekalkan 8+ jam tidur selama 21 hari',
    platformLinker: 'Penghubung Platform',
    successfullyLinkedTen: 'Berjaya menghubungkan 10+ platform kesihatan',
    upcomingAchievements: 'Pencapaian Akan Datang',
    marathonMonth: 'Bulan Maraton',
    completeDays: 'Lengkapkan 31 hari berjalan/berlari 5km+',
    hydrationHero: 'Wira Hidrasi',
    drinkEightGlasses: 'Minum 8+ gelas air selama 14 hari berturut-turut',
    allAchievementData: 'Semua data pencapaian dienkripsi dan mematuhi HIPAA. Anda mengekalkan kawalan penuh atas perkongsian dan pencetakan blockchain.',
    dataShared: 'Data Dikongsi!',
    hasBeenShared: 'telah dikongsi ke profil anda.',
    nftMintingStarted: 'Pencetakan NFT Dimulakan',
    yourDataBeingMinted: 'Data anda sedang dicetak sebagai NFT di blockchain.'
  },
  ta: {
    pleaseLogInViewNFT: 'உங்கள் NFT தரவைப் பார்க்க உள்நுழையவும்.',
    nftmeAchievements: 'NFTme சாதனைகள்',
    turnHealthMilestones: 'உங்கள் ஆரோக்கிய மைல்கற்களை சேகரிக்கக்கூடிய NFTகளாக மாற்றுங்கள்',
    totalData: 'மொத்த தரவு',
    mintedNFTs: 'அச்சிடப்பட்ட NFTகள்',
    common: 'பொதுவான',
    rare: 'அரிய',
    epic: 'காவியம்',
    legendary: 'புராணம்',
    shared: 'பகிரப்பட்டது',
    share: 'பகிர்',
    nftProgress: 'முன்னேற்றம்',
    mintNFT: 'NFT அச்சிடு',
    viewNFT: 'NFT பார்',
    tenKStepsChampion: '10K அடிகள் சாம்பியன்',
    achievedTenKSteps: '30 தொடர்ச்சியான நாட்களுக்கு 10,000 அடிகள் அடைந்தது',
    heartRateMaster: 'இதய துடிப்பு மாஸ்டர்',
    maintainedOptimalHeart: '50 உடற்பயிற்சிகளுக்கு உகந்த இதய துடிப்பு மண்டலங்களை பராமரித்தது',
    sleepConsistencyPro: 'தூக்க நிலைத்தன்மை நிபுணர்',
    maintainedEightHours: '21 நாட்களுக்கு 8+ மணி நேர தூக்கத்தை பராமரித்தது',
    platformLinker: 'தளம் இணைப்பாளர்',
    successfullyLinkedTen: '10+ ஆரோக்கிய தளங்களை வெற்றிகரமாக இணைத்தது',
    upcomingAchievements: 'வரவிருக்கும் சாதனைகள்',
    marathonMonth: 'மாரத்தான் மாதம்',
    completeDays: '31 நாட்கள் 5கிமீ+ நடைபயிற்சி/ஓட்டம் நிறைவு செய்',
    hydrationHero: 'நீரேற்ற ஹீரோ',
    drinkEightGlasses: '14 தொடர்ச்சியான நாட்களுக்கு 8+ கிளாஸ் தண்ணீர் குடிக்க',
    allAchievementData: 'அனைத்து சாதனை தரவும் குறியாக்கம் செய்யப்பட்டு HIPAA இணக்கமானது. பகிர்வு மற்றும் பிளாக்செயின் அச்சிடலின் மீது நீங்கள் முழு கட்டுப்பாட்டை வைத்திருக்கிறீர்கள்.',
    dataShared: 'தரவு பகிரப்பட்டது!',
    hasBeenShared: 'உங்கள் சுயவிவரத்தில் பகிரப்பட்டது.',
    nftMintingStarted: 'NFT அச்சிடல் தொடங்கியது',
    yourDataBeingMinted: 'உங்கள் தரவு பிளாக்செயினில் NFTயாக அச்சிடப்படுகிறது.'
  },
  ru: {
    pleaseLogInViewNFT: 'Пожалуйста, войдите в систему, чтобы просмотреть ваши NFT данные.',
    nftmeAchievements: 'Достижения NFTme',
    turnHealthMilestones: 'Превратите ваши достижения в области здоровья в коллекционные NFT',
    totalData: 'Общие Данные',
    mintedNFTs: 'Отчеканенные NFT',
    common: 'обычный',
    rare: 'редкий',
    epic: 'эпический',
    legendary: 'легендарный',
    shared: 'Поделился',
    share: 'Поделиться',
    nftProgress: 'Прогресс',
    mintNFT: 'Чеканить NFT',
    viewNFT: 'Посмотреть NFT',
    tenKStepsChampion: 'Чемпион 10K Шагов',
    achievedTenKSteps: 'Достиг 10,000 шагов в течение 30 дней подряд',
    heartRateMaster: 'Мастер Сердечного Ритма',
    maintainedOptimalHeart: 'Поддерживал оптимальные зоны сердечного ритма в течение 50 тренировок',
    sleepConsistencyPro: 'Профи Постоянства Сна',
    maintainedEightHours: 'Поддерживал 8+ часов сна в течение 21 дня',
    platformLinker: 'Связующее Платформ',
    successfullyLinkedTen: 'Успешно связал 10+ платформ здоровья',
    upcomingAchievements: 'Предстоящие Достижения',
    marathonMonth: 'Марафонский Месяц',
    completeDays: 'Завершите 31 день ходьбы/бега 5км+',
    hydrationHero: 'Герой Гидратации',
    drinkEightGlasses: 'Пейте 8+ стаканов воды в течение 14 дней подряд',
    allAchievementData: 'Все данные достижений зашифрованы и соответствуют HIPAA. Вы сохраняете полный контроль над обменом и чеканкой блокчейна.',
    dataShared: 'Данные Поделены!',
    hasBeenShared: 'было поделено в вашем профиле.',
    nftMintingStarted: 'Чеканка NFT Начата',
    yourDataBeingMinted: 'Ваши данные чеканятся как NFT на блокчейне.'
  },
  de: {
    pleaseLogInViewNFT: 'Bitte melden Sie sich an, um Ihre NFT-Daten anzuzeigen.',
    nftmeAchievements: 'NFTme Erfolge',
    turnHealthMilestones: 'Verwandeln Sie Ihre Gesundheitsmeilensteine in sammelbare NFTs',
    totalData: 'Gesamtdaten',
    mintedNFTs: 'Geprägte NFTs',
    common: 'gewöhnlich',
    rare: 'selten',
    epic: 'episch',
    legendary: 'legendär',
    shared: 'Geteilt',
    share: 'Teilen',
    nftProgress: 'Fortschritt',
    mintNFT: 'NFT Prägen',
    viewNFT: 'NFT Anzeigen',
    tenKStepsChampion: '10K Schritte Champion',
    achievedTenKSteps: 'Erreichte 10.000 Schritte für 30 aufeinanderfolgende Tage',
    heartRateMaster: 'Herzfrequenz Meister',
    maintainedOptimalHeart: 'Hielt optimale Herzfrequenzzonen für 50 Workouts aufrecht',
    sleepConsistencyPro: 'Schlafkonsistenz Profi',
    maintainedEightHours: 'Hielt 8+ Stunden Schlaf für 21 Tage aufrecht',
    platformLinker: 'Plattform Verknüpfer',
    successfullyLinkedTen: 'Erfolgreich 10+ Gesundheitsplattformen verknüpft',
    upcomingAchievements: 'Kommende Erfolge',
    marathonMonth: 'Marathon Monat',
    completeDays: 'Vervollständige 31 Tage mit 5km+ Spaziergängen/Läufen',
    hydrationHero: 'Hydrations Held',
    drinkEightGlasses: 'Trinke 8+ Gläser Wasser für 14 aufeinanderfolgende Tage',
    allAchievementData: 'Alle Erfolgsdaten sind verschlüsselt und HIPAA-konform. Sie behalten die volle Kontrolle über das Teilen und Blockchain-Prägen.',
    dataShared: 'Daten Geteilt!',
    hasBeenShared: 'wurde zu Ihrem Profil geteilt.',
    nftMintingStarted: 'NFT Prägung Gestartet',
    yourDataBeingMinted: 'Ihre Daten werden als NFT auf der Blockchain geprägt.'
  }
};

async function updateLanguageFile() {
  const languageFilePath = path.join(process.cwd(), '../client/src/lib/language.tsx');
  
  try {
    // Read the current language file
    let content = fs.readFileSync(languageFilePath, 'utf8');
    
    // For each language, add the missing keys
    Object.entries(translations).forEach(([lang, langTranslations]) => {
      // Find the language section
      const sectionStart = content.indexOf(`${lang}: {`);
      if (sectionStart === -1) {
        console.log(`❌ Language section ${lang} not found`);
        return;
      }
      
      // Find the end of the language section
      let braceCount = 0;
      let sectionEnd = sectionStart;
      let inString = false;
      let escapeNext = false;
      
      for (let i = sectionStart; i < content.length; i++) {
        const char = content[i];
        
        if (escapeNext) {
          escapeNext = false;
          continue;
        }
        
        if (char === '\\') {
          escapeNext = true;
          continue;
        }
        
        if (char === '"' || char === "'") {
          inString = !inString;
          continue;
        }
        
        if (!inString) {
          if (char === '{') {
            braceCount++;
          } else if (char === '}') {
            braceCount--;
            if (braceCount === 0) {
              sectionEnd = i;
              break;
            }
          }
        }
      }
      
      // Insert the new keys before the closing brace
      const insertPosition = sectionEnd;
      let keysToInsert = '\n    \n    // NFTME Page Translations\n';
      
      Object.entries(langTranslations).forEach(([key, value]) => {
        // Check if key already exists in this language section
        const keyPattern = new RegExp(`\\b${key}\\s*:`);
        const languageSection = content.slice(sectionStart, sectionEnd);
        
        if (!keyPattern.test(languageSection)) {
          keysToInsert += `    ${key}: '${value.replace(/'/g, "\\'")}',\n`;
        }
      });
      
      if (keysToInsert.trim() !== '// NFTME Page Translations') {
        content = content.slice(0, insertPosition) + keysToInsert + content.slice(insertPosition);
      }
    });
    
    // Write the updated content back to the file
    fs.writeFileSync(languageFilePath, content, 'utf8');
    console.log('✅ Successfully updated language file with NFTME translations');
    
  } catch (error) {
    console.error('❌ Error updating language file:', error);
  }
}

// Run the update
updateLanguageFile();