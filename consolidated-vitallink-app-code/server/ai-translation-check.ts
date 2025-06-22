import OpenAI from "openai";
import { geminiHealthAI } from "./gemini-ai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Use both AI systems to verify and improve the translation implementation
export async function verifyTranslationSystem() {
  // OpenAI code review
  const openaiPrompt = `
  Review this React translation implementation for VitalLink health platform:
  
  1. TranslationProvider with useContext
  2. Language switching in LanguageSelector component
  3. Translation hooks in Layout component
  
  Identify any issues preventing language switching from working and provide fixes.
  Focus on React context, state management, and component integration.
  `;

  const openaiReview = await openai.chat.completions.create({
    model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    messages: [
      { role: "system", content: "You are a React expert reviewing multilingual implementation." },
      { role: "user", content: openaiPrompt }
    ],
    response_format: { type: "json_object" }
  });

  // Gemini implementation suggestions
  const geminiPrompt = `
  Analyze this multilingual React application implementation:
  
  Current setup:
  - TranslationProvider with React Context
  - useTranslation hook
  - LanguageSelector component
  - 7 languages: English, Spanish, Chinese, Malay, Tamil, Russian, German
  
  The language selector shows but switching doesn't update the UI text.
  Provide specific fixes for the React component integration.
  
  Respond in JSON format with solutions.
  `;

  try {
    const geminiResponse = await geminiHealthAI.generateMultilingualHealthContent(
      geminiPrompt,
      'en',
      'Technical React Development'
    );

    return {
      openaiReview: JSON.parse(openaiReview.choices[0].message.content || '{}'),
      geminiSuggestions: geminiResponse,
      recommendations: [
        "Ensure TranslationProvider wraps all components using translations",
        "Verify useTranslation hook is called in components that need translation",
        "Replace hardcoded text with translation function calls",
        "Test language state persistence and updates"
      ]
    };
  } catch (error) {
    console.error("AI translation verification failed:", error);
    return {
      error: "AI verification failed",
      fallbackFix: "Check React Context provider hierarchy and hook usage"
    };
  }
}

// Quick fix based on common React translation issues
export function getTranslationQuickFix() {
  return {
    issues: [
      "getText function using localStorage instead of useTranslation hook",
      "Navigation text not using translation function",
      "Language changes not triggering re-renders"
    ],
    solutions: [
      "Replace getText with t() function from useTranslation",
      "Add translation keys to all UI text",
      "Ensure language state updates trigger component re-renders"
    ]
  };
}