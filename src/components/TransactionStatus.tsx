'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, ExternalLink, Loader2 } from 'lucide-react';
import { BLOCK_EXPLORER_URLS } from '@/lib/constants';
import { useChainId } from 'wagmi';

interface TransactionStatusProps {
  isLoading?: boolean;
  isSuccess?: boolean;
  isError?: boolean;
  txHash?: string | null;
  error?: Error | null;
  onReset?: () => void;
}

export function TransactionStatus({
  isLoading,
  isSuccess,
  isError,
  txHash,
  error,
  onReset,
}: TransactionStatusProps) {
  const chainId = useChainId();
  const explorerUrl = BLOCK_EXPLORER_URLS[chainId] || BLOCK_EXPLORER_URLS[1];

  if (isLoading) {
    return (
      <Alert className="border-blue-500 bg-blue-50">
        <Loader2 className="h-4 w-4 animate-spin" />
        <AlertTitle>Transaction Pending</AlertTitle>
        <AlertDescription>
          Please confirm the transaction in your wallet and wait for confirmation...
        </AlertDescription>
      </Alert>
    );
  }

  if (isSuccess && txHash) {
    return (
      <Alert className="border-green-500 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertTitle>Transaction Successful</AlertTitle>
        <AlertDescription className="flex flex-col gap-2">
          <span>Your transaction has been confirmed.</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <a
                href={\\/tx/\\}
                target="_blank"
                rel="noopener noreferrer"
              >
                View on Explorer <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </Button>
            {onReset && (
              <Button variant="ghost" size="sm" onClick={onReset}>
                Dismiss
              </Button>
            )}
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <XCircle className="h-4 w-4" />
        <AlertTitle>Transaction Failed</AlertTitle>
        <AlertDescription className="flex flex-col gap-2">
          <span>{error?.message || 'An unknown error occurred.'}</span>
          {onReset && (
            <Button variant="outline" size="sm" onClick={onReset}>
              Try Again
            </Button>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  return null;
}
