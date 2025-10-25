import { Soul, SoulElement, SoulAlignment, SoulRarity } from '../types/soul';
import { Filter, Sparkles, Crown, Shield } from 'lucide-react';
import FloatingParticles from './FloatingParticles';
import { useState } from 'react';

interface MyGalleryScreenProps {
  souls: Soul[];
  onSelectSoul: (soul: Soul) => void;
  onMintNew: () => void;
}

export default function MyGalleryScreen({ souls, onSelectSoul, onMintNew }: MyGalleryScreenProps) {
  const [elementFilter, setElementFilter] = useState<SoulElement | 'all'>('all');
  const [alignmentFilter, setAlignmentFilter] = useState<SoulAlignment | 'all'>('all');
  const [rarityFilter, setRarityFilter] = useState<SoulRarity | 'all'>('all');

  const filteredSouls = souls.filter(soul => {
    if (elementFilter !== 'all' && soul.element !== elementFilter) return false;
    if (alignmentFilter !== 'all' && soul.alignment !== alignmentFilter) return false;
    if (rarityFilter !== 'all' && soul.rarity !== rarityFilter) return false;
    return true;
  });

  const getRarityColor = (rarity?: SoulRarity) => {
    switch (rarity) {
      case 'legendary': return 'from-yellow-500 to-orange-500';
      case 'epic': return 'from-purple-500 to-pink-500';
      case 'rare': return 'from-blue-500 to-cyan-500';
      default: return 'from-gray-500 to-gray-600';
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
    <div className="min-h-screen relative overflow-hidden">
      <FloatingParticles />

      <div className="relative z-10 px-4 py-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-soul-pink to-soul-teal bg-clip-text text-transparent mb-2">
            My Soul Gallery
          </h1>
          <p className="text-soul-teal/70">
            {souls.length} {souls.length === 1 ? 'soul' : 'souls'} in your collection
          </p>
        </div>

        <div className="soul-card p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-soul-teal" />
            <span className="text-sm font-medium text-soul-teal/80">Filter Souls</span>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-soul-teal/70 mb-2">Element</label>
              <select
                value={elementFilter}
                onChange={(e) => setElementFilter(e.target.value as SoulElement | 'all')}
                className="w-full bg-soul-dark/50 border border-soul-purple/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-soul-pink/50 focus:ring-2 focus:ring-soul-pink/20"
              >
                <option value="all">All Elements</option>
                <option value="celestial">Celestial</option>
                <option value="nature">Nature</option>
                <option value="digital">Digital</option>
                <option value="fire">Fire</option>
                <option value="water">Water</option>
                <option value="shadow">Shadow</option>
                <option value="electric">Electric</option>
                <option value="crystal">Crystal</option>
                <option value="solar">Solar</option>
                <option value="lunar">Lunar</option>
                <option value="desert">Desert</option>
                <option value="ether">Ether</option>
                <option value="quantum">Quantum</option>
                <option value="sky">Sky</option>
                <option value="frost">Frost</option>
                <option value="neon">Neon</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-soul-teal/70 mb-2">Alignment</label>
              <select
                value={alignmentFilter}
                onChange={(e) => setAlignmentFilter(e.target.value as SoulAlignment | 'all')}
                className="w-full bg-soul-dark/50 border border-soul-purple/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-soul-pink/50 focus:ring-2 focus:ring-soul-pink/20"
              >
                <option value="all">All Alignments</option>
                <option value="guardian">Guardian</option>
                <option value="healer">Healer</option>
                <option value="oracle">Oracle</option>
                <option value="wanderer">Wanderer</option>
                <option value="warrior">Warrior</option>
                <option value="sage">Sage</option>
                <option value="mystic">Mystic</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-soul-teal/70 mb-2">Rarity</label>
              <select
                value={rarityFilter}
                onChange={(e) => setRarityFilter(e.target.value as SoulRarity | 'all')}
                className="w-full bg-soul-dark/50 border border-soul-purple/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-soul-pink/50 focus:ring-2 focus:ring-soul-pink/20"
              >
                <option value="all">All Rarities</option>
                <option value="common">Common</option>
                <option value="rare">Rare</option>
                <option value="epic">Epic</option>
                <option value="legendary">Legendary</option>
              </select>
            </div>
          </div>
        </div>

        {filteredSouls.length === 0 ? (
          <div className="soul-card p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-soul-purple/30 to-soul-pink/30 flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-soul-teal/50" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No Souls Found</h3>
            <p className="text-soul-teal/60 mb-6">
              {souls.length === 0 ? 'Start by minting your first soul' : 'Try adjusting your filters'}
            </p>
            {souls.length === 0 && (
              <button onClick={onMintNew} className="glow-button">
                <Sparkles className="w-5 h-5" />
                Mint First Soul
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {filteredSouls.map((soul) => (
                <button
                  key={soul.id}
                  onClick={() => onSelectSoul(soul)}
                  className="soul-card p-6 hover:scale-105 transition-all duration-300 text-left group"
                >
                  <div className="relative mb-4">
                    <div className={`w-24 h-24 mx-auto rounded-full bg-gradient-to-br ${getRarityColor(soul.rarity)} p-1`}>
                      <div className="w-full h-full rounded-full bg-soul-dark/80 flex items-center justify-center text-4xl">
                        {soul.avatar}
                      </div>
                    </div>
                    {soul.rarity && (
                      <div className="absolute top-0 right-0">
                        <Crown className="w-6 h-6 text-yellow-400" />
                      </div>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-soul-pink transition-colors">
                    {soul.name}
                  </h3>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {soul.rarity && (
                      <span className={`text-xs px-2 py-1 rounded-full border ${getRarityBadgeColor(soul.rarity)}`}>
                        {soul.rarity}
                      </span>
                    )}
                    {soul.element && (
                      <span className="text-xs px-2 py-1 rounded-full border bg-soul-teal/20 text-soul-teal border-soul-teal/30">
                        {soul.element}
                      </span>
                    )}
                    {soul.alignment && (
                      <span className="text-xs px-2 py-1 rounded-full border bg-soul-purple/20 text-soul-purple border-soul-purple/30">
                        {soul.alignment}
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-soul-teal/60 line-clamp-2 mb-4">{soul.bio}</p>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-soul-teal/70">
                      <Shield className="w-4 h-4" />
                      <span>Trust: {soul.trustScore}</span>
                    </div>
                    <div className="text-soul-purple/70">
                      {soul.trustedBy.length} connections
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex justify-center">
              <button onClick={onMintNew} className="glow-button">
                <Sparkles className="w-5 h-5" />
                Mint Another Soul
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
