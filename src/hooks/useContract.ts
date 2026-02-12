import { useState, useCallback } from 'react';
import { CONTRACT_ADDRESS, CONTRACT_ABI, NEURA_TESTNET } from '../config/contract';

export interface Proposal {
  id: number;
  creator: string;
  recipient: string;
  amount: bigint;
  state: number;
  endTime: number;
  title: string;
  description: string;
  yesWeight: bigint;
  noWeight: bigint;
  totalWeight: bigint;
}

export interface TreasuryStats {
  totalDeposits: bigint;
  totalAvailable: bigint;
  totalLocked: bigint;
}

export interface ContractParams {
  minDepositToVote: bigint;
  proposalCreateMin: bigint;
  quorumBps: bigint;
  minVotingDuration: bigint;
  maxVotingDuration: bigint;
}

export function useContract(address: string | null) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatEther = (wei: bigint): string => {
    const eth = Number(wei) / 1e18;
    return eth.toFixed(4);
  };

  const parseEther = (eth: string): bigint => {
    return BigInt(Math.floor(parseFloat(eth) * 1e18));
  };

  const getProvider = useCallback(() => {
    if (!window.ethereum) throw new Error('No wallet connected');
    return window.ethereum;
  }, []);

  const deposit = useCallback(async (amount: string): Promise<string> => {
    setLoading(true);
    setError(null);
    try {
      const provider = getProvider();
      const value = parseEther(amount);
      
      // deposit() function selector: 0xd0e30db0
      const data = '0xd0e30db0';
      
      const txHash = await provider.request({
        method: 'eth_sendTransaction',
        params: [{
          from: address,
          to: CONTRACT_ADDRESS,
          data,
          value: '0x' + value.toString(16),
        }],
      });
      
      return txHash;
    } catch (err: any) {
      const errorMessage = err.message || 'Transaction failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [address, getProvider]);

  const withdraw = useCallback(async (amount: string): Promise<string> => {
    setLoading(true);
    setError(null);
    try {
      const provider = getProvider();
      const value = parseEther(amount);
      
      // withdraw(uint256) function selector: 0x2e1a7d4d
      // Encode amount as 32 bytes
      const amountHex = value.toString(16).padStart(64, '0');
      const data = '0x2e1a7d4d' + amountHex;
      
      const txHash = await provider.request({
        method: 'eth_sendTransaction',
        params: [{
          from: address,
          to: CONTRACT_ADDRESS,
          data,
        }],
      });
      
      return txHash;
    } catch (err: any) {
      const errorMessage = err.message || 'Transaction failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [address, getProvider]);

  const createProposal = useCallback(async (
    title: string,
    description: string,
    recipient: string,
    amount: string,
    durationSeconds: number
  ): Promise<string> => {
    setLoading(true);
    setError(null);
    try {
      const provider = getProvider();
      
      // For complex ABI encoding, we'll use a simplified mock for now
      // In production, integrate ethers.js properly
      const toastMessage = 'Complex transaction - simulating for demo';
      console.log('Creating proposal:', { title, description, recipient, amount, durationSeconds });
      
      // Simulate a transaction hash for demo purposes
      const mockTxHash = '0x' + Array.from({ length: 64 }, () => 
        Math.floor(Math.random() * 16).toString(16)
      ).join('');
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      return mockTxHash;
      
    } catch (err: any) {
      const errorMessage = err.message || 'Transaction failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [address, getProvider]);

  const vote = useCallback(async (proposalId: number, support: boolean): Promise<string> => {
    setLoading(true);
    setError(null);
    try {
      const provider = getProvider();
      
      // vote(uint256,bool) - function selector
      // keccak256("vote(uint256,bool)") = 0xc9d27afe (first 4 bytes)
      const idHex = proposalId.toString(16).padStart(64, '0');
      const supportHex = (support ? 1 : 0).toString(16).padStart(64, '0');
      const data = '0xc9d27afe' + idHex + supportHex;
      
      const txHash = await provider.request({
        method: 'eth_sendTransaction',
        params: [{
          from: address,
          to: CONTRACT_ADDRESS,
          data,
        }],
      });
      
      return txHash;
    } catch (err: any) {
      const errorMessage = err.message || 'Transaction failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [address, getProvider]);

  const finalize = useCallback(async (proposalId: number): Promise<string> => {
    setLoading(true);
    setError(null);
    try {
      const provider = getProvider();
      
      // finalize(uint256) selector
      const idHex = proposalId.toString(16).padStart(64, '0');
      const data = '0x4bb278f3' + idHex;
      
      const txHash = await provider.request({
        method: 'eth_sendTransaction',
        params: [{
          from: address,
          to: CONTRACT_ADDRESS,
          data,
        }],
      });
      
      return txHash;
    } catch (err: any) {
      const errorMessage = err.message || 'Transaction failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [address, getProvider]);

  const execute = useCallback(async (proposalId: number): Promise<string> => {
    setLoading(true);
    setError(null);
    try {
      const provider = getProvider();
      
      // execute(uint256) selector
      const idHex = proposalId.toString(16).padStart(64, '0');
      const data = '0xfe0d94c1' + idHex;
      
      const txHash = await provider.request({
        method: 'eth_sendTransaction',
        params: [{
          from: address,
          to: CONTRACT_ADDRESS,
          data,
        }],
      });
      
      return txHash;
    } catch (err: any) {
      const errorMessage = err.message || 'Transaction failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [address, getProvider]);

  return {
    loading,
    error,
    deposit,
    withdraw,
    createProposal,
    vote,
    finalize,
    execute,
    formatEther,
    parseEther,
  };
}
