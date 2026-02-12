import React, { useState } from 'react';
import { WalletProvider } from './context/WalletContext';
import { ToastProvider } from './context/ToastContext';
import { Header } from './components/Header';
import { ToastContainer } from './components/ToastContainer';
import { AnimatedBackground } from './components/AnimatedBackground';
import { Landing } from './pages/Landing';
import { Treasury } from './pages/Treasury';
import { Proposals } from './pages/Proposals';
import { CreateProposal } from './pages/CreateProposal';
import { ProposalDetail } from './pages/ProposalDetail';

function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [selectedProposal, setSelectedProposal] = useState<number | null>(null);

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <Landing setCurrentPage={setCurrentPage} />;
      case 'treasury':
        return <Treasury />;
      case 'proposals':
        return <Proposals setCurrentPage={setCurrentPage} setSelectedProposal={setSelectedProposal} />;
      case 'create':
        return <CreateProposal setCurrentPage={setCurrentPage} />;
      case 'proposal-detail':
        return <ProposalDetail proposalId={selectedProposal} setCurrentPage={setCurrentPage} />;
      default:
        return <Landing setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <WalletProvider>
      <ToastProvider>
        <div className="min-h-screen bg-[#0a0a0f] text-white relative overflow-x-hidden">
          <AnimatedBackground />
          <div className="relative z-10">
            <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
            {renderPage()}
          </div>
          <ToastContainer />
        </div>
      </ToastProvider>
    </WalletProvider>
  );
}

export default App;
