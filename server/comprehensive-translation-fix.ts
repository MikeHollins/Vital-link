import { analyzeComponentsForTranslation } from './translation-analyzer';
import * as fs from 'fs';
import * as path from 'path';

// Manual analysis of hardcoded text found in components
export function getHardcodedTextAnalysis() {
  return {
    privacyPage: {
      hardcodedText: [
        "Authentication Required",
        "Please log in to manage your privacy settings.",
        "Your data is secured with Zero-Knowledge Proofs",
        "We can verify your health achievements without seeing your actual health data. End-to-end encryption ensures maximum privacy.",
        "Secure API Connections Required",
        "To connect platforms, you'll need to provide your personal API credentials. This ensures only you have access to your health data with full HIPAA & GDPR compliance.",
        "GDPR Compliant",
        "Control how your health data is used and protected",
        "Health Data Protected",
        "Privacy Rights Respected",
        "Settings",
        "ZK Proofs",
        "Security Settings",
        "Two-Factor Authentication",
        "Add an extra layer of security to your account",
        "Biometric Authentication",
        "Use fingerprint or face recognition for quick access",
        "Data Sharing Preferences",
        "Analytics & Performance",
        "Help improve app performance with anonymous usage data",
        "Health Research",
        "Contribute anonymized data to health research studies",
        "Marketing Communications",
        "Receive personalized health tips and product updates",
        "Third-Party Integrations",
        "Allow data sharing with connected health platforms",
        "Profile Visibility",
        "Public Profile",
        "Make your profile visible to other VitalLink users",
        "Achievement Sharing",
        "Share your health achievements and NFTs publicly",
        "Health Metrics",
        "Display basic health statistics on your profile",
        "Export My Data",
        "Delete All Data",
        "Compliance Information",
        "Settings Updated",
        "Your privacy preferences have been saved.",
        "Data Export Started",
        "Your health data export will be ready for download shortly.",
        "Data Deletion Requested",
        "Your data deletion request has been submitted for processing."
      ],
      suggestedKeys: [
        "authenticationRequired",
        "pleaseLogInManagePrivacy",
        "dataSecuredWithZKP", 
        "verifyWithoutSeeing",
        "secureAPIConnections",
        "apiCredentialsNotice",
        "gdprCompliant",
        "controlHealthDataUsage",
        "healthDataProtected",
        "privacyRightsRespected",
        "settings",
        "zkProofs",
        "securitySettings",
        "twoFactorAuthentication",
        "addExtraSecurityLayer",
        "biometricAuthentication",
        "useFingerprintFaceRecognition",
        "dataSharingPreferences",
        "analyticsPerformance",
        "helpImproveAppPerformance",
        "healthResearch",
        "contributeAnonymizedData",
        "marketingCommunications",
        "receivePersonalizedHealthTips",
        "thirdPartyIntegrations",
        "allowDataSharingConnectedPlatforms",
        "profileVisibility",
        "publicProfile",
        "makeProfileVisibleOtherUsers",
        "achievementSharing",
        "shareHealthAchievementsNFTs",
        "healthMetrics",
        "displayBasicHealthStatistics",
        "exportMyData",
        "deleteAllData",
        "complianceInformation",
        "settingsUpdated",
        "privacyPreferencesSaved",
        "dataExportStarted",
        "healthDataExportReady",
        "dataDeletionRequested",
        "dataDeletionRequestSubmitted"
      ]
    },
    navigation: {
      hardcodedText: [
        "Settings",
        "ZK Proofs"
      ],
      suggestedKeys: [
        "settings",
        "zkProofs"
      ]
    }
  };
}

// Get missing translation keys for all languages
export function getMissingTranslationKeys() {
  const analysis = getHardcodedTextAnalysis();
  const allKeys = [
    ...analysis.privacyPage.suggestedKeys,
    ...analysis.navigation.suggestedKeys
  ];

  return {
    keysToAdd: allKeys,
    translations: {
      en: generateEnglishTranslations(allKeys),
      es: generateSpanishTranslations(allKeys),
      zh: generateChineseTranslations(allKeys),
      ms: generateMalayTranslations(allKeys),
      ta: generateTamilTranslations(allKeys),
      ru: generateRussianTranslations(allKeys),
      de: generateGermanTranslations(allKeys)
    }
  };
}

function generateEnglishTranslations(keys: string[]) {
  const translations: Record<string, string> = {};
  
  // Map keys to English values
  const mapping = {
    authenticationRequired: 'Authentication Required',
    pleaseLogInManagePrivacy: 'Please log in to manage your privacy settings.',
    dataSecuredWithZKP: 'Your data is secured with Zero-Knowledge Proofs',
    verifyWithoutSeeing: 'We can verify your health achievements without seeing your actual health data. End-to-end encryption ensures maximum privacy.',
    secureAPIConnections: 'Secure API Connections Required',
    apiCredentialsNotice: 'To connect platforms, you\'ll need to provide your personal API credentials. This ensures only you have access to your health data with full HIPAA & GDPR compliance.',
    gdprCompliant: 'GDPR Compliant',
    controlHealthDataUsage: 'Control how your health data is used and protected',
    healthDataProtected: 'Health Data Protected',
    privacyRightsRespected: 'Privacy Rights Respected',
    securitySettings: 'Security Settings',
    twoFactorAuthentication: 'Two-Factor Authentication',
    addExtraSecurityLayer: 'Add an extra layer of security to your account',
    biometricAuthentication: 'Biometric Authentication',
    useFingerprintFaceRecognition: 'Use fingerprint or face recognition for quick access',
    dataSharingPreferences: 'Data Sharing Preferences',
    analyticsPerformance: 'Analytics & Performance',
    helpImproveAppPerformance: 'Help improve app performance with anonymous usage data',
    healthResearch: 'Health Research',
    contributeAnonymizedData: 'Contribute anonymized data to health research studies',
    marketingCommunications: 'Marketing Communications',
    receivePersonalizedHealthTips: 'Receive personalized health tips and product updates',
    thirdPartyIntegrations: 'Third-Party Integrations',
    allowDataSharingConnectedPlatforms: 'Allow data sharing with connected health platforms',
    profileVisibility: 'Profile Visibility',
    publicProfile: 'Public Profile',
    makeProfileVisibleOtherUsers: 'Make your profile visible to other VitalLink users',
    achievementSharing: 'Achievement Sharing',
    shareHealthAchievementsNFTs: 'Share your health achievements and NFTs publicly',
    displayBasicHealthStatistics: 'Display basic health statistics on your profile',
    exportMyData: 'Export My Data',
    deleteAllData: 'Delete All Data',
    complianceInformation: 'Compliance Information',
    settingsUpdated: 'Settings Updated',
    privacyPreferencesSaved: 'Your privacy preferences have been saved.',
    dataExportStarted: 'Data Export Started',
    healthDataExportReady: 'Your health data export will be ready for download shortly.',
    dataDeletionRequested: 'Data Deletion Requested',
    dataDeletionRequestSubmitted: 'Your data deletion request has been submitted for processing.'
  };

  keys.forEach(key => {
    if (mapping[key]) {
      translations[key] = mapping[key];
    }
  });

  return translations;
}

function generateSpanishTranslations(keys: string[]) {
  const translations: Record<string, string> = {};
  
  const mapping = {
    authenticationRequired: 'Autenticación Requerida',
    pleaseLogInManagePrivacy: 'Por favor inicie sesión para gestionar su configuración de privacidad.',
    dataSecuredWithZKP: 'Sus datos están protegidos con Pruebas de Conocimiento Cero',
    verifyWithoutSeeing: 'Podemos verificar sus logros de salud sin ver sus datos reales de salud. El cifrado de extremo a extremo garantiza la máxima privacidad.',
    secureAPIConnections: 'Conexiones API Seguras Requeridas',
    apiCredentialsNotice: 'Para conectar plataformas, necesitará proporcionar sus credenciales API personales. Esto garantiza que solo usted tenga acceso a sus datos de salud con total cumplimiento de HIPAA y GDPR.',
    gdprCompliant: 'Cumple con GDPR',
    controlHealthDataUsage: 'Controla cómo se usan y protegen tus datos de salud',
    healthDataProtected: 'Datos de Salud Protegidos',
    privacyRightsRespected: 'Derechos de Privacidad Respetados',
    securitySettings: 'Configuración de Seguridad',
    twoFactorAuthentication: 'Autenticación de Dos Factores',
    addExtraSecurityLayer: 'Agrega una capa extra de seguridad a tu cuenta',
    biometricAuthentication: 'Autenticación Biométrica',
    useFingerprintFaceRecognition: 'Usa huella dactilar o reconocimiento facial para acceso rápido',
    dataSharingPreferences: 'Preferencias de Compartir Datos',
    analyticsPerformance: 'Análisis y Rendimiento',
    helpImproveAppPerformance: 'Ayuda a mejorar el rendimiento de la aplicación con datos de uso anónimos',
    healthResearch: 'Investigación de Salud',
    contributeAnonymizedData: 'Contribuye con datos anonimizados a estudios de investigación de salud',
    marketingCommunications: 'Comunicaciones de Marketing',
    receivePersonalizedHealthTips: 'Recibe consejos de salud personalizados y actualizaciones de productos',
    thirdPartyIntegrations: 'Integraciones de Terceros',
    allowDataSharingConnectedPlatforms: 'Permite compartir datos con plataformas de salud conectadas',
    profileVisibility: 'Visibilidad del Perfil',
    publicProfile: 'Perfil Público',
    makeProfileVisibleOtherUsers: 'Haz visible tu perfil a otros usuarios de VitalLink',
    achievementSharing: 'Compartir Logros',
    shareHealthAchievementsNFTs: 'Comparte tus logros de salud y NFTs públicamente',
    displayBasicHealthStatistics: 'Muestra estadísticas básicas de salud en tu perfil',
    exportMyData: 'Exportar Mis Datos',
    deleteAllData: 'Eliminar Todos los Datos',
    complianceInformation: 'Información de Cumplimiento',
    settingsUpdated: 'Configuración Actualizada',
    privacyPreferencesSaved: 'Tus preferencias de privacidad han sido guardadas.',
    dataExportStarted: 'Exportación de Datos Iniciada',
    healthDataExportReady: 'Tu exportación de datos de salud estará lista para descargar en breve.',
    dataDeletionRequested: 'Eliminación de Datos Solicitada',
    dataDeletionRequestSubmitted: 'Tu solicitud de eliminación de datos ha sido enviada para procesamiento.'
  };

  keys.forEach(key => {
    if (mapping[key]) {
      translations[key] = mapping[key];
    }
  });

  return translations;
}

function generateChineseTranslations(keys: string[]) {
  const translations: Record<string, string> = {};
  
  const mapping = {
    authenticationRequired: '需要身份验证',
    pleaseLogInManagePrivacy: '请登录以管理您的隐私设置。',
    dataSecuredWithZKP: '您的数据受零知识证明保护',
    verifyWithoutSeeing: '我们可以验证您的健康成就，而无需查看您的实际健康数据。端到端加密确保最大隐私。',
    secureAPIConnections: '需要安全API连接',
    apiCredentialsNotice: '要连接平台，您需要提供个人API凭据。这确保只有您可以访问您的健康数据，完全符合HIPAA和GDPR。',
    gdprCompliant: '符合GDPR',
    controlHealthDataUsage: '控制您的健康数据如何使用和保护',
    healthDataProtected: '健康数据受保护',
    privacyRightsRespected: '隐私权受尊重',
    securitySettings: '安全设置',
    twoFactorAuthentication: '双重身份验证',
    addExtraSecurityLayer: '为您的账户添加额外的安全层',
    biometricAuthentication: '生物识别身份验证',
    useFingerprintFaceRecognition: '使用指纹或面部识别快速访问',
    dataSharingPreferences: '数据共享偏好',
    analyticsPerformance: '分析和性能',
    helpImproveAppPerformance: '通过匿名使用数据帮助改善应用性能',
    healthResearch: '健康研究',
    contributeAnonymizedData: '为健康研究贡献匿名化数据',
    marketingCommunications: '营销通讯',
    receivePersonalizedHealthTips: '接收个性化健康提示和产品更新',
    thirdPartyIntegrations: '第三方集成',
    allowDataSharingConnectedPlatforms: '允许与连接的健康平台共享数据',
    profileVisibility: '个人资料可见性',
    publicProfile: '公开个人资料',
    makeProfileVisibleOtherUsers: '让其他VitalLink用户看到您的个人资料',
    achievementSharing: '成就分享',
    shareHealthAchievementsNFTs: '公开分享您的健康成就和NFT',
    displayBasicHealthStatistics: '在您的个人资料上显示基本健康统计',
    exportMyData: '导出我的数据',
    deleteAllData: '删除所有数据',
    complianceInformation: '合规信息',
    settingsUpdated: '设置已更新',
    privacyPreferencesSaved: '您的隐私偏好已保存。',
    dataExportStarted: '数据导出已开始',
    healthDataExportReady: '您的健康数据导出将很快准备好下载。',
    dataDeletionRequested: '数据删除已请求',
    dataDeletionRequestSubmitted: '您的数据删除请求已提交处理。'
  };

  keys.forEach(key => {
    if (mapping[key]) {
      translations[key] = mapping[key];
    }
  });

  return translations;
}

function generateMalayTranslations(keys: string[]) {
  const translations: Record<string, string> = {};
  
  const mapping = {
    authenticationRequired: 'Pengesahan Diperlukan',
    pleaseLogInManagePrivacy: 'Sila log masuk untuk mengurus tetapan privasi anda.',
    dataSecuredWithZKP: 'Data anda dilindungi dengan Bukti Pengetahuan Sifar',
    verifyWithoutSeeing: 'Kami boleh mengesahkan pencapaian kesihatan anda tanpa melihat data kesihatan sebenar anda. Penyulitan hujung ke hujung memastikan privasi maksimum.',
    secureAPIConnections: 'Sambungan API Selamat Diperlukan',
    apiCredentialsNotice: 'Untuk menyambung platform, anda perlu menyediakan kelayakan API peribadi anda. Ini memastikan hanya anda mempunyai akses kepada data kesihatan anda dengan pematuhan penuh HIPAA & GDPR.',
    gdprCompliant: 'Patuh GDPR',
    controlHealthDataUsage: 'Kawal bagaimana data kesihatan anda digunakan dan dilindungi',
    healthDataProtected: 'Data Kesihatan Dilindungi',
    privacyRightsRespected: 'Hak Privasi Dihormati',
    securitySettings: 'Tetapan Keselamatan',
    twoFactorAuthentication: 'Pengesahan Dua Faktor',
    addExtraSecurityLayer: 'Tambah lapisan keselamatan tambahan untuk akaun anda',
    biometricAuthentication: 'Pengesahan Biometrik',
    useFingerprintFaceRecognition: 'Gunakan cap jari atau pengecaman muka untuk akses pantas',
    dataSharingPreferences: 'Keutamaan Perkongsian Data',
    analyticsPerformance: 'Analitik & Prestasi',
    helpImproveAppPerformance: 'Bantu meningkatkan prestasi aplikasi dengan data penggunaan tanpa nama',
    healthResearch: 'Penyelidikan Kesihatan',
    contributeAnonymizedData: 'Sumbang data tanpa nama kepada kajian penyelidikan kesihatan',
    marketingCommunications: 'Komunikasi Pemasaran',
    receivePersonalizedHealthTips: 'Terima petua kesihatan peribadi dan kemaskini produk',
    thirdPartyIntegrations: 'Integrasi Pihak Ketiga',
    allowDataSharingConnectedPlatforms: 'Benarkan perkongsian data dengan platform kesihatan yang disambung',
    profileVisibility: 'Keterlihatan Profil',
    publicProfile: 'Profil Awam',
    makeProfileVisibleOtherUsers: 'Jadikan profil anda boleh dilihat oleh pengguna VitalLink lain',
    achievementSharing: 'Perkongsian Pencapaian',
    shareHealthAchievementsNFTs: 'Kongsi pencapaian kesihatan dan NFT anda secara awam',
    displayBasicHealthStatistics: 'Paparkan statistik kesihatan asas pada profil anda',
    exportMyData: 'Eksport Data Saya',
    deleteAllData: 'Padam Semua Data',
    complianceInformation: 'Maklumat Pematuhan',
    settingsUpdated: 'Tetapan Dikemaskini',
    privacyPreferencesSaved: 'Keutamaan privasi anda telah disimpan.',
    dataExportStarted: 'Eksport Data Dimulakan',
    healthDataExportReady: 'Eksport data kesihatan anda akan sedia untuk dimuat turun tidak lama lagi.',
    dataDeletionRequested: 'Permintaan Padam Data',
    dataDeletionRequestSubmitted: 'Permintaan padam data anda telah diserahkan untuk diproses.'
  };

  keys.forEach(key => {
    if (mapping[key]) {
      translations[key] = mapping[key];
    }
  });

  return translations;
}

function generateTamilTranslations(keys: string[]) {
  const translations: Record<string, string> = {};
  
  const mapping = {
    authenticationRequired: 'அங்கீகார அவசியம்',
    pleaseLogInManagePrivacy: 'உங்கள் தனியுரிமை அமைப்புகளை நிர்வகிக்க தயவுசெய்து உள்நுழையவும்.',
    dataSecuredWithZKP: 'உங்கள் தரவு ஜீரோ-நாலெட்ஜ் சான்றுகளால் பாதுகாக்கப்படுகிறது',
    verifyWithoutSeeing: 'உங்கள் உண்மையான உடல்நலத் தரவைப் பார்க்காமல் உங்கள் உடல்நல சாதனைகளை நாங்கள் சரிபார்க்க முடியும். எண்ட்-டு-எண்ட் என்க்ரிப்ஷன் அதிகபட்ச தனியுரிமையை உறுதி செய்கிறது.',
    secureAPIConnections: 'பாதுகாப்பான ஏபிஐ இணைப்புகள் தேவை',
    apiCredentialsNotice: 'இயங்குதளங்களை இணைக்க, உங்கள் தனிப்பட்ட ஏபிஐ நற்சான்றிதழ்களை வழங்க வேண்டும். இது HIPAA & GDPR முழு இணக்கத்துடன் உங்கள் உடல்நலத் தரவுக்கு நீங்கள் மட்டுமே அணுகல் உள்ளதை உறுதி செய்கிறது.',
    gdprCompliant: 'GDPR இணக்கம்',
    controlHealthDataUsage: 'உங்கள் உடல்நலத் தரவு எவ்வாறு பயன்படுத்தப்படுகிறது மற்றும் பாதுகாக்கப்படுகிறது என்பதைக் கட்டுப்படுத்தவும்',
    healthDataProtected: 'உடல்நலத் தரவு பாதுகாக்கப்பட்டது',
    privacyRightsRespected: 'தனியுரிமை உரிமைகள் மதிக்கப்படுகின்றன',
    securitySettings: 'பாதுகாப்பு அமைப்புகள்',
    twoFactorAuthentication: 'இரண்டு காரணி அங்கீகாரம்',
    addExtraSecurityLayer: 'உங்கள் கணக்கிற்கு கூடுதல் பாதுகாப்பு அடுக்கைச் சேர்க்கவும்',
    biometricAuthentication: 'பயோமெட்ரிக் அங்கீகாரம்',
    useFingerprintFaceRecognition: 'விரைவான அணுகலுக்கு கைரேகை அல்லது முக அங்கீகாரத்தைப் பயன்படுத்தவும்',
    dataSharingPreferences: 'தரவு பகிர்வு விருப்பத்தேர்வுகள்',
    analyticsPerformance: 'பகுப்பாய்வு மற்றும் செயல்திறன்',
    helpImproveAppPerformance: 'அநாமதேய பயன்பாட்டுத் தரவுடன் பயன்பாட்டின் செயல்திறனை மேம்படுத்த உதவுங்கள்',
    healthResearch: 'உடல்நல ஆராய்ச்சி',
    contributeAnonymizedData: 'உடல்நல ஆராய்ச்சி ஆய்வுகளுக்கு அநாமதேய தரவை பங்களிக்கவும்',
    marketingCommunications: 'சந்தைப்படுத்தல் தகவல்தொடர்புகள்',
    receivePersonalizedHealthTips: 'தனிப்பட்ட உடல்நல உதவிக்குறிப்புகள் மற்றும் தயாரிப்பு புதுப்பிப்புகளைப் பெறுங்கள்',
    thirdPartyIntegrations: 'மூன்றாம் தரப்பு ஒருங்கிணைப்புகள்',
    allowDataSharingConnectedPlatforms: 'இணைக்கப்பட்ட உடல்நல இயங்குதளங்களுடன் தரவு பகிர்வை அனுமதிக்கவும்',
    profileVisibility: 'சுயவிவர தெரிவுநிலை',
    publicProfile: 'பொது சுயவிவரம்',
    makeProfileVisibleOtherUsers: 'உங்கள் சுயவிவரத்தை மற்ற VitalLink பயனர்களுக்குத் தெரியும்படி செய்யவும்',
    achievementSharing: 'சாதனை பகிர்வு',
    shareHealthAchievementsNFTs: 'உங்கள் உடல்நல சாதனைகள் மற்றும் NFTகளை பகிரங்கமாகப் பகிரவும்',
    displayBasicHealthStatistics: 'உங்கள் சுயவிவரத்தில் அடிப்படை உடல்நல புள்ளிவிவரங்களைக் காண்பிக்கவும்',
    exportMyData: 'எனது தரவை ஏற்றுமதி செய்',
    deleteAllData: 'அனைத்து தரவையும் நீக்கு',
    complianceInformation: 'இணக்க தகவல்',
    settingsUpdated: 'அமைப்புகள் புதுப்பிக்கப்பட்டன',
    privacyPreferencesSaved: 'உங்கள் தனியுரிமை விருப்பத்தேர்வுகள் சேமிக்கப்பட்டுள்ளன.',
    dataExportStarted: 'தரவு ஏற்றுமதி தொடங்கப்பட்டது',
    healthDataExportReady: 'உங்கள் உடல்நலத் தரவு ஏற்றுமதி விரைவில் பதிவிறக்கத்திற்குத் தயாராக இருக்கும்.',
    dataDeletionRequested: 'தரவு நீக்கம் கோரப்பட்டது',
    dataDeletionRequestSubmitted: 'உங்கள் தரவு நீக்கக் கோரிக்கை செயலாக்கத்திற்காக சமர்ப்பிக்கப்பட்டுள்ளது.'
  };

  keys.forEach(key => {
    if (mapping[key]) {
      translations[key] = mapping[key];
    }
  });

  return translations;
}

function generateRussianTranslations(keys: string[]) {
  const translations: Record<string, string> = {};
  
  const mapping = {
    authenticationRequired: 'Требуется аутентификация',
    pleaseLogInManagePrivacy: 'Пожалуйста, войдите в систему для управления настройками конфиденциальности.',
    dataSecuredWithZKP: 'Ваши данные защищены доказательствами с нулевым разглашением',
    verifyWithoutSeeing: 'Мы можем проверить ваши достижения в области здоровья, не видя ваших фактических данных о здоровье. Сквозное шифрование обеспечивает максимальную конфиденциальность.',
    secureAPIConnections: 'Требуются безопасные API-соединения',
    apiCredentialsNotice: 'Для подключения платформ вам необходимо предоставить свои личные учетные данные API. Это гарантирует, что только у вас есть доступ к вашим данным о здоровье с полным соблюдением HIPAA и GDPR.',
    gdprCompliant: 'Соответствует GDPR',
    controlHealthDataUsage: 'Контролируйте, как используются и защищаются ваши данные о здоровье',
    healthDataProtected: 'Данные о здоровье защищены',
    privacyRightsRespected: 'Права на конфиденциальность соблюдаются',
    securitySettings: 'Настройки безопасности',
    twoFactorAuthentication: 'Двухфакторная аутентификация',
    addExtraSecurityLayer: 'Добавьте дополнительный уровень безопасности для вашей учетной записи',
    biometricAuthentication: 'Биометрическая аутентификация',
    useFingerprintFaceRecognition: 'Используйте отпечаток пальца или распознавание лица для быстрого доступа',
    dataSharingPreferences: 'Предпочтения обмена данными',
    analyticsPerformance: 'Аналитика и производительность',
    helpImproveAppPerformance: 'Помогите улучшить производительность приложения с помощью анонимных данных об использовании',
    healthResearch: 'Исследования здоровья',
    contributeAnonymizedData: 'Внесите анонимные данные в исследования здоровья',
    marketingCommunications: 'Маркетинговые коммуникации',
    receivePersonalizedHealthTips: 'Получайте персонализированные советы по здоровью и обновления продуктов',
    thirdPartyIntegrations: 'Интеграции третьих сторон',
    allowDataSharingConnectedPlatforms: 'Разрешить обмен данными с подключенными платформами здоровья',
    profileVisibility: 'Видимость профиля',
    publicProfile: 'Публичный профиль',
    makeProfileVisibleOtherUsers: 'Сделайте свой профиль видимым для других пользователей VitalLink',
    achievementSharing: 'Обмен достижениями',
    shareHealthAchievementsNFTs: 'Делитесь своими достижениями в области здоровья и NFT публично',
    displayBasicHealthStatistics: 'Отображайте основную статистику здоровья в своем профиле',
    exportMyData: 'Экспортировать мои данные',
    deleteAllData: 'Удалить все данные',
    complianceInformation: 'Информация о соответствии',
    settingsUpdated: 'Настройки обновлены',
    privacyPreferencesSaved: 'Ваши предпочтения конфиденциальности сохранены.',
    dataExportStarted: 'Экспорт данных начат',
    healthDataExportReady: 'Ваш экспорт данных о здоровье скоро будет готов для загрузки.',
    dataDeletionRequested: 'Запрошено удаление данных',
    dataDeletionRequestSubmitted: 'Ваш запрос на удаление данных отправлен на обработку.'
  };

  keys.forEach(key => {
    if (mapping[key]) {
      translations[key] = mapping[key];
    }
  });

  return translations;
}

function generateGermanTranslations(keys: string[]) {
  const translations: Record<string, string> = {};
  
  const mapping = {
    authenticationRequired: 'Authentifizierung erforderlich',
    pleaseLogInManagePrivacy: 'Bitte melden Sie sich an, um Ihre Datenschutzeinstellungen zu verwalten.',
    dataSecuredWithZKP: 'Ihre Daten sind mit Zero-Knowledge-Beweisen gesichert',
    verifyWithoutSeeing: 'Wir können Ihre Gesundheitserfolge verifizieren, ohne Ihre tatsächlichen Gesundheitsdaten zu sehen. Ende-zu-Ende-Verschlüsselung gewährleistet maximale Privatsphäre.',
    secureAPIConnections: 'Sichere API-Verbindungen erforderlich',
    apiCredentialsNotice: 'Um Plattformen zu verbinden, müssen Sie Ihre persönlichen API-Anmeldedaten bereitstellen. Dies stellt sicher, dass nur Sie Zugang zu Ihren Gesundheitsdaten haben, mit vollständiger HIPAA- und GDPR-Konformität.',
    gdprCompliant: 'GDPR-konform',
    controlHealthDataUsage: 'Kontrollieren Sie, wie Ihre Gesundheitsdaten verwendet und geschützt werden',
    healthDataProtected: 'Gesundheitsdaten geschützt',
    privacyRightsRespected: 'Datenschutzrechte respektiert',
    securitySettings: 'Sicherheitseinstellungen',
    twoFactorAuthentication: 'Zwei-Faktor-Authentifizierung',
    addExtraSecurityLayer: 'Fügen Sie eine zusätzliche Sicherheitsebene zu Ihrem Konto hinzu',
    biometricAuthentication: 'Biometrische Authentifizierung',
    useFingerprintFaceRecognition: 'Verwenden Sie Fingerabdruck oder Gesichtserkennung für schnellen Zugang',
    dataSharingPreferences: 'Datenweitergabe-Einstellungen',
    analyticsPerformance: 'Analytik & Leistung',
    helpImproveAppPerformance: 'Helfen Sie dabei, die App-Leistung mit anonymen Nutzungsdaten zu verbessern',
    healthResearch: 'Gesundheitsforschung',
    contributeAnonymizedData: 'Tragen Sie anonymisierte Daten zu Gesundheitsforschungsstudien bei',
    marketingCommunications: 'Marketing-Kommunikation',
    receivePersonalizedHealthTips: 'Erhalten Sie personalisierte Gesundheitstipps und Produktupdates',
    thirdPartyIntegrations: 'Drittanbieter-Integrationen',
    allowDataSharingConnectedPlatforms: 'Datenweitergabe mit verbundenen Gesundheitsplattformen zulassen',
    profileVisibility: 'Profil-Sichtbarkeit',
    publicProfile: 'Öffentliches Profil',
    makeProfileVisibleOtherUsers: 'Machen Sie Ihr Profil für andere VitalLink-Benutzer sichtbar',
    achievementSharing: 'Erfolge teilen',
    shareHealthAchievementsNFTs: 'Teilen Sie Ihre Gesundheitserfolge und NFTs öffentlich',
    displayBasicHealthStatistics: 'Grundlegende Gesundheitsstatistiken in Ihrem Profil anzeigen',
    exportMyData: 'Meine Daten exportieren',
    deleteAllData: 'Alle Daten löschen',
    complianceInformation: 'Compliance-Informationen',
    settingsUpdated: 'Einstellungen aktualisiert',
    privacyPreferencesSaved: 'Ihre Datenschutzeinstellungen wurden gespeichert.',
    dataExportStarted: 'Datenexport gestartet',
    healthDataExportReady: 'Ihr Gesundheitsdatenexport wird in Kürze zum Download bereit sein.',
    dataDeletionRequested: 'Datenlöschung angefordert',
    dataDeletionRequestSubmitted: 'Ihr Datenlöschungsantrag wurde zur Bearbeitung eingereicht.'
  };

  keys.forEach(key => {
    if (mapping[key]) {
      translations[key] = mapping[key];
    }
  });

  return translations;
}

export async function runManualTranslationFix() {
  console.log('🔧 Running manual translation system analysis and fix...\n');
  
  const analysis = getHardcodedTextAnalysis();
  const missingKeys = getMissingTranslationKeys();
  
  console.log('📋 HARDCODED TEXT FOUND:');
  console.log('Privacy Page:', analysis.privacyPage.hardcodedText.length, 'items');
  console.log('Navigation:', analysis.navigation.hardcodedText.length, 'items');
  
  console.log('\n🔑 MISSING TRANSLATION KEYS:');
  console.log('Total keys to add:', missingKeys.keysToAdd.length);
  
  console.log('\n📝 SAMPLE TRANSLATIONS:');
  console.log('English:', Object.keys(missingKeys.translations.en).length, 'keys');
  console.log('Spanish:', Object.keys(missingKeys.translations.es).length, 'keys');
  console.log('Chinese:', Object.keys(missingKeys.translations.zh).length, 'keys');
  
  return {
    analysis,
    missingKeys,
    recommendations: [
      '1. Add missing translation keys to language.tsx',
      '2. Replace hardcoded text in privacy.tsx with t() function calls',
      '3. Update navigation components to use translations',
      '4. Test language switching functionality',
      '5. Verify all 7 languages have complete translations'
    ]
  };
}

// Run if called directly
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  runManualTranslationFix().then(result => {
    console.log('Analysis complete:', result);
  });
}