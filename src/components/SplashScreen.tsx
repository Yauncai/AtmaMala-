import { Sparkles } from 'lucide-react';
import FloatingParticles from './FloatingParticles';


interface SplashScreenProps {
  onConnect: () => void;
}

export default function SplashScreen({ onConnect }: SplashScreenProps) {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <FloatingParticles />

      <div className="text-center z-10 space-y-8 px-4">
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-soul-pink/20 blur-3xl rounded-full animate-pulse-glow" />
          <img src="./amii.png" alt="ĀtmaMālā Logo" style={{ width: '300px', height: '300px' }} />
          {/* <Sparkles className="w-24 h-24 mx-auto text-soul-teal relative z-10" strokeWidth={1.5} /> */}
        </div>

        <div className="space-y-3">
          <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-soul-teal via-soul-pink to-soul-gold bg-clip-text text-transparent">
            ĀtmaMālā
          </h1>
          <p className="text-xl md:text-2xl text-soul-teal/80 font-light tracking-wide">
            Mint your soul. Connect your essence.
          </p>
        </div>

        <button
          onClick={onConnect}
          className="glow-button mt-8 text-lg"
        >
          Connect Wallet
        </button>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <p className="text-sm text-soul-purple/60 font-light">
            A digital soul and trust network
          </p>
        </div>
      </div>
    </div>
  );
}
