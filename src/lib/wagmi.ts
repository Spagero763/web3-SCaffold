import { http, createConfig } from 'wagmi';
import { base } from 'wagmi/chains';
import { rainbowkit, walletConnect, injected } from '@rainbow-me/rainbowkit/wallets';

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "a505c671629d1c7d6d333f4a38148135";

export const config = createConfig({
  chains: [base],
  connectors: [
    injected(),
    walletConnect({ projectId, metadata: {
        name: 'Web3 Scaffold',
        description: 'Web3 Scaffold App',
        url: 'https://web3-scaffold.com',
        icons: ['https://avatars.githubusercontent.com/u/37784886']
    }}),
  ],
  ssr: true,
  transports: {
    [base.id]: http(),
  },
});
