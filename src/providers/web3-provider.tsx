"use client";

import * as React from 'react';
import {
  RainbowKitProvider,
  getDefaultConfig,
  lightTheme,
  darkTheme,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { base } from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import '@rainbow-me/rainbowkit/styles.css';
import { config } from '@/lib/wagmi'

const queryClient = new QueryClient();

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
            theme={{
                lightMode: lightTheme({
                    accentColor: '#247BA0',
                    accentColorForeground: 'white',
                    borderRadius: 'medium',
                }),
                darkMode: darkTheme({
                    accentColor: '#7044ff',
                    accentColorForeground: 'white',
                    borderRadius: 'medium',
                }),
            }}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
