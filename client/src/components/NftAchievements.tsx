import React, { useState } from "react";
import { useNftAchievements, type NftAchievement, type CreateNftAchievementData, type MintNftData } from "@/hooks/useNftAchievements";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { InfoIcon, Trophy, Award, Star, Shield, Lock, Unlock, ExternalLink, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const DATA_CATEGORIES = [
  "Steps",
  "Activity",
  "Sleep",
  "Heart",
  "Weight",
  "Nutrition",
  "Hydration",
  "Meditation",
  "Custom"
];

const RARITY_LEVELS = [
  "Common",
  "Uncommon",
  "Rare",
  "Epic",
  "Legendary"
];

export const NftAchievements = () => {
  const { user } = useAuth();
  const { toast } = useToas;
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [mintDialogOpen, setMintDialogOpen] = useState(false);
  const [selectedHealthData, setSelectedHealthData] = useState<NftAchievement | null>(null);
  const [createFormData, setCreateFormData] = useState<CreateNftAchievementData>({
    title: "",
    description: "",
    category: "",
    rarity: "",
    thresholdMetric: "",
    thresholdValue: 0,
  });
  const [mintFormData, setMintFormData] = useState<MintNftData>({
    blockchainId: "",
    tokenId: "",
  });
  const [complianceInfoOpen, setComplianceInfoOpen] = useState(false);
  const [privacyConfirmed, setPrivacyConfirmed] = useState(false);

  const {
    achievements,
    isLoading,
    isError,
    createAchievement,
    mintAchievement,
    updateSharing,
    deleteAchievement,
    isCreating,
    isMinting,
    isUpdatingSharing,
    isDeleting,
  } = useNftAchievements();

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefaul;
    if (!privacyConfirmed) {
      toast({
        title: "Privacy confirmation required",
        description: "Please confirm that you understand the privacy implications before creating an NFT achievement.",
        variant: "destructive",
      });
      return;
    }
    
    createAchievemencreateFormData;
    toast({
      title: "Achievement created",
      description: "Your health achievement has been securely saved. You can NFTme it when you're ready.",
    });
    setCreateDialogOpen(false);
    setCreateFormData({
      title: "",
      description: "",
      category: "",
      rarity: "",
      thresholdMetric: "",
      thresholdValue: 0,
    });
    setPrivacyConfirmed(false);
  };

  const handleMintSubmit = (e: React.FormEvent) => {
    e.preventDefaul;
    if (!selectedHealthData) return;
    
    mintAchievemenselectedHealthData.id, mintFormData;
    toast({
      title: "NFTme Complete",
      description: "Your health data has been securely minted as an NFT on the Polygon blockchain.",
    });
    setMintDialogOpen(false);
    setMintFormData({
      blockchainId: "",
      tokenId: "",
    });
  };

  const handleSharingToggle = (achievement: NftAchievement) => {
    updateSharing(achievement.id, !achievement.isShared);
    toast({
      title: achievement.isShared ? "Sharing disabled" : "Sharing enabled",
      description: achievement.isShared 
        ? "Your NFT achievement is now private." 
        : "Your NFT achievement can now be shared with others.",
    });
  };

  const handleDelete = (achievement: NftAchievement) => {
    if (confirm("Are you sure you want to delete this achievement? This action cannot be undone.")) {
      deleteAchievemenachievement.id;
      toast({
        title: "Achievement deleted",
        description: "Your health achievement has been permanently deleted.",
      });
    }
  };

  if (isLoading) {
    return <div className="flex justify-center my-10">Loading your secure NFT achievements...</div>;
  }

  if (isError) {
    return (
      <Alert variant="destructive" className="my-4">
        <AlertTitle>Error loading achievements</AlertTitle>
        <AlertDescription>
          There was a problem loading your NFT achievements. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-1 pb-4 min-h-screen overflow-y-auto">
      {/* Header with less prominent HIPAA button */}
      <div className="flex justify-between items-start mb-8">
        <div className="flex-1">
          <h2 className="text-3xl font-bold tracking-tight">NFTme</h2>
          <p className="text-muted-foreground mt-2">
            Transform your health achievements into verified, tradeable digital assets with patent-pending NFTme technology
          </p>
        </div>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => setComplianceInfoOpen(true)}
          className="text-xs opacity-70 hover:opacity-100"
        >
          <Shield className="mr-1 h-3 w-3" />
          HIPAA Info
        </Button>
      </div>

      {/* Prominent centered NFTme button with 3D futuristic design */}
      <div className="text-center mb-12 relative">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Futuristic background glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/20 to-cyan-500/10 rounded-3xl blur-3xl -z-10" />
          
          <div className="space-y-6 relative">
            <div className="space-y-4">
              <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-blue-500 to-cyan-400 bg-clip-text text-transparent animate-pulse">
                Turn Your Health Achievements Into NFTs
              </h3>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
                Mint your health milestones as unique digital collectibles on the blockchain with cutting-edge security
              </p>
            </div>
            
            {/* 3D Futuristic NFTme button */}
            <div className="relative group">
              <Button 
                onClick={() => setCreateDialogOpen(true)}
                size="lg"
                className="relative bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 hover:from-purple-500 hover:via-blue-500 hover:to-cyan-500 text-white shadow-2xl shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-500 px-12 py-4 text-xl font-bold tracking-wide transform hover:scale-110 hover:-translate-y-1 border-0 rounded-2xl backdrop-blur-sm"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-cyan-400/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500" />
                <Trophy className="mr-4 h-8 w-8 drop-shadow-lg" />
                <span className="relative z-10 drop-shadow-sm">NFTme</span>
              </Button>
              
              {/* Animated particles around button */}
              <div className="absolute -inset-4 opacity-30 group-hover:opacity-60 transition-opacity duration-500">
                <div className="absolute top-0 left-1/4 w-2 h-2 bg-purple-400 rounded-full animate-ping" />
                <div className="absolute bottom-0 right-1/4 w-1 h-1 bg-blue-400 rounded-full animate-ping delay-75" />
                <div className="absolute top-1/2 right-0 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping delay-150" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* HIPAA Compliance Info Dialog */}
      <Dialog open={complianceInfoOpen} onOpenChange={setComplianceInfoOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5 text-primary" />
              HIPAA Compliance & Privacy Information
            </DialogTitle>
            <DialogDescription>
              Understand how we protect your health data when creating NFT achievements
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <Alert>
              <AlertTitle className="flex items-center">
                <Lock className="mr-2 h-4 w-4" />
                Protected Health Information (PHI) Security
              </AlertTitle>
              <AlertDescription>
                VitalLink's NFTme feature is fully HIPAA compliant. We never store actual health metrics in the blockchain. 
                Only achievement metadata (title, category, etc.) is included in the NFT. Your sensitive health data 
                remains encrypted and protected in our secure database.
              </AlertDescription>
            </Alert>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Data Protection Measures</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex items-start">
                    <Check className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                    <p>All health data is encrypted at rest and in transit</p>
                  </div>
                  <div className="flex items-start">
                    <Check className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                    <p>Automated PHI detection prevents sensitive data in NFTs</p>
                  </div>
                  <div className="flex items-start">
                    <Check className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                    <p>Comprehensive audit logs for all NFT operations</p>
                  </div>
                  <div className="flex items-start">
                    <Check className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                    <p>Access controls limit data visibility to authorized users</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">What's Stored on Blockchain</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex items-start">
                    <Check className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                    <p>Achievement title (e.g., "10K Steps Champion")</p>
                  </div>
                  <div className="flex items-start">
                    <Check className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                    <p>Achievement category and rarity level</p>
                  </div>
                  <div className="flex items-start">
                    <Check className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                    <p>Generic achievement image</p>
                  </div>
                  <div className="flex items-start">
                    <X className="h-4 w-4 mr-2 text-red-500 mt-0.5" />
                    <p className="font-medium">No actual health metrics or PHI</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-medium mb-2">Compliance Reporting</h4>
              <p className="text-sm text-muted-foreground mb-2">
                VitalLink maintains comprehensive HIPAA compliance reports for all NFT operations.
                These reports track every interaction with your health data to ensure transparency and security.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button onClick={() => setComplianceInfoOpen(false)}>
              I Understand
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Achievement Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>NFTme - Create Achievement</DialogTitle>
            <DialogDescription>
              Create a health achievement that can be minted as an NFT on the Polygon blockchain.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleCreateSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Achievement Title</Label>
                <Input 
                  id="title" 
                  value={createFormData.title}
                  onChange={(e) => setCreateFormData({...createFormData, title: e.target.value})}
                  placeholder="e.g., 10K Steps Champion"
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  value={createFormData.description}
                  onChange={(e) => setCreateFormData({...createFormData, description: e.target.value})}
                  placeholder="Describe your health achievement"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  <InfoIcon className="inline h-3 w-3 mr-1" />
                  Do not include specific health measurements or personal health information
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={createFormData.category}
                    onValueChange={(value) => setCreateFormData({...createFormData, category: value})}
                    required
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {DATA_CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="rarity">Rarity Level</Label>
                  <Select 
                    value={createFormData.rarity}
                    onValueChange={(value) => setCreateFormData({...createFormData, rarity: value})}
                    required
                  >
                    <SelectTrigger id="rarity">
                      <SelectValue placeholder="Select rarity" />
                    </SelectTrigger>
                    <SelectContent>
                      {RARITY_LEVELS.map((rarity) => (
                        <SelectItem key={rarity} value={rarity}>{rarity}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="thresholdMetric">Metric Type</Label>
                  <Input 
                    id="thresholdMetric" 
                    value={createFormData.thresholdMetric}
                    onChange={(e) => setCreateFormData({...createFormData, thresholdMetric: e.target.value})}
                    placeholder="e.g., steps, minutes"
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="thresholdValue">Threshold Value</Label>
                  <Input 
                    id="thresholdValue" 
                    type="number"
                    value={createFormData.thresholdValue.toString()}
                    onChange={(e) => setCreateFormData({
                      ...createFormData, 
                      thresholdValue: parseFloae.target.value || 0
                    })}
                    placeholder="e.g., 10000"
                    required
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2 pt-2">
                <Switch 
                  id="privacy-confirm" 
                  checked={privacyConfirmed}
                  onCheckedChange={setPrivacyConfirmed}
                />
                <Label htmlFor="privacy-confirm" className="text-sm">
                  I understand that this achievement will be stored securely and no personal health information (PHI) 
                  will be included in the blockchain NFT
                </Label>
              </div>
            </div>
            
            <DialogFooter>
              <Button type="submit" disabled={isCreating || !privacyConfirmed}>
                {isCreating ? "Creating..." : "NFTme"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Mint NFT Dialog */}
      <Dialog open={mintDialogOpen} onOpenChange={setMintDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Mint Achievement as NFT</DialogTitle>
            <DialogDescription>
              Mint your achievement as an NFT on the Polygon blockchain. This process is HIPAA compliant and secures your data.
            </DialogDescription>
          </DialogHeader>
          
          {selectedAchievement && (
            <form onSubmit={handleMintSubmit}>
              <div className="mb-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{selectedAchievement.title}</CardTitle>
                    <CardDescription className="text-xs">{selectedAchievement.category} · {selectedAchievement.rarity}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm">{selectedAchievement.description}</p>
                  </CardContent>
                </Card>
              </div>
              
              <Alert className="mb-4">
                <AlertTitle className="flex items-center">
                  <Shield className="mr-2 h-4 w-4" />
                  HIPAA Compliance Notice
                </AlertTitle>
                <AlertDescription className="text-xs">
                  For your privacy and HIPAA compliance, only achievement metadata will be stored on the blockchain.
                  No personal health information will be included in the NFT.
                </AlertDescription>
              </Alert>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="blockchainId">Blockchain ID</Label>
                  <Input 
                    id="blockchainId" 
                    value={mintFormData.blockchainId}
                    onChange={(e) => setMintFormData({...mintFormData, blockchainId: e.target.value})}
                    placeholder="Enter Polygon blockchain ID"
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="tokenId">Token ID</Label>
                  <Input 
                    id="tokenId" 
                    value={mintFormData.tokenId}
                    onChange={(e) => setMintFormData({...mintFormData, tokenId: e.target.value})}
                    placeholder="Enter token ID"
                    required
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button type="submit" disabled={isMinting}>
                  {isMinting ? "Minting..." : "Mint as NFT"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Achievement List */}
      <Tabs defaultValue="all" className="mt-6">
        <TabsList>
          <TabsTrigger value="all">All Achievements</TabsTrigger>
          <TabsTrigger value="minted">Minted NFTs</TabsTrigger>
          <TabsTrigger value="unminted">Unminted</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-4">
          {achievements.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-10">
                <Trophy className="h-16 w-16 text-muted-foreground/30 mb-4" />
                <h3 className="text-xl font-medium mb-2">No Achievements Yet</h3>
                <p className="text-center text-muted-foreground mb-4">
                  Start tracking your health progress and create your first achievement.
                </p>
                <Button onClick={() => setCreateDialogOpen(true)}>
                  Create First Achievement
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map((achievement) => (
                <AchievementCard 
                  key={achievement.id}
                  achievement={achievement}
                  onMint={() => {
                    setSelectedAchievemenachievement;
                    setMintDialogOpen(true);
                  }}
                  onToggleSharing={() => handleSharingToggle(achievement)}
                  onDelete={() => handleDelete(achievement)}
                  isUpdatingSharing={isUpdatingSharing}
                  isDeleting={isDeleting}
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="minted" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.filter(a => a.isMinted).length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-10">
                  <p className="text-center text-muted-foreground">
                    You haven't used NFTme yet. Create achievements and mint them as NFTs!
                  </p>
                </CardContent>
              </Card>
            ) : (
              achievements
                .filter(a => a.isMinted)
                .map((achievement) => (
                  <AchievementCard 
                    key={achievement.id}
                    achievement={achievement}
                    onMint={() => {}}
                    onToggleSharing={() => handleSharingToggle(achievement)}
                    onDelete={() => handleDelete(achievement)}
                    isUpdatingSharing={isUpdatingSharing}
                    isDeleting={isDeleting}
                  />
                ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="unminted" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.filter(a => !a.isMinted).length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-10">
                  <p className="text-center text-muted-foreground">
                    All your achievements have been minted as NFTs.
                  </p>
                </CardContent>
              </Card>
            ) : (
              achievements
                .filter(a => !a.isMinted)
                .map((achievement) => (
                  <AchievementCard 
                    key={achievement.id}
                    achievement={achievement}
                    onMint={() => {
                      setSelectedAchievemenachievement;
                      setMintDialogOpen(true);
                    }}
                    onToggleSharing={() => handleSharingToggle(achievement)}
                    onDelete={() => handleDelete(achievement)}
                    isUpdatingSharing={isUpdatingSharing}
                    isDeleting={isDeleting}
                  />
                ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface AchievementCardProps {
  achievement: NftAchievement;
  onMint: () => void;
  onToggleSharing: () => void;
  onDelete: () => void;
  isUpdatingSharing: boolean;
  isDeleting: boolean;
}

const AchievementCard: React.FC<AchievementCardProps> = ({ 
  achievement,
  onMint,
  onToggleSharing,
  onDelete,
  isUpdatingSharing,
  isDeleting
}) => {
  const { 
    id, 
    title, 
    description, 
    category, 
    rarity, 
    isMinted, 
    isShared, 
    createdAt, 
    mintedAt,
    blockchainId,
    tokenId 
  } = achievement;
  
  // Format dates
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }).formadate;
  };
  
  // Get rarity color
  const getRarityColor = (rarity: string) => {
    switch(rarity) {
      case 'Common': return 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      case 'Uncommon': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Rare': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Epic': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'Legendary': return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
      default: return 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };
  
  return (
    <Card className="overflow-hidden">
      <div className={`h-2 w-full ${getRarityColor(rarity)}`} />
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription className="text-xs">
              Created on {formatDate(createdAt)}
            </CardDescription>
          </div>
          <div className="flex">
            <Badge variant="outline" className="mr-2">
              {category}
            </Badge>
            <Badge className={getRarityColor(rarity)}>
              {rarity}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm">{description}</p>
        
        {isMinted && (
          <div className="mt-4 pt-2 border-t border-muted">
            <div className="flex items-center mb-2">
              <Award className="h-4 w-4 mr-2 text-primary" />
              <span className="text-xs font-medium">Minted on {formatDate(mintedAt || '')}</span>
            </div>
            {(blockchainId && tokenId) && (
              <div className="flex items-center">
                <ExternalLink className="h-3 w-3 mr-2 text-muted-foreground" />
                <a 
                  href={`https://polygonscan.com/token/${blockchainId}`} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:text-primary truncate"
                >
                  Token: {tokenId.substring(0, 8)}...
                </a>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col items-stretch pt-2 pb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            {isMinted ? (
              <Badge variant="outline" className="flex items-center">
                <Check className="h-3 w-3 mr-1" />
                Minted
              </Badge>
            ) : (
              <Badge variant="outline" className="flex items-center text-muted-foreground">
                Unminted
              </Badge>
            )}
          </div>
          
          <div className="flex items-center">
            <span className="text-xs mr-2">
              {isShared ? 'Public' : 'Private'}
            </span>
            <Switch 
              checked={isShared} 
              onCheckedChange={onToggleSharing}
              disabled={isUpdatingSharing || !isMinted}
              className="data-[state=checked]:bg-green-500"
            />
          </div>
        </div>
        
        <div className="flex justify-between gap-2 mt-2">
          {!isMinted ? (
            <Button 
              variant="default" 
              size="sm" 
              className="flex-1"
              onClick={onMint}
            >
              <Trophy className="h-4 w-4 mr-2" />
              Mint as NFT
            </Button>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              disabled
            >
              <Shield className="h-4 w-4 mr-2" />
              HIPAA Compliant
            </Button>
          )}
          
          <Button 
            variant="destructive" 
            size="sm"
            onClick={onDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default NftAchievements;