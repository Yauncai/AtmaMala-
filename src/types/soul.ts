export type SoulElement = 'celestial' | 'nature' | 'digital' | 'fire' | 'water' | 'shadow' | 'electric' | 'crystal' | 'solar' | 'lunar' | 'desert' | 'ether' | 'quantum' | 'sky' | 'frost' | 'neon';

export type SoulAlignment = 'guardian' | 'healer' | 'oracle' | 'wanderer' | 'warrior' | 'sage' | 'mystic';

export type SoulRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface SoulArchetype {
  name: string;
  keywords: string[];
  description: string;
  image: string;
  element?: SoulElement;
  alignment?: SoulAlignment;
  rarity?: SoulRarity;
}

export interface Soul {
  id: string;
  name: string;
  bio: string;
  avatar: string;
  trustScore: number;
  walletAddress: string;
  createdAt: string;
  trustedBy: string[];
  archetype?: string;
  element?: SoulElement;
  alignment?: SoulAlignment;
  rarity?: SoulRarity;
}

export interface TrustLink {
  fromSoulId: string;
  toSoulId: string;
  timestamp: string;
}

export type Screen = 'splash' | 'mint' | 'profile' | 'explore' | 'gallery';
