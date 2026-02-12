# Neura MicroDAO Treasury

A fully on-chain MicroDAO Treasury dApp built on Neura testnet using native ANKR as the gas token.

## Features

### Smart Contract (NeuraMicroDAO.sol)
- **Membership & Treasury**: Users become members by depositing native ANKR
- **Spending Proposals**: Members can create proposals to spend treasury funds
- **Democratic Voting**: Vote weight proportional to deposit amount
- **Quorum Protection**: Minimum participation required for proposals to pass
- **Secure Execution**: Non-reentrant protection, proper fund locking

### Frontend
- **Landing Page**: Overview of the DAO and how it works
- **Treasury Dashboard**: View stats, deposit/withdraw ANKR
- **Proposals List**: Browse all proposals with filtering
- **Create Proposal**: Submit new spending proposals
- **Proposal Detail**: Vote, finalize, and execute proposals

## Contract Details

### Key Parameters
- `minDepositToVote`: 0.01 ANKR
- `proposalCreateMin`: 0.1 ANKR
- `quorumBps`: 1000 (10%)
- `minVotingDuration`: 1 hour
- `maxVotingDuration`: 7 days

### Functions
- `deposit()`: Deposit ANKR to become a member
- `withdraw(amount)`: Withdraw unallocated funds
- `createProposal(...)`: Create a new spending proposal
- `vote(proposalId, support)`: Cast your vote
- `finalize(proposalId)`: Finalize voting after end time
- `execute(proposalId)`: Execute passed proposals

### Events
- `Deposit`, `Withdraw`
- `ProposalCreated`, `VoteCast`, `ProposalFinalized`, `ProposalExecuted`
- `ParamsUpdated`, `Paused`

## Network Configuration

**Neura Testnet**
- Chain ID: 267 (0x10B)
- RPC: https://rpc.ankr.com/neura_testnet
- Explorer: https://explorer.neura-testnet.ankr.com
- Native Token: ANKR

## Deployment

1. Deploy `contracts/NeuraMicroDAO.sol` to Neura testnet
2. Update `CONTRACT_ADDRESS` in `src/config/contract.ts`
3. Build and deploy the frontend

## Development

```bash
npm install
npm run dev
```

## Tech Stack
- React + TypeScript
- Tailwind CSS
- Vite
- Solidity 0.8.19

## License
MIT
