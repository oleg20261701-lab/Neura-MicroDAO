import React, { useState } from 'react';
import { 
  Vote, Clock, CheckCircle, XCircle, Play, 
  Users, Coins, ArrowRight, Filter, Search,
  TrendingUp, AlertCircle
} from 'lucide-react';
import { useWalletContext } from '../context/WalletContext';

interface ProposalsProps {
  setCurrentPage: (page: string) => void;
  setSelectedProposal: (id: number | null) => void;
}

interface Proposal {
  id: number;
  title: string;
  description: string;
  creator: string;
  recipient: string;
  amount: bigint;
  state: 'Active' | 'Passed' | 'Failed' | 'Executed';
  endTime: number;
  yesWeight: bigint;
  noWeight: bigint;
  totalWeight: bigint;
}

export function Proposals({ setCurrentPage, setSelectedProposal }: ProposalsProps) {
  const { isConnected } = useWalletContext();
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock proposals data
  const proposals: Proposal[] = [
    {
      id: 1,
      title: 'Fund Community Developer Grant',
      description: 'Allocate funds to support community developers building on Neura ecosystem.',
      creator: '0x1234...5678',
      recipient: '0xabcd...efgh',
      amount: BigInt('2000000000000000000'),
      state: 'Active',
      endTime: Date.now() + 86400000 * 2,
      yesWeight: BigInt('3500000000000000000'),
      noWeight: BigInt('1200000000000000000'),
      totalWeight: BigInt('4700000000000000000'),
    },
    {
      id: 2,
      title: 'Marketing Campaign Q1 2025',
      description: 'Launch comprehensive marketing campaign to increase awareness.',
      creator: '0x2345...6789',
      recipient: '0xbcde...fghi',
      amount: BigInt('1500000000000000000'),
      state: 'Passed',
      endTime: Date.now() - 86400000,
      yesWeight: BigInt('4000000000000000000'),
      noWeight: BigInt('800000000000000000'),
      totalWeight: BigInt('4800000000000000000'),
    },
    {
      id: 3,
      title: 'Security Audit Fund',
      description: 'Reserve funds for upcoming smart contract security audits.',
      creator: '0x3456...7890',
      recipient: '0xcdef...ghij',
      amount: BigInt('3000000000000000000'),
      state: 'Executed',
      endTime: Date.now() - 86400000 * 5,
      yesWeight: BigInt('4500000000000000000'),
      noWeight: BigInt('500000000000000000'),
      totalWeight: BigInt('5000000000000000000'),
    },
    {
      id: 4,
      title: 'Infrastructure Upgrade',
      description: 'Upgrade node infrastructure for better performance.',
      creator: '0x4567...8901',
      recipient: '0xdefg...hijk',
      amount: BigInt('500000000000000000'),
      state: 'Failed',
      endTime: Date.now() - 86400000 * 3,
      yesWeight: BigInt('1000000000000000000'),
      noWeight: BigInt('2500000000000000000'),
      totalWeight: BigInt('3500000000000000000'),
    },
    {
      id: 5,
      title: 'Hackathon Prize Pool',
      description: 'Fund prizes for the upcoming Neura hackathon event.',
      creator: '0x5678...9012',
      recipient: '0xefgh...ijkl',
      amount: BigInt('1000000000000000000'),
      state: 'Active',
      endTime: Date.now() + 86400000 * 5,
      yesWeight: BigInt('2000000000000000000'),
      noWeight: BigInt('300000000000000000'),
      totalWeight: BigInt('2300000000000000000'),
    },
  ];

  const formatEther = (wei: bigint): string => {
    const eth = Number(wei) / 1e18;
    return eth.toFixed(2);
  };

  const getTimeRemaining = (endTime: number): string => {
    const now = Date.now();
    const diff = endTime - now;
    
    if (diff <= 0) return 'Ended';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h remaining`;
    return `${hours}h remaining`;
  };

  const getStateColor = (state: string) => {
    switch (state) {
      case 'Active':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Passed':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'Failed':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'Executed':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStateIcon = (state: string) => {
    switch (state) {
      case 'Active':
        return <Clock className="w-4 h-4" />;
      case 'Passed':
        return <CheckCircle className="w-4 h-4" />;
      case 'Failed':
        return <XCircle className="w-4 h-4" />;
      case 'Executed':
        return <Play className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const filteredProposals = proposals.filter(p => {
    if (activeFilter !== 'all' && p.state.toLowerCase() !== activeFilter) return false;
    if (searchQuery && !p.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const stats = {
    total: proposals.length,
    active: proposals.filter(p => p.state === 'Active').length,
    passed: proposals.filter(p => p.state === 'Passed').length,
    executed: proposals.filter(p => p.state === 'Executed').length,
  };

  return (
    <div className="min-h-screen pt-24 px-4 pb-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Proposals</h1>
            <p className="text-gray-400">Vote on treasury spending proposals</p>
          </div>
          <button
            onClick={() => setCurrentPage('create')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold hover:from-purple-500 hover:to-blue-500 transition-all"
          >
            <Vote className="w-5 h-5" />
            Create Proposal
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-xl bg-[#1a1a2e]/50 border border-purple-500/20">
            <p className="text-gray-400 text-sm mb-1">Total Proposals</p>
            <p className="text-2xl font-bold text-white">{stats.total}</p>
          </div>
          <div className="p-4 rounded-xl bg-[#1a1a2e]/50 border border-blue-500/20">
            <p className="text-gray-400 text-sm mb-1">Active</p>
            <p className="text-2xl font-bold text-blue-400">{stats.active}</p>
          </div>
          <div className="p-4 rounded-xl bg-[#1a1a2e]/50 border border-emerald-500/20">
            <p className="text-gray-400 text-sm mb-1">Passed</p>
            <p className="text-2xl font-bold text-emerald-400">{stats.passed}</p>
          </div>
          <div className="p-4 rounded-xl bg-[#1a1a2e]/50 border border-purple-500/20">
            <p className="text-gray-400 text-sm mb-1">Executed</p>
            <p className="text-2xl font-bold text-purple-400">{stats.executed}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search proposals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#1a1a2e]/50 border border-purple-500/20 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'active', 'passed', 'failed', 'executed'].map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-3 rounded-xl text-sm font-medium capitalize transition-all ${
                  activeFilter === filter
                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                    : 'bg-[#1a1a2e]/50 text-gray-400 border border-transparent hover:border-purple-500/20'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Proposals List */}
        <div className="space-y-4">
          {filteredProposals.length === 0 ? (
            <div className="p-12 rounded-2xl bg-[#1a1a2e]/50 border border-purple-500/20 text-center">
              <AlertCircle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">No proposals found</p>
            </div>
          ) : (
            filteredProposals.map(proposal => {
              const yesPercent = proposal.totalWeight > 0 
                ? Number(proposal.yesWeight * BigInt(100) / proposal.totalWeight) 
                : 0;
              const noPercent = 100 - yesPercent;

              return (
                <div
                  key={proposal.id}
                  onClick={() => {
                    setSelectedProposal(proposal.id);
                    setCurrentPage('proposal-detail');
                  }}
                  className="group p-6 rounded-2xl bg-[#1a1a2e]/50 border border-purple-500/20 hover:border-purple-500/40 transition-all cursor-pointer"
                >
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    {/* Main Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-gray-500 text-sm">#{proposal.id}</span>
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStateColor(proposal.state)}`}>
                          {getStateIcon(proposal.state)}
                          {proposal.state}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-400 transition-colors">
                        {proposal.title}
                      </h3>
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                        {proposal.description}
                      </p>

                      {/* Vote Progress */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-emerald-400">Yes: {yesPercent}%</span>
                          <span className="text-red-400">No: {noPercent}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-gray-700 overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all"
                            style={{ width: `${yesPercent}%` }}
                          />
                        </div>
                      </div>

                      {/* Meta */}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Coins className="w-4 h-4" />
                          {formatEther(proposal.amount)} ANKR
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {formatEther(proposal.totalWeight)} ANKR voted
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {getTimeRemaining(proposal.endTime)}
                        </span>
                      </div>
                    </div>

                    {/* Arrow */}
                    <div className="hidden md:flex items-center">
                      <ArrowRight className="w-6 h-6 text-gray-600 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
