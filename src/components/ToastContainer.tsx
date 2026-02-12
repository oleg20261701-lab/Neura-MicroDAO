import React from 'react';
import { CheckCircle, XCircle, Info, Loader2, X, ExternalLink } from 'lucide-react';
import { useToast, Toast } from '../context/ToastContext';
import { NEURA_TESTNET } from '../config/contract';

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  const getIcon = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-emerald-400" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-400" />;
      case 'pending':
        return <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />;
      default:
        return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  const getBorderColor = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return 'border-emerald-500/50';
      case 'error':
        return 'border-red-500/50';
      case 'pending':
        return 'border-blue-500/50';
      default:
        return 'border-blue-500/50';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`flex items-start gap-3 p-4 rounded-xl bg-[#1a1a2e]/95 backdrop-blur-xl border ${getBorderColor(toast.type)} shadow-2xl min-w-[320px] max-w-[420px] animate-slide-in`}
        >
          {getIcon(toast.type)}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white">{toast.title}</p>
            {toast.message && (
              <p className="text-xs text-gray-400 mt-1">{toast.message}</p>
            )}
            {toast.txHash && (
              <a
                href={`${NEURA_TESTNET.blockExplorerUrls[0]}/tx/${toast.txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 mt-2"
              >
                View on Explorer
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      ))}
    </div>
  );
}
