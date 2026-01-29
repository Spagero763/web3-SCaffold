export const SUPPORTED_CHAINS = {
  mainnet: 1,
  sepolia: 11155111,
  polygon: 137,
  optimism: 10,
  arbitrum: 42161,
  base: 8453,
} as const;

export const RPC_URLS: Record<number, string> = {
  1: 'https://eth.llamarpc.com',
  11155111: 'https://rpc.sepolia.org',
  137: 'https://polygon-rpc.com',
  10: 'https://mainnet.optimism.io',
  42161: 'https://arb1.arbitrum.io/rpc',
  8453: 'https://mainnet.base.org',
};

export const BLOCK_EXPLORER_URLS: Record<number, string> = {
  1: 'https://etherscan.io',
  11155111: 'https://sepolia.etherscan.io',
  137: 'https://polygonscan.com',
  10: 'https://optimistic.etherscan.io',
  42161: 'https://arbiscan.io',
  8453: 'https://basescan.org',
};

export const DEFAULT_CHAIN_ID = SUPPORTED_CHAINS.sepolia;

export const GAS_BUFFER_PERCENTAGE = 20;

export const TX_CONFIRMATION_BLOCKS = 2;
