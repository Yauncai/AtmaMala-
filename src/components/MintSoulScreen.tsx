import { useState } from 'react';
import { Wand2, User } from 'lucide-react';
import FloatingParticles from './FloatingParticles';

interface MintSoulScreenProps {
  onMint: (prompt: string) => void;
  isGenerating: boolean;
}

export default function MintSoulScreen({ onMint, isGenerating }: MintSoulScreenProps) {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onMint(prompt);
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

          <button
            type="submit"
            disabled={!prompt.trim() || isGenerating}
            className="glow-button w-full text-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <Wand2 className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
            {isGenerating ? 'Generating Soul...' : 'Generate Soul'}
          </button>
        </form>
      </div>
    </div>
  );
}
