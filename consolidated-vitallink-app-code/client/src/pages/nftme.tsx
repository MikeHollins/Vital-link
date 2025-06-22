import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

import { 
  Trophy, 
  Award, 
  Star, 
  Share2, 
  Download, 
  Calendar,
  Target,
  TrendingUp,
  Heart,
  Activity,
  Zap,
  Shield,
  Loader2
} from 'lucide-react';

interface HealthData {
  id: string;
  title: string;
  description: string;
  category: 'fitness' | 'health' | 'wellness' | 'consistency';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  earnedDate: string;
  blockchainId?: string;
  tokenId?: string;
  isShared: boolean;
  metadata: {
    icon: React.ReactNode;
    color: string;
    progress?: number;
    target?: number;
  };
}

export default function NFTmePage() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [selectedHealthData, setSelectedHealthData] = useState<HealthData | null>(null);

  // Demo health data
  const healthData: HealthData[] = [
    {
      id: '1',
      title: 'tenKStepsChampion',
      description: 'achievedTenKSteps',
      category: 'fitness',
      rarity: 'epic',
      earnedDate: '2024-01-15',
      blockchainId: 'eth_0x123',
      tokenId: 'VL_001',
      isShared: true,
      metadata: {
        icon: <Activity className="w-8 h-8" />,
        color: 'from-blue-500 to-cyan-500',
        progress: 100,
        target: 30
      }
    },
    {
      id: '2',
      title: 'heartRateMaster',
      description: 'maintainedOptimalHeart',
      category: 'health',
      rarity: 'rare',
      earnedDate: '2024-02-20',
      blockchainId: 'eth_0x456',
      tokenId: 'VL_002',
      isShared: false,
      metadata: {
        icon: <Heart className="w-8 h-8" />,
        color: 'from-red-500 to-pink-500',
        progress: 100,
        target: 50
      }
    },
    {
      id: '3',
      title: 'sleepConsistencyPro',
      description: 'maintainedEightHours',
      category: 'wellness',
      rarity: 'legendary',
      earnedDate: '2024-03-10',
      isShared: true,
      metadata: {
        icon: <Star className="w-8 h-8" />,
        color: 'from-purple-500 to-indigo-500',
        progress: 100,
        target: 21
      }
    },
    {
      id: '4',
      title: 'platformLinker',
      description: 'successfullyLinkedTen',
      category: 'consistency',
      rarity: 'rare',
      earnedDate: '2024-04-05',
      isShared: false,
      metadata: {
        icon: <Zap className="w-8 h-8" />,
        color: 'from-yellow-500 to-orange-500',
        progress: 100,
        target: 10
      }
    }
  ];

  const stats = {
    totalData: healthData.length,
    rarityBreakdown: {
      common: healthData.filter(a => a.rarity === 'common').length,
      rare: healthData.filter(a => a.rarity === 'rare').length,
      epic: healthData.filter(a => a.rarity === 'epic').length,
      legendary: healthData.filter(a => a.rarity === 'legendary').length,
    },
    sharedCount: healthData.filter(a => a.isShared).length,
    mintedCount: healthData.filter(a => a.blockchainId).length
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-600 bg-gray-100 dark:bg-gray-800';
      case 'rare': return 'text-blue-600 bg-blue-100 dark:bg-blue-900';
      case 'epic': return 'text-purple-600 bg-purple-100 dark:bg-purple-900';
      case 'legendary': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-800';
    }
  };

  const handleShare = (data: HealthData) => {
    toast({
      title: 'dataShared',
      description: `${data.title} ${'hasBeenShared'}`,
    });
  };

  const handleMint = (data: HealthData) => {
    toast({
      title: 'nftMintingStarted',
      description: 'yourDataBeingMinted',
    });
  };

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <Trophy className="w-16 h-16 mx-auto text-gray-400" />
            <h2 className="text-2xl font-bold">{'authenticationRequired'}</h2>
            <p className="text-gray-600 dark:text-gray-400">{'pleaseLogInViewNFT'}</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 pt-1">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            <Trophy className="w-8 h-8 inline mr-2" />
            {'nftmeAchievements'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {'turnHealthMilestones'}
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.totalData}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{'totalData'}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.mintedCount}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{'mintedNFTs'}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.sharedCount}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Shared</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.rarityBreakdown.legendary}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Legendary</div>
            </CardContent>
          </Card>
        </div>

        {/* Health Data Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {healthData.map((achievement) => (
            <Card key={achievement.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-2">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${achievement.metadata.color} flex items-center justify-center text-white mx-auto mb-2`}>
                  {achievement.metadata.icon}
                </div>
                <CardTitle className="text-center text-lg">{achievement.title}</CardTitle>
                <div className="flex justify-center">
                  <Badge className={getRarityColor(achievement.rarity)}>
                    {achievement.rarity.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                  {achievement.description}
                </p>
                
                {achievement.metadata.progress && achievement.metadata.target && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{'nftProgress'}</span>
                      <span>{achievement.metadata.progress}/{achievement.metadata.target}</span>
                    </div>
                    <Progress value={(achievement.metadata.progress / achievement.metadata.target) * 100} />
                  </div>
                )}

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(achievement.earnedDate).toLocaleDateString()}
                  </span>
                  {achievement.blockchainId && (
                    <Badge variant="outline" className="text-xs">
                      NFT #{achievement.tokenId}
                    </Badge>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleShare(achievement)}
                    className="flex-1"
                  >
                    <Share2 className="w-4 h-4 mr-1" />
                    {achievement.isShared ? 'shared' : 'share'}
                  </Button>
                  {!achievement.blockchainId ? (
                    <Button
                      size="sm"
                      onClick={() => handleMint(achievement)}
                      className="flex-1"
                    >
                      <Trophy className="w-4 h-4 mr-1" />
                      {'mintNFT'}
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        if (achievement.blockchainId) {
                          const sanitizedId = achievement.blockchainId.replace(/[^a-fA-F0-9]/g, '');
                          if (sanitizedId.length >= 32) {
                            window.open(`https://opensea.io/assets/ethereum/${sanitizedId}`, '_blank', 'noopener,noreferrer');
                          }
                        }
                      }}
                      className="flex-1"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      {'viewNFT'}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Upcoming Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Upcoming Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Marathon Month</span>
                  <span className="text-xs text-gray-500">15/31 days</span>
                </div>
                <Progress value={48} />
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Complete 31 days of 5km+ walks/runs
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Hydration Hero</span>
                  <span className="text-xs text-gray-500">6/14 days</span>
                </div>
                <Progress value={43} />
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Drink 8+ glasses of water for 14 consecutive days
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* HIPAA Compliance Notice */}
        <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
              <Shield className="w-5 h-5" />
              <span className="font-medium">Privacy Protected</span>
            </div>
            <p className="text-sm text-green-600 dark:text-green-400 mt-1">
              All achievement data is encrypted and HIPAA compliant. You maintain full control over sharing and blockchain minting.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}