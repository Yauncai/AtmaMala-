export interface Soul {
  id: string;
  name: string;
  bio: string;
  avatar: string;
  image?: string;
  trustScore: number;
  walletAddress: string;
  createdAt: string;
  trustedBy: string[];
}

export interface TrustLink {
  fromSoulId: string;
  toSoulId: string;
  timestamp: string;
}

export type Screen = 'splash' | 'mint' | 'profile' | 'explore';
