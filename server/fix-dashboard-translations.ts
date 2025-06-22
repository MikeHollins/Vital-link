import fs from 'fs';
import path from 'path';

// Comprehensive translation key mapping for Dashboard component
const translationMapping = {
  // Activity metrics
  "Steps": "health:metrics.steps",
  "Active Calories": "dashboard:activeCalories",
  "Blood Glucose": "dashboard:bloodGlucose",
  "Blood Pressure": "dashboard:bloodPressure",
  "Blood Oxygen": "dashboard:bloodOxygen",
  "Mood Score": "dashboard:moodScore",
  "Mindfulness": "dashboard:mindfulness",
  "Stress Level": "dashboard:stressLevel",
  "Sleep Duration": "dashboard:sleepDuration",
  "Sleep Quality": "dashboard:sleepQuality",
  "Step Goal Streak": "dashboard:stepGoalStreak",
  "Workout Minutes": "dashboard:workoutMinutes",
  "Hydration Goal": "dashboard:hydrationGoal",
  
  // Section titles
  "Today's Activity": "dashboard:todaysActivity",
  "Advanced Vitals": "dashboard:advancedVitals", 
  "Mental Health & Wellness": "dashboard:mentalHealth",
  "Sleep & Recovery": "dashboard:sleepRecovery",
  "Achievements": "dashboard:achievements",
  
  // Action buttons and text
  "View All": "dashboard:viewAll",
  "Link a Platform": "dashboard:connectPlatform",
  "Health Summary": "dashboard:overview",
  
  // Units
  "steps": "health:units.steps",
  "cal": "health:units.calories",
  "mg/dL": "health:units.mgdl",
  "mmHg": "health:units.mmHg",
  "%": "health:units.percent",
  "/10": "health:units.outOfTen",
  "minutes": "health:units.minutes",
  "hours": "health:units.hours",
  "days": "health:units.days",
  
  // Detailed view titles
  "Today's Details": "dashboard:todaysDetails",
  "This Week": "dashboard:thisWeek",
  "This Month": "dashboard:thisMonth",
  "AI Insights": "dashboard:aiInsights",
  "Today's Readings": "dashboard:todaysReadings",
  "Glucose Insights": "dashboard:glucoseInsights",
  "Blood Pressure Insights": "dashboard:bloodPressureInsights",
  "Oxygen Level Insights": "dashboard:oxygenInsights",
  "Today's Mood": "dashboard:todaysMood",
  "Mood Insights": "dashboard:moodInsights",
  "Today's Sessions": "dashboard:todaysSessions",
  "Mindfulness Insights": "dashboard:mindfulnessInsights",
  "Today's Stress": "dashboard:todaysStress",
  "Stress Insights": "dashboard:stressInsights",
  "Last Night": "dashboard:lastNight",
  "Sleep Insights": "dashboard:sleepInsights",
  "Last Night Quality": "dashboard:lastNightQuality",
  "Sleep Quality Insights": "dashboard:sleepQualityInsights",
  
  // Trend descriptions
  "Low": "dashboard:low",
  "Medium": "dashboard:medium",
  "High": "dashboard:high",
  "Stable": "dashboard:stable"
};

// Add missing translation keys to files
const additionalKeys = {
  "en/dashboard.json": {
    "todaysDetails": "Today's Details",
    "aiInsights": "AI Insights", 
    "todaysReadings": "Today's Readings",
    "glucoseInsights": "Glucose Insights",
    "bloodPressureInsights": "Blood Pressure Insights",
    "oxygenInsights": "Oxygen Level Insights",
    "todaysMood": "Today's Mood",
    "moodInsights": "Mood Insights",
    "todaysSessions": "Today's Sessions",
    "mindfulnessInsights": "Mindfulness Insights",
    "todaysStress": "Today's Stress",
    "stressInsights": "Stress Insights",
    "lastNight": "Last Night",
    "sleepInsights": "Sleep Insights",
    "lastNightQuality": "Last Night Quality",
    "sleepQualityInsights": "Sleep Quality Insights",
    "low": "Low",
    "medium": "Medium", 
    "high": "High",
    "stable": "Stable"
  },
  "en/health.json": {
    "units": {
      "calories": "cal",
      "mgdl": "mg/dL",
      "outOfTen": "/10",
      "days": "days"
    }
  }
};

export function addMissingTranslationKeys() {
  const localesPath = path.join(__dirname, '../public/locales');
  
  // Add English keys
  Object.entries(additionalKeys).forEach(([filePath, keys]) => {
    const fullPath = path.join(localesPath, filePath);
    if (fs.existsSync(fullPath)) {
      const content = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
      const merged = { ...content, ...keys };
      fs.writeFileSync(fullPath, JSON.stringify(merged, null, 2));
      console.log(`Updated ${filePath} with missing keys`);
    }
  });
}

export function generateTranslationFix() {
  console.log('Dashboard Translation Mapping:');
  console.log(JSON.stringify(translationMapping, null, 2));
  
  addMissingTranslationKeys();
  
  return translationMapping;
}

if (require.main === module) {
  generateTranslationFix();
}