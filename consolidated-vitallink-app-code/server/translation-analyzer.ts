import OpenAI from "openai";
import { geminiHealthAI } from "./gemini-ai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Comprehensive component analysis for translation needs
export async function analyzeComponentsForTranslation(componentContent: string, componentName: string) {
  
  // Step 1: OpenAI analysis for hardcoded text identification
  const openaiPrompt = `
  Analyze this React component for hardcoded English text that should be translated:
  
  Component: ${componentName}
  Content: ${componentContent}
  
  Find all hardcoded English strings that should be translated for a multilingual health platform.
  Ignore imports, CSS classes, and technical identifiers.
  
  Return JSON with:
  {
    "hardcodedText": ["text1", "text2"],
    "suggestedKeys": ["key1", "key2"],
    "priority": "high|medium|low",
    "category": "navigation|dashboard|forms|general"
  }
  `;

  try {
    const openaiAnalysis = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        { role: "system", content: "You are a React expert analyzing components for internationalization." },
        { role: "user", content: openaiPrompt }
      ],
      response_format: { type: "json_object" }
    });

    const openaiResult = JSON.parse(openaiAnalysis.choices[0].message.content || '{}');

    // Step 2: Gemini analysis for health-specific terminology
    if (openaiResult.hardcodedText && openaiResult.hardcodedText.length > 0) {
      const geminiAnalysis = await geminiHealthAI.generateMultilingualHealthContent(
        `Analyze these health platform text strings for medical terminology and cultural sensitivity: ${openaiResult.hardcodedText.join(', ')}. Suggest appropriate translations for Spanish, Chinese, and Malay with cultural health context.`,
        'en',
        'Health Platform Translation Analysis'
      );

      return {
        component: componentName,
        openaiAnalysis: openaiResult,
        geminiHealthContext: geminiAnalysis,
        status: 'analyzed'
      };
    }

    return {
      component: componentName,
      openaiAnalysis: openaiResult,
      status: 'no_translation_needed'
    };

  } catch (error) {
    console.error(`Translation analysis failed for ${componentName}:`, error);
    return {
      component: componentName,
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 'analysis_failed'
    };
  }
}

// Batch analyze multiple components
export async function batchAnalyzeComponents(components: { name: string, content: string }[]) {
  const results = [];
  
  // Process one at a time to avoid rate limits
  for (const component of components) {
    console.log(`Analyzing component: ${component.name}`);
    const result = await analyzeComponentsForTranslation(component.content, component.name);
    results.push(result);
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  return results;
}