import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Shield, CheckCircle, AlertCircle, Hash, Link } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/apiRequest";

interface ZKProofResult {
  proof: {
    proofHash: string;
    publicInputs: Record<string, any>;
    verificationKey: string;
    circuitId: string;
    isValid: boolean;
    proofMetadata: {
      constraintsSatisfied: boolean;
      environmentalFactors: string[];
      privacyLevel: string;
    };
  };
  blockchainAnchor: {
    transactionHash: string;
    blockNumber: number;
    network: string;
    gasUsed: number;
    confirmationStatus: string;
  };
  constraints: {
    minValue: number;
    maxValue: number;
    adjustmentFactor: number;
    environmentallyAdjusted: boolean;
  };
}

interface BiometricData {
  type: string;
  value: string;
  unit: string;
  timestamp: string;
}

export default function ZKProofGenerator() {
  const [environmentalDataId, setEnvironmentalDataId] = useState("");
  const [biometricData, setBiometricData] = useState<BiometricData[]>([
    {
      type: "oxygen_saturation",
      value: "94",
      unit: "%",
      timestamp: new Date().toISOString()
    }
  ]);
  const [proofType, setProofType] = useState("compliance");
  const [zkProofResult, setZkProofResult] = useState<ZKProofResult | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const addBiometricReading = () => {
    setBiometricData([...biometricData, {
      type: "heart_rate",
      value: "72",
      unit: "bpm",
      timestamp: new Date().toISOString()
    }]);
  };

  const updateBiometricReading = (index: number, field: keyof BiometricData, value: string) => {
    const updated = [...biometricData];
    updated[index] = { ...updated[index], [field]: value };
    setBiometricData(updated);
  };

  const removeBiometricReading = (index: number) => {
    setBiometricData(biometricData.filter((_, i) => i !== index));
  };

  const generateZKProof = async () => {
    if (!environmentalDataId) {
      toast({
        title: "Environmental Data Required",
        description: "Please generate environmental context first using the Environmental Constraint Demo",
        variant: "destructive"
      });
      return;
    }

    if (biometricData.length === 0) {
      toast({
        title: "Biometric Data Required",
        description: "Add at least one biometric reading",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const response = await apiRequest("/api/generate-proof", {
        method: "POST",
        body: {
          biometricData: biometricData,
          environmentalDataId: parseInt(environmentalDataId),
          proofType: proofType
        }
      });

      setZkProofResult(response);

      toast({
        title: "ZK Proof Generated Successfully",
        description: `Proof hash: ${response.proof.proofHash.substring(0, 16)}...`,
      });
    } catch (error) {
      toast({
        title: "Proof Generation Failed",
        description: "Failed to generate zero-knowledge proof",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const verifyProof = async () => {
    if (!zkProofResult) return;

    setLoading(true);
    try {
      const response = await apiRequest("/api/verify-proof", {
        method: "POST",
        body: {
          proofHash: zkProofResult.proof.proofHash,
          verificationKey: zkProofResult.proof.verificationKey,
          publicInputs: zkProofResult.proof.publicInputs,
          requesterCredentials: {
            requesterId: "demo_verifier",
            apiKey: "demo_key_12345"
          }
        }
      });

      toast({
        title: "Proof Verification Complete",
        description: response.isValid ? "Proof is valid" : "Proof verification failed",
        variant: response.isValid ? "default" : "destructive"
      });
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: "Failed to verify proof",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Zero-Knowledge Proof Generator</h1>
        <p className="text-muted-foreground">
          Generate cryptographic proofs for health data compliance without revealing sensitive information
        </p>
      </div>

      {/* Input Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Proof Configuration
          </CardTitle>
          <CardDescription>
            Configure biometric data and proof parameters
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="envDataId">Environmental Data ID</Label>
              <Input
                id="envDataId"
                value={environmentalDataId}
                onChange={(e) => setEnvironmentalDataId(e.target.value)}
                placeholder="Get from Environmental Constraint Demo"
              />
            </div>
            <div>
              <Label htmlFor="proofType">Proof Type</Label>
              <select
                className="w-full p-2 border rounded-md"
                value={proofType}
                onChange={(e) => setProofType(e.target.value)}
              >
                <option value="compliance">Compliance</option>
                <option value="threshold">Threshold</option>
                <option value="range">Range</option>
                <option value="temporal">Temporal</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Biometric Readings</Label>
              <Button onClick={addBiometricReading} size="sm">
                Add Reading
              </Button>
            </div>

            {biometricData.map((reading, index) => (
              <div key={index} className="grid grid-cols-4 gap-2 p-3 border rounded-lg">
                <select
                  className="p-1 border rounded"
                  value={reading.type}
                  onChange={(e) => updateBiometricReading(index, 'type', e.target.value)}
                >
                  <option value="oxygen_saturation">Oxygen Saturation</option>
                  <option value="heart_rate">Heart Rate</option>
                  <option value="blood_pressure_systolic">Blood Pressure</option>
                  <option value="body_temperature">Body Temperature</option>
                </select>
                <Input
                  value={reading.value}
                  onChange={(e) => updateBiometricReading(index, 'value', e.target.value)}
                  placeholder="Value"
                />
                <Input
                  value={reading.unit}
                  onChange={(e) => updateBiometricReading(index, 'unit', e.target.value)}
                  placeholder="Unit"
                />
                <Button
                  onClick={() => removeBiometricReading(index)}
                  variant="outline"
                  size="sm"
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>

          <Button onClick={generateZKProof} disabled={loading} className="w-full">
            Generate Zero-Knowledge Proof
          </Button>
        </CardContent>
      </Card>

      {/* Proof Result */}
      {zkProofResult && (
            <div className="relative">
              {/* Certificate-style container with folded edge */}
              <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-8 shadow-lg">
                {/* Folded corner effect */}
                <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-blue-300 to-blue-200 transform rotate-45 translate-x-4 -translate-y-4 shadow-md"></div>
                <div className="absolute top-0 right-0 w-6 h-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-l border-b border-blue-200"></div>

                {/* Certificate header */}
                <div className="text-center mb-6 border-b-2 border-blue-200 pb-4">
                  <div className="flex justify-center items-center mb-2">
                    <Shield className="w-8 h-8 text-blue-600 mr-3" />
                    <h3 className="text-2xl font-bold text-blue-800">ZERO-KNOWLEDGE PROOF CERTIFICATE</h3>
                    <Shield className="w-8 h-8 text-blue-600 ml-3" />
                  </div>
                  <div className="text-sm text-blue-600 font-medium">Cryptographically Verified Health Achievement</div>
                </div>

                <div className="space-y-6">
                  {/* Proof Hash - styled as certificate number */}
                  <div className="bg-white p-4 rounded-lg border-2 border-blue-100 shadow-sm">
                    <div className="text-center">
                      <div className="text-sm font-bold text-blue-800 mb-2">CERTIFICATE NUMBER</div>
                      <div className="text-xs font-mono bg-blue-50 p-3 rounded border-dashed border-2 border-blue-200 break-all">
                        {zkProofResult.proof.proofHash}
                      </div>
                    </div>
                  </div>

                  {/* Main certificate content */}
                  <div className="bg-white p-6 rounded-lg border-2 border-blue-100 shadow-sm">
                    <div className="text-center mb-4">
                      <div className="text-lg font-bold text-gray-800 mb-2">THIS CERTIFIES THAT</div>
                      <div className="text-xl font-bold text-blue-800">HEALTH ACHIEVEMENT</div>
                      <div className="text-base text-gray-700 mt-2">has been cryptographically verified using zero-knowledge proofs</div>
                    </div>

                    {/* Status indicators */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                      <div className="text-center p-4 bg-gradient-to-b from-green-50 to-green-100 border-2 border-green-200 rounded-lg">
                        <div className="font-bold text-green-800 mb-1">PROOF STATUS</div>
                        <Badge variant={zkProofResult.proof.isValid ? "default" : "destructive"} className="text-lg px-4 py-1">
                          {zkProofResult.proof.isValid ? "✓ VALID" : "✗ INVALID"}
                        </Badge>
                      </div>
                      <div className="text-center p-4 bg-gradient-to-b from-blue-50 to-blue-100 border-2 border-blue-200 rounded-lg">
                        <div className="font-bold text-blue-800 mb-1">CONSTRAINTS</div>
                        <Badge variant={zkProofResult.proof.proofMetadata.constraintsSatisfied ? "default" : "destructive"} className="text-lg px-4 py-1">
                          {zkProofResult.proof.proofMetadata.constraintsSatisfied ? "✓ SATISFIED" : "✗ VIOLATED"}
                        </Badge>
                      </div>
                      <div className="text-center p-4 bg-gradient-to-b from-purple-50 to-purple-100 border-2 border-purple-200 rounded-lg">
                        <div className="font-bold text-purple-800 mb-1">PRIVACY LEVEL</div>
                        <Badge variant="secondary" className="text-lg px-4 py-1 bg-purple-200 text-purple-800">
                          {zkProofResult.proof.proofMetadata.privacyLevel.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Technical details - minimized */}
                  <details className="bg-white rounded-lg border border-gray-200">
                    <summary className="p-4 cursor-pointer font-medium text-gray-700 hover:bg-gray-50 rounded-lg">
                      📋 Technical Details
                    </summary>
                    <div className="p-4 border-t space-y-3">
                      <div>
                        <div className="text-sm font-medium mb-1">Public Inputs:</div>
                        <pre className="text-xs bg-gray-50 p-3 rounded overflow-auto border">
                          {JSON.stringify(zkProofResult.proof.publicInputs, null, 2)}
                        </pre>
                      </div>
                      <div>
                        <div className="text-sm font-medium mb-1">Circuit Information:</div>
                        <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                          Circuit ID: {zkProofResult.proof.circuitId}
                        </div>
                      </div>
                    </div>
                  </details>

                  {/* Certificate footer */}
                  <div className="text-center pt-4 border-t-2 border-blue-200">
                    <div className="text-xs text-blue-600">
                      Generated on {new Date().toLocaleDateString()} • VitalLink Health Verification System
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Powered by Zero-Knowledge Cryptographic Proofs
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

      {/* Blockchain Anchor */}
      {zkProofResult?.blockchainAnchor && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link className="h-5 w-5" />
              Blockchain Anchor
            </CardTitle>
            <CardDescription>
              Immutable proof storage for tamper-evident verification
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Transaction Hash</Label>
                <div className="p-2 bg-secondary rounded font-mono text-sm">
                  {zkProofResult.blockchainAnchor.transactionHash}
                </div>
              </div>
              <div>
                <Label>Block Number</Label>
                <div className="p-2 bg-secondary rounded font-mono text-sm">
                  {zkProofResult.blockchainAnchor.blockNumber}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-2 border rounded">
                <div className="text-sm font-medium">Network</div>
                <div className="text-sm">{zkProofResult.blockchainAnchor.network}</div>
              </div>
              <div className="text-center p-2 border rounded">
                <div className="text-sm font-medium">Gas Used</div>
                <div className="text-sm">{zkProofResult.blockchainAnchor.gasUsed}</div>
              </div>
              <div className="text-center p-2 border rounded">
                <div className="text-sm font-medium">Status</div>
                <Badge variant="default">
                  {zkProofResult.blockchainAnchor.confirmationStatus}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Patent Information */}
      <Card>
        <CardHeader>
          <CardTitle>Patent Implementation Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Zero-Knowledge Proof Engine (Patent Claims 1-10):</strong><br />
                ✓ Environmental metadata integration<br />
                ✓ Dynamic constraint parameter selection<br />
                ✓ Cryptographic proof generation<br />
                ✓ Blockchain anchoring simulation<br />
                ✓ Third-party verification interface
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}