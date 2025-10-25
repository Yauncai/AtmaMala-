import { supabase } from '../lib/supabase';
import { Soul } from '../types/soul';

export async function createSoul(soul: Omit<Soul, 'id' | 'trustedBy'>): Promise<Soul | null> {
  try {
    const { data, error } = await supabase
      .from('souls')
      .insert({
        name: soul.name,
        bio: soul.bio,
        avatar: soul.avatar,
        element: soul.element || null,
        alignment: soul.alignment || null,
        rarity: soul.rarity || null,
        archetype: soul.archetype || null,
        karma_points: 0,
        trust_score: soul.trustScore || 0,
        wallet_address: soul.walletAddress,
        owner_id: null,
      })
      .select()
      .maybeSingle();

    if (error) {
      console.error('Error creating soul:', error);
      return null;
    }

    if (!data) return null;

    return {
      id: data.id,
      name: data.name,
      bio: data.bio,
      avatar: data.avatar,
      trustScore: data.trust_score,
      walletAddress: data.wallet_address,
      createdAt: data.created_at,
      trustedBy: [],
      archetype: data.archetype || undefined,
      element: data.element || undefined,
      alignment: data.alignment || undefined,
      rarity: data.rarity || undefined,
    };
  } catch (err) {
    console.error('Exception creating soul:', err);
    return null;
  }
}

export async function getAllSouls(): Promise<Soul[]> {
  try {
    const { data, error } = await supabase
      .from('souls')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching souls:', error);
      return [];
    }

    if (!data) return [];

    const trustData = await supabase
      .from('trust_relationships')
      .select('to_soul_id, from_soul_id');

    const trustMap = new Map<string, string[]>();
    if (trustData.data) {
      trustData.data.forEach(rel => {
        const existing = trustMap.get(rel.to_soul_id) || [];
        existing.push(rel.from_soul_id);
        trustMap.set(rel.to_soul_id, existing);
      });
    }

    return data.map(soul => ({
      id: soul.id,
      name: soul.name,
      bio: soul.bio,
      avatar: soul.avatar,
      trustScore: soul.trust_score,
      walletAddress: soul.wallet_address,
      createdAt: soul.created_at,
      trustedBy: trustMap.get(soul.id) || [],
      archetype: soul.archetype || undefined,
      element: soul.element || undefined,
      alignment: soul.alignment || undefined,
      rarity: soul.rarity || undefined,
    }));
  } catch (err) {
    console.error('Exception fetching souls:', err);
    return [];
  }
}

export async function addTrustRelationship(fromSoulId: string, toSoulId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('trust_relationships')
      .insert({
        from_soul_id: fromSoulId,
        to_soul_id: toSoulId,
        from_user_id: '00000000-0000-0000-0000-000000000000',
        to_user_id: '00000000-0000-0000-0000-000000000000',
      });

    if (error) {
      console.error('Error adding trust relationship:', error);
      return false;
    }

    const { error: updateError } = await supabase
      .from('souls')
      .update({
        trust_score: supabase.rpc('increment', { x: 1 })
      })
      .eq('id', toSoulId);

    if (updateError) {
      console.error('Error updating trust score:', updateError);
    }

    return true;
  } catch (err) {
    console.error('Exception adding trust relationship:', err);
    return false;
  }
}
