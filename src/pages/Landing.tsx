import React from 'react';
import { 
  Zap, Shield, Users, Vote, ArrowRight, Coins, 
  Lock, CheckCircle, TrendingUp, Globe, Sparkles 
} from 'lucide-react';
import { useWalletContext } from '../context/WalletContext';

interface LandingProps {
  setCurrentPage: (page: string) => void;
}

export function Landing({ setCurrentPage }: LandingProps) {
  const { isConnected, connect } = useWalletContext();

  const features = [
    {
      icon: Coins,
      title: 'Deposit & Earn',
      description: 'Deposit native ANKR to become a DAO member and participate in treasury governance.',
      gradient: 'from-amber-500 to-orange-500',
    },
    {
      icon: Vote,
      title: 'Democratic Voting',
      description: 'Vote on spending proposals with weight proportional to your deposit. One address, one vote per proposal.',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: Shield,
      title: 'Secure Treasury',
      description: 'Funds are locked only when proposals pass. Non-reentrant protection ensures safe execution.',
      gradient: 'from-emerald-500 to-teal-500',
    },
    {
      icon: Lock,
      title: 'Quorum Protection',
      description: 'Proposals require minimum participation to pass, preventing low-turnout manipulation.',
      gradient: 'from-blue-500 to-cyan-500',
    },
  ];

  const stats = [
    { label: 'Min Deposit to Vote', value: '0.01 ANKR' },
    { label: 'Min to Create Proposal', value: '0.1 ANKR' },
    { label: 'Default Quorum', value: '10%' },
    { label: 'Network', value: 'Neura Testnet' },
  ];

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 mb-8">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-purple-300">Built on Neura Testnet</span>
            </div>

            {/* Main heading */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
                Decentralized
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-gradient">
                Treasury Governance
              </span>
            </h1>

            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              A fully on-chain MicroDAO where members deposit native ANKR, vote on spending proposals, 
              and collectively manage treasury funds with transparent, verifiable governance.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {!isConnected ? (
                <button
                  onClick={connect}
                  className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold text-lg hover:from-purple-500 hover:to-blue-500 transition-all transform hover:scale-105 shadow-2xl shadow-purple-500/30"
                >
                  <Coins className="w-5 h-5" />
                  Deposit ANKR to Join
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              ) : (
                <button
                  onClick={() => setCurrentPage('treasury')}
                  className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold text-lg hover:from-purple-500 hover:to-blue-500 transition-all transform hover:scale-105 shadow-2xl shadow-purple-500/30"
                >
                  <TrendingUp className="w-5 h-5" />
                  View Treasury
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              )}
              <button
                onClick={() => setCurrentPage('proposals')}
                className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-semibold text-lg hover:bg-white/10 transition-all"
              >
                <Vote className="w-5 h-5" />
                View Proposals
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 max-w-4xl mx-auto">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-[#1a1a2e]/50 border border-purple-500/20 backdrop-blur-sm text-center"
              >
                <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Simple, transparent, and fully decentralized treasury management
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                className="group p-8 rounded-3xl bg-[#1a1a2e]/50 border border-purple-500/20 hover:border-purple-500/40 transition-all backdrop-blur-sm"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Governance Process
            </h2>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
            {[
              { step: '1', title: 'Deposit', desc: 'Add ANKR to treasury' },
              { step: '2', title: 'Propose', desc: 'Create spending proposal' },
              { step: '3', title: 'Vote', desc: 'Members cast votes' },
              { step: '4', title: 'Finalize', desc: 'Check quorum & results' },
              { step: '5', title: 'Execute', desc: 'Send funds to recipient' },
            ].map((item, i) => (
              <React.Fragment key={i}>
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-2xl font-bold text-white mb-3">
                    {item.step}
                  </div>
                  <h4 className="text-white font-semibold">{item.title}</h4>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
                {i < 4 && (
                  <ArrowRight className="w-6 h-6 text-purple-500/50 hidden md:block" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative p-12 rounded-3xl bg-gradient-to-br from-purple-900/50 to-blue-900/50 border border-purple-500/30 overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5Yzg4ZmYiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
            <div className="relative text-center">
              <Globe className="w-16 h-16 text-purple-400 mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Participate?
              </h2>
              <p className="text-gray-300 mb-8 max-w-xl mx-auto">
                Join the Neura MicroDAO today. Deposit ANKR, vote on proposals, 
                and help shape the future of decentralized treasury management.
              </p>
              <button
                onClick={() => isConnected ? setCurrentPage('treasury') : connect()}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-white text-gray-900 font-semibold text-lg hover:bg-gray-100 transition-all transform hover:scale-105"
              >
                {isConnected ? 'Go to Treasury' : 'Connect & Deposit'}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
