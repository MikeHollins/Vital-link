import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface LocationData {
  latitude: number;
  longitude: number;
  altitude?: number;
  timezone: string;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  pressure: number;
  altitude: number;
}

export interface EnvironmentalContext {
  location: LocationData;
  weather: WeatherData;
  timestamp: Date;
}

export class EnvironmentalService {
  // Get weather data from OpenWeatherMap API
  async getWeatherData(lat: number, lon: number): Promise<WeatherData> {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      return {
        temperature: data.main.temp,
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        altitude: 0 // Will be enhanced with elevation API
      };
    } catch (error) {
      // Use AI to estimate environmental conditions if weather API fails
      return this.estimateWeatherWithAI(lat, lon);
    }
  }

  // AI-powered environmental estimation
  private async estimateWeatherWithAI(lat: number, lon: number): Promise<WeatherData> {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an environmental data expert. Provide realistic weather estimates based on coordinates. Return JSON only."
          },
          {
            role: "user",
            content: `Estimate current weather conditions for coordinates ${lat}, ${lon}. Consider seasonal patterns, geography, and typical climate. Return JSON with: temperature (Celsius), humidity (%), pressure (hPa), altitude (meters).`
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 200,
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");
      return {
        temperature: result.temperature || 20,
        humidity: result.humidity || 60,
        pressure: result.pressure || 1013,
        altitude: result.altitude || 100
      };
    } catch (error) {
      console.error("AI weather estimation failed:", error);
      // Conservative defaults
      return {
        temperature: 20,
        humidity: 60,
        pressure: 1013,
        altitude: 100
      };
    }
  }

  // Get altitude from elevation API
  async getAltitude(lat: number, lon: number): Promise<number> {
    try {
      // Using Open-Elevation API (free)
      const response = await fetch(
        `https://api.open-elevation.com/api/v1/lookup?locations=${lat},${lon}`
      );
      
      if (!response.ok) {
        throw new Error(`Elevation API error: ${response.status}`);
      }
      
      const data = await response.json();
      return data.results[0]?.elevation || 100;
    } catch (error) {
      console.error("Elevation API failed:", error);
      return 100; // Default sea level + buffer
    }
  }

  // Determine timezone from coordinates
  async getTimezone(lat: number, lon: number): Promise<string> {
    try {
      // Simple timezone estimation based on longitude
      const offset = Math.round(lon / 15);
      return `UTC${offset >= 0 ? '+' : ''}${offset}`;
    } catch (error) {
      return 'UTC+0';
    }
  }

  // Comprehensive environmental context gathering
  async getEnvironmentalContext(lat: number, lon: number): Promise<EnvironmentalContext> {
    const [weather, altitude, timezone] = await Promise.all([
      this.getWeatherData(lat, lon),
      this.getAltitude(lat, lon),
      this.getTimezone(lat, lon)
    ]);

    // Update weather with accurate altitude
    weather.altitude = altitude;

    return {
      location: {
        latitude: lat,
        longitude: lon,
        altitude,
        timezone
      },
      weather,
      timestamp: new Date()
    };
  }

  // AI-powered environmental risk assessment
  async assessEnvironmentalRisks(context: EnvironmentalContext): Promise<{
    riskLevel: 'low' | 'medium' | 'high';
    factors: string[];
    recommendations: string[];
  }> {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a health and environmental risk assessment expert. Analyze environmental conditions and provide health-related risk assessment."
          },
          {
            role: "user",
            content: `Assess health risks for these environmental conditions:
            - Altitude: ${context.weather.altitude}m
            - Temperature: ${context.weather.temperature}°C
            - Humidity: ${context.weather.humidity}%
            - Pressure: ${context.weather.pressure}hPa
            
            Return JSON with: riskLevel (low/medium/high), factors (array of risk factors), recommendations (array of health recommendations).`
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 500,
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");
      return {
        riskLevel: result.riskLevel || 'low',
        factors: result.factors || [],
        recommendations: result.recommendations || []
      };
    } catch (error) {
      console.error("Environmental risk assessment failed:", error);
      return {
        riskLevel: 'low',
        factors: [],
        recommendations: []
      };
    }
  }
}

export const environmentalService = new EnvironmentalService();