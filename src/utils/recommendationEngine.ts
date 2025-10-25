import { Soul } from '../types/soul';

export interface SoulRecommendation {
  soul: Soul;
  score: number;
  reasons: string[];
}

export function getRecommendedSouls(
  currentSoul: Soul,
  allSouls: Soul[],
  limit: number = 5
): SoulRecommendation[] {
  const alreadyTrusted = new Set(
    allSouls.filter(s => s.trustedBy.includes(currentSoul.id)).map(s => s.id)
  );

  const recommendations = allSouls
    .filter(soul => {
      return (
        soul.id !== currentSoul.id &&
        !alreadyTrusted.has(soul.id)
      );
    })
    .map(soul => {
      let score = 0;
      const reasons: string[] = [];

      const mutualConnections = allSouls.filter(s => {
        const trustsCurrent = s.trustedBy.includes(currentSoul.id);
        const trustsCandidate = s.trustedBy.includes(soul.id);
        return trustsCurrent && trustsCandidate;
      });

      if (mutualConnections.length > 0) {
        score += mutualConnections.length * 10;
        reasons.push(
          `${mutualConnections.length} mutual ${mutualConnections.length === 1 ? 'connection' : 'connections'}`
        );
      }

      const trustedByYourNetwork = allSouls.filter(s => {
        const youTrustThem = s.trustedBy.includes(currentSoul.id);
        const theyTrustCandidate = soul.trustedBy.includes(s.id);
        return youTrustThem && theyTrustCandidate;
      });

      if (trustedByYourNetwork.length > 0) {
        score += trustedByYourNetwork.length * 8;
        reasons.push(`Trusted by ${trustedByYourNetwork.length} souls you trust`);
      }

      if (currentSoul.element && soul.element === currentSoul.element) {
        score += 5;
        reasons.push(`Same element (${soul.element})`);
      }

      if (currentSoul.alignment && soul.alignment === currentSoul.alignment) {
        score += 5;
        reasons.push(`Same alignment (${soul.alignment})`);
      }

      if (soul.rarity === 'legendary') {
        score += 3;
        reasons.push('Legendary soul');
      } else if (soul.rarity === 'epic') {
        score += 2;
        reasons.push('Epic soul');
      }

      if (soul.trustScore >= 4) {
        score += soul.trustScore;
        reasons.push(`High trust score (${soul.trustScore})`);
      }

      const trustsYou = currentSoul.trustedBy.includes(soul.id);
      if (trustsYou) {
        score += 15;
        reasons.push('Already trusts you');
      }

      if (reasons.length === 0) {
        reasons.push('New soul to discover');
      }

      return { soul, score, reasons };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return recommendations;
}

export function findSimilarSouls(
  referenceSoul: Soul,
  allSouls: Soul[],
  limit: number = 5
): Soul[] {
  return allSouls
    .filter(soul => soul.id !== referenceSoul.id)
    .map(soul => {
      let similarity = 0;

      if (referenceSoul.element && soul.element === referenceSoul.element) {
        similarity += 3;
      }

      if (referenceSoul.alignment && soul.alignment === referenceSoul.alignment) {
        similarity += 3;
      }

      if (referenceSoul.rarity && soul.rarity === referenceSoul.rarity) {
        similarity += 2;
      }

      const trustScoreDiff = Math.abs(referenceSoul.trustScore - soul.trustScore);
      similarity += Math.max(0, 5 - trustScoreDiff);

      return { soul, similarity };
    })
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit)
    .map(item => item.soul);
}
