import { geminiHealthAI } from "./gemini-ai";

export async function consultGeminiForDebug() {
  try {
    const debugPrompt = `
    I have a TypeScript React application with the following errors:

    1. Property 'localFirstStorage' does not exist on type '{}'
    2. Cannot find name 'CardHeader', 'CardTitle' 
    3. 'React' refers to a UMD global, but the current file is a module
    4. Missing function declarations and incomplete component structure

    The app is a health data privacy dashboard with zero-knowledge proof features.

    Please provide specific solutions to:
    1. Fix TypeScript property access errors
    2. Resolve missing React imports and component imports
    3. Create a working Privacy component structure
    4. Ensure proper type safety

    Focus on practical, immediate fixes that will get the app running.
    `;

    const response = await geminiHealthAI.generatePersonalizedRecommendations(
      {}, // health data not needed for debugging
      { role: 'developer', context: 'typescript_debugging' },
      'en'
    );

    return {
      solutions: response.recommendations,
      technicalInsights: response.insights,
      immediateActions: response.actionPlan
    };
  } catch (error) {
    console.error("Error consulting Gemini for debug solutions:", error);
    return {
      solutions: [
        "Add proper TypeScript type definitions",
        "Import React components correctly", 
        "Use default values for optional properties",
        "Create interface definitions for component props"
      ],
      technicalInsights: ["TypeScript strict mode requires proper type definitions"],
      immediateActions: ["Fix imports", "Add type guards", "Create component interfaces"]
    };
  }
}

export async function getQuickFixes() {
  // Quick manual fixes based on common patterns
  return {
    typeScriptFixes: [
      "Add React import: import React from 'react'",
      "Use optional chaining: settings?.localFirstStorage", 
      "Add default values in destructuring",
      "Import components from correct paths"
    ],
    componentFixes: [
      "Import Card components from '@/components/ui/card'",
      "Add proper useState type definitions",
      "Use useEffect instead of bare useState calls"
    ],
    immediateFix: "Replace broken Privacy component with working version"
  };
}