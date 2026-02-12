import React from 'react';
import { Wallet, ChevronDown, ExternalLink, LogOut, Zap } from 'lucide-react';
import { useWalletContext } from '../context/WalletContext';
import { NEURA_TESTNET } from '../config/contract';

interface HeaderProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

export function Header({ currentPage, setCurrentPage }: HeaderProps) {
  const { address, isConnected, isCorrectNetwork, connect, switchNetwork, disconnect, isConnecting } = useWalletContext();

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const navItems = [
    { id: 'landing', label: 'Home' },
    { id: 'treasury', label: 'Treasury' },
    { id: 'proposals', label: 'Proposals' },
    { id: 'create', label: 'Create' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-purple-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setCurrentPage('landing')}
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center transform group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Neura MicroDAO
              </h1>
              <p className="text-xs text-gray-500">Treasury Governance</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentPage === item.id
                    ? 'bg-purple-500/20 text-purple-400'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Wallet Connection */}
          <div className="flex items-center gap-3">
            {isConnected && !isCorrectNetwork && (
              <button
                onClick={switchNetwork}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/20 text-amber-400 text-sm font-medium hover:bg-amber-500/30 transition-all"
              >
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                Switch Network
              </button>
            )}

            {!isConnected ? (
              <button
                onClick={connect}
                disabled={isConnecting}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-semibold hover:from-purple-500 hover:to-blue-500 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/25"
              >
                <Wallet className="w-4 h-4" />
                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1a1a2e] border border-purple-500/30">
                  <div className={`w-2 h-2 rounded-full ${isCorrectNetwork ? 'bg-emerald-400' : 'bg-amber-400'} animate-pulse`} />
                  <span className="text-sm text-gray-300">{formatAddress(address!)}</span>
                </div>
                <button
                  onClick={disconnect}
                  className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
