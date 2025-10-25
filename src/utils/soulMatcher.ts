import { SoulArchetype } from '../types/soul';
import { SOUL_ARCHETYPES } from '../data/soulArchetypes';

interface MatchResult {
  archetype: SoulArchetype;
  score: number;
  matchedKeywords: string[];
}

export function matchSoulArchetypes(userPrompt: string, topN: number = 5): SoulArchetype[] {
  const normalizedPrompt = userPrompt.toLowerCase().trim();
  const words = normalizedPrompt.split(/\s+/);

  const results: MatchResult[] = SOUL_ARCHETYPES.map(archetype => {
    let score = 0;
    const matchedKeywords: string[] = [];

    archetype.keywords.forEach(keyword => {
      const keywordLower = keyword.toLowerCase();

      if (normalizedPrompt.includes(keywordLower)) {
        score += 10;
        matchedKeywords.push(keyword);
      }

      words.forEach(word => {
        if (word === keywordLower) {
          score += 5;
        } else if (word.includes(keywordLower) || keywordLower.includes(word)) {
          score += 2;
        }
      });
    });

    if (normalizedPrompt.includes(archetype.name.toLowerCase())) {
      score += 50;
    }

    return {
      archetype,
      score,
      matchedKeywords
    };
  });

  results.sort((a, b) => b.score - a.score);

  const hasMatches = results[0].score > 0;

  if (hasMatches) {
    return results.slice(0, topN).map(r => r.archetype);
  }

  const shuffled = [...SOUL_ARCHETYPES].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, topN);
}

export function getSoulArchetypeByName(name: string): SoulArchetype | undefined {
  return SOUL_ARCHETYPES.find(archetype => archetype.name === name);
}
