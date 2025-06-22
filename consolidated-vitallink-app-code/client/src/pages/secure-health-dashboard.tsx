import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Shield, Brain, Link, Check, AlertTriangle, Clock } from 'lucide-react';

export default function SecureHealthDashboard() {
  const { toast } = useToast();
  const [healthData, setHealthData] = useState({
    deviceType: '',
    rawData: '',
    metadata: ''
  });
  const [zkRequest, setZkRequest] = useState({
    metricType: '',
    targetThreshold: '',
    timeWindow: '24'
  });
  const [consentData, setConsentData] = useState({
    dataTypes: ['health_data'],
    processingPurposes: ['health_verification'],
    jurisdictionPreference: 'SG'
  });

  // AI Health Data Normalization
  const normalizeMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', '/api/ai/normalize-health-data', data);
      return response.json();
    },
    onSuccess: (result) => {
      toast({
        title: "Health Data Normalized",
        description: `Quality Score: ${result.qualityScore}% - Data processed successfully`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/health-data'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Normalization Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Zero-Knowledge Proof Generation
  const zkProofMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', '/api/zk-proofs/generate', data);
      return response.json();
    },
    onSuccess: (result) => {
      toast({
        title: "Zero-Knowledge Proof Generated",
        description: `Proof hash: ${result.proofHash.substring(0, 16)}...`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/zk-proofs'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Proof Generation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Privacy Consent Management
  const consentMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', '/api/privacy/capture-consent', data);
      return response.json();
    },
    onSuccess: (result) => {
      toast({
        title: "Consent Captured",
        description: `Consent ID: ${result.consentId}`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Consent Capture Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Fetch existing ZK proofs
  const { data: zkProofs = [] } = useQuery({
    queryKey: ['/api/zk-proofs']
  });

  // Fetch consent status
  const { data: consentStatus = { isValid: false } } = useQuery({
    queryKey: ['/api/privacy/consent-status']
  });

  const handleNormalizeData = () => {
    if (!healthData.deviceType || !healthData.rawData) {
      toast({
        title: "Missing Data",
        description: "Please provide device type and raw health data",
        variant: "destructive",
      });
      return;
    }

    try {
      const parsedData = JSON.parse(healthData.rawData);
      const metadata = healthData.metadata ? JSON.parse(healthData.metadata) : {};
      
      normalizeMutation.mutate({
        deviceType: healthData.deviceType,
        rawData: parsedData,
        metadata
      });
    } catch (error) {
      toast({
        title: "Invalid JSON",
        description: "Please provide valid JSON data",
        variant: "destructive",
      });
    }
  };

  const handleGenerateProof = () => {
    if (!zkRequest.metricType) {
      toast({
        title: "Missing Metric Type",
        description: "Please select a metric type",
        variant: "destructive",
      });
      return;
    }

    zkProofMutation.mutate({
      metricType: zkRequest.metricType,
      targetThreshold: zkRequest.targetThreshold ? parseInzkRequest.targetThreshold : undefined,
      timeWindow: parseInzkRequest.timeWindow
    });
  };

  const handleCaptureConsent = () => {
    consentMutation.mutate(consentData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            VitalLink Secure Health Platform
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            AI-powered health data processing with Zero-Knowledge privacy protection
          </p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-green-200 bg-green-50 dark:bg-green-900/20">
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <Shield className="h-5 w-5 text-green-600" />
              <CardTitle className="text-sm font-medium ml-2">Privacy Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700 dark:text-green-400">
                {consentStatus?.isValid ? 'Protected' : 'Consent Required'}
              </div>
              <p className="text-xs text-green-600 dark:text-green-500">
                {consentStatus?.isValid ? 'All data processing authorized' : 'Setup consent to begin'}
              </p>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <Brain className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-sm font-medium ml-2">AI Processing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                {normalizeMutation.isPending ? 'Processing...' : 'Ready'}
              </div>
              <p className="text-xs text-blue-600 dark:text-blue-500">
                Advanced health data normalization
              </p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-purple-50 dark:bg-purple-900/20">
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <Link className="h-5 w-5 text-purple-600" />
              <CardTitle className="text-sm font-medium ml-2">ZK Proofs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-700 dark:text-purple-400">
                {zkProofs?.length || 0}
              </div>
              <p className="text-xs text-purple-600 dark:text-purple-500">
                Zero-knowledge verifications generated
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* AI Health Data Normalization */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="h-5 w-5 mr-2 text-blue-600" />
                AI Health Data Normalization
              </CardTitle>
              <CardDescription>
                Process raw health data from any device using advanced AI algorithms
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="deviceType">Device Type</Label>
                <Select onValueChange={(value) => setHealthData(prev => ({ ...prev, deviceType: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select device type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apple_health">Apple Health</SelectItem>
                    <SelectItem value="fitbit">Fitbit</SelectItem>
                    <SelectItem value="google_fit">Google Fit</SelectItem>
                    <SelectItem value="samsung_health">Samsung Health</SelectItem>
                    <SelectItem value="garmin">Garmin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="rawData">Raw Health Data (JSON)</Label>
                <Textarea
                  id="rawData"
                  placeholder='{"heart_rate": 72, "steps": 8500, "timestamp": "2024-01-15T10:30:00Z"}'
                  value={healthData.rawData}
                  onChange={(e) => setHealthData(prev => ({ ...prev, rawData: e.target.value }))}
                  rows={4}
                />
              </div>
              
              <div>
                <Label htmlFor="metadata">Metadata (JSON, optional)</Label>
                <Textarea
                  id="metadata"
                  placeholder='{"age": 30, "gender": "M", "activity_level": "active"}'
                  value={healthData.metadata}
                  onChange={(e) => setHealthData(prev => ({ ...prev, metadata: e.target.value }))}
                  rows={2}
                />
              </div>
              
              <Button 
                onClick={handleNormalizeData} 
                className="w-full"
                disabled={normalizeMutation.isPending}
              >
                {normalizeMutation.isPending ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4 mr-2" />
                    Normalize Health Data
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Zero-Knowledge Proof Generation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2 text-purple-600" />
                Zero-Knowledge Proof Generation
              </CardTitle>
              <CardDescription>
                Generate privacy-preserving health verifications without revealing data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="metricType">Health Metric</Label>
                <Select onValueChange={(value) => setZkRequesprev => ({ ...prev, metricType: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select metric type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="heart_rate">Heart Rate</SelectItem>
                    <SelectItem value="steps">Daily Steps</SelectItem>
                    <SelectItem value="blood_pressure">Blood Pressure</SelectItem>
                    <SelectItem value="sleep">Sleep Duration</SelectItem>
                    <SelectItem value="weight">Weight</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="threshold">Target Threshold (optional)</Label>
                <Input
                  id="threshold"
                  placeholder="e.g., 10000 for steps"
                  value={zkRequest.targetThreshold}
                  onChange={(e) => setZkRequesprev => ({ ...prev, targetThreshold: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="timeWindow">Time Window (hours)</Label>
                <Select onValueChange={(value) => setZkRequesprev => ({ ...prev, timeWindow: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time window" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Hour</SelectItem>
                    <SelectItem value="6">6 Hours</SelectItem>
                    <SelectItem value="24">24 Hours</SelectItem>
                    <SelectItem value="168">1 Week</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                onClick={handleGenerateProof} 
                className="w-full"
                disabled={zkProofMutation.isPending}
              >
                {zkProofMutation.isPending ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    Generate ZK Proof
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Privacy Consent Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Check className="h-5 w-5 mr-2 text-green-600" />
                Privacy Consent Management
              </CardTitle>
              <CardDescription>
                Configure data processing permissions and privacy preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Data Types (Selected)</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {consentData.dataTypes.map((type) => (
                    <Badge key={type} variant="secondary">
                      {type.replace('_', ' ')}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <Label>Processing Purposes</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {consentData.processingPurposes.map((purpose) => (
                    <Badge key={purpose} variant="outline">
                      {purpose.replace('_', ' ')}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <Label htmlFor="jurisdiction">Jurisdiction Preference</Label>
                <Select onValueChange={(value) => setConsentData(prev => ({ ...prev, jurisdictionPreference: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select jurisdiction" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SG">Singapore (PDPA)</SelectItem>
                    <SelectItem value="EU">European Union (GDPR)</SelectItem>
                    <SelectItem value="US">United States (HIPAA)</SelectItem>
                    <SelectItem value="CA">Canada (PIPEDA)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                onClick={handleCaptureConsent} 
                className="w-full"
                disabled={consentMutation.isPending}
              >
                {consentMutation.isPending ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Capture Consent
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Generated ZK Proofs List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Link className="h-5 w-5 mr-2 text-indigo-600" />
                Generated ZK Proofs
              </CardTitle>
              <CardDescription>
                Your privacy-preserving health verifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {zkProofs && zkProofs.length > 0 ? (
                  zkProofs.map((proof: any) => (
                    <div key={proof.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{proof.proofType}</div>
                        <div className="text-sm text-gray-500">
                          {proof.proofHash.substring(0, 16)}...
                        </div>
                      </div>
                      <div className="flex items-center">
                        {proof.isVerified ? (
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            <Check className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            <Clock className="h-3 w-3 mr-1" />
                            Pending
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
                    No ZK proofs generated yet
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}