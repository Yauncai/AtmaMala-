import { useState } from 'react';
import { ArrowLeft, Heart, Star } from 'lucide-react';
import { Soul } from '../types/soul';

interface ExploreScreenProps {
  souls: Soul[];
  currentSoulId: string;
  onBack: () => void;
  onTrustSoul: (soulId: string) => void;
}

export default function ExploreScreen({ souls, currentSoulId, onBack, onTrustSoul }: ExploreScreenProps) {
  const [selectedSoul, setSelectedSoul] = useState<Soul | null>(null);

  const otherSouls = souls.filter(s => s.id !== currentSoulId);

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-soul-pink to-soul-teal bg-clip-text text-transparent">
              Trust Network
            </h2>
            <p className="text-soul-teal/70 mt-2">Discover and connect with other souls</p>
          </div>

          <button
            onClick={onBack}
            className="flex items-center gap-2 px-6 py-3 bg-soul-dark-alt/80 border border-soul-purple/30 rounded-full text-white hover:border-soul-teal/50 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Profile
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {otherSouls.map((soul) => (
            <div
              key={soul.id}
              className="soul-card p-6 space-y-4 cursor-pointer group"
              onClick={() => setSelectedSoul(soul)}
            >
              <div className="flex items-start gap-4">
                <div className="relative flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-soul-purple via-soul-pink to-soul-teal p-0.5">
                    <div className="w-full h-full rounded-full bg-soul-dark flex items-center justify-center">
                       {soul.image ? (
                        <img
                          src={soul.image}
                          alt={soul.name}
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <span className="text-2xl">{soul.avatar}</span>
                      )}
                    </div>
                  </div>
                  <div className="absolute inset-0 rounded-full border border-soul-pink/20 group-hover:border-soul-pink/40 transition-all" />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-white truncate">{soul.name}</h3>
                  <p className="text-xs text-soul-teal/50 font-mono">
                    {soul.walletAddress.slice(0, 8)}...{soul.walletAddress.slice(-4)}
                  </p>
                </div>
              </div>

              <p className="text-sm text-white/70 line-clamp-2">{soul.bio}</p>

              <div className="flex items-center justify-between pt-2 border-t border-soul-purple/20">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${
                        i < soul.trustScore
                          ? 'text-soul-gold fill-soul-gold'
                          : 'text-soul-purple/30'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onTrustSoul(soul.id);
                  }}
                  className="px-4 py-1.5 bg-gradient-to-r from-soul-purple to-soul-pink rounded-full text-xs font-semibold text-white hover:shadow-[0_0_20px_rgba(255,110,199,0.4)] transition-all flex items-center gap-1"
                >
                  <Heart className="w-3 h-3" />
                  Trust
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedSoul && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedSoul(null)}
        >
          <div
            className="soul-card p-8 max-w-2xl w-full space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-soul-purple via-soul-pink to-soul-teal p-1">
                  <div className="w-full h-full rounded-full bg-soul-dark flex items-center justify-center">
                      {selectedSoul.image ? (
                        <img
                          src={selectedSoul.image}
                          alt={selectedSoul.name}
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <span className="text-4xl">{selectedSoul.avatar}</span>
                      )}
                  </div>
                </div>
                <div className="absolute inset-0 rounded-full border-2 border-soul-pink/30 animate-pulse-glow" />
              </div>

              <div className="flex-1">
                <h3 className="text-3xl font-bold text-white">{selectedSoul.name}</h3>
                <p className="text-soul-teal/70 text-sm font-mono mt-1">
                  {selectedSoul.walletAddress}
                </p>
              </div>
            </div>

            <div className="bg-soul-dark/50 rounded-xl p-6 space-y-3">
              <h4 className="text-sm font-semibold text-soul-pink uppercase tracking-wide">Soul Essence</h4>
              <p className="text-white/90 leading-relaxed">{selectedSoul.bio}</p>
            </div>

            <div className="flex items-center justify-between py-4 px-6 bg-soul-dark/50 rounded-xl">
              <div className="flex items-center gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < selectedSoul.trustScore
                        ? 'text-soul-gold fill-soul-gold'
                        : 'text-soul-purple/30'
                    }`}
                  />
                ))}
              </div>

              <div className="text-right">
                <div className="text-2xl font-bold text-soul-teal">{selectedSoul.trustedBy.length}</div>
                <p className="text-xs text-soul-teal/70">Trusted By</p>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setSelectedSoul(null)}
                className="flex-1 bg-soul-dark-alt/80 border border-soul-purple/30 rounded-full px-6 py-3 font-semibold text-white hover:border-soul-teal/50 transition-all"
              >
                Close
              </button>

              <button
                onClick={() => {
                  onTrustSoul(selectedSoul.id);
                  setSelectedSoul(null);
                }}
                className="flex-1 glow-button flex items-center justify-center gap-2"
              >
                <Heart className="w-5 h-5" />
                Trust Soul
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
