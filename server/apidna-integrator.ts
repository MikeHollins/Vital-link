import { OpenAI } from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

interface HealthPlatformConfig {
  name: string;
  apiEndpoint: string;
  authType: 'oauth2' | 'api_key' | 'bearer';
  dataTypes: string[];
  rateLimit: number;
  documentation?: string;
}

interface AutoIntegrationResult {
  platformName: string;
  integrationCode: string;
  authFlow: string;
  dataMapping: Record<string, string>;
  testCases: string[];
  errorHandling: string;
  rateLimitHandling: string;
}

export class APIDNAHealthIntegrator {
  private healthPlatforms: HealthPlatformConfig[] = [
    {
      name: 'Apple Health',
      apiEndpoint: 'https://developer.apple.com/documentation/healthkit',
      authType: 'oauth2',
      dataTypes: ['steps', 'heart_rate', 'sleep', 'activity', 'nutrition'],
      rateLimit: 1000,
      documentation: 'HealthKit framework for iOS health data access'
    },
    {
      name: 'Fitbit',
      apiEndpoint: 'https://dev.fitbit.com/build/reference/web-api/',
      authType: 'oauth2',
      dataTypes: ['steps', 'heart_rate', 'sleep', 'activity', 'weight'],
      rateLimit: 150,
      documentation: 'Fitbit Web API for health and fitness data'
    },
    {
      name: 'Google Fit',
      apiEndpoint: 'https://developers.google.com/fit/rest',
      authType: 'oauth2',
      dataTypes: ['steps', 'heart_rate', 'sleep', 'activity', 'location'],
      rateLimit: 500,
      documentation: 'Google Fit REST API for fitness data'
    },
    {
      name: 'Samsung Health',
      apiEndpoint: 'https://developer.samsung.com/health',
      authType: 'api_key',
      dataTypes: ['steps', 'heart_rate', 'sleep', 'stress', 'nutrition'],
      rateLimit: 200,
      documentation: 'Samsung Health SDK for health data integration'
    },
    {
      name: 'Garmin Connect',
      apiEndpoint: 'https://developer.garmin.com/connect-iq/api-docs/',
      authType: 'oauth2',
      dataTypes: ['steps', 'heart_rate', 'activity', 'sleep', 'stress'],
      rateLimit: 100,
      documentation: 'Garmin Connect IQ API for fitness devices'
    },
    {
      name: 'Oura Ring',
      apiEndpoint: 'https://cloud.ouraring.com/docs/',
      authType: 'bearer',
      dataTypes: ['sleep', 'readiness', 'activity', 'heart_rate'],
      rateLimit: 5000,
      documentation: 'Oura Ring API for sleep and recovery data'
    },
    {
      name: 'Withings',
      apiEndpoint: 'https://developer.withings.com/api/doc',
      authType: 'oauth2',
      dataTypes: ['weight', 'blood_pressure', 'heart_rate', 'sleep'],
      rateLimit: 120,
      documentation: 'Withings API for health measurement devices'
    },
    {
      name: 'MyFitnessPal',
      apiEndpoint: 'https://www.myfitnesspal.com/api',
      authType: 'oauth2',
      dataTypes: ['nutrition', 'calories', 'exercise', 'weight'],
      rateLimit: 50,
      documentation: 'MyFitnessPal API for nutrition and exercise tracking'
    }
  ];

  /**
   * APIDNA-style autonomous integration generation
   * Uses AI agents to automatically generate platform integrations
   */
  async generateAutoIntegration(platformName: string): Promise<AutoIntegrationResult> {
    const platform = this.healthPlatforms.find(p => 
      p.name.toLowerCase() === platformName.toLowerCase()
    );

    if (!platform) {
      throw new Error(`Platform ${platformName} not supported`);
    }

    // Use dual AI agents for comprehensive integration generation
    const [codeGeneration, authFlowGeneration] = await Promise.all([
      this.generateIntegrationCode(platform),
      this.generateAuthFlow(platform)
    ]);

    const dataMapping = await this.generateDataMapping(platform);
    const testCases = await this.generateTestCases(platform);
    const errorHandling = await this.generateErrorHandling(platform);
    const rateLimitHandling = await this.generateRateLimitHandling(platform);

    return {
      platformName: platform.name,
      integrationCode: codeGeneration,
      authFlow: authFlowGeneration,
      dataMapping,
      testCases,
      errorHandling,
      rateLimitHandling
    };
  }

  private async generateIntegrationCode(platform: HealthPlatformConfig): Promise<string> {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    
    const prompt = `Generate a complete TypeScript integration class for ${platform.name} health platform:

Platform Details:
- API Endpoint: ${platform.apiEndpoint}
- Auth Type: ${platform.authType}
- Data Types: ${platform.dataTypes.join(', ')}
- Rate Limit: ${platform.rateLimit} requests/hour
- Documentation: ${platform.documentation}

Generate a TypeScript class that includes:
1. Authentication handling (${platform.authType})
2. Data fetching methods for each data type
3. Error handling and retry logic
4. Rate limiting implementation
5. Data normalization to our schema
6. TypeScript interfaces for responses

Make it production-ready with proper error handling, logging, and type safety.
Follow our biological validation standards for health data.

Class name: ${platform.name.replace(/\s+/g, '')}HealthIntegrator`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error(`Code generation failed for ${platform.name}:`, error);
      return this.getFallbackIntegrationCode(platform);
    }
  }

  private async generateAuthFlow(platform: HealthPlatformConfig): Promise<string> {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{
        role: "system",
        content: "You are an expert in OAuth2 and API authentication flows. Generate secure, production-ready authentication code."
      }, {
        role: "user",
        content: `Generate a complete ${platform.authType} authentication flow for ${platform.name}:

Requirements:
- Secure token storage
- Automatic token refresh
- Error handling for auth failures
- PKCE for OAuth2 if applicable
- Proper scope requests for health data
- HIPAA-compliant token handling

Include both client-side and server-side components in TypeScript.`
      }],
      max_tokens: 2000,
      temperature: 0.3
    });

    return completion.choices[0]?.message?.content || this.getFallbackAuthFlow(platform);
  }

  private async generateDataMapping(platform: HealthPlatformConfig): Promise<Record<string, string>> {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    
    const prompt = `Create data mapping configuration for ${platform.name} to our standardized health schema:

Our Standard Schema:
- steps: number (daily step count)
- heart_rate: number (BPM)
- sleep: { duration: number, quality: number, stages: object }
- activity: { type: string, duration: number, calories: number }
- weight: number (kg)
- blood_pressure: { systolic: number, diastolic: number }

Platform Data Types: ${platform.dataTypes.join(', ')}

Generate JSON mapping configuration that maps ${platform.name} field names to our schema.
Include unit conversions where needed (e.g., pounds to kg, minutes to hours).`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.error(`Data mapping generation failed for ${platform.name}:`, error);
    }

    return this.getFallbackDataMapping(platform);
  }

  private async generateTestCases(platform: HealthPlatformConfig): Promise<string[]> {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{
        role: "system",
        content: "Generate comprehensive test cases for health API integrations. Include edge cases and error scenarios."
      }, {
        role: "user",
        content: `Generate test cases for ${platform.name} integration covering:
        
1. Successful data retrieval for each data type: ${platform.dataTypes.join(', ')}
2. Authentication failures and recovery
3. Rate limiting scenarios
4. Network errors and timeouts
5. Invalid or corrupted data handling
6. Boundary value testing for health metrics
7. Privacy compliance verification

Provide specific test scenarios with expected inputs and outputs.`
      }],
      max_tokens: 1500,
      temperature: 0.3
    });

    const response = completion.choices[0]?.message?.content || '';
    return response.split('\n').filter(line => line.trim().length > 0);
  }

  private async generateErrorHandling(platform: HealthPlatformConfig): Promise<string> {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    
    const prompt = `Generate comprehensive error handling code for ${platform.name} integration:

Requirements:
- Handle ${platform.authType} authentication errors
- Network timeout and retry logic
- Rate limit (${platform.rateLimit}/hour) handling with exponential backoff
- Data validation errors
- API response parsing errors
- Health data validation against biological constraints
- HIPAA compliance error logging
- User-friendly error messages

Generate TypeScript error handling class with specific error types and recovery strategies.`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error(`Error handling generation failed for ${platform.name}:`, error);
      return this.getFallbackErrorHandling(platform);
    }
  }

  private async generateRateLimitHandling(platform: HealthPlatformConfig): Promise<string> {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{
        role: "system",
        content: "Generate robust rate limiting and request management code for API integrations."
      }, {
        role: "user",
        content: `Generate rate limiting implementation for ${platform.name}:

Rate Limit: ${platform.rateLimit} requests per hour
Requirements:
- Token bucket or sliding window algorithm
- Request queuing for burst handling
- Exponential backoff for rate limit hits
- Request prioritization (real-time vs batch)
- Monitoring and alerting for rate limit usage
- Graceful degradation when limits approached

Provide TypeScript implementation with Redis support for distributed rate limiting.`
      }],
      max_tokens: 1200,
      temperature: 0.3
    });

    return completion.choices[0]?.message?.content || this.getFallbackRateLimitHandling(platform);
  }

  /**
   * Batch generate integrations for multiple platforms
   */
  async generateBatchIntegrations(platformNames: string[]): Promise<AutoIntegrationResult[]> {
    const results: AutoIntegrationResult[] = [];
    
    // Process in batches to respect AI API rate limits
    const batchSize = 2;
    for (let i = 0; i < platformNames.length; i += batchSize) {
      const batch = platformNames.slice(i, i + batchSize);
      
      const batchResults = await Promise.all(
        batch.map(name => 
          this.generateAutoIntegration(name).catch(error => {
            console.error(`Failed to generate integration for ${name}:`, error);
            return null;
          })
        )
      );
      
      results.push(...batchResults.filter(result => result !== null) as AutoIntegrationResult[]);
      
      // Rate limiting delay between batches
      if (i + batchSize < platformNames.length) {
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }
    
    return results;
  }

  /**
   * Generate OpenAPI/Postman collection analysis
   */
  async analyzeAPIDocumentation(platformName: string, documentationUrl: string): Promise<any> {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    
    const prompt = `Analyze the API documentation for ${platformName} and extract integration requirements:

Documentation URL: ${documentationUrl}

Extract and provide:
1. Available endpoints for health data
2. Authentication requirements and scopes
3. Rate limits and quotas
4. Data formats and schemas
5. Error codes and handling
6. Required permissions and consent flows
7. Data retention and privacy policies

Provide a structured analysis that can be used for automatic integration generation.`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error(`API documentation analysis failed for ${platformName}:`, error);
      return `Analysis unavailable for ${platformName}. Manual review required.`;
    }
  }

  // Fallback methods for when AI generation fails
  private getFallbackIntegrationCode(platform: HealthPlatformConfig): string {
    return `
// Fallback integration template for ${platform.name}
export class ${platform.name.replace(/\s+/g, '')}HealthIntegrator {
  private apiKey: string;
  private baseUrl = '${platform.apiEndpoint}';
  
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }
  
  async fetchHealthData(dataType: string, startDate: Date, endDate: Date) {
    // Implementation needed based on ${platform.name} API documentation
    throw new Error('Integration implementation required');
  }
  
  async authenticate() {
    // ${platform.authType} authentication implementation needed
    throw new Error('Authentication implementation required');
  }
}`;
  }

  private getFallbackAuthFlow(platform: HealthPlatformConfig): string {
    return `${platform.authType} authentication flow implementation needed for ${platform.name}`;
  }

  private getFallbackDataMapping(platform: HealthPlatformConfig): Record<string, string> {
    const mapping: Record<string, string> = {};
    platform.dataTypes.forEach(type => {
      mapping[type] = `${platform.name.toLowerCase()}_${type}`;
    });
    return mapping;
  }

  private getFallbackErrorHandling(platform: HealthPlatformConfig): string {
    return `Error handling implementation needed for ${platform.name} with ${platform.authType} auth`;
  }

  private getFallbackRateLimitHandling(platform: HealthPlatformConfig): string {
    return `Rate limiting (${platform.rateLimit}/hour) implementation needed for ${platform.name}`;
  }

  /**
   * Get list of supported health platforms
   */
  getSupportedPlatforms(): HealthPlatformConfig[] {
    return this.healthPlatforms;
  }
}

export const apidnaIntegrator = new APIDNAHealthIntegrator();