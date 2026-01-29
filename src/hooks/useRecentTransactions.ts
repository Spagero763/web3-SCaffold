'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'web3_recent_txs';
const MAX_TRANSACTIONS = 20;

export interface RecentTransaction {
  hash: string;
  chainId: number;
  timestamp: number;
  description: string;
  status: 'pending' | 'confirmed' | 'failed';
}

export function useRecentTransactions(chainId?: number) {
  const [transactions, setTransactions] = useState<RecentTransaction[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as RecentTransaction[];
      const filtered = chainId 
        ? parsed.filter(tx => tx.chainId === chainId)
        : parsed;
      setTransactions(filtered);
    }
  }, [chainId]);

  const addTransaction = useCallback((tx: Omit<RecentTransaction, 'timestamp'>) => {
    setTransactions(prev => {
      const newTx = { ...tx, timestamp: Date.now() };
      const updated = [newTx, ...prev].slice(0, MAX_TRANSACTIONS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const updateTransaction = useCallback((hash: string, status: RecentTransaction['status']) => {
    setTransactions(prev => {
      const updated = prev.map(tx => 
        tx.hash === hash ? { ...tx, status } : tx
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearTransactions = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setTransactions([]);
  }, []);

  return {
    transactions,
    addTransaction,
    updateTransaction,
    clearTransactions,
    pendingCount: transactions.filter(tx => tx.status === 'pending').length,
  };
}
