import { useState, useEffect, useCallback } from 'react';
import { NEURA_TESTNET } from '../config/contract';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export interface WalletState {
  address: string | null;
  chainId: number | null;
  isConnected: boolean;
  isCorrectNetwork: boolean;
}

export function useWallet() {
  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    chainId: null,
    isConnected: false,
    isCorrectNetwork: false,
  });
  const [isConnecting, setIsConnecting] = useState(false);

  const checkNetwork = useCallback((chainId: number) => {
    return chainId === NEURA_TESTNET.chainId;
  }, []);

  const updateWalletState = useCallback(async () => {
    if (!window.ethereum) return;

    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
      const chainId = parseInt(chainIdHex, 16);

      setWallet({
        address: accounts[0] || null,
        chainId,
        isConnected: accounts.length > 0,
        isCorrectNetwork: checkNetwork(chainId),
      });
    } catch (error) {
      console.error('Error updating wallet state:', error);
    }
  }, [checkNetwork]);

  const connect = useCallback(async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask or another Web3 wallet');
      return;
    }

    setIsConnecting(true);
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      await updateWalletState();
    } catch (error) {
      console.error('Error connecting wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  }, [updateWalletState]);

  const switchNetwork = useCallback(async () => {
    if (!window.ethereum) return;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: NEURA_TESTNET.chainIdHex }],
      });
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: NEURA_TESTNET.chainIdHex,
                chainName: NEURA_TESTNET.chainName,
                nativeCurrency: NEURA_TESTNET.nativeCurrency,
                rpcUrls: NEURA_TESTNET.rpcUrls,
                blockExplorerUrls: NEURA_TESTNET.blockExplorerUrls,
              },
            ],
          });
        } catch (addError) {
          console.error('Error adding network:', addError);
        }
      }
    }
  }, []);

  const disconnect = useCallback(() => {
    setWallet({
      address: null,
      chainId: null,
      isConnected: false,
      isCorrectNetwork: false,
    });
  }, []);

  useEffect(() => {
    updateWalletState();

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', updateWalletState);
      window.ethereum.on('chainChanged', updateWalletState);

      return () => {
        window.ethereum.removeListener('accountsChanged', updateWalletState);
        window.ethereum.removeListener('chainChanged', updateWalletState);
      };
    }
  }, [updateWalletState]);

  return {
    ...wallet,
    connect,
    disconnect,
    switchNetwork,
    isConnecting,
  };
}
