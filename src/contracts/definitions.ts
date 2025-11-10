import type { Icon } from 'lucide-react';
import {
  Coins,
  Badge,
  Clock,
  NotebookText,
  Vote,
  CircleDollarSign,
  Send,
  Trophy,
  CalendarCheck,
  Heart,
  Bot,
  LayoutDashboard,
  Box,
} from 'lucide-react';
import { tipJarAbi } from './abis/tip-jar';
import { badgeNftAbi } from './abis/badge-nft';
import { timeCapsuleAbi } from './abis/time-capsule';
import { onchainNotepadAbi } from './abis/onchain-notepad';
import { pollCreatorAbi } from './abis/poll-creator';
import { simpleTokenAbi } from './abis/simple-token';
import { airdropperAbi } from './abis/airdropper';
import { taskBountyAbi } from './abis/task-bounty';
import { dailyCheckinAbi } from './abis/daily-checkin';
import { donationTrackerAbi } from './abis/donation-tracker';

export type ContractDefinition = {
  name: string;
  abi: any;
  address: `0x${string}`;
  description: string;
  icon: Icon;
  page: string;
};

export const contracts = {
  tipJar: {
    name: 'Tip Jar',
    abi: tipJarAbi,
    address: '0x16335a2a2245b774a754a55393dD0d29497d5193',
    description: 'A simple contract to send and receive tips.',
    icon: Coins,
    page: '/tipjar',
  },
  badgeNft: {
    name: 'Badge NFT',
    abi: badgeNftAbi,
    address: '0x959922bE3CAee4b8Cd9a407cc3ac1C251C2007B1',
    description: 'Mint and manage unique NFT badges.',
    icon: Badge,
    page: '/badgenft',
  },
  timeCapsule: {
    name: 'Time Capsule',
    abi: timeCapsuleAbi,
    address: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
    description: 'Lock funds that can only be withdrawn after a specific time.',
    icon: Clock,
    page: '/timecapsule',
  },
  onchainNotepad: {
    name: 'On-chain Notepad',
    abi: onchainNotepadAbi,
    address: '0x0165878A594ca255338adfa4d48449f69242Eb8F',
    description: 'Save and retrieve short notes on the blockchain.',
    icon: NotebookText,
    page: '/onchainnotepad',
  },
  pollCreator: {
    name: 'Poll Creator',
    abi: pollCreatorAbi,
    address: '0xa513E6E4b8f2a923D98304ec87F64353C4D5C853',
    description: 'Create and participate in on-chain polls.',
    icon: Vote,
    page: '/pollcreator',
  },
  simpleToken: {
    name: 'Simple Token',
    abi: simpleTokenAbi,
    address: '0x2279B7A0a67DB372996a5FAB50D91eAA73d2eBe6',
    description: 'A basic ERC20 token contract.',
    icon: CircleDollarSign,
    page: '/simpletoken',
  },
  airdropper: {
    name: 'Airdropper',
    abi: airdropperAbi,
    address: '0x8A791620dd6260079BF849Dc5567aDC3F2FdC318',
    description: 'Distribute ERC20 tokens to multiple addresses in a single transaction.',
    icon: Send,
    page: '/airdropper',
  },
  taskBounty: {
    name: 'Task Bounty',
    abi: taskBountyAbi,
    address: '0x610178dA211FEF7D417bC0e6FeD39F05609AD788',
    description: 'Create bounties for tasks and reward solvers.',
    icon: Trophy,
    page: '/taskbounty',
  },
  dailyCheckin: {
    name: 'Daily Check-in',
    abi: dailyCheckinAbi,
    address: '0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e',
    description: 'Check in daily to maintain a streak.',
    icon: CalendarCheck,
    page: '/dailycheckin',
  },
  donationTracker: {
    name: 'Donation Tracker',
    abi: donationTrackerAbi,
    address: '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9',
    description: 'Register causes and track donations.',
    icon: Heart,
    page: '/donationtracker',
  },
} as const;

export type ContractName = keyof typeof contracts;

export const contractList = Object.values(contracts);

export const mainNavItems = [
    {
        name: 'Dashboard',
        icon: LayoutDashboard,
        page: '/',
    },
    {
        name: 'AI Generator',
        icon: Bot,
        page: '/ai-generator',
    },
    {
        name: 'Reown App',
        icon: Box,
        page: '/reown-app',
    }
]
