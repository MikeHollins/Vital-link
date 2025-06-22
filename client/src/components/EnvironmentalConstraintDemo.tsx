import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, MapPin, Thermometer, Gauge, Mountain } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/apiRequest";

interface EnvironmentalData {
  location: {
    latitude: number;
    longitude: number;
    altitude: number;
    timezone: string;
  };
  weather: {
    temperature: number;
    humidity: number;
    pressure: number;
    altitude: number;
  };
  timestamp: Date;
}

interface ConstraintParameters {
  minValue: number;
  maxValue: number;
  adjustmentFactor: number;
  environmentallyAdjusted: boolean;
}

interface BiometricReading {
  type: string;
  value: string;
  unit: string;
  timestamp: string;
}

export default function EnvironmentalConstraintDemo() {
  const [location, setLocation] = useState({ latitude: "", longitude: "" });
  const [environmentalData, setEnvironmentalData] = useState<EnvironmentalData | null>(null);
  const [environmentalDataId, setEnvironmentalDataId] = useState<string | null>(null);
  const [biometricReading, setBiometricReading] = useState<BiometricReading>({
    type: "oxygen_saturation",
    value: "96",
    unit: "%",
    timestamp: new Date().toISOString()
  });
  const [constraints, setConstraints] = useState<ConstraintParameters | null>(null);
  const [validationResult, setValidationResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Get user's current location
  const getCurrentLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString()
          });
          setLoading(false);
          toast({
            title: "Location Retrieved",
            description: "GPS coordinates obtained successfully"
          });
        },
        (error) => {
          console.error("Geolocation error:", error);
          // Use Denver, CO as example location (high altitude)
          setLocation({
            latitude: "39.7392",
            longitude: "-104.9903"
          });
          setLoading(false);
          toast({
            title: "Location Set",
            description: "Using Denver, CO (1609m altitude) as example location",
            variant: "default"
          });
        }
      );
    } else {
      // Fallback to Denver coordinates
      setLocation({
        latitude: "39.7392",
        longitude: "-104.9903"
      });
      setLoading(false);
    }
  };

  // Generate environmental context
  const generateEnvironmentalContext = async () => {
    if (!location.latitude || !location.longitude) {
      toast({
        title: "Location Required",
        description: "Please provide coordinates or use current location",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const response = await apiRequest("/api/environmental-context", {
        method: "POST",
        body: {
          latitude: location.latitude,
          longitude: location.longitude
        }
      });

      setEnvironmentalData(response.environmentalContext);
      setEnvironmentalDataId(response.dataId);

      toast({
        title: "Environmental Context Generated",
        description: `Altitude: ${response.environmentalContext.weather.altitude}m, Temp: ${response.environmentalContext.weather.temperature}°C`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate environmental context",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Get constraint parameters for biometric type
  const getConstraintParameters = async () => {
    if (!environmentalDataId) {
      toast({
        title: "Environmental Data Required",
        description: "Generate environmental context first",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const response = await apiRequest("/api/constraint-parameters", {
        method: "POST",
        body: {
          biometricType: biometricReading.type,
          environmentalDataId: environmentalDataId
        }
      });

      setConstraints(response.constraints);

      if (response.altitudeAdjustment) {
        toast({
          title: "Patent Claim 3 Implemented",
          description: `Oxygen saturation adjusted for ${response.altitudeAdjustment.altitude}: ${response.altitudeAdjustment.adjustedRange}`,
        });
      } else {
        toast({
          title: "Constraints Generated",
          description: `Range: ${response.constraints.minValue}-${response.constraints.maxValue}`
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get constraint parameters",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Validate biometric reading
  const validateBiometric = async () => {
    if (!environmentalDataId) {
      toast({
        title: "Environmental Data Required",
        description: "Generate environmental context first",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const response = await apiRequest("/api/validate-biometric", {
        method: "POST",
        body: {
          reading: biometricReading,
          environmentalDataId: environmentalDataId
        }
      });

      setValidationResult(response.validationResult);

      toast({
        title: "Validation Complete",
        description: response.validationResult.isValid ? "Reading is valid" : "Reading failed validation",
        variant: response.validationResult.isValid ? "default" : "destructive"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to validate biometric reading",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const validateBiometrics = async () => {
    if (!environmentalDataId) {
      toast({
        title: "Environmental Data Required",
        description: "Please generate environmental context first",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Enhanced validation with biological constraints
      const response = await apiRequest("/api/validate-biometric-enhanced", {
        method: "POST",
        body: {
          reading: biometricReading,
          environmentalDataId: parseInt(environmentalDataId),
          userContext: {
            age: 30, // Would come from user profile
            fitness_level: "moderate",
            medical_conditions: [],
            medications: []
          }
        }
      });

      setValidationResult(response);

      // Enhanced feedback based on AI analysis
      if (response.aiAnalysis) {
        toast({
          title: "Enhanced Validation Complete",
          description: `${response.validationResult.isValid ? 'Valid' : 'Invalid'} - Confidence: ${response.aiAnalysis.confidence}%`,
          variant: response.validationResult.isValid ? "default" : "destructive"
        });
      } else {
        toast({
          title: "Validation Complete",
          description: `Biometric data ${response.validationResult.isValid ? 'validated' : 'flagged'} successfully`,
          variant: response.validationResult.isValid ? "default" : "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Validation Failed",
        description: "Failed to validate biometric data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };


  // Auto-load location on component mount
  useEffect(() => {
    getCurrentLocation();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Environmental Constraint Adaptation</h1>
        <p className="text-muted-foreground">
          Patent Implementation: Dynamic physiological constraints based on environmental metadata
        </p>
      </div>

      {/* Step 1: Location Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Step 1: Environmental Context
          </CardTitle>
          <CardDescription>
            Set location to determine environmental conditions for constraint adjustment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                value={location.latitude}
                onChange={(e) => setLocation({ ...location, latitude: e.target.value })}
                placeholder="39.7392"
              />
            </div>
            <div>
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                value={location.longitude}
                onChange={(e) => setLocation({ ...location, longitude: e.target.value })}
                placeholder="-104.9903"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={getCurrentLocation} disabled={loading}>
              Use Current Location
            </Button>
            <Button onClick={generateEnvironmentalContext} disabled={loading || !location.latitude}>
              Generate Environmental Context
            </Button>
          </div>

          {environmentalData && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div className="flex items-center gap-2 p-3 bg-secondary rounded-lg">
                <Mountain className="h-4 w-4" />
                <div>
                  <div className="text-sm font-medium">Altitude</div>
                  <div className="text-lg">{environmentalData.weather.altitude}m</div>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-secondary rounded-lg">
                <Thermometer className="h-4 w-4" />
                <div>
                  <div className="text-sm font-medium">Temperature</div>
                  <div className="text-lg">{environmentalData.weather.temperature}°C</div>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-secondary rounded-lg">
                <Gauge className="h-4 w-4" />
                <div>
                  <div className="text-sm font-medium">Humidity</div>
                  <div className="text-lg">{environmentalData.weather.humidity}%</div>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-secondary rounded-lg">
                <Gauge className="h-4 w-4" />
                <div>
                  <div className="text-sm font-medium">Pressure</div>
                  <div className="text-lg">{environmentalData.weather.pressure} hPa</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Step 2: Biometric Input */}
      <Card>
        <CardHeader>
          <CardTitle>Step 2: Biometric Reading</CardTitle>
          <CardDescription>
            Enter biometric data for validation against environmental constraints
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="type">Metric Type</Label>
              <select
                className="w-full p-2 border rounded-md"
                value={biometricReading.type}
                onChange={(e) => setBiometricReading({ ...biometricReading, type: e.target.value })}
              >
                <option value="oxygen_saturation">Oxygen Saturation</option>
                <option value="heart_rate">Heart Rate</option>
                <option value="blood_pressure_systolic">Blood Pressure (Systolic)</option>
                <option value="body_temperature">Body Temperature</option>
              </select>
            </div>
            <div>
              <Label htmlFor="value">Value</Label>
              <Input
                id="value"
                value={biometricReading.value}
                onChange={(e) => setBiometricReading({ ...biometricReading, value: e.target.value })}
                placeholder="96"
              />
            </div>
            <div>
              <Label htmlFor="unit">Unit</Label>
              <Input
                id="unit"
                value={biometricReading.unit}
                onChange={(e) => setBiometricReading({ ...biometricReading, unit: e.target.value })}
                placeholder="%"
              />
            </div>
          </div>

          <Button onClick={getConstraintParameters} disabled={loading || !environmentalDataId}>
            Get Dynamic Constraints
          </Button>

          {constraints && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Environmental Constraints Generated:</strong><br />
                Valid Range: {constraints.minValue} - {constraints.maxValue} {biometricReading.unit}<br />
                Adjustment Factor: {constraints.adjustmentFactor}<br />
                <Badge variant={constraints.environmentallyAdjusted ? "default" : "secondary"}>
                  {constraints.environmentallyAdjusted ? "Environmentally Adjusted" : "Standard Range"}
                </Badge>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Step 3: Validation */}
      <Card>
        <CardHeader>
          <CardTitle>Step 3: Constraint Validation</CardTitle>
          <CardDescription>
            Validate biometric reading against dynamically adjusted constraints
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={validateBiometrics} disabled={loading || !constraints}>
            Validate Biometric Reading
          </Button>

          {validationResult && (
            <div className="space-y-4">
              <Alert variant={validationResult.isValid ? "default" : "destructive"}>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Validation Result:</strong><br />
                  Status: <Badge variant={validationResult.isValid ? "default" : "destructive"}>
                    {validationResult.isValid ? "VALID" : "INVALID"}
                  </Badge><br />
                  Constraints Satisfied: {validationResult.constraintsSatisfied ? "Yes" : "No"}<br />
                  Risk Level: <Badge variant={
                    validationResult.riskAssessment.level === 'low' ? 'default' :
                    validationResult.riskAssessment.level === 'medium' ? 'secondary' : 'destructive'
                  }>
                    {validationResult.riskAssessment.level.toUpperCase()}
                  </Badge>
                </AlertDescription>
              </Alert>

              {validationResult.recommendations && validationResult.recommendations.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">AI Recommendations:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    {validationResult.recommendations.map((rec: string, index: number) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Patent Information */}
      <Card>
        <CardHeader>
          <CardTitle>Patent Implementation Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p><strong>Patent Claim 1:</strong> Computer-implemented method for privacy-preserving verification using environmental metadata</p>
            <p><strong>Patent Claim 2:</strong> Environmental metadata comprises altitude, climate, or geographic location for constraint adjustment</p>
            <p><strong>Patent Claim 3:</strong> Altitude-based oxygen saturation adjustment - higher altitude = lower acceptable range</p>
            <p><strong>Paragraph [0047]:</strong> Environmental metadata defines core logic of cryptographic circuit vs. static public input</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}