import { useState } from 'react';
import SplashScreen from './components/SplashScreen';
import MintSoulScreen from './components/MintSoulScreen';
import SoulProfileScreen from './components/SoulProfileScreen';
import ExploreScreen from './components/ExploreScreen';
import { sdk } from '@farcaster/miniapp-sdk';
import Toast from './components/Toast';
import { Soul, Screen } from './types/soul';
import { generateImage } from './utils/generateImage';
import { useEffect } from 'react';


function App() {
   useEffect(() => {
        sdk.actions.ready();
    }, []);

  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [currentSoul, setCurrentSoul] = useState<Soul | null>(null);
  const [allSouls, setAllSouls] = useState<Soul[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
  };

  const handleConnect = () => {
    showToast('Wallet connected successfully!', 'success');
    setCurrentScreen('mint');
  };

  const generateSoulData = (prompt: string): Soul => {
    const avatars = ['🌟', '✨', '🔮', '💎', '🌙', '☀️', '🌸', '🦋', '🕉️', '☯️'];
    const prefixes = ['Mystic', 'Radiant', 'Ethereal', 'Cosmic', 'Sacred', 'Divine', 'Luminous', 'Transcendent'];
    const suffixes = ['Seeker', 'Wanderer', 'Sage', 'Spirit', 'Soul', 'Dreamer', 'Oracle', 'Guide'];

    const name = `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
    const avatar = avatars[Math.floor(Math.random() * avatars.length)];

    const bioTemplates = [
      `A ${prompt.toLowerCase()} soul seeking truth and connection in the digital realm. Guided by intuition and the cosmic web of trust.`,
      `Embodying ${prompt.toLowerCase()}, this essence radiates authenticity and spiritual wisdom across the metaverse.`,
      `${prompt}. A beacon of light in the blockchain, weaving threads of trust through conscious connection.`,
    ];

    return {
      id: `soul_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      name,
      bio: bioTemplates[Math.floor(Math.random() * bioTemplates.length)],
      avatar,
      trustScore: Math.floor(Math.random() * 3) + 3,
      walletAddress: `0x${Math.random().toString(16).slice(2, 42)}`,
      createdAt: new Date().toISOString(),
      trustedBy: [],
    };
  };

  const handleMint = async (prompt: string) => {
    setIsGenerating(true);

    // await new Promise(resolve => setTimeout(resolve, 2000));

    const newSoul = generateSoulData(prompt);

     try {
      const imageUrl = await generateImage(
        `${prompt}, mystical digital soul portrait, vibrant colors, fantasy art, high resolution`
      );
      newSoul.image = imageUrl;
    } catch (err) {
      console.error('AI image generation failed', err);
    }
    
    setCurrentSoul(newSoul);
    setAllSouls(prev => [...prev, newSoul]);

    setIsGenerating(false);
    showToast('Soul minted successfully!', 'success');
    setCurrentScreen('profile');
  };

  const handleTrust = () => {
    showToast('Trust link added!', 'success');
  };

  const handleTrustSoul = (soulId: string) => {
    setAllSouls(prev =>
      prev.map(soul =>
        soul.id === soulId
          ? { ...soul, trustedBy: [...soul.trustedBy, currentSoul?.id || ''], trustScore: Math.min(5, soul.trustScore + 1) }
          : soul
      )
    );
    showToast('Trust connection established!', 'success');
  };

  const handleExplore = () => {
    if (allSouls.length < 2) {
      const mockSouls: Soul[] = [
        {
          id: 'soul_1',
          name: 'Cosmic Wanderer',
          bio: 'Exploring the intersection of consciousness and technology. Building bridges between souls in the digital realm.',
          avatar: '🌟',
          trustScore: 5,
          walletAddress: `0x${Math.random().toString(16).slice(2, 42)}`,
          createdAt: new Date().toISOString(),
          trustedBy: ['soul_2', 'soul_3'],
        },
        {
          id: 'soul_2',
          name: 'Ethereal Sage',
          bio: 'A seeker of truth and wisdom in the Web3 universe. Connecting hearts through blockchain enlightenment.',
          avatar: '🔮',
          trustScore: 4,
          walletAddress: `0x${Math.random().toString(16).slice(2, 42)}`,
          createdAt: new Date().toISOString(),
          trustedBy: ['soul_1'],
        },
        {
          id: 'soul_3',
          name: 'Divine Oracle',
          bio: 'Channeling cosmic energy into decentralized networks. Spreading love and trust through authentic connection.',
          avatar: '✨',
          trustScore: 5,
          walletAddress: `0x${Math.random().toString(16).slice(2, 42)}`,
          createdAt: new Date().toISOString(),
          trustedBy: ['soul_1', 'soul_2', 'soul_4'],
        },
        {
          id: 'soul_4',
          name: 'Sacred Spirit',
          bio: 'Dancing between dimensions, weaving trust networks with intention and grace. A guardian of digital souls.',
          avatar: '🌸',
          trustScore: 4,
          walletAddress: `0x${Math.random().toString(16).slice(2, 42)}`,
          createdAt: new Date().toISOString(),
          trustedBy: ['soul_3'],
        },
      ];
      setAllSouls(prev => [...prev, ...mockSouls]);
    }
    setCurrentScreen('explore');
  };

  return (
    <>
      {currentScreen === 'splash' && <SplashScreen onConnect={handleConnect} />}
      {currentScreen === 'mint' && <MintSoulScreen onMint={handleMint} isGenerating={isGenerating} />}
      {currentScreen === 'profile' && currentSoul && (
        <SoulProfileScreen soul={currentSoul} onTrust={handleTrust} onExplore={handleExplore} />
      )}
      {currentScreen === 'explore' && currentSoul && (
        <ExploreScreen
          souls={allSouls}
          currentSoulId={currentSoul.id}
          onBack={() => setCurrentScreen('profile')}
          onTrustSoul={handleTrustSoul}
        />
      )}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}

export default App;
