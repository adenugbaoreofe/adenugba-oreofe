export const ARC_TESTNET_CHAIN_ID = 5042002;
export const ARC_TESTNET_CHAIN_ID_HEX = "0x" + ARC_TESTNET_CHAIN_ID.toString(16);

export const ARC_TESTNET_PARAMS = {
  chainId: ARC_TESTNET_CHAIN_ID_HEX,
  chainName: "Arc Testnet",
  nativeCurrency: { name: "USDC", symbol: "USDC", decimals: 18 },
  rpcUrls: ["https://rpc.testnet.arc.network"],
  blockExplorerUrls: ["https://testnet.arcscan.app"],
};

export const DEFAULT_DEMO_POOL = "0x8f3c8B35b3e21F1703279148b8d96001889c676E";
export const DEFAULT_DEMO_TOKEN = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";

export const POOL_ABI = [
  "function token() view returns (address)",
  "function owner() view returns (address)",
  "function paused() view returns (bool)",
  "function apyBps() view returns (uint256)",
  "function totalStaked() view returns (uint256)",
  "function rewardReserve() view returns (uint256)",
  "function pendingRewards(address) view returns (uint256)",
  "function getUserInfo(address) view returns (uint256 staked, uint256 pending)",
  "function stake(uint256 amount)",
  "function withdraw(uint256 amount)",
  "function claimReward()",
  "function exit()",
  "function fundRewards(uint256 amount)",
  "function withdrawRewardReserve(uint256 amount)",
  "function setAPY(uint256 newApyBps)",
  "function pause()",
  "function unpause()",
  "event Staked(address indexed user, uint256 amount)",
  "event Withdrawn(address indexed user, uint256 amount)",
  "event RewardClaimed(address indexed user, uint256 amount)",
  "event RewardsFunded(address indexed funder, uint256 amount)",
  "event APYUpdated(uint256 oldApyBps, uint256 newApyBps)",
];

export const ERC20_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function allowance(address,address) view returns (uint256)",
  "function approve(address,uint256) returns (bool)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
];
