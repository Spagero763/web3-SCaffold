'use client';

import { useState, useEffect } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatAddress, formatEther } from '@/lib/utils';
import { Wallet, Copy, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function WalletInfo() {
  const { address, isConnected } = useAccount();
  const { data: balance, isLoading } = useBalance({ address });
  const [copied, setCopied] = useState(false);

  const copyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      setCopied(true);
    }
  };

  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timeout);
    }
  }, [copied]);

  if (!isConnected) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center gap-2">
          <Wallet className="h-5 w-5" />
          <CardTitle>Wallet</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Connect your wallet to view details</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2">
        <Wallet className="h-5 w-5 text-primary" />
        <CardTitle>Wallet</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Address</span>
          <div className="flex items-center gap-2">
            <code className="text-sm font-mono">{formatAddress(address || '', 6)}</code>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={copyAddress}>
              {copied ? (
                <CheckCircle className="h-3 w-3 text-green-500" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Balance</span>
          {isLoading ? (
            <Skeleton className="h-5 w-24" />
          ) : (
            <span className="font-mono">
              {balance ? formatEther(balance.value) : '0'} {balance?.symbol}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
