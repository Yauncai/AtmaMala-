import { useState, useEffect } from 'react';
import SplashScreen from './components/SplashScreen';
import MintSoulScreen from './components/MintSoulScreen';
import SoulProfileScreen from './components/SoulProfileScreen';
import ExploreScreen from './components/ExploreScreen';
import MyGalleryScreen from './components/MyGalleryScreen';
import Toast from './components/Toast';
import { Soul, Screen, SoulArchetype } from './types/soul';
import { createSoul, getAllSouls, addTrustRelationship } from './services/soulService';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [currentSoul, setCurrentSoul] = useState<Soul | null>(null);
  const [allSouls, setAllSouls] = useState<Soul[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  useEffect(() => {
    loadSouls();
  }, []);

  const loadSouls = async () => {
    setIsLoading(true);
    const souls = await getAllSouls();
    setAllSouls(souls);
    setIsLoading(false);
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
  };

  const handleConnect = async () => {
    showToast('Wallet connected successfully!', 'success');
    await loadSouls();
    if (allSouls.length > 0) {
      setCurrentScreen('gallery');
    } else {
      setCurrentScreen('mint');
    }
  };

  const generateSoulData = (prompt: string, archetype?: SoulArchetype): Soul => {
    const avatars = ['🌟', '✨', '🔮', '💎', '🌙', '☀️', '🌸', '🦋', '🕉️', '☯️'];

    const avatar = avatars[Math.floor(Math.random() * avatars.length)];

    return {
      id: `soul_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      name: archetype ? archetype.name : `Soul #${Date.now()}`,
      bio: archetype ? archetype.description : prompt,
      avatar: archetype ? archetype.image : avatar,
      trustScore: 0,
      walletAddress: `0x${Math.random().toString(16).slice(2, 42)}`,
      createdAt: new Date().toISOString(),
      trustedBy: [],
      archetype: archetype?.name,
      element: archetype?.element,
      alignment: archetype?.alignment,
      rarity: archetype?.rarity,
    };
  };

  const handleMint = async (prompt: string, archetype?: SoulArchetype) => {
    setIsGenerating(true);

    await new Promise(resolve => setTimeout(resolve, 2000));

    const soulData = generateSoulData(prompt, archetype);
    const createdSoul = await createSoul(soulData);

    if (createdSoul) {
      setCurrentSoul(createdSoul);
      setAllSouls(prev => [...prev, createdSoul]);
      showToast(`${archetype?.name || 'Soul'} minted successfully!`, 'success');
      setCurrentScreen('gallery');
    } else {
      showToast('Failed to mint soul. Please try again.', 'error');
    }

    setIsGenerating(false);
  };

  const handleTrust = () => {
    showToast('Trust link added!', 'success');
  };

  const handleTrustSoul = async (soulId: string) => {
    if (!currentSoul) return;

    const success = await addTrustRelationship(currentSoul.id, soulId);

    if (success) {
      setAllSouls(prev =>
        prev.map(soul =>
          soul.id === soulId
            ? { ...soul, trustedBy: [...soul.trustedBy, currentSoul.id], trustScore: soul.trustScore + 1 }
            : soul
        )
      );
      showToast('Trust connection established!', 'success');
    } else {
      showToast('Failed to establish trust. Please try again.', 'error');
    }
  };

  const handleExplore = async () => {
    await loadSouls();
    setCurrentScreen('explore');
  };

  return (
    <>
      {currentScreen === 'splash' && <SplashScreen onConnect={handleConnect} />}
      {currentScreen === 'mint' && <MintSoulScreen onMint={handleMint} isGenerating={isGenerating} />}
      {currentScreen === 'gallery' && (
        <MyGalleryScreen
          souls={allSouls}
          onSelectSoul={(soul) => {
            setCurrentSoul(soul);
            setCurrentScreen('profile');
          }}
          onMintNew={() => setCurrentScreen('mint')}
        />
      )}
      {currentScreen === 'profile' && currentSoul && (
        <SoulProfileScreen
          soul={currentSoul}
          onTrust={handleTrust}
          onExplore={handleExplore}
          onViewNetwork={handleViewNetwork}
          onBack={() => setCurrentScreen('gallery')}
          showBackButton={true}
        />
      )}
      {currentScreen === 'network' && currentSoul && (
        <TrustNetworkScreen
          currentSoul={currentSoul}
          allSouls={allSouls}
          onBack={() => setCurrentScreen('profile')}
          onSelectSoul={(soul) => {
            setCurrentSoul(soul);
            setCurrentScreen('profile');
          }}
          onTrustSoul={handleTrustSoul}
        />
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
