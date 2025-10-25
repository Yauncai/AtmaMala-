import { Heart, Star, Users, Crown, Sparkles, Shield, ArrowLeft } from 'lucide-react';
import { Soul, SoulRarity } from '../types/soul';

interface SoulProfileScreenProps {
  soul: Soul;
  onTrust: () => void;
  onExplore: () => void;
  onBack?: () => void;
  showBackButton?: boolean;
}

export default function SoulProfileScreen({ soul, onTrust, onExplore, onBack, showBackButton = false }: SoulProfileScreenProps) {
  const getRarityColor = (rarity?: SoulRarity) => {
    switch (rarity) {
      case 'legendary': return 'from-yellow-500 to-orange-500';
      case 'epic': return 'from-purple-500 to-pink-500';
      case 'rare': return 'from-blue-500 to-cyan-500';
      default: return 'from-soul-purple via-soul-pink to-soul-teal';
    }
  };

  const getRarityBadgeColor = (rarity?: SoulRarity) => {
    switch (rarity) {
      case 'legendary': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'epic': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'rare': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full space-y-8">
        <div className="flex items-center justify-between">
          {showBackButton && onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-soul-teal/70 hover:text-soul-teal transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Gallery</span>
            </button>
          )}
          <h2 className="text-3xl font-bold bg-gradient-to-r from-soul-pink to-soul-teal bg-clip-text text-transparent mx-auto">
            Soul Profile
          </h2>
          {showBackButton && <div className="w-32" />}
        </div>

        <div className="soul-card p-8 space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-soul-pink/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-soul-teal/10 rounded-full blur-3xl" />

          <div className="relative z-10 space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className={`w-32 h-32 rounded-full bg-gradient-to-br ${getRarityColor(soul.rarity)} p-1`}>
                  <div className="w-full h-full rounded-full bg-soul-dark flex items-center justify-center">
                    <span className="text-4xl">{soul.avatar}</span>
                  </div>
                </div>
                <div className="absolute inset-0 rounded-full border-2 border-soul-pink/30 animate-pulse-glow" />
                {soul.rarity && (
                  <div className="absolute -top-2 -right-2">
                    <Crown className="w-8 h-8 text-yellow-400 drop-shadow-lg" />
                  </div>
                )}
              </div>

              <div className="text-center space-y-2">
                <h3 className="text-3xl font-bold text-white">{soul.name}</h3>
                {soul.archetype && (
                  <p className="text-soul-pink/70 text-sm italic">{soul.archetype}</p>
                )}
                <p className="text-soul-teal/70 text-sm font-mono">
                  {soul.walletAddress.slice(0, 6)}...{soul.walletAddress.slice(-4)}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 justify-center">
                {soul.rarity && (
                  <span className={`text-xs px-3 py-1 rounded-full border ${getRarityBadgeColor(soul.rarity)} flex items-center gap-1`}>
                    <Crown className="w-3 h-3" />
                    {soul.rarity}
                  </span>
                )}
                {soul.element && (
                  <span className="text-xs px-3 py-1 rounded-full border bg-soul-teal/20 text-soul-teal border-soul-teal/30 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    {soul.element}
                  </span>
                )}
                {soul.alignment && (
                  <span className="text-xs px-3 py-1 rounded-full border bg-soul-purple/20 text-soul-purple border-soul-purple/30 flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    {soul.alignment}
                  </span>
                )}
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
