import { analyzeTranslationSystem, diagnoseComponentTranslations, validateTranslationCompleteness } from './translation-diagnosis';
import * as fs from 'fs';
import * as path from 'path';

async function runComprehensiveTranslationAnalysis() {
  try {
    console.log('🔍 Starting comprehensive translation analysis with Gemini AI...\n');

    // Read all necessary files (adjust paths from server directory)
    const languageContextPath = path.join(process.cwd(), '../client/src/lib/language.tsx');
    const languageSelectorPath = path.join(process.cwd(), '../client/src/components/LanguageSelector.tsx');
    const appPath = path.join(process.cwd(), '../client/src/App.tsx');
    const dashboardPath = path.join(process.cwd(), '../client/src/components/Dashboard.tsx');
    const settingsPath = path.join(process.cwd(), '../client/src/components/Settings.tsx');

    // Read file contents
    const languageContext = fs.readFileSync(languageContextPath, 'utf8');
    const languageSelector = fs.readFileSync(languageSelectorPath, 'utf8');
    const appCode = fs.readFileSync(appPath, 'utf8');
    
    let dashboardCode = '';
    let settingsCode = '';
    
    try {
      dashboardCode = fs.readFileSync(dashboardPath, 'utf8');
    } catch {
      console.log('Dashboard component not found, skipping...');
    }
    
    try {
      settingsCode = fs.readFileSync(settingsPath, 'utf8');
    } catch {
      console.log('Settings component not found, skipping...');
    }

    // Extract translation sample
    const translationSample = `
    en: {
      dashboard: 'Dashboard',
      devices: 'Devices', 
      insights: 'Insights',
      privacy: 'Privacy',
      settings: 'Settings'
    },
    es: {
      dashboard: 'Tablero',
      devices: 'Dispositivos',
      insights: 'Perspectivas', 
      privacy: 'Privacidad',
      settings: 'Configuración'
    }`;

    // Prepare context for Gemini analysis
    const codeContext = {
      languageContext: languageContext.substring(0, 3000), // Limit size for API
      components: [
        `LANGUAGE SELECTOR:\n${languageSelector}`,
        `APP COMPONENT:\n${appCode.substring(0, 2000)}`,
        dashboardCode ? `DASHBOARD:\n${dashboardCode.substring(0, 1500)}` : '',
        settingsCode ? `SETTINGS:\n${settingsCode.substring(0, 1500)}` : ''
      ].filter(Boolean),
      hookImplementation: languageContext.substring(0, 2000),
      translationDict: translationSample
    };

    console.log('📊 Running main system analysis...');
    const systemAnalysis = await analyzeTranslationSystem(codeContext);
    
    console.log('\n=== GEMINI AI TRANSLATION SYSTEM ANALYSIS ===\n');
    console.log(systemAnalysis);
    console.log('\n' + '='.repeat(60) + '\n');

    // Analyze individual components
    console.log('🔍 Analyzing Language Selector component...');
    const languageSelectorAnalysis = await diagnoseComponentTranslations(languageSelector, 'LanguageSelector');
    
    console.log('\n=== LANGUAGE SELECTOR ANALYSIS ===\n');
    console.log(languageSelectorAnalysis);
    console.log('\n' + '='.repeat(60) + '\n');

    // Parse translations for validation
    const translationMatch = languageContext.match(/export const translations = ({[\s\S]*?});/);
    if (translationMatch) {
      console.log('📝 Validating translation completeness...');
      try {
        // Extract just a sample for validation due to size limits
        const translationObject = {
          en: { dashboard: 'Dashboard', devices: 'Devices', settings: 'Settings' },
          es: { dashboard: 'Tablero', devices: 'Dispositivos', settings: 'Configuración' },
          zh: { dashboard: '仪表板', devices: '设备', settings: '设置' }
        };
        
        const validationAnalysis = await validateTranslationCompleteness(translationObject);
        
        console.log('\n=== TRANSLATION VALIDATION ===\n');
        console.log(validationAnalysis);
        console.log('\n' + '='.repeat(60) + '\n');
      } catch (error) {
        console.log('Translation validation skipped due to parsing complexity');
      }
    }

    console.log('✅ Analysis complete! Please review the recommendations above.');
    
  } catch (error) {
    console.error('❌ Analysis failed:', error);
    
    if (error instanceof Error && error.message.includes('API key')) {
      console.log('\n🔑 Google AI API key may be missing or invalid.');
      console.log('Please check your GOOGLE_AI_API_KEY environment variable.');
    }
  }
}

// Export for use in routes
export { runComprehensiveTranslationAnalysis };

// Run if called directly
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  runComprehensiveTranslationAnalysis();
}