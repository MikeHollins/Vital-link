import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Trophy, 
  Shield, 
  Lock, 
  Award, 
  Star, 
  Zap,
  Eye,
  EyeOff,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
  Download
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const healthData = [
  {
    id: 1,
    title: "Step Master",
    description: "Achieved 10,000+ steps for 30 consecutive days",
    category: "Fitness",
    rarity: "Epic",
    progress: 100,
    imageUrl: "/api/placeholder/300/300",
    isEarned: true,
    isMinted: false,
    healthMetric: "Daily Steps",
    threshold: "10,000 steps × 30 days",
    earnedDate: "2024-01-15",
    zkProofGenerated: true
  },
  {
    id: 2,
    title: "Heart Health Champion",
    description: "Maintained resting heart rate below 65 BPM for 3 months",
    category: "Cardiovascular",
    rarity: "Legendary",
    progress: 100,
    imageUrl: "/api/placeholder/300/300", 
    isEarned: true,
    isMinted: true,
    healthMetric: "Resting Heart Rate",
    threshold: "<65 BPM × 90 days",
    earnedDate: "2024-02-20",
    mintedDate: "2024-02-22",
    blockchainId: "0x8f7e2b1c9d5a4e6f8b2c1a9e7d5f3b8c6a4e2f1d9b7c5a3e1f8d6b4c2a9e7f5",
    tokenId: "42",
    zkProofGenerated: true
  },
  {
    id: 3,
    title: "Sleep Consistency Pro",
    description: "8+ hours of sleep for 60 consecutive nights",
    category: "Sleep",
    rarity: "Rare",
    progress: 85,
    imageUrl: "/api/placeholder/300/300",
    isEarned: false,
    isMinted: false,
    healthMetric: "Sleep Duration",
    threshold: "8+ hours × 60 days",
    currentStreak: "51 days",
    zkProofGenerated: false
  }
];

const rarityColors = {
  "Common": "bg-gray-100 text-gray-800 border-gray-300",
  "Rare": "bg-blue-100 text-blue-800 border-blue-300", 
  "Epic": "bg-purple-100 text-purple-800 border-purple-300",
  "Legendary": "bg-yellow-100 text-yellow-800 border-yellow-300"
};

export default function SecureNFTme() {
  const [privacyMode, setPrivacyMode] = useState(false);
  const [mintingId, setMintingId] = useState<number | null>(null);
  const { toast } = useToast();

  const handleMintNFT = async (achievement: any) => {
    if (!achievement.zkProofGenerated) {
      toast({
        title: "Zero-Knowledge Proof Required",
        description: "Generating privacy-preserving proof of your health achievement. This may take a moment...",
        variant: "default",
      });
      return;
    }

    setMintingId(achievement.id);
    
    toast({
      title: "Blockchain Connection Required",
      description: "To mint your health data as an NFT, please connect your Web3 wallet or provide your blockchain credentials for secure minting.",
      variant: "default",
    });

    // Simulate minting process
    setTimeout(() => {
      setMintingId(null);
      toast({
        title: "NFT Minting Initiated",
        description: "Your health data NFT is being created on the blockchain. You'll receive a notification once it's complete.",
      });
    }, 3000);
  };

  const generateZKProof = async (dataId: number) => {
    toast({
      title: "Generating Zero-Knowledge Proof",
      description: "Creating cryptographic proof of your data without revealing personal health data...",
    });

    // In real implementation, this would call the ZK proof generation service
    setTimeout(() => {
      toast({
        title: "Privacy Proof Generated",
        description: "Your data can now be verified without exposing your personal health data.",
      });
    }, 2000);
  };

  const AchievementCard = ({ achievement }: { achievement: any }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">{achievement.title}</CardTitle>
              <CardDescription>{achievement.description}</CardDescription>
            </div>
          </div>
          <Badge className={rarityColors[achievement.rarity as keyof typeof rarityColors]}>
            {achievement.rarity}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!achievement.isEarned && (
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Progress</span>
              <span>{achievement.progress}%</span>
            </div>
            <Progress value={achievement.progress} className="h-2" />
            {achievement.currentStreak && (
              <p className="text-sm text-muted-foreground mt-1">
                Current streak: {achievement.currentStreak}
              </p>
            )}
          </div>
        )}

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Health Metric:</span>
            <span className="font-medium">{achievement.healthMetric}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Threshold:</span>
            <span className="font-medium">{privacyMode ? "••••••" : achievement.threshold}</span>
          </div>
          {achievement.earnedDate && (
            <div className="flex justify-between text-sm">
              <span>Earned:</span>
              <span className="font-medium">{achievement.earnedDate}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 text-sm">
          <div className="flex items-center gap-1">
            {achievement.zkProofGenerated ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
            )}
            <span>Zero-Knowledge Proof: {achievement.zkProofGenerated ? "Generated" : "Pending"}</span>
          </div>
        </div>

        <div className="flex gap-2">
          {achievement.isEarned && !achievement.zkProofGenerated && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => generateZKProof(achievement.id)}
            >
              <Lock className="h-4 w-4 mr-1" />
              Generate Privacy Proof
            </Button>
          )}
          
          {achievement.isEarned && achievement.zkProofGenerated && !achievement.isMinted && (
            <Button 
              size="sm"
              onClick={() => handleMintNFT(achievement)}
              disabled={mintingId === achievement.id}
            >
              {mintingId === achievement.id ? (
                <>
                  <Zap className="h-4 w-4 mr-1 animate-pulse" />
                  Minting...
                </>
              ) : (
                <>
                  <Award className="h-4 w-4 mr-1" />
                  Mint NFT
                </>
              )}
            </Button>
          )}

          {achievement.isMinted && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <ExternalLink className="h-4 w-4 mr-1" />
                View on OpenSea
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                Download Certificate
              </Button>
            </div>
          )}
        </div>

        {achievement.isMinted && (
          <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="font-medium text-green-800 dark:text-green-200">NFT Successfully Minted</span>
            </div>
            <div className="text-xs space-y-1 text-green-700 dark:text-green-300">
              <div>Token ID: {achievement.tokenId}</div>
              <div>Blockchain: {achievement.blockchainId?.substring(0, 20)}...</div>
              <div>Minted: {achievement.mintedDate}</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const earnedCount = healthData.filter(a => a.isEarned).length;
  const mintedCount = healthData.filter(a => a.isMinted).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <div className="container mx-auto px-4 py-8">
        {/* Sleek Header */}
        <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg mb-8 overflow-hidden">
          {/* Background gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-blue-500/5 to-teal-500/5 dark:from-purple-400/10 dark:via-blue-400/10 dark:to-teal-400/10"></div>
          
          <div className="relative px-8 py-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                {/* Icon container */}
                <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl shadow-lg">
                  <Trophy className="h-8 w-8 text-white" />
                </div>
                
                {/* Title and description */}
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    NFTme - Health Data
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm font-medium">
                    Turn your health milestones into valuable blockchain assets with privacy protection
                  </p>
                </div>
              </div>
              

            </div>
            
            {/* Portfolio stats */}
            <div className="mt-4 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">NFT Portfolio Performance</span>
                <span className="text-xs font-medium text-purple-600 dark:text-purple-400">Active Collection</span>
              </div>
              <div className="flex items-center space-x-8">
                <div className="text-center">
                  <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
                    {healthData.length}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    Total Items
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-green-600 dark:text-green-400">
                    {earnedCount}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    Earned
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    {mintedCount}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    Minted
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
                    {privacyMode ? "••••" : `${(mintedCount * 0.1).toFixed(1)} ETH`}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    Portfolio Value
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>





        {/* Data Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Data</TabsTrigger>
            <TabsTrigger value="earned">Earned</TabsTrigger>
            <TabsTrigger value="minted">Minted NFTs</TabsTrigger>
            <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {healthData.map(achievement => (
                <AchievementCard key={achievement.id} achievement={achievement} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="earned" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {healthData.filter(a => a.isEarned).map(achievement => (
                <AchievementCard key={achievement.id} achievement={achievement} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="minted" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {healthData.filter(a => a.isMinted).map(achievement => (
                <AchievementCard key={achievement.id} achievement={achievement} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="marketplace" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>NFT Marketplace Integration</CardTitle>
                <CardDescription>
                  Your health achievement NFTs are automatically listed on major marketplaces
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">OpenSea Collection</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Your health achievements are available on the world's largest NFT marketplace
                    </p>
                    <Button variant="outline" className="w-full">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View on OpenSea
                    </Button>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Health NFT Analytics</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Track the value and rarity of your health achievement NFTs
                    </p>
                    <Button variant="outline" className="w-full">
                      <Star className="h-4 w-4 mr-2" />
                      View Analytics
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}