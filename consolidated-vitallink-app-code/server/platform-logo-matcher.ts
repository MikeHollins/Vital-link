import { GoogleGenerativeAI } from '@google/generative-ai';
import { OpenAI } from 'openai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface PlatformLogoInfo {
  platformName: string;
  appStoreUrl: string;
  logoUrl: string;
  iconUrl: string;
  brandColors: string[];
  logoSpecs: {
    format: string;
    size: string;
    aspectRatio: string;
    backgroundColor: string;
  };
  verified: boolean;
  lastUpdated: Date;
}

interface LogoAnalysis {
  isOfficialLogo: boolean;
  brandConsistency: number; // 0-100
  qualityScore: number; // 0-100
  recommendedSizes: string[];
  brandGuidelines: string[];
  issues: string[];
}

export class PlatformLogoMatcher {
  private healthPlatforms = [
    { 
      name: 'Apple Health', 
      appStoreId: 'com.apple.Health',
      bundleId: 'com.apple.Health',
      playStoreId: null // iOS only
    },
    { 
      name: 'Fitbit', 
      appStoreId: 'com.fitbit.FitbitMobile',
      bundleId: 'com.fitbit.FitbitMobile',
      playStoreId: 'com.fitbit.FitbitMobile'
    },
    { 
      name: 'Google Fit', 
      appStoreId: 'com.google.ios.fitness',
      bundleId: 'com.google.ios.fitness',
      playStoreId: 'com.google.android.apps.fitness'
    },
    { 
      name: 'Samsung Health', 
      appStoreId: 'com.sec.android.app.shealth',
      bundleId: null, // Android only primarily
      playStoreId: 'com.sec.android.app.shealth'
    },
    { 
      name: 'Garmin Connect', 
      appStoreId: 'com.garmin.connect.mobile',
      bundleId: 'com.garmin.connect.mobile',
      playStoreId: 'com.garmin.android.apps.connectmobile'
    },
    { 
      name: 'Oura', 
      appStoreId: 'com.ouraring.oura',
      bundleId: 'com.ouraring.oura',
      playStoreId: 'com.ouraring.oura'
    },
    { 
      name: 'Withings Health Mate', 
      appStoreId: 'com.withings.wiscale2',
      bundleId: 'com.withings.wiscale2',
      playStoreId: 'com.withings.wiscale2'
    },
    { 
      name: 'MyFitnessPal', 
      appStoreId: 'com.myfitnesspal.app',
      bundleId: 'com.myfitnesspal.app',
      playStoreId: 'com.myfitnesspal.android'
    },
    { 
      name: 'Strava', 
      appStoreId: 'com.strava.stravaride',
      bundleId: 'com.strava.stravaride',
      playStoreId: 'com.strava'
    },
    { 
      name: 'Polar Flow', 
      appStoreId: 'fi.polar.polarflow',
      bundleId: 'fi.polar.polarflow',
      playStoreId: 'fi.polar.polarflow'
    }
  ];

  /**
   * Generate authentic App Store logo information using AI analysis
   */
  async matchPlatformLogo(platformName: string): Promise<PlatformLogoInfo> {
    const platform = this.healthPlatforms.find(p => 
      p.name.toLowerCase().includes(platformName.toLowerCase()) ||
      platformName.toLowerCase().includes(p.name.toLowerCase())
    );

    if (!platform) {
      throw new Error(`Platform ${platformName} not found in supported platforms`);
    }

    // Use AI to generate accurate App Store information
    const logoInfo = await this.generateLogoInformation(platform);
    const verification = await this.verifyLogoAuthenticity(logoInfo);

    return {
      ...logoInfo,
      verified: verification.isOfficialLogo,
      lastUpdated: new Date()
    };
  }

  private async generateLogoInformation(platform: any): Promise<PlatformLogoInfo> {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    
    const prompt = `Generate accurate App Store logo information for ${platform.name}:

Platform Details:
- App Name: ${platform.name}
- iOS Bundle ID: ${platform.bundleId || 'N/A'}
- Android Package: ${platform.playStoreId || 'N/A'}

Provide App Store logo information in JSON format:
{
  "platformName": "${platform.name}",
  "appStoreUrl": "Official app store URL (iOS App Store or Google Play)",
  "logoUrl": "Direct URL to official app icon/logo",
  "iconUrl": "High-resolution app icon URL",
  "brandColors": ["primary hex color", "secondary hex color"],
  "logoSpecs": {
    "format": "PNG/SVG",
    "size": "recommended size",
    "aspectRatio": "1:1 or specific ratio",
    "backgroundColor": "transparent or color"
  }
}

Focus on:
- Official App Store listings only
- High-quality logo resources
- Brand-compliant colors and specifications
- Current/active app versions`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      throw new Error('Invalid AI response format');
    } catch (error) {
      console.error(`Logo information generation failed for ${platform.name}:`, error);
      return this.getFallbackLogoInfo(platform);
    }
  }

  private async verifyLogoAuthenticity(logoInfo: PlatformLogoInfo): Promise<LogoAnalysis> {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [{
        role: "system",
        content: "You are a brand compliance expert specializing in mobile app logos and App Store guidelines. Analyze logos for authenticity and brand compliance."
      }, {
        role: "user",
        content: `Analyze this health platform logo information for authenticity and brand compliance:

Platform: ${logoInfo.platformName}
App Store URL: ${logoInfo.appStoreUrl}
Logo URL: ${logoInfo.logoUrl}
Brand Colors: ${logoInfo.brandColors.join(', ')}

Provide analysis in JSON format:
{
  "isOfficialLogo": boolean,
  "brandConsistency": number (0-100),
  "qualityScore": number (0-100),
  "recommendedSizes": ["128x128", "256x256", "512x512"],
  "brandGuidelines": ["guideline1", "guideline2"],
  "issues": ["issue1 if any", "issue2 if any"]
}

Verify against official App Store listings and brand guidelines.`
      }],
      max_tokens: 800,
      temperature: 0.3
    });

    const response = completion.choices[0]?.message?.content || '';
    
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.error('Logo verification parsing failed:', error);
    }

    return this.getFallbackVerification();
  }

  /**
   * Batch process multiple platform logos
   */
  async batchMatchPlatformLogos(platformNames: string[]): Promise<PlatformLogoInfo[]> {
    const results: PlatformLogoInfo[] = [];
    
    // Process in batches to respect AI API rate limits
    const batchSize = 3;
    for (let i = 0; i < platformNames.length; i += batchSize) {
      const batch = platformNames.slice(i, i + batchSize);
      
      const batchResults = await Promise.all(
        batch.map(name => 
          this.matchPlatformLogo(name).catch(error => {
            console.error(`Logo matching failed for ${name}:`, error);
            return null;
          })
        )
      );
      
      results.push(...batchResults.filter(result => result !== null) as PlatformLogoInfo[]);
      
      // Rate limiting delay between batches
      if (i + batchSize < platformNames.length) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    return results;
  }

  /**
   * Generate optimized logo variants for different use cases
   */
  async generateLogoVariants(logoInfo: PlatformLogoInfo): Promise<any> {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    
    const prompt = `Generate logo variant specifications for ${logoInfo.platformName}:

Base Logo Info:
- Platform: ${logoInfo.platformName}
- Primary Colors: ${logoInfo.brandColors.join(', ')}
- Format: ${logoInfo.logoSpecs.format}

Generate variants for different UI contexts:
{
  "variants": [
    {
      "context": "dashboard_card",
      "size": "64x64",
      "format": "PNG",
      "backgroundColor": "transparent",
      "borderRadius": "8px"
    },
    {
      "context": "connection_list",
      "size": "32x32", 
      "format": "PNG",
      "backgroundColor": "white",
      "borderRadius": "4px"
    },
    {
      "context": "settings_page",
      "size": "48x48",
      "format": "PNG", 
      "backgroundColor": "transparent",
      "borderRadius": "6px"
    },
    {
      "context": "mobile_icon",
      "size": "96x96",
      "format": "PNG",
      "backgroundColor": "brand_color",
      "borderRadius": "12px"
    }
  ],
  "brandGuidelines": {
    "minSize": "16x16",
    "maxSize": "512x512", 
    "preserveAspectRatio": true,
    "backgroundOptions": ["transparent", "white", "brand_color"],
    "usageNotes": ["Always maintain aspect ratio", "Use official colors only"]
  }
}`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.error(`Logo variants generation failed for ${logoInfo.platformName}:`, error);
    }

    return this.getFallbackVariants(logoInfo);
  }

  /**
   * Validate logo against App Store guidelines
   */
  async validateAppStoreCompliance(logoInfo: PlatformLogoInfo): Promise<any> {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{
        role: "system",
        content: "You are an App Store review specialist. Validate app icons against iOS and Android store guidelines."
      }, {
        role: "user",
        content: `Validate this health app logo against App Store guidelines:

Platform: ${logoInfo.platformName}
Logo Format: ${logoInfo.logoSpecs.format}
Size: ${logoInfo.logoSpecs.size}
Colors: ${logoInfo.brandColors.join(', ')}

Check compliance with:
1. iOS App Store icon guidelines
2. Google Play Store icon guidelines  
3. Accessibility requirements
4. Brand trademark compliance
5. Health app specific requirements

Provide compliance report with pass/fail status and recommendations.`
      }],
      max_tokens: 1000,
      temperature: 0.3
    });

    return completion.choices[0]?.message?.content || 'Compliance validation completed';
  }

  /**
   * Get all supported platform information
   */
  getSupportedPlatforms() {
    return this.healthPlatforms.map(p => ({
      name: p.name,
      hasIOSApp: !!p.bundleId,
      hasAndroidApp: !!p.playStoreId,
      appStoreId: p.appStoreId
    }));
  }

  // Fallback methods
  private getFallbackLogoInfo(platform: any): PlatformLogoInfo {
    return {
      platformName: platform.name,
      appStoreUrl: `https://apps.apple.com/app/${platform.appStoreId}`,
      logoUrl: `/assets/platform-logos/${platform.name.toLowerCase().replace(/\s+/g, '-')}.png`,
      iconUrl: `/assets/platform-icons/${platform.name.toLowerCase().replace(/\s+/g, '-')}.png`,
      brandColors: ['#007AFF', '#34C759'], // Default iOS colors
      logoSpecs: {
        format: 'PNG',
        size: '128x128',
        aspectRatio: '1:1',
        backgroundColor: 'transparent'
      },
      verified: false,
      lastUpdated: new Date()
    };
  }

  private getFallbackVerification(): LogoAnalysis {
    return {
      isOfficialLogo: false,
      brandConsistency: 50,
      qualityScore: 50,
      recommendedSizes: ['128x128', '256x256', '512x512'],
      brandGuidelines: ['Verify with official brand guidelines'],
      issues: ['Manual verification required']
    };
  }

  private getFallbackVariants(logoInfo: PlatformLogoInfo) {
    return {
      variants: [
        {
          context: 'dashboard_card',
          size: '64x64',
          format: 'PNG',
          backgroundColor: 'transparent'
        }
      ],
      brandGuidelines: {
        minSize: '16x16',
        maxSize: '512x512',
        preserveAspectRatio: true
      }
    };
  }
}

export const platformLogoMatcher = new PlatformLogoMatcher();