import { useEffect } from 'react';
import { CheckCircle, XCircle, Info } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-soul-teal" />,
    error: <XCircle className="w-5 h-5 text-red-400" />,
    info: <Info className="w-5 h-5 text-soul-pink" />,
  };

  return (
    <div className="fixed top-6 right-6 z-50 animate-fade-in">
      <div className="flex items-center gap-3 bg-soul-dark-alt/95 backdrop-blur-lg border border-soul-purple/40 rounded-2xl px-6 py-4 shadow-[0_0_30px_rgba(255,110,199,0.4)] min-w-[300px]">
        {icons[type]}
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  );
}
