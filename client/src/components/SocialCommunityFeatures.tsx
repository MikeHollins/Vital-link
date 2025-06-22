import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { 
  Users, 
  Trophy, 
  MessageCircle, 
  Share2, 
  Heart, 
  Target, 
  Calendar,
  Award,
  TrendingUp,
  UserPlus,
  MessageSquare,
  Shield,
  Globe,
  Lock,
  Crown,
  Zap,
  Plus
} from 'lucide-react';

interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  avatar?: string;
  healthScore: number;
  lastActive: string;
  sharedMetrics: string[];
  emergencyContact: boolean;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'steps' | 'sleep' | 'meditation' | 'custom';
  duration: string;
  participants: number;
  progress: number;
  reward: string;
  status: 'active' | 'completed' | 'upcoming';
  isPrivate: boolean;
}

interface CommunityPost {
  id: string;
  author: string;
  avatar?: string;
  content: string;
  type: 'insight' | 'achievement' | 'question' | 'tip';
  timestamp: string;
  likes: number;
  replies: number;
  tags: string[];
  verified: boolean;
}

interface ExpertQA {
  id: string;
  question: string;
  expert: {
    name: string;
    credentials: string;
    avatar?: string;
    verified: boolean;
  };
  answer: string;
  timestamp: string;
  likes: number;
  category: string;
}

export const SocialCommunityFeatures: React.FC = () => {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      relationship: 'Spouse',
      healthScore: 92,
      lastActive: '2 hours ago',
      sharedMetrics: ['steps', 'sleep', 'heart_rate'],
      emergencyContact: true
    },
    {
      id: '2',
      name: 'Michael Johnson',
      relationship: 'Child',
      healthScore: 88,
      lastActive: '5 hours ago',
      sharedMetrics: ['steps', 'activity'],
      emergencyContact: false
    }
  ]);

  const [challenges, setChallenges] = useState<Challenge[]>([
    {
      id: '1',
      title: '10,000 Steps Daily',
      description: 'Walk 10,000 steps every day for a week',
      type: 'steps',
      duration: '7 days',
      participants: 156,
      progress: 65,
      reward: 'Digital Badge + Health Points',
      status: 'active',
      isPrivate: false
    },
    {
      id: '2',
      title: 'Family Sleep Challenge',
      description: 'Get 8+ hours of sleep for 5 consecutive nights',
      type: 'sleep',
      duration: '5 days',
      participants: 4,
      progress: 80,
      reward: 'Family Movie Night',
      status: 'active',
      isPrivate: true
    },
    {
      id: '3',
      title: 'Mindfulness March',
      description: 'Complete 10 minutes of meditation daily',
      type: 'meditation',
      duration: '30 days',
      participants: 89,
      progress: 0,
      reward: 'Premium Meditation Course',
      status: 'upcoming',
      isPrivate: false
    }
  ]);

  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([
    {
      id: '1',
      author: 'Dr. Smith',
      content: 'New research shows that 7-9 hours of sleep significantly improves immune function. Quality matters more than quantity!',
      type: 'insight',
      timestamp: '2 hours ago',
      likes: 24,
      replies: 8,
      tags: ['sleep', 'immune-system', 'research'],
      verified: true
    },
    {
      id: '2',
      author: 'FitnessEnthusiast22',
      content: 'Just completed my first marathon! The key was consistent training and proper recovery. Happy to share my training plan.',
      type: 'achievement',
      timestamp: '4 hours ago',
      likes: 45,
      replies: 12,
      tags: ['marathon', 'training', 'achievement'],
      verified: false
    },
    {
      id: '3',
      author: 'HealthMom',
      content: 'Any tips for getting kids to eat more vegetables? My 8-year-old is very picky!',
      type: 'question',
      timestamp: '6 hours ago',
      likes: 8,
      replies: 15,
      tags: ['nutrition', 'children', 'tips'],
      verified: false
    }
  ]);

  const [expertQAs, setExpertQAs] = useState<ExpertQA[]>([
    {
      id: '1',
      question: 'How does stress affect heart rate variability?',
      expert: {
        name: 'Dr. Emily Carter',
        credentials: 'MD, Cardiologist',
        verified: true
      },
      answer: 'Chronic stress can significantly reduce heart rate variability (HRV), which is a marker of autonomic nervous system health. Lower HRV is associated with increased cardiovascular risk. Regular meditation, exercise, and stress management techniques can help improve HRV.',
      timestamp: '1 day ago',
      likes: 67,
      category: 'Cardiology'
    },
    {
      id: '2',
      question: 'What are the optimal sleep stages for recovery?',
      expert: {
        name: 'Dr. James Wilson',
        credentials: 'PhD, Sleep Medicine',
        verified: true
      },
      answer: 'Deep sleep (stages 3-4) and REM sleep are crucial for recovery. Deep sleep is when physical restoration occurs, while REM sleep is important for cognitive function and memory consolidation. Aim for 20-25% deep sleep and 20-25% REM sleep.',
      timestamp: '2 days ago',
      likes: 89,
      category: 'Sleep Medicine'
    }
  ]);

  const [newQuestion, setNewQuestion] = useState('');

  const handleLike = (postId: string, type: 'post' | 'qa') => {
    if (type === 'post') {
      setCommunityPosts(prev => prev.map(post => 
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      ));
    } else {
      setExpertQAs(prev => prev.map(qa => 
        qa.id === postId ? { ...qa, likes: qa.likes + 1 } : qa
      ));
    }
  };

  const joinChallenge = (challengeId: string) => {
    setChallenges(prev => prev.map(challenge => 
      challenge.id === challengeId 
        ? { ...challenge, participants: challenge.participants + 1 }
        : challenge
    ));
  };

  const getPostTypeIcon = (type: string) => {
    switch (type) {
      case 'insight': return <Zap className="h-4 w-4 text-yellow-500" />;
      case 'achievement': return <Trophy className="h-4 w-4 text-gold-500" />;
      case 'question': return <MessageCircle className="h-4 w-4 text-blue-500" />;
      case 'tip': return <Target className="h-4 w-4 text-green-500" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getChallengeIcon = (type: string) => {
    switch (type) {
      case 'steps': return <TrendingUp className="h-5 w-5 text-blue-500" />;
      case 'sleep': return <Calendar className="h-5 w-5 text-purple-500" />;
      case 'meditation': return <Heart className="h-5 w-5 text-green-500" />;
      default: return <Target className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="family" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="family">Family Health</TabsTrigger>
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
          <TabsTrigger value="community">Community</TabsTrigger>
          <TabsTrigger value="experts">Expert Q&A</TabsTrigger>
        </TabsList>

        {/* Family Health Sharing */}
        <TabsContent value="family">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Family Health Dashboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {familyMembers.map(member => (
                    <Card key={member.id} className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar>
                          <AvatarFallback>{member.name.spli' '.map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{member.name}</h3>
                          <p className="text-sm text-muted-foreground">{member.relationship}</p>
                        </div>
                        {member.emergencyContact && (
                          <Badge variant="outline" className="ml-auto">
                            Emergency Contact
                          </Badge>
                        )}
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Health Score</span>
                            <span>{member.healthScore}/100</span>
                          </div>
                          <Progress value={member.healthScore} className="h-2" />
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium mb-2">Shared Metrics:</p>
                          <div className="flex flex-wrap gap-1">
                            {member.sharedMetrics.map(metric => (
                              <Badge key={metric} variant="outline" className="text-xs">
                                {metric.replace('_', ' ')}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <p className="text-xs text-muted-foreground">
                          Last active: {member.lastActive}
                        </p>
                      </div>
                    </Card>
                  ))}
                  
                  <Card className="p-4 border-dashed">
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <UserPlus className="h-8 w-8 text-muted-foreground mb-2" />
                      <h3 className="font-medium mb-1">Add Family Member</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Share health data with trusted family members
                      </p>
                      <Button size="sm">Send Invitation</Button>
                    </div>
                  </Card>
                </div>
              </CardContent>
            </Card>

            {/* Privacy Controls */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Privacy Controls
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Share sleep data</h4>
                      <p className="text-sm text-muted-foreground">Allow family to see your sleep patterns</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Share activity data</h4>
                      <p className="text-sm text-muted-foreground">Allow family to see your daily activity</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Emergency access</h4>
                      <p className="text-sm text-muted-foreground">Grant emergency contacts full access during crises</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Health Challenges */}
        <TabsContent value="challenges">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Health Challenges
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {challenges.map(challenge => (
                    <Card key={challenge.id} className={`p-4 ${
                      challenge.status === 'completed' ? 'bg-green-50 dark:bg-green-950/20' :
                      challenge.status === 'upcoming' ? 'bg-blue-50 dark:bg-blue-950/20' :
                      'bg-white dark:bg-gray-950'
                    }`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {getChallengeIcon(challenge.type)}
                          <div>
                            <h3 className="font-medium flex items-center gap-2">
                              {challenge.title}
                              {challenge.isPrivate && <Lock className="h-3 w-3 text-muted-foreground" />}
                            </h3>
                            <p className="text-sm text-muted-foreground">{challenge.description}</p>
                          </div>
                        </div>
                        <Badge variant={
                          challenge.status === 'completed' ? 'default' :
                          challenge.status === 'upcoming' ? 'secondary' : 'outline'
                        }>
                          {challenge.status}
                        </Badge>
                      </div>
                      
                      {challenge.status === 'active' && (
                        <div className="mb-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progress</span>
                            <span>{challenge.progress}%</span>
                          </div>
                          <Progress value={challenge.progress} className="h-2" />
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          <span>{challenge.participants} participants • {challenge.duration}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{challenge.reward}</span>
                          {challenge.status === 'upcoming' && (
                            <Button size="sm" onClick={() => joinChallenge(challenge.id)}>
                              Join Challenge
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
                
                <Button className="w-full mt-4" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Custom Challenge
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Community Feed */}
        <TabsContent value="community">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Community Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {communityPosts.map(post => (
                  <Card key={post.id} className="p-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{post.author[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium">{post.author}</span>
                          {post.verified && <Crown className="h-3 w-3 text-yellow-500" />}
                          {getPostTypeIcon(post.type)}
                          <span className="text-sm text-muted-foreground">{post.timestamp}</span>
                        </div>
                        
                        <p className="text-sm mb-3">{post.content}</p>
                        
                        <div className="flex flex-wrap gap-1 mb-3">
                          {post.tags.map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <button 
                            className="flex items-center gap-1 hover:text-red-500"
                            onClick={() => handleLike(post.id, 'post')}
                          >
                            <Heart className="h-3 w-3" />
                            {post.likes}
                          </button>
                          <button className="flex items-center gap-1 hover:text-blue-500">
                            <MessageCircle className="h-3 w-3" />
                            {post.replies}
                          </button>
                          <button className="flex items-center gap-1 hover:text-green-500">
                            <Share2 className="h-3 w-3" />
                            Share
                          </button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Expert Q&A */}
        <TabsContent value="experts">
          <div className="space-y-6">
            {/* Ask Question */}
            <Card>
              <CardHeader>
                <CardTitle>Ask a Health Expert</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Textarea
                    placeholder="Ask your health-related question here..."
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                  />
                  <Button className="w-full">
                    Submit Question
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Expert Answers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Expert Answers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {expertQAs.map(qa => (
                    <div key={qa.id} className="border-b pb-6 last:border-b-0">
                      <div className="mb-3">
                        <h3 className="font-medium text-lg mb-2">{qa.question}</h3>
                        <Badge variant="outline">{qa.category}</Badge>
                      </div>
                      
                      <div className="flex items-start gap-3 mb-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>{qa.expert.name.spli' '.map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{qa.expert.name}</span>
                            {qa.expert.verified && <Crown className="h-3 w-3 text-yellow-500" />}
                          </div>
                          <p className="text-sm text-muted-foreground">{qa.expert.credentials}</p>
                        </div>
                      </div>
                      
                      <p className="text-sm mb-3 pl-13">{qa.answer}</p>
                      
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{qa.timestamp}</span>
                        <button 
                          className="flex items-center gap-1 hover:text-red-500"
                          onClick={() => handleLike(qa.id, 'qa')}
                        >
                          <Heart className="h-3 w-3" />
                          {qa.likes} helpful
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};