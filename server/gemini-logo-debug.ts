
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

export class GeminiLogoDebugger {
  
  async debugLogoIssues(platformName: string, expectedLogoUrl?: string) {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    
    const prompt = `You are a debugging expert for health platform app logos. Help diagnose logo loading issues.

Platform: ${platformName}
Expected Logo URL: ${expectedLogoUrl || 'Not provided'}

Common health platform logo issues to check:
1. Apple Health - iOS only, uses HealthKit icon
2. Fitbit - Has distinctive blue/teal branding
3. Google Fit - Uses Google's fitness icon with heart symbol
4. Samsung Health - Purple/blue Samsung branding
5. Garmin Connect - Blue/white Garmin branding
6. Oura Ring - Black/gradient branding
7. Withings - Green/teal medical device branding
8. MyFitnessPal - Blue/white nutrition tracking branding

For ${platformName}, provide:
1. Most likely correct App Store icon URL
2. Alternative CDN URLs that might work
3. Fallback approaches if official logos aren't available
4. Brand-safe placeholder options

Return your response as JSON:
{
  "diagnosis": "What's likely wrong",
  "recommendedUrl": "Best logo URL to try",
  "alternativeUrls": ["url1", "url2", "url3"],
  "fallbackStrategy": "What to do if logos don't work",
  "brandColors": ["#color1", "#color2"],
  "logoSpecs": {
    "preferredSize": "128x128",
    "format": "PNG",
    "backgroundColor": "transparent"
  }
}`;

    try {
      const result = await model.generateContent(prompt);
      const response = result.response.text();
      
      // Extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // Fallback response
      return {
        diagnosis: "Unable to parse Gemini response",
        recommendedUrl: null,
        alternativeUrls: [],
        fallbackStrategy: "Use gradient placeholder with platform initial",
        brandColors: ["#007AFF", "#34C759"],
        logoSpecs: {
          preferredSize: "128x128",
          format: "PNG", 
          backgroundColor: "transparent"
        }
      };
      
    } catch (error) {
      console.error('Gemini logo debug error:', error);
      
      // Fallback diagnosis based on platform name
      return this.getFallbackDiagnosis(platformName);
    }
  }

  private getFallbackDiagnosis(platformName: string) {
    const platformLower = platformName.toLowerCase();
    
    if (platformLower.includes('apple')) {
      return {
        diagnosis: "Apple Health requires iOS app store API access",
        recommendedUrl: "https://developer.apple.com/assets/elements/icons/healthkit/healthkit-96x96_2x.png",
        alternativeUrls: [
          "https://help.apple.com/assets/61A4A4FB2FAFC736C12DE4B5/61A4A4FD2FAFC736C12DE4BC/en_US/841b06b477eb8b52b8c301c3c99a3c5c.png"
        ],
        fallbackStrategy: "Use Apple HealthKit icon or red heart with Apple styling",
        brandColors: ["#007AFF", "#FF3B30"],
        logoSpecs: { preferredSize: "128x128", format: "PNG", backgroundColor: "transparent" }
      };
    }
    
    if (platformLower.includes('fitbit')) {
      return {
        diagnosis: "Fitbit logo should be available from official sources",
        recommendedUrl: "https://www.fitbit.com/global/content/dam/fitbit/global/pdp/devices/sense/logo.png",
        alternativeUrls: [
          "https://play-lh.googleusercontent.com/ZPHqNGzTDDK0bXfQ7QR-2O2-Y7AUbg6VN1qCVc0",
          "https://cdn.worldvectorlogo.com/logos/fitbit-1.svg"
        ],
        fallbackStrategy: "Use teal circle with 'F' or fitness tracker icon",
        brandColors: ["#00B0B9", "#4CC8C8"],
        logoSpecs: { preferredSize: "128x128", format: "PNG", backgroundColor: "transparent" }
      };
    }
    
    // Default fallback
    return {
      diagnosis: "Platform not recognized, using generic approach",
      recommendedUrl: null,
      alternativeUrls: [],
      fallbackStrategy: "Create branded placeholder with platform colors",
      brandColors: ["#667eea", "#764ba2"],
      logoSpecs: { preferredSize: "128x128", format: "PNG", backgroundColor: "transparent" }
    };
  }

  async batchDebugLogos(platformNames: string[]) {
    const debugResults = [];
    
    for (const platformName of platformNames) {
      const debug = await this.debugLogoIssues(platformName);
      debugResults.push({
        platform: platformName,
        debug
      });
    }
    
    return debugResults;
  }
}

export const geminiLogoDebugger = new GeminiLogoDebugger();
