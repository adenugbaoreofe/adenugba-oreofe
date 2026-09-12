export interface ArcPoolInfo {
  address: string;
  tokenAddress: string;
  tokenSymbol: string;
  tokenDecimals: number;
  apyBps: number;
  totalStaked: string;
  rewardReserve: string;
  isPaused: boolean;
  owner: string;
}

export interface UserPosition {
  staked: string;
  pendingRewards: string;
  walletBalance: string;
  rawStaked: bigint;
  rawPending: bigint;
  rawWalletBalance: bigint;
}

export interface ActivityItem {
  id: string;
  type: 'Stake' | 'Withdraw' | 'Claim' | 'Fund reserve' | 'Reclaim reserve' | 'APY change' | 'Pause' | 'Unpause';
  amountText: string;
  address: string;
  txHash?: string;
  timestamp: number;
}

export type ThemeMode = 'parchment' | 'obsidian' | 'emerald';
