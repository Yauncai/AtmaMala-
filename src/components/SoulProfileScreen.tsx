import { Heart, Star, Users } from 'lucide-react';
import { Soul } from '../types/soul';

interface SoulProfileScreenProps {
  soul: Soul;
  onTrust: () => void;
  onExplore: () => void;
}

export default function SoulProfileScreen({ soul, onTrust, onExplore }: SoulProfileScreenProps) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-soul-pink to-soul-teal bg-clip-text text-transparent">
            Your Soul Profile
          </h2>
        </div>

        <div className="soul-card p-8 space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-soul-pink/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-soul-teal/10 rounded-full blur-3xl" />

          <div className="relative z-10 space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-soul-purple via-soul-pink to-soul-teal p-1">
                  <div className="w-full h-full rounded-full bg-soul-dark flex items-center justify-center">
                    {soul.image? (
                      <img src={soul.image}
                      alt={soul.name}
                      className="w-full h-full object-cover rounded-full"
                      />
                    ):(
                      <span className="text-4xl">{soul.avatar}</span>
                    )}  
                  </div>
                </div>
                <div className="absolute inset-0 rounded-full border-2 border-soul-pink/30 animate-pulse-glow" />
              </div>

              <div className="text-center space-y-2">
                <h3 className="text-3xl font-bold text-white">{soul.name}</h3>
                <p className="text-soul-teal/70 text-sm font-mono">
                  {soul.walletAddress.slice(0, 6)}...{soul.walletAddress.slice(-4)}
                </p>
              </div>
            </div>

            <div className="bg-soul-dark/50 rounded-xl p-6 space-y-3">
              <h4 className="text-sm font-semibold text-soul-pink uppercase tracking-wide">Soul Essence</h4>
              <p className="text-white/90 leading-relaxed">{soul.bio}</p>
            </div>

            <div className="flex items-center justify-center gap-8 py-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < soul.trustScore
                          ? 'text-soul-gold fill-soul-gold'
                          : 'text-soul-purple/30'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-soul-teal/70">Trust Score</p>
              </div>

              <div className="h-12 w-px bg-soul-purple/30" />

              <div className="text-center">
                <div className="text-2xl font-bold text-soul-teal">{soul.trustedBy.length}</div>
                <p className="text-xs text-soul-teal/70">Trusted By</p>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={onExplore}
                className="flex-1 bg-soul-dark-alt/80 border border-soul-purple/30 rounded-full px-6 py-3 font-semibold text-white transition-all duration-300 hover:border-soul-teal/50 hover:shadow-[0_0_20px_rgba(0,255,255,0.3)] flex items-center justify-center gap-2"
              >
                <Users className="w-5 h-5" />
                Explore Network
              </button>

              <button
                onClick={onTrust}
                className="flex-1 glow-button flex items-center justify-center gap-2"
              >
                <Heart className="w-5 h-5" />
                Trust Soul
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
