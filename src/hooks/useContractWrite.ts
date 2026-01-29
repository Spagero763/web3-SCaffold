'use client';

import { useState, useCallback } from 'react';
import { useAccount, usePublicClient, useWalletClient } from 'wagmi';
import type { Abi, Address } from 'viem';

export interface TransactionState {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: Error | null;
  txHash: string | null;
}

export function useContractWrite(
  contractAddress: Address,
  abi: Abi
) {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const [state, setState] = useState<TransactionState>({
    isLoading: false,
    isSuccess: false,
    isError: false,
    error: null,
    txHash: null,
  });

  const write = useCallback(
    async (functionName: string, args: unknown[] = []) => {
      if (!walletClient || !address || !publicClient) {
        setState(prev => ({
          ...prev,
          isError: true,
          error: new Error('Wallet not connected'),
        }));
        return;
      }

      setState({
        isLoading: true,
        isSuccess: false,
        isError: false,
        error: null,
        txHash: null,
      });

      try {
        const { request } = await publicClient.simulateContract({
          address: contractAddress,
          abi,
          functionName,
          args,
          account: address,
        });

        const hash = await walletClient.writeContract(request);

        const receipt = await publicClient.waitForTransactionReceipt({
          hash,
          confirmations: 2,
        });

        setState({
          isLoading: false,
          isSuccess: receipt.status === 'success',
          isError: receipt.status === 'reverted',
          error: receipt.status === 'reverted' ? new Error('Transaction reverted') : null,
          txHash: hash,
        });

        return hash;
      } catch (err) {
        setState({
          isLoading: false,
          isSuccess: false,
          isError: true,
          error: err instanceof Error ? err : new Error('Unknown error'),
          txHash: null,
        });
      }
    },
    [walletClient, address, publicClient, contractAddress, abi]
  );

  const reset = useCallback(() => {
    setState({
      isLoading: false,
      isSuccess: false,
      isError: false,
      error: null,
      txHash: null,
    });
  }, []);

  return { ...state, write, reset };
}
