import React, { useState, useEffect } from 'react';
import { 
  Wallet, TrendingUp, TrendingDown, Lock, Unlock, 
  ArrowUpRight, ArrowDownRight, RefreshCw, Info,
  Coins, PiggyBank, Shield
} from 'lucide-react';
import { useWalletContext } from '../context/WalletContext';
import { useContract } from '../hooks/useContract';
import { useToast } from '../context/ToastContext';
import { CONTRACT_ADDRESS, NEURA_TESTNET } from '../config/contract';

export function Treasury() {
  const { address, isConnected, isCorrectNetwork } = useWalletContext();
  const { deposit, withdraw, formatEther, parseEther, loading } = useContract(address);
  const { addToast, updateToast } = useToast();

  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>('deposit');

  // Mock data - in production, fetch from contract
  const [treasuryData, setTreasuryData] = useState({
    totalDeposits: BigInt('5000000000000000000'), // 5 ANKR
    totalAvailable: BigInt('4500000000000000000'), // 4.5 ANKR
    totalLocked: BigInt('500000000000000000'), // 0.5 ANKR
    memberBalance: BigInt('1000000000000000000'), // 1 ANKR
    memberCount: 12,
    activeProposals: 3,
  });

  const handleDeposit = async () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      addToast({ type: 'error', title: 'Invalid amount', message: 'Please enter a valid deposit amount' });
      return;
    }

    const toastId = addToast({ type: 'pending', title: 'Depositing...', message: `Depositing ${depositAmount} ANKR` });

    try {
      const txHash = await deposit(depositAmount);
      updateToast(toastId, { 
        type: 'success', 
        title: 'Deposit Successful!', 
        message: `Deposited ${depositAmount} ANKR`,
        txHash 
      });
      setDepositAmount('');
    } catch (error: any) {
      updateToast(toastId, { 
        type: 'error', 
        title: 'Deposit Failed', 
        message: error.message 
      });
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      addToast({ type: 'error', title: 'Invalid amount', message: 'Please enter a valid withdrawal amount' });
      return;
    }

    const toastId = addToast({ type: 'pending', title: 'Withdrawing...', message: `Withdrawing ${withdrawAmount} ANKR` });

    try {
      const txHash = await withdraw(withdrawAmount);
      updateToast(toastId, { 
        type: 'success', 
        title: 'Withdrawal Successful!', 
        message: `Withdrew ${withdrawAmount} ANKR`,
        txHash 
      });
      setWithdrawAmount('');
    } catch (error: any) {
      updateToast(toastId, { 
        type: 'error', 
        title: 'Withdrawal Failed', 
        message: error.message 
      });
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen pt-24 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="p-12 rounded-3xl bg-[#1a1a2e]/50 border border-purple-500/20">
            <Wallet className="w-16 h-16 text-purple-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h2>
            <p className="text-gray-400 mb-6">
              Connect your wallet to view the treasury and manage your deposits.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!isCorrectNetwork) {
    return (
      <div className="min-h-screen pt-24 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="p-12 rounded-3xl bg-amber-500/10 border border-amber-500/30">
            <Shield className="w-16 h-16 text-amber-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">Wrong Network</h2>
            <p className="text-gray-400 mb-6">
              Please switch to Neura Testnet to interact with the treasury.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-4 pb-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Treasury Dashboard</h1>
          <p className="text-gray-400">Manage your deposits and view treasury statistics</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="p-6 rounded-2xl bg-[#1a1a2e]/50 border border-purple-500/20 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400 text-sm">Total Deposits</span>
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <PiggyBank className="w-5 h-5 text-purple-400" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white">
              {formatEther(treasuryData.totalDeposits)} <span className="text-lg text-gray-400">ANKR</span>
            </p>
            <p className="text-sm text-emerald-400 mt-2 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              +12.5% this week
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#1a1a2e]/50 border border-emerald-500/20 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400 text-sm">Available Funds</span>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <Unlock className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white">
              {formatEther(treasuryData.totalAvailable)} <span className="text-lg text-gray-400">ANKR</span>
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Ready for proposals
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#1a1a2e]/50 border border-amber-500/20 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400 text-sm">Locked in Proposals</span>
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <Lock className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white">
              {formatEther(treasuryData.totalLocked)} <span className="text-lg text-gray-400">ANKR</span>
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {treasuryData.activeProposals} active proposals
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#1a1a2e]/50 border border-blue-500/20 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400 text-sm">Your Balance</span>
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-blue-400" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white">
              {formatEther(treasuryData.memberBalance)} <span className="text-lg text-gray-400">ANKR</span>
            </p>
            <p className="text-sm text-blue-400 mt-2">
              Voting power active
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Deposit/Withdraw Card */}
          <div className="lg:col-span-2">
            <div className="p-8 rounded-3xl bg-[#1a1a2e]/50 border border-purple-500/20 backdrop-blur-sm">
              {/* Tabs */}
              <div className="flex gap-2 mb-8">
                <button
                  onClick={() => setActiveTab('deposit')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all ${
                    activeTab === 'deposit'
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  <ArrowDownRight className="w-5 h-5" />
                  Deposit
                </button>
                <button
                  onClick={() => setActiveTab('withdraw')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all ${
                    activeTab === 'withdraw'
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  <ArrowUpRight className="w-5 h-5" />
                  Withdraw
                </button>
              </div>

              {activeTab === 'deposit' ? (
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Amount to Deposit</label>
                  <div className="relative mb-4">
                    <input
                      type="number"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      placeholder="0.0"
                      className="w-full px-4 py-4 rounded-xl bg-[#0a0a0f] border border-purple-500/30 text-white text-xl font-semibold placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                      <span className="text-gray-400 font-semibold">ANKR</span>
                    </div>
                  </div>

                  <div className="flex gap-2 mb-6">
                    {['0.1', '0.5', '1', '5'].map(amount => (
                      <button
                        key={amount}
                        onClick={() => setDepositAmount(amount)}
                        className="flex-1 py-2 rounded-lg bg-purple-500/10 text-purple-400 text-sm font-medium hover:bg-purple-500/20 transition-colors"
                      >
                        {amount} ANKR
                      </button>
                    ))}
                  </div>

                  <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 mb-6">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-gray-300">
                        <p className="font-semibold text-purple-400 mb-1">Membership Benefits</p>
                        <ul className="space-y-1 text-gray-400">
                          <li>• Deposit ≥0.01 ANKR to vote on proposals</li>
                          <li>• Deposit ≥0.1 ANKR to create proposals</li>
                          <li>• Voting weight = your deposit amount</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleDeposit}
                    disabled={loading || !depositAmount}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold text-lg hover:from-purple-500 hover:to-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Coins className="w-5 h-5" />
                        Deposit ANKR
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Amount to Withdraw</label>
                  <div className="relative mb-4">
                    <input
                      type="number"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      placeholder="0.0"
                      className="w-full px-4 py-4 rounded-xl bg-[#0a0a0f] border border-purple-500/30 text-white text-xl font-semibold placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                      <span className="text-gray-400 font-semibold">ANKR</span>
                    </div>
                  </div>

                  <div className="flex gap-2 mb-6">
                    <button
                      onClick={() => setWithdrawAmount(formatEther(treasuryData.memberBalance / BigInt(4)))}
                      className="flex-1 py-2 rounded-lg bg-purple-500/10 text-purple-400 text-sm font-medium hover:bg-purple-500/20 transition-colors"
                    >
                      25%
                    </button>
                    <button
                      onClick={() => setWithdrawAmount(formatEther(treasuryData.memberBalance / BigInt(2)))}
                      className="flex-1 py-2 rounded-lg bg-purple-500/10 text-purple-400 text-sm font-medium hover:bg-purple-500/20 transition-colors"
                    >
                      50%
                    </button>
                    <button
                      onClick={() => setWithdrawAmount(formatEther(treasuryData.memberBalance * BigInt(75) / BigInt(100)))}
                      className="flex-1 py-2 rounded-lg bg-purple-500/10 text-purple-400 text-sm font-medium hover:bg-purple-500/20 transition-colors"
                    >
                      75%
                    </button>
                    <button
                      onClick={() => setWithdrawAmount(formatEther(treasuryData.memberBalance))}
                      className="flex-1 py-2 rounded-lg bg-purple-500/10 text-purple-400 text-sm font-medium hover:bg-purple-500/20 transition-colors"
                    >
                      Max
                    </button>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-6">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-gray-300">
                        <p className="font-semibold text-amber-400 mb-1">Withdrawal Notice</p>
                        <p className="text-gray-400">
                          You can only withdraw unallocated funds. Funds locked in passed proposals cannot be withdrawn until executed.
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleWithdraw}
                    disabled={loading || !withdrawAmount}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold text-lg hover:from-purple-500 hover:to-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <ArrowUpRight className="w-5 h-5" />
                        Withdraw ANKR
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Your Status */}
            <div className="p-6 rounded-2xl bg-[#1a1a2e]/50 border border-purple-500/20 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-white mb-4">Your Status</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Member Status</span>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-sm font-medium">
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Can Vote</span>
                  <span className="text-emerald-400">✓ Yes</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Can Create Proposals</span>
                  <span className="text-emerald-400">✓ Yes</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Voting Power</span>
                  <span className="text-white font-semibold">
                    {formatEther(treasuryData.memberBalance)} ANKR
                  </span>
                </div>
              </div>
            </div>

            {/* Contract Info */}
            <div className="p-6 rounded-2xl bg-[#1a1a2e]/50 border border-purple-500/20 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-white mb-4">Contract Info</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-gray-500 text-sm">Contract Address</span>
                  <p className="text-gray-300 text-sm font-mono break-all">
                    {CONTRACT_ADDRESS}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Network</span>
                  <p className="text-gray-300">{NEURA_TESTNET.chainName}</p>
                </div>
                <a
                  href={`${NEURA_TESTNET.blockExplorerUrls[0]}/address/${CONTRACT_ADDRESS}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 text-sm"
                >
                  View on Explorer
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
