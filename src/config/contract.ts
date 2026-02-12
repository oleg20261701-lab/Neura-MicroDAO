export const CONTRACT_ADDRESS = "0x730EEAE4920e26A90b96430192c843B8006b9B65"; // Deploy and update this

export const NEURA_TESTNET = {
  chainId: 267,
  chainIdHex: "0x10B",
  chainName: "Neura Testnet",
  nativeCurrency: {
    name: "ANKR",
    symbol: "ANKR",
    decimals: 18,
  },
  rpcUrls: ["https://rpc.ankr.com/neura_testnet"],
  blockExplorerUrls: ["https://explorer.neura-testnet.ankr.com"],
};

export const CONTRACT_ABI = [
  // Read functions
  "function owner() view returns (address)",
  "function paused() view returns (bool)",
  "function totalDeposits() view returns (uint256)",
  "function totalLocked() view returns (uint256)",
  "function minDepositToVote() view returns (uint256)",
  "function proposalCreateMin() view returns (uint256)",
  "function quorumBps() view returns (uint256)",
  "function minVotingDuration() view returns (uint256)",
  "function maxVotingDuration() view returns (uint256)",
  "function memberBalance(address) view returns (uint256)",
  "function proposalCount() view returns (uint256)",
  "function hasVoted(uint256, address) view returns (bool)",
  "function totalAvailable() view returns (uint256)",
  "function isMember(address) view returns (bool)",
  "function canVote(address) view returns (bool)",
  "function canCreateProposal(address) view returns (bool)",
  "function getProposalCore(uint256) view returns (uint256, address, address, uint256, uint8, uint256)",
  "function getProposalText(uint256) view returns (string, string)",
  "function getProposalVotes(uint256) view returns (uint256, uint256, uint256)",
  "function getTreasuryStats() view returns (uint256, uint256)",
  // Write functions
  "function deposit() payable",
  "function withdraw(uint256)",
  "function createProposal(string, string, address, uint256, uint256) returns (uint256)",
  "function vote(uint256, bool)",
  "function finalize(uint256)",
  "function execute(uint256)",
  "function setParams(uint256, uint256, uint256, uint256, uint256)",
  "function pause()",
  "function unpause()",
  "function transferOwnership(address)",
  // Events
  "event Deposit(address indexed member, uint256 amount)",
  "event Withdraw(address indexed member, uint256 amount)",
  "event ProposalCreated(uint256 indexed proposalId, address indexed creator, address recipient, uint256 amount)",
  "event VoteCast(uint256 indexed proposalId, address indexed voter, bool support, uint256 weight)",
  "event ProposalFinalized(uint256 indexed proposalId, uint8 state)",
  "event ProposalExecuted(uint256 indexed proposalId, address recipient, uint256 amount)",
  "event ParamsUpdated(uint256 minDepositToVote, uint256 proposalCreateMin, uint256 quorumBps)",
  "event Paused(bool isPaused)",
];
