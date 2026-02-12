import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Clock, CheckCircle, XCircle, Play, 
  ThumbsUp, ThumbsDown, Users, Coins, ExternalLink,
  AlertCircle, RefreshCw, Target, User
} from 'lucide-react';
import { useWalletContext } from '../context/WalletContext';
import { useToast } from '../context/ToastContext';
import { NEURA_TESTNET } from '../config/contract';

interface ProposalDetailProps {
  proposalId: number | null;
  setCurrentPage: (page: string) => void;
}

export function ProposalDetail({ proposalId, setCurrentPage }: ProposalDetailProps) {
  const { address, isConnected, isCorrectNetwork } = useWalletContext();
  const { addToast, updateToast } = useToast();
  const [isVoting, setIsVoting] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState('');

  // Mock proposal data
  const proposal = {
    id: proposalId || 1,
    title: 'Fund Community Developer Grant',
    description: 'Allocate funds to support community developers building on Neura ecosystem. This grant will be used to fund 5 developer projects over the next quarter, with each project receiving up to 0.4 ANKR based on milestones achieved.',
    creator: '0x1234567890abcdef1234567890abcdef12345678',
    recipient: '0xabcdef1234567890abcdef1234567890abcdef12',
    amount: BigInt('2000000000000000000'),
    state: 'Active' as const,
    endTime: Date.now() + 86400000 * 2,
    yesWeight: BigInt('3500000000000000000'),
    noWeight: BigInt('1200000000000000000'),
    totalWeight: BigInt('4700000000000000000'),
    hasVoted: false,
    quorumRequired: BigInt('500000000000000000'),
  };

  const formatEther = (wei: bigint): string => {
    const eth = Number(wei) / 1e18;
    return eth.toFixed(4);
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 10)}...${addr.slice(-8)}`;
  };

  useEffect(() => {
    const updateTimer = () => {
      const now = Date.now();
      const diff = proposal.endTime - now;
      
      if (diff <= 0) {
        setTimeRemaining('Voting Ended');
        return;
      }
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeRemaining(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [proposal.endTime]);

  const yesPercent = proposal.totalWeight > 0 
    ? Number(proposal.yesWeight * BigInt(100) / proposal.totalWeight) 
    : 0;
  const noPercent = 100 - yesPercent;
  const quorumPercent = Number(proposal.totalWeight * BigInt(100) / proposal.quorumRequired);

  const handleVote = async (support: boolean) => {
    setIsVoting(true);
    const toastId = addToast({ 
      type: 'pending', 
      title: 'Casting Vote...', 
      message: `Voting ${support ? 'Yes' : 'No'} on proposal #${proposal.id}` 
    });

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      updateToast(toastId, {
        type: 'success',
        title: 'Vote Cast!',
        message: `You voted ${support ? 'Yes' : 'No'}`,
        txHash: '0x' + Math.random().toString(16).slice(2, 66),
      });
    } catch (error: any) {
      updateToast(toastId, {
        type: 'error',
        title: 'Vote Failed',
        message: error.message,
      });
    } finally {
      setIsVoting(false);
    }
  };

  const handleFinalize = async () => {
    setIsFinalizing(true);
    const toastId = addToast({ 
      type: 'pending', 
      title: 'Finalizing...', 
      message: 'Calculating final results' 
    });

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      updateToast(toastId, {
        type: 'success',
        title: 'Proposal Finalized!',
        message: 'The proposal has been finalized',
        txHash: '0x' + Math.random().toString(16).slice(2, 66),
      });
    } catch (error: any) {
      updateToast(toastId, {
        type: 'error',
        title: 'Finalization Failed',
        message: error.message,
      });
    } finally {
      setIsFinalizing(false);
    }
  };

  const handleExecute = async () => {
    setIsExecuting(true);
    const toastId = addToast({ 
      type: 'pending', 
      title: 'Executing...', 
      message: 'Sending funds to recipient' 
    });

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      updateToast(toastId, {
        type: 'success',
        title: 'Proposal Executed!',
        message: `${formatEther(proposal.amount)} ANKR sent to recipient`,
        txHash: '0x' + Math.random().toString(16).slice(2, 66),
      });
    } catch (error: any) {
      updateToast(toastId, {
        type: 'error',
        title: 'Execution Failed',
        message: error.message,
      });
    } finally {
      setIsExecuting(false);
    }
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

  return (
    <div className="min-h-screen pt-24 px-4 pb-12">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => setCurrentPage('proposals')}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Proposals
        </button>

        {/* Header */}
        <div className="p-8 rounded-3xl bg-[#1a1a2e]/50 border border-purple-500/20 backdrop-blur-sm mb-6">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-gray-500">Proposal #{proposal.id}</span>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStateColor(proposal.state)}`}>
                  {proposal.state === 'Active' && <Clock className="w-3 h-3" />}
                  {proposal.state === 'Passed' && <CheckCircle className="w-3 h-3" />}
                  {proposal.state === 'Failed' && <XCircle className="w-3 h-3" />}
                  {proposal.state === 'Executed' && <Play className="w-3 h-3" />}
                  {proposal.state}
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                {proposal.title}
              </h1>
            </div>
          </div>

          <p className="text-gray-300 leading-relaxed mb-6">
            {proposal.description}
          </p>

          {/* Meta Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-[#0a0a0f]/50">
              <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                <User className="w-4 h-4" />
                Creator
              </div>
              <a
                href={`${NEURA_TESTNET.blockExplorerUrls[0]}/address/${proposal.creator}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 hover:text-purple-300 text-sm font-mono"
              >
                {formatAddress(proposal.creator)}
              </a>
            </div>
            <div className="p-4 rounded-xl bg-[#0a0a0f]/50">
              <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                <Target className="w-4 h-4" />
                Recipient
              </div>
              <a
                href={`${NEURA_TESTNET.blockExplorerUrls[0]}/address/${proposal.recipient}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 hover:text-purple-300 text-sm font-mono"
              >
                {formatAddress(proposal.recipient)}
              </a>
            </div>
            <div className="p-4 rounded-xl bg-[#0a0a0f]/50">
              <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                <Coins className="w-4 h-4" />
                Amount
              </div>
              <p className="text-white font-semibold">
                {formatEther(proposal.amount)} ANKR
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#0a0a0f]/50">
              <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                <Clock className="w-4 h-4" />
                Time Remaining
              </div>
              <p className={`font-semibold ${proposal.state === 'Active' ? 'text-blue-400' : 'text-gray-400'}`}>
                {timeRemaining}
              </p>
            </div>
          </div>
        </div>

        {/* Voting Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Vote Progress */}
          <div className="p-6 rounded-2xl bg-[#1a1a2e]/50 border border-purple-500/20">
            <h3 className="text-lg font-semibold text-white mb-4">Vote Results</h3>
            
            {/* Yes/No Bars */}
            <div className="space-y-4 mb-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center gap-2 text-emerald-400">
                    <ThumbsUp className="w-4 h-4" />
                    Yes
                  </span>
                  <span className="text-white font-semibold">{yesPercent}%</span>
                </div>
                <div className="h-3 rounded-full bg-gray-700 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-500"
                    style={{ width: `${yesPercent}%` }}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {formatEther(proposal.yesWeight)} ANKR
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center gap-2 text-red-400">
                    <ThumbsDown className="w-4 h-4" />
                    No
                  </span>
                  <span className="text-white font-semibold">{noPercent}%</span>
                </div>
                <div className="h-3 rounded-full bg-gray-700 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-500"
                    style={{ width: `${noPercent}%` }}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {formatEther(proposal.noWeight)} ANKR
                </p>
              </div>
            </div>

            {/* Quorum */}
            <div className="p-4 rounded-xl bg-[#0a0a0f]/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Quorum Progress</span>
                <span className={`text-sm font-semibold ${quorumPercent >= 100 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {Math.min(quorumPercent, 100)}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-gray-700 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${
                    quorumPercent >= 100 
                      ? 'bg-gradient-to-r from-emerald-600 to-emerald-400' 
                      : 'bg-gradient-to-r from-amber-600 to-amber-400'
                  }`}
                  style={{ width: `${Math.min(quorumPercent, 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {formatEther(proposal.totalWeight)} / {formatEther(proposal.quorumRequired)} ANKR required
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="p-6 rounded-2xl bg-[#1a1a2e]/50 border border-purple-500/20">
            <h3 className="text-lg font-semibold text-white mb-4">Actions</h3>

            {!isConnected ? (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-400" />
                  <p className="text-amber-400 text-sm">Connect wallet to participate</p>
                </div>
              </div>
            ) : proposal.state === 'Active' ? (
              <div className="space-y-4">
                {proposal.hasVoted ? (
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                      <p className="text-emerald-400">You have already voted</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-gray-400 text-sm mb-4">
                      Cast your vote. Your voting power is based on your deposit amount.
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => handleVote(true)}
                        disabled={isVoting}
                        className="flex items-center justify-center gap-2 py-4 rounded-xl bg-emerald-500/20 text-emerald-400 font-semibold hover:bg-emerald-500/30 transition-all disabled:opacity-50"
                      >
                        {isVoting ? (
                          <RefreshCw className="w-5 h-5 animate-spin" />
                        ) : (
                          <ThumbsUp className="w-5 h-5" />
                        )}
                        Vote Yes
                      </button>
                      <button
                        onClick={() => handleVote(false)}
                        disabled={isVoting}
                        className="flex items-center justify-center gap-2 py-4 rounded-xl bg-red-500/20 text-red-400 font-semibold hover:bg-red-500/30 transition-all disabled:opacity-50"
                      >
                        {isVoting ? (
                          <RefreshCw className="w-5 h-5 animate-spin" />
                        ) : (
                          <ThumbsDown className="w-5 h-5" />
                        )}
                        Vote No
                      </button>
                    </div>
                  </>
                )}

                {/* Finalize button - shown when voting ended */}
                {Date.now() >= proposal.endTime && (
                  <button
                    onClick={handleFinalize}
                    disabled={isFinalizing}
                    className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-purple-500/20 text-purple-400 font-semibold hover:bg-purple-500/30 transition-all disabled:opacity-50"
                  >
                    {isFinalizing ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                      <CheckCircle className="w-5 h-5" />
                    )}
                    Finalize Proposal
                  </button>
                )}
              </div>
            ) : proposal.state === 'Passed' ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                    <p className="text-emerald-400">Proposal passed! Ready for execution.</p>
                  </div>
                </div>
                <button
                  onClick={handleExecute}
                  disabled={isExecuting}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold hover:from-purple-500 hover:to-blue-500 transition-all disabled:opacity-50"
                >
                  {isExecuting ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <Play className="w-5 h-5" />
                  )}
                  Execute Proposal
                </button>
              </div>
            ) : proposal.state === 'Executed' ? (
              <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                <div className="flex items-center gap-3">
                  <Play className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="text-purple-400 font-semibold">Executed</p>
                    <p className="text-gray-400 text-sm">
                      {formatEther(proposal.amount)} ANKR sent to recipient
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                <div className="flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-red-400" />
                  <p className="text-red-400">Proposal failed to pass</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
