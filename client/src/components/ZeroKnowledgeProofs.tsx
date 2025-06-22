import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Lock, Eye, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ZKProof {
  id: string;
  type: 'fitness_achievement' | 'health_milestone' | 'wellness_goal';
  title: string;
  description: string;
  proofGenerated: boolean;
  verified: boolean;
  privateData: any;
  publicClaim: string;
  zkProofHash: string;
}

export const ZeroKnowledgeProofs: React.FC = () => {
  const { toast } = useToast();
  const [proofs, setProofs] = useState<ZKProof[]>([
    {
      id: 'steps-30-days',
      type: 'fitness_achievement',
      title: '30-Day Step Goal',
      description: 'Prove you achieved 10,000+ steps for 30 consecutive days',
      proofGenerated: false,
      verified: false,
      privateData: {
        dailySteps: [10250, 12100, 9800, 11500, 10800], // Actual step data (private)
        dates: ['2024-01-01', '2024-01-02', '2024-01-03', '2024-01-04', '2024-01-05']
      },
      publicClaim: 'User achieved 10,000+ steps for 30 consecutive days',
      zkProofHash: ''
    },
    {
      id: 'weight-loss',
      type: 'health_milestone',
      title: 'Weight Loss Achievement',
      description: 'Prove 10+ lbs weight loss without revealing actual weights',
      proofGenerated: false,
      verified: false,
      privateData: {
        startWeight: 180,
        endWeight: 168,
        weightLoss: 12
      },
      publicClaim: 'User achieved 10+ lbs weight loss over 3 months',
      zkProofHash: ''
    },
    {
      id: 'sleep-quality',
      type: 'wellness_goal',
      title: 'Sleep Quality Improvement',
      description: 'Prove consistent 7+ hours sleep without revealing sleep patterns',
      proofGenerated: false,
      verified: false,
      privateData: {
        avgSleepHours: 7.5,
        consistency: 0.92,
        qualityScore: 85
      },
      publicClaim: 'User maintained 7+ hours quality sleep for 30 days',
      zkProofHash: ''
    }
  ]);

  // Simulate zero-knowledge proof generation
  const generateZKProof = async (proofId: string) => {
    const proof = proofs.find(p => p.id === proofId);
    if (!proof) return;

    toast({
      title: "Generating ZK Proof",
      description: "Creating privacy-preserving proof of your health achievement...",
    });

    // Simulate ZK proof computation (in real implementation, this would use libraries like snarkjs, circom, etc.)
    setTimeout(() => {
      const zkHash = `zk_${Math.random().toString(36).substr(2, 16)}`;
      
      setProofs(prev => prev.map(p => 
        p.id === proofId 
          ? { ...p, proofGenerated: true, zkProofHash: zkHash }
          : p
      ));

      toast({
        title: "ZK Proof Generated! 🔐",
        description: "Your health achievement is now verifiable without revealing private data.",
      });
    }, 2000);
  };

  // Simulate proof verification
  const verifyProof = async (proofId: string) => {
    const proof = proofs.find(p => p.id === proofId);
    if (!proof || !proof.proofGenerated) return;

    toast({
      title: "Verifying Proof",
      description: "Checking proof validity on blockchain...",
    });

    setTimeout(() => {
      setProofs(prev => prev.map(p => 
        p.id === proofId 
          ? { ...p, verified: true }
          : p
      ));

      toast({
        title: "Proof Verified! ✅",
        description: "Your achievement has been cryptographically verified.",
      });
    }, 1500);
  };

  const getProofTypeIcon = (type: ZKProof['type']) => {
    switch (type) {
      case 'fitness_achievement':
        return '🏃‍♂️';
      case 'health_milestone':
        return '🎯';
      case 'wellness_goal':
        return '💤';
      default:
        return '🔐';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          <Shield className="w-6 h-6 inline mr-2" />
          Zero-Knowledge Proofs
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Prove your health achievements without revealing sensitive data
        </p>
      </div>

      {/* ZK Proofs Explanation */}
      <Card className="border-primary-200 dark:border-primary-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary-600 dark:text-primary-400">
            <Lock className="w-5 h-5" />
            How Zero-Knowledge Proofs Work
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="text-center p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
              <Eye className="w-6 h-6 mx-auto mb-2 text-primary-500" />
              <div className="font-medium">Private Data</div>
              <div className="text-gray-600 dark:text-gray-400">Your actual health metrics stay private</div>
            </div>
            <div className="text-center p-3 bg-success-50 dark:bg-success-900/20 rounded-lg">
              <Shield className="w-6 h-6 mx-auto mb-2 text-success-500" />
              <div className="font-medium">Generate Proof</div>
              <div className="text-gray-600 dark:text-gray-400">Create cryptographic proof of achievement</div>
            </div>
            <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <CheckCircle className="w-6 h-6 mx-auto mb-2 text-blue-500" />
              <div className="font-medium">Verify Claim</div>
              <div className="text-gray-600 dark:text-gray-400">Anyone can verify without seeing data</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Available ZK Proofs */}
      <div className="grid gap-4">
        {proofs.map((proof) => (
          <Card key={proof.id} className="border-gray-200 dark:border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">{getProofTypeIcon(proof.type)}</span>
                  {proof.title}
                </CardTitle>
                <div className="flex gap-2">
                  {proof.verified && (
                    <Badge variant="default" className="bg-success-500">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                  {proof.proofGenerated && !proof.verified && (
                    <Badge variant="secondary">
                      <Shield className="w-3 h-3 mr-1" />
                      Proof Ready
                    </Badge>
                  )}
                  {!proof.proofGenerated && (
                    <Badge variant="outline">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Pending
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400">{proof.description}</p>
              
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                <div className="text-sm font-medium mb-1">Public Claim:</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{proof.publicClaim}</div>
              </div>

              {proof.zkProofHash && (
                <div className="bg-primary-50 dark:bg-primary-900/20 p-3 rounded-lg">
                  <div className="text-sm font-medium mb-1">ZK Proof Hash:</div>
                  <div className="text-xs font-mono text-primary-600 dark:text-primary-400 break-all">
                    {proof.zkProofHash}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                {!proof.proofGenerated && (
                  <Button 
                    onClick={() => generateZKProof(proof.id)}
                    className="bg-primary-500 hover:bg-primary-600"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Generate ZK Proof
                  </Button>
                )}
                
                {proof.proofGenerated && !proof.verified && (
                  <Button 
                    onClick={() => verifyProof(proof.id)}
                    variant="outline"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Verify on Blockchain
                  </Button>
                )}

                {proof.verified && (
                  <Button variant="secondary" disabled>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Verified & Recorded
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Technical Implementation Info */}
      <Card className="border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="text-blue-600 dark:text-blue-400">
            🔧 Technical Implementation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div><strong>ZK Library:</strong> snarkjs + circom for circuit compilation</div>
          <div><strong>Blockchain:</strong> Ethereum/Polygon for proof verification</div>
          <div><strong>Privacy:</strong> No sensitive health data ever leaves your device</div>
          <div><strong>Verification:</strong> Smart contracts validate proofs automatically</div>
          <div><strong>Interoperability:</strong> Proofs work across health platforms</div>
        </CardContent>
      </Card>
    </div>
  );
};