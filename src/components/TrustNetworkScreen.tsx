import { Soul } from '../types/soul';
import { ArrowLeft, Heart, Users, TrendingUp, Network, Lightbulb, Target, GitBranch } from 'lucide-react';
import FloatingParticles from './FloatingParticles';
import NetworkGraphVisualization from './NetworkGraphVisualization';
import { useMemo, useState } from 'react';
import { getRecommendedSouls, SoulRecommendation } from '../utils/recommendationEngine';
import { findTrustPath, findAllPathsWithinDegrees } from '../utils/trustPathFinder';

interface TrustNetworkScreenProps {
  currentSoul: Soul;
  allSouls: Soul[];
  onBack: () => void;
  onSelectSoul: (soul: Soul) => void;
  onTrustSoul?: (soulId: string) => void;
}

interface TrustStats {
  trustedBy: Soul[];
  trusting: Soul[];
  mutualTrust: Soul[];
  trustInfluence: number;
}

type ViewMode = 'stats' | 'graph' | 'recommendations' | 'paths';

export default function TrustNetworkScreen({ currentSoul, allSouls, onBack, onSelectSoul, onTrustSoul }: TrustNetworkScreenProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('stats');
  const [selectedPathSoul, setSelectedPathSoul] = useState<Soul | null>(null);

  const trustStats: TrustStats = useMemo(() => {
    const trustedBy = allSouls.filter(soul =>
      currentSoul.trustedBy.includes(soul.id)
    );

    const trusting = allSouls.filter(soul =>
      soul.trustedBy.includes(currentSoul.id)
    );

    const mutualTrust = trustedBy.filter(soul =>
      trusting.some(t => t.id === soul.id)
    );

    const trustInfluence = trustedBy.reduce((acc, soul) => acc + soul.trustScore, 0);

    return { trustedBy, trusting, mutualTrust, trustInfluence };
  }, [currentSoul, allSouls]);

  const recommendations = useMemo(() => {
    return getRecommendedSouls(currentSoul, allSouls, 10);
  }, [currentSoul, allSouls]);

  const pathInfo = useMemo(() => {
    if (!selectedPathSoul) return null;
    return findTrustPath(currentSoul, selectedPathSoul, allSouls);
  }, [currentSoul, selectedPathSoul, allSouls]);

  const nearbyConnections = useMemo(() => {
    const paths = findAllPathsWithinDegrees(currentSoul, allSouls, 3);
    return Array.from(paths.entries())
      .map(([id, path]) => ({
        soul: allSouls.find(s => s.id === id)!,
        degrees: path.degrees
      }))
      .filter(item => item.soul)
      .sort((a, b) => a.degrees - b.degrees)
      .slice(0, 20);
  }, [currentSoul, allSouls]);

  const recentActivity = useMemo(() => {
    const activities: { soul: Soul; type: 'received' | 'given'; timestamp: Date }[] = [];

    trustStats.trustedBy.forEach(soul => {
      activities.push({
        soul,
        type: 'received',
        timestamp: new Date(soul.createdAt)
      });
    });

    trustStats.trusting.forEach(soul => {
      activities.push({
        soul,
        type: 'given',
        timestamp: new Date(soul.createdAt)
      });
    });

    return activities
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 10);
  }, [trustStats]);

  const handleTrustRecommendation = (soulId: string) => {
    if (onTrustSoul) {
      onTrustSoul(soulId);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <FloatingParticles />

      <div className="relative z-10 px-4 py-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-soul-teal/70 hover:text-soul-teal transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Profile</span>
          </button>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-soul-pink to-soul-teal bg-clip-text text-transparent mb-2">
            Trust Network
          </h1>
          <p className="text-soul-teal/70">
            Exploring connections for <span className="text-white font-semibold">{currentSoul.name}</span>
          </p>
        </div>

        <div className="flex gap-2 mb-8 overflow-x-auto">
          <button
            onClick={() => setViewMode('stats')}
            className={`px-4 py-2 rounded-lg border transition-colors whitespace-nowrap ${
              viewMode === 'stats'
                ? 'bg-soul-pink/20 border-soul-pink text-soul-pink'
                : 'bg-soul-dark/50 border-soul-purple/30 text-soul-teal/70 hover:border-soul-pink/50'
            }`}
          >
            <Users className="w-4 h-4 inline mr-2" />
            Stats & Activity
          </button>
          <button
            onClick={() => setViewMode('graph')}
            className={`px-4 py-2 rounded-lg border transition-colors whitespace-nowrap ${
              viewMode === 'graph'
                ? 'bg-soul-pink/20 border-soul-pink text-soul-pink'
                : 'bg-soul-dark/50 border-soul-purple/30 text-soul-teal/70 hover:border-soul-pink/50'
            }`}
          >
            <Network className="w-4 h-4 inline mr-2" />
            Network Graph
          </button>
          <button
            onClick={() => setViewMode('recommendations')}
            className={`px-4 py-2 rounded-lg border transition-colors whitespace-nowrap ${
              viewMode === 'recommendations'
                ? 'bg-soul-pink/20 border-soul-pink text-soul-pink'
                : 'bg-soul-dark/50 border-soul-purple/30 text-soul-teal/70 hover:border-soul-pink/50'
            }`}
          >
            <Lightbulb className="w-4 h-4 inline mr-2" />
            Recommendations
          </button>
          <button
            onClick={() => setViewMode('paths')}
            className={`px-4 py-2 rounded-lg border transition-colors whitespace-nowrap ${
              viewMode === 'paths'
                ? 'bg-soul-pink/20 border-soul-pink text-soul-pink'
                : 'bg-soul-dark/50 border-soul-purple/30 text-soul-teal/70 hover:border-soul-pink/50'
            }`}
          >
            <GitBranch className="w-4 h-4 inline mr-2" />
            Trust Paths
          </button>
        </div>

        {viewMode === 'stats' && (
          <>
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="soul-card p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-soul-pink/20 flex items-center justify-center">
                    <Heart className="w-5 h-5 text-soul-pink" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{trustStats.trustedBy.length}</div>
                    <div className="text-xs text-soul-teal/70">Trusted By</div>
                  </div>
                </div>
              </div>

              <div className="soul-card p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-soul-teal/20 flex items-center justify-center">
                    <Users className="w-5 h-5 text-soul-teal" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{trustStats.trusting.length}</div>
                    <div className="text-xs text-soul-teal/70">Trusting</div>
                  </div>
                </div>
              </div>

              <div className="soul-card p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-soul-purple/20 flex items-center justify-center">
                    <Network className="w-5 h-5 text-soul-purple" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{trustStats.mutualTrust.length}</div>
                    <div className="text-xs text-soul-teal/70">Mutual Trust</div>
                  </div>
                </div>
              </div>

              <div className="soul-card p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-yellow-500" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{trustStats.trustInfluence}</div>
                    <div className="text-xs text-soul-teal/70">Trust Influence</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="soul-card p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-soul-pink" />
                  Trusted By ({trustStats.trustedBy.length})
                </h3>
                {trustStats.trustedBy.length === 0 ? (
                  <p className="text-soul-teal/60 text-center py-8">No souls trust this soul yet</p>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {trustStats.trustedBy.map(soul => (
                      <button
                        key={soul.id}
                        onClick={() => onSelectSoul(soul)}
                        className="w-full p-4 rounded-lg border border-soul-purple/30 bg-soul-dark/30 hover:border-soul-pink/50 hover:bg-soul-dark/50 transition-all text-left"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-soul-purple to-soul-pink flex items-center justify-center text-xl flex-shrink-0">
                            {soul.avatar}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-white truncate">{soul.name}</div>
                            <div className="text-sm text-soul-teal/60">Trust Score: {soul.trustScore}</div>
                          </div>
                          {trustStats.mutualTrust.some(m => m.id === soul.id) && (
                            <div className="px-2 py-1 rounded-full bg-soul-pink/20 text-soul-pink text-xs">
                              Mutual
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="soul-card p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-soul-teal" />
                  Trusting ({trustStats.trusting.length})
                </h3>
                {trustStats.trusting.length === 0 ? (
                  <p className="text-soul-teal/60 text-center py-8">This soul hasn't trusted anyone yet</p>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {trustStats.trusting.map(soul => (
                      <button
                        key={soul.id}
                        onClick={() => onSelectSoul(soul)}
                        className="w-full p-4 rounded-lg border border-soul-purple/30 bg-soul-dark/30 hover:border-soul-teal/50 hover:bg-soul-dark/50 transition-all text-left"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-soul-teal to-soul-purple flex items-center justify-center text-xl flex-shrink-0">
                            {soul.avatar}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-white truncate">{soul.name}</div>
                            <div className="text-sm text-soul-teal/60">Trust Score: {soul.trustScore}</div>
                          </div>
                          {trustStats.mutualTrust.some(m => m.id === soul.id) && (
                            <div className="px-2 py-1 rounded-full bg-soul-teal/20 text-soul-teal text-xs">
                              Mutual
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="soul-card p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-yellow-500" />
                Recent Trust Activity
              </h3>
              {recentActivity.length === 0 ? (
                <p className="text-soul-teal/60 text-center py-8">No trust activity yet</p>
              ) : (
                <div className="space-y-2">
                  {recentActivity.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-3 rounded-lg bg-soul-dark/30 border border-soul-purple/20"
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        activity.type === 'received'
                          ? 'bg-soul-pink/20'
                          : 'bg-soul-teal/20'
                      }`}>
                        <Heart className={`w-4 h-4 ${
                          activity.type === 'received'
                            ? 'text-soul-pink'
                            : 'text-soul-teal'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <button
                          onClick={() => onSelectSoul(activity.soul)}
                          className="font-semibold text-white hover:text-soul-pink transition-colors"
                        >
                          {activity.soul.name}
                        </button>
                        <span className="text-soul-teal/70 text-sm">
                          {activity.type === 'received' ? ' trusted you' : ' was trusted by you'}
                        </span>
                      </div>
                      <div className="text-xs text-soul-teal/50">
                        {activity.timestamp.toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {viewMode === 'graph' && (
          <div className="soul-card p-6" style={{ height: '600px' }}>
            <NetworkGraphVisualization
              currentSoul={currentSoul}
              allSouls={allSouls}
              onSelectSoul={onSelectSoul}
            />
          </div>
        )}

        {viewMode === 'recommendations' && (
          <div className="soul-card p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              Recommended Souls to Trust
            </h3>
            {recommendations.length === 0 ? (
              <p className="text-soul-teal/60 text-center py-8">No recommendations available</p>
            ) : (
              <div className="space-y-4">
                {recommendations.map((rec) => (
                  <div
                    key={rec.soul.id}
                    className="p-4 rounded-lg border border-soul-purple/30 bg-soul-dark/30"
                  >
                    <div className="flex items-start gap-4">
                      <button
                        onClick={() => onSelectSoul(rec.soul)}
                        className="w-16 h-16 rounded-full bg-gradient-to-br from-soul-purple to-soul-pink flex items-center justify-center text-2xl flex-shrink-0 hover:scale-110 transition-transform"
                      >
                        {rec.soul.avatar}
                      </button>
                      <div className="flex-1">
                        <button
                          onClick={() => onSelectSoul(rec.soul)}
                          className="font-semibold text-white text-lg hover:text-soul-pink transition-colors"
                        >
                          {rec.soul.name}
                        </button>
                        <div className="flex items-center gap-2 mb-2">
                          <Target className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm text-yellow-500">Match Score: {rec.score}</span>
                        </div>
                        <ul className="space-y-1">
                          {rec.reasons.map((reason, idx) => (
                            <li key={idx} className="text-sm text-soul-teal/70 flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-soul-teal/50" />
                              {reason}
                            </li>
                          ))}
                        </ul>
                      </div>
                      {onTrustSoul && (
                        <button
                          onClick={() => handleTrustRecommendation(rec.soul.id)}
                          className="px-4 py-2 rounded-lg bg-soul-pink/20 text-soul-pink border border-soul-pink/30 hover:bg-soul-pink/30 transition-colors flex items-center gap-2"
                        >
                          <Heart className="w-4 h-4" />
                          Trust
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {viewMode === 'paths' && (
          <div className="space-y-6">
            <div className="soul-card p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <GitBranch className="w-5 h-5 text-soul-teal" />
                Find Trust Path
              </h3>
              <p className="text-soul-teal/70 mb-4">
                Select a soul to find the shortest trust path from {currentSoul.name}
              </p>
              <div className="grid md:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
                {allSouls
                  .filter(s => s.id !== currentSoul.id)
                  .map(soul => (
                    <button
                      key={soul.id}
                      onClick={() => setSelectedPathSoul(soul)}
                      className={`p-3 rounded-lg border transition-all text-left ${
                        selectedPathSoul?.id === soul.id
                          ? 'border-soul-pink bg-soul-pink/20'
                          : 'border-soul-purple/30 bg-soul-dark/30 hover:border-soul-teal/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-soul-purple to-soul-teal flex items-center justify-center text-lg flex-shrink-0">
                          {soul.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-white truncate text-sm">{soul.name}</div>
                        </div>
                      </div>
                    </button>
                  ))}
              </div>
            </div>

            {selectedPathSoul && (
              <div className="soul-card p-6">
                <h3 className="text-xl font-bold text-white mb-4">
                  Trust Path: {currentSoul.name} → {selectedPathSoul.name}
                </h3>
                {pathInfo ? (
                  <>
                    <div className="mb-4 p-3 rounded-lg bg-soul-teal/10 border border-soul-teal/30">
                      <p className="text-soul-teal">
                        <strong>{pathInfo.degrees}</strong> {pathInfo.degrees === 1 ? 'degree' : 'degrees'} of separation
                      </p>
                    </div>
                    <div className="flex items-center gap-3 overflow-x-auto pb-4">
                      {pathInfo.souls.map((soul, index) => (
                        <div key={soul.id} className="flex items-center gap-3 flex-shrink-0">
                          <button
                            onClick={() => onSelectSoul(soul)}
                            className="flex flex-col items-center gap-2 hover:scale-110 transition-transform"
                          >
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-soul-purple to-soul-pink flex items-center justify-center text-2xl">
                              {soul.avatar}
                            </div>
                            <span className="text-sm text-white text-center max-w-[100px] truncate">
                              {soul.name}
                            </span>
                          </button>
                          {index < pathInfo.souls.length - 1 && (
                            <div className="text-soul-teal text-2xl">→</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="text-soul-teal/60 text-center py-8">
                    No trust path found between these souls
                  </p>
                )}
              </div>
            )}

            <div className="soul-card p-6">
              <h3 className="text-xl font-bold text-white mb-4">
                Nearby Connections (Within 3 Degrees)
              </h3>
              {nearbyConnections.length === 0 ? (
                <p className="text-soul-teal/60 text-center py-8">No connections within 3 degrees</p>
              ) : (
                <div className="space-y-2">
                  {nearbyConnections.map(({ soul, degrees }) => (
                    <button
                      key={soul.id}
                      onClick={() => onSelectSoul(soul)}
                      className="w-full p-4 rounded-lg border border-soul-purple/30 bg-soul-dark/30 hover:border-soul-teal/50 hover:bg-soul-dark/50 transition-all text-left flex items-center gap-4"
                    >
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-soul-purple to-soul-teal flex items-center justify-center text-xl flex-shrink-0">
                        {soul.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-white">{soul.name}</div>
                        <div className="text-sm text-soul-teal/60">Trust Score: {soul.trustScore}</div>
                      </div>
                      <div className="px-3 py-1 rounded-full bg-soul-purple/20 text-soul-purple text-sm">
                        {degrees} {degrees === 1 ? 'degree' : 'degrees'}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
