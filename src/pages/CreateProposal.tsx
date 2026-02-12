import React, { useState } from 'react';
import { 
  FileText, User, Coins, Clock, AlertCircle, 
  CheckCircle, ArrowRight, Info, Sparkles
} from 'lucide-react';
import { useWalletContext } from '../context/WalletContext';
import { useToast } from '../context/ToastContext';

interface CreateProposalProps {
  setCurrentPage: (page: string) => void;
}

export function CreateProposal({ setCurrentPage }: CreateProposalProps) {
  const { address, isConnected, isCorrectNetwork } = useWalletContext();
  const { addToast, updateToast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    recipient: '',
    amount: '',
    duration: '3',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const durationOptions = [
    { value: '1', label: '1 Day' },
    { value: '3', label: '3 Days' },
    { value: '5', label: '5 Days' },
    { value: '7', label: '7 Days' },
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 80) {
      newErrors.title = 'Title must be 80 characters or less';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length > 500) {
      newErrors.description = 'Description must be 500 characters or less';
    }

    if (!formData.recipient.trim()) {
      newErrors.recipient = 'Recipient address is required';
    } else if (!/^0x[a-fA-F0-9]{40}$/.test(formData.recipient)) {
      newErrors.recipient = 'Invalid Ethereum address';
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    const toastId = addToast({ 
      type: 'pending', 
      title: 'Creating Proposal...', 
      message: 'Please confirm the transaction in your wallet' 
    });

    try {
      // Simulate transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      updateToast(toastId, {
        type: 'success',
        title: 'Proposal Created!',
        message: `"${formData.title}" has been submitted`,
        txHash: '0x' + Math.random().toString(16).slice(2, 66),
      });

      setCurrentPage('proposals');
    } catch (error: any) {
      updateToast(toastId, {
        type: 'error',
        title: 'Failed to Create Proposal',
        message: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isConnected || !isCorrectNetwork) {
    return (
      <div className="min-h-screen pt-24 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="p-12 rounded-3xl bg-[#1a1a2e]/50 border border-purple-500/20">
            <AlertCircle className="w-16 h-16 text-amber-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">
              {!isConnected ? 'Connect Your Wallet' : 'Switch to Neura Testnet'}
            </h2>
            <p className="text-gray-400">
              {!isConnected 
                ? 'Connect your wallet to create a proposal.'
                : 'Please switch to Neura Testnet to create a proposal.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-4 pb-12">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Create Proposal</h1>
          <p className="text-gray-400">Submit a new spending proposal for the DAO treasury</p>
        </div>

        {/* Requirements Notice */}
        <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 mb-8">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold text-purple-400 mb-1">Requirements</p>
              <ul className="text-gray-400 space-y-1">
                <li>• Minimum deposit of 0.1 ANKR required to create proposals</li>
                <li>• Title: max 80 characters | Description: max 500 characters</li>
                <li>• Voting duration: 1-7 days</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="p-8 rounded-3xl bg-[#1a1a2e]/50 border border-purple-500/20 backdrop-blur-sm space-y-6">
            {/* Title */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <FileText className="w-4 h-4 text-purple-400" />
                Proposal Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter a clear, concise title"
                maxLength={80}
                className={`w-full px-4 py-3 rounded-xl bg-[#0a0a0f] border ${
                  errors.title ? 'border-red-500' : 'border-purple-500/30'
                } text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors`}
              />
              <div className="flex items-center justify-between mt-2">
                {errors.title && (
                  <span className="text-red-400 text-sm">{errors.title}</span>
                )}
                <span className="text-gray-500 text-sm ml-auto">
                  {formData.title.length}/80
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the purpose and expected outcomes of this proposal"
                maxLength={500}
                rows={4}
                className={`w-full px-4 py-3 rounded-xl bg-[#0a0a0f] border ${
                  errors.description ? 'border-red-500' : 'border-purple-500/30'
                } text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors resize-none`}
              />
              <div className="flex items-center justify-between mt-2">
                {errors.description && (
                  <span className="text-red-400 text-sm">{errors.description}</span>
                )}
                <span className="text-gray-500 text-sm ml-auto">
                  {formData.description.length}/500
                </span>
              </div>
            </div>

            {/* Recipient */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <User className="w-4 h-4 text-purple-400" />
                Recipient Address
              </label>
              <input
                type="text"
                value={formData.recipient}
                onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
                placeholder="0x..."
                className={`w-full px-4 py-3 rounded-xl bg-[#0a0a0f] border ${
                  errors.recipient ? 'border-red-500' : 'border-purple-500/30'
                } text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors font-mono`}
              />
              {errors.recipient && (
                <span className="text-red-400 text-sm mt-2 block">{errors.recipient}</span>
              )}
            </div>

            {/* Amount */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <Coins className="w-4 h-4 text-purple-400" />
                Amount (ANKR)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.0"
                  step="0.01"
                  min="0"
                  className={`w-full px-4 py-3 rounded-xl bg-[#0a0a0f] border ${
                    errors.amount ? 'border-red-500' : 'border-purple-500/30'
                  } text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors`}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                  ANKR
                </span>
              </div>
              {errors.amount && (
                <span className="text-red-400 text-sm mt-2 block">{errors.amount}</span>
              )}
            </div>

            {/* Duration */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <Clock className="w-4 h-4 text-purple-400" />
                Voting Duration
              </label>
              <div className="grid grid-cols-4 gap-3">
                {durationOptions.map(option => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, duration: option.value })}
                    className={`py-3 rounded-xl text-sm font-medium transition-all ${
                      formData.duration === option.value
                        ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50'
                        : 'bg-[#0a0a0f] text-gray-400 border border-purple-500/20 hover:border-purple-500/40'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="p-6 rounded-2xl bg-[#1a1a2e]/30 border border-purple-500/10">
            <h3 className="text-sm font-medium text-gray-400 mb-4">Preview</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Title</span>
                <span className="text-white">{formData.title || '-'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Recipient</span>
                <span className="text-white font-mono text-sm">
                  {formData.recipient ? `${formData.recipient.slice(0, 10)}...${formData.recipient.slice(-8)}` : '-'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Amount</span>
                <span className="text-white">{formData.amount || '0'} ANKR</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Duration</span>
                <span className="text-white">{formData.duration} Days</span>
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold text-lg hover:from-purple-500 hover:to-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating Proposal...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Submit Proposal
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
