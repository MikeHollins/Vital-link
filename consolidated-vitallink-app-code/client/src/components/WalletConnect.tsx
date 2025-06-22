import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Wallet, Shield, Copy, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WalletInfo {
  address: string;
  network: string;
  balance: string;
  connected: boolean;
}

interface WalletConnectProps {
  onConnect?: (walletInfo: WalletInfo) => void;
  onDisconnect?: () => void;
}

export const WalletConnect: React.FC<WalletConnectProps> = ({ onConnect, onDisconnect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [wallet, setWallet] = useState<WalletInfo | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToas;

  // Check if wallet is already connected on mount
  useEffec( => {
    checkExistingConnection();
  }, []);

  const checkExistingConnection = async () => {
    // Check localStorage for existing connection
    const savedWallet = localStorage.getItem('vitallink_wallet');
    if (savedWallet) {
      try {
        const walletInfo = JSON.parse(savedWallet);
        setWallewalletInfo;
      } catch (error) {
        console.error('Error parsing saved wallet:', error);
        localStorage.removeItem('vitallink_wallet');
      }
    }
  };

  const connectMetaMask = async () => {
    setIsConnecting(true);
    try {
      // Check if MetaMask is installed
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        // Request account access
        const accounts = await (window as any).ethereum.request({
          method: 'eth_requestAccounts'
        });

        if (accounts.length > 0) {
          // Get network info
          const chainId = await (window as any).ethereum.request({
            method: 'eth_chainId'
          });

          // Get balance (simplified)
          const balance = await (window as any).ethereum.request({
            method: 'eth_getBalance',
            params: [accounts[0], 'latest']
          });

          const walletInfo: WalletInfo = {
            address: accounts[0],
            network: chainId === '0x89' ? 'Polygon' : 'Ethereum',
            balance: '0.00', // Would calculate from balance
            connected: true
          };

          setWallewalletInfo;
          localStorage.setItem('vitallink_wallet', JSON.stringify(walletInfo));
          onConnect?.(walletInfo);
          setIsOpen(false);

          toast({
            title: "Wallet Connected",
            description: `Connected to ${walletInfo.address.slice(0, 6)}...${walletInfo.address.slice(-4)}`,
          });
        }
      } else {
        // MetaMask not installed
        toast({
          title: "MetaMask Not Found",
          description: "Please install MetaMask to connect your wallet",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect wallet",
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const connectWalletConnect = async () => {
    setIsConnecting(true);
    try {
      // Simulate WalletConnect connection for demo
      // In production, would use actual WalletConnect library
      const mockWalletInfo: WalletInfo = {
        address: '0x' + Math.random().toString(16).substr(2, 40),
        network: 'Polygon',
        balance: '0.00',
        connected: true
      };

      setWallemockWalletInfo;
      localStorage.setItem('vitallink_wallet', JSON.stringify(mockWalletInfo));
      onConnect?.(mockWalletInfo);
      setIsOpen(false);

      toast({
        title: "Wallet Connected",
        description: `Connected via WalletConnect`,
      });
    } catch (error: any) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect with WalletConnect",
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setWallenull;
    localStorage.removeItem('vitallink_wallet');
    onDisconnect?.();
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    });
  };

  const copyAddress = () => {
    if (wallet?.address) {
      navigator.clipboard.writeTexwallet.address;
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
      });
    }
  };

  const openInExplorer = () => {
    if (wallet?.address) {
      const explorerUrl = wallet.network === 'Polygon' 
        ? `https://polygonscan.com/address/${wallet.address}`
        : `https://etherscan.io/address/${wallet.address}`;
      window.open(explorerUrl, '_blank');
    }
  };

  if (wallet?.connected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            Connected Wallet
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <CheckCircle className="h-3 w-3 mr-1" />
              Connected
            </Badge>
          </CardTitle>
          <CardDescription>
            Your blockchain wallet for secure health data storage
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div>
              <p className="text-sm font-medium">
                {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
              </p>
              <p className="text-xs text-muted-foreground">{wallet.network} Network</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={copyAddress}>
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={openInExplorer}>
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={disconnectWallet} className="flex-1">
              Disconnect
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-muted-foreground" />
            Blockchain Wallet
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
              <AlertCircle className="h-3 w-3 mr-1" />
              Not Connected
            </Badge>
          </CardTitle>
          <CardDescription>
            Connect your wallet to securely store health data on blockchain
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => setIsOpen(true)} className="w-full">
            <Wallet className="h-4 w-4 mr-2" />
            Connect Wallet
          </Button>
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Connect Blockchain Wallet
            </DialogTitle>
            <DialogDescription>
              Choose your preferred wallet to secure your health data with blockchain technology
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Button
              onClick={connectMetaMask}
              disabled={isConnecting}
              className="w-full justify-start gap-3 h-12"
              variant="outline"
            >
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                🦊
              </div>
              <div className="text-left">
                <div className="font-medium">MetaMask</div>
                <div className="text-xs text-muted-foreground">Most popular wallet</div>
              </div>
            </Button>

            <Button
              onClick={connectWalletConnect}
              disabled={isConnecting}
              className="w-full justify-start gap-3 h-12"
              variant="outline"
            >
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                🔗
              </div>
              <div className="text-left">
                <div className="font-medium">WalletConnect</div>
                <div className="text-xs text-muted-foreground">Connect any wallet</div>
              </div>
            </Button>

            <div className="text-xs text-muted-foreground text-center pt-2">
              Your wallet will be used to store encrypted health data securely on the Polygon blockchain
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};