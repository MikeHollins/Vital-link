import React, { useState } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Wallet, ExternalLink, Shield, Zap, CheckCircle, AlertCircle, Building2, User, Crown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WalletConnectionProps {
  onConnect?: (address: string, type: 'self-custody' | 'coinbase-custody') => void;
  onDisconnect?: () => void;
}

export const WalletConnection: React.FC<WalletConnectionProps> = ({ onConnect, onDisconnect }) => {
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [custodialWallet, setCustodialWallet] = useState<string | null>(null);
  const [walletType, setWalletType] = useState<'self-custody' | 'coinbase-custody' | null>(null);
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors, isPending, error } = useConnect();
  const { disconnect } = useDisconnect();
  const { toast } = useToast();

  const handleConnect = (connector: any) => {
    connect({ connector });
    setWalletType('self-custody');
    setShowConnectModal(false);
    if (onConnect && address) {
      onConnect(address, 'self-custody');
    }
  };

  const handleCustodialConnect = async () => {
    try {
      // Create a custodial wallet through our Coinbase Custody integration
      const response = await fetch('/api/wallet/create-custodial', {
        method: 'POST',
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to create custodial wallet');
      }
      
      const { walletAddress } = await response.json();
      setCustodialWallet(walletAddress);
      setWalletType('coinbase-custody');
      setShowConnectModal(false);
      
      if (onConnect) {
        onConnect(walletAddress, 'coinbase-custody');
      }
    } catch (error) {
      console.error('Failed to create custodial wallet:', error);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    setCustodialWallet(null);
    setWalletType(null);
    setShowConnectModal(false);
    if (onDisconnect) {
      onDisconnect();
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const isCorrectNetwork = chain?.id === 137 || chain?.id === 80001; // Polygon mainnet or Mumbai testnet
  const currentWallet = custodialWallet || address;
  const isWalletConnected = custodialWallet || isConnected;

  if (isWalletConnected && currentWallet) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="pb-3 px-4 sm:px-6">
          <CardTitle className="flex items-center text-lg sm:text-xl">
            <CheckCircle className="h-5 w-5 mr-2 text-green-500 flex-shrink-0" />
            <span className="truncate">Wallet Connected</span>
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Ready to mint your health achievements as NFTs
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 px-4 sm:px-6 pb-6">
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div>
              <p className="text-sm font-medium">
                {walletType === 'coinbase-custody' ? 'Custodial Wallet' : 'Connected Address'}
              </p>
              <p className="text-xs text-muted-foreground">{formatAddress(currentWallet)}</p>
            </div>
            <div className="flex gap-2">
              <Badge variant={walletType === 'coinbase-custody' ? "default" : "outline"}>
                {walletType === 'coinbase-custody' ? (
                  <div className="flex items-center">
                    <Building2 className="h-3 w-3 mr-1" />
                    Custodial
                  </div>
                ) : (
                  <div className="flex items-center">
                    <User className="h-3 w-3 mr-1" />
                    Self-Custody
                  </div>
                )}
              </Badge>
              {walletType === 'self-custody' && (
                <Badge variant={isCorrectNetwork ? "default" : "destructive"}>
                  {chain?.name || 'Unknown Network'}
                </Badge>
              )}
            </div>
          </div>

          {!isCorrectNetwork && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please switch to Polygon network to mint NFTs. Current network: {chain?.name}
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const sanitizedWallet = currentWallet.replace(/[^a-fA-F0-9x]/g, '');
                if (sanitizedWallet.length >= 40) {
                  window.open(`https://polygonscan.com/address/${sanitizedWallet}`, '_blank', 'noopener,noreferrer');
                }
              }}
              className="flex-1 h-11 text-sm active:scale-95 transition-transform"
            >
              <ExternalLink className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate">View Explorer</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleDisconnect}
              className="h-11 px-4 active:scale-95 transition-transform whitespace-nowrap"
            >
              Disconnect
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="pb-3 px-4 sm:px-6">
          <CardTitle className="flex items-center text-lg sm:text-xl">
            <Wallet className="h-5 w-5 mr-2 flex-shrink-0" />
            <span className="truncate">Connect Wallet</span>
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Connect your wallet to mint health achievements as NFTs on Polygon
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 px-4 sm:px-6 pb-6">
          <Alert>
            <Shield className="h-4 w-4 flex-shrink-0" />
            <AlertDescription className="text-sm">
              Your wallet is used only for NFT minting. No health data is stored on the blockchain.
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <div className="flex items-center text-sm text-muted-foreground">
              <Zap className="h-4 w-4 mr-3 flex-shrink-0" />
              <span>Low cost minting on Polygon (~$0.01 per NFT)</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Shield className="h-4 w-4 mr-3 flex-shrink-0" />
              <span>HIPAA compliant - no personal health information in NFTs</span>
            </div>
          </div>

          <Button 
            onClick={() => setShowConnectModal(true)} 
            className="w-full h-12 text-base active:scale-95 transition-transform"
            disabled={isPending}
          >
            {isPending ? 'Connecting...' : 'Connect Wallet'}
          </Button>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <AlertDescription className="text-sm">
                Failed to connect wallet: {error.message}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Dialog open={showConnectModal} onOpenChange={setShowConnectModal}>
        <DialogContent className="max-w-lg mx-4 ios-safe-top ios-safe-bottom">
          <DialogHeader className="px-2">
            <DialogTitle className="text-xl sm:text-2xl text-center">Choose Your Wallet Option</DialogTitle>
            <DialogDescription className="text-center text-sm sm:text-base">
              Select how you'd like to manage your wallet for NFT minting
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="simple" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="simple" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Simple & Secure
              </TabsTrigger>
              <TabsTrigger value="advanced" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Your Wallet
              </TabsTrigger>
            </TabsList>

            <TabsContent value="simple" className="space-y-4">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Crown className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Coinbase Custody Wallet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    We'll create and manage a secure wallet for you. Perfect for beginners!
                  </p>
                </div>
                
                <div className="space-y-3 text-left">
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 mr-3 text-green-500" />
                    <span>No wallet setup required</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 mr-3 text-green-500" />
                    <span>Institutional-grade security</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 mr-3 text-green-500" />
                    <span>Automatic network management</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 mr-3 text-green-500" />
                    <span>HIPAA compliant storage</span>
                  </div>
                </div>

                <Button 
                  onClick={handleCustodialConnect} 
                  className="w-full h-12 text-base active:scale-95 transition-transform" 
                  size="lg"
                >
                  <Building2 className="h-5 w-5 mr-2 flex-shrink-0" />
                  Create Secure Wallet
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="p-3 bg-blue-500/10 rounded-full">
                    <Wallet className="h-8 w-8 text-blue-500" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Connect Your Wallet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Use your existing wallet like MetaMask. You maintain full control.
                  </p>
                </div>

                <div className="space-y-3">
                  {connectors.map((connector) => (
                    <Button
                      key={connector.uid}
                      variant="outline"
                      onClick={() => handleConnect(connector)}
                      disabled={isPending}
                      className="w-full justify-start h-auto p-4 min-h-[60px] active:scale-95 transition-transform"
                    >
                      <div className="flex items-center w-full">
                        <Wallet className="h-6 w-6 mr-4 flex-shrink-0" />
                        <div className="text-left flex-1">
                          <div className="font-medium text-base">{connector.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {connector.name === 'MetaMask' && 'Most popular wallet'}
                            {connector.name === 'WalletConnect' && 'Mobile wallet support'}
                            {connector.name === 'Injected' && 'Browser extension'}
                          </div>
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>

                <Alert>
                  <AlertDescription className="text-xs">
                    Need a wallet? Download MetaMask from{' '}
                    <a href="https://metamask.io" target="_blank" rel="noopener noreferrer" className="underline">
                      metamask.io
                    </a>
                  </AlertDescription>
                </Alert>
              </div>
            </TabsContent>
          </Tabs>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error.message}
              </AlertDescription>
            </Alert>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WalletConnection;