import { http, createConfig } from 'wagmi';
import { base } from 'wagmi/chains';
import {
  injectedWallet,
  walletConnectWallet,
  rainbowWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { connectorsForWallets } from '@rainbow-me/rainbowkit';

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "a505c671629d1c7d6d333f4a38148135";

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Suggested',
      wallets: [injectedWallet, rainbowWallet, walletConnectWallet],
    },
  ],
  {
    appName: 'Web3 Scaffold',
    projectId,
  }
);


export const config = createConfig({
  chains: [base],
  connectors,
  ssr: true,
  transports: {
    [base.id]: http(),
  },
});
