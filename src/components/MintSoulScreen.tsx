import { useState, useEffect } from 'react';
import { Wand2, User, Sparkles } from 'lucide-react';
import FloatingParticles from './FloatingParticles';
import { matchSoulArchetypes } from '../utils/soulMatcher';
import { SoulArchetype } from '../types/soul';

interface MintSoulScreenProps {
  onMint: (prompt: string, archetype?: SoulArchetype) => void;
  isGenerating: boolean;
}

export default function MintSoulScreen({ onMint, isGenerating }: MintSoulScreenProps) {
  const [prompt, setPrompt] = useState('');
  const [suggestions, setSuggestions] = useState<SoulArchetype[]>([]);
  const [selectedArchetype, setSelectedArchetype] = useState<SoulArchetype | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (prompt.trim().length > 10) {
      const matches = matchSoulArchetypes(prompt, 5);
      setSuggestions(matches);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
      setSelectedArchetype(null);
    }
  }, [prompt]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && selectedArchetype) {
      onMint(prompt, selectedArchetype);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
      <FloatingParticles />

      <div className="max-w-2xl w-full z-10 space-y-8">
        <div className="text-center space-y-4">
          <div className="relative inline-block">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-soul-purple/30 to-soul-pink/30 backdrop-blur-sm flex items-center justify-center relative">
              <div className="absolute inset-0 rounded-full border-2 border-soul-teal/30 animate-pulse-glow" />
              <User className="w-16 h-16 text-soul-teal/50" strokeWidth={1.5} />
            </div>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-soul-pink to-soul-teal bg-clip-text text-transparent">
            Mint Your Soul
          </h2>
          <p className="text-soul-teal/70 text-lg">
            Describe yourself briefly and let AI generate your digital essence
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="soul-card p-8 space-y-4">
            <label htmlFor="prompt" className="block text-sm font-medium text-soul-teal/80">
              Tell us about yourself...
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="I'm a creative developer passionate about blockchain and spiritual growth..."
              className="w-full h-32 bg-soul-dark/50 border border-soul-purple/30 rounded-xl px-4 py-3 text-white placeholder-soul-purple/40 focus:outline-none focus:border-soul-pink/50 focus:ring-2 focus:ring-soul-pink/20 transition-all resize-none"
              disabled={isGenerating}
            />
          </div>

          {showSuggestions && suggestions.length > 0 && (
            <div className="soul-card p-6 space-y-4">
              <div className="flex items-center gap-2 text-soul-teal/80">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">Suggested Soul Archetypes</span>
              </div>
              <div className="grid gap-3">
                {suggestions.map((archetype, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSelectedArchetype(archetype)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      selectedArchetype?.name === archetype.name
                        ? 'border-soul-pink bg-soul-pink/10'
                        : 'border-soul-purple/30 bg-soul-dark/30 hover:border-soul-purple/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-soul-purple/30 to-soul-pink/30 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-6 h-6 text-soul-teal" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white mb-1">{archetype.name}</h3>
                        <p className="text-sm text-soul-teal/60 line-clamp-2">{archetype.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={!prompt.trim() || !selectedArchetype || isGenerating}
            className="glow-button w-full text-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <Wand2 className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
            {isGenerating ? 'Minting Soul...' : selectedArchetype ? `Mint ${selectedArchetype.name}` : 'Select a Soul Archetype'}
          </button>
        </form>
      </div>
    </div>
  );
}
