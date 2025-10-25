import { Soul } from '../types/soul';

export interface TrustPath {
  souls: Soul[];
  degrees: number;
}

export function findTrustPath(fromSoul: Soul, toSoul: Soul, allSouls: Soul[]): TrustPath | null {
  if (fromSoul.id === toSoul.id) {
    return { souls: [fromSoul], degrees: 0 };
  }

  const visited = new Set<string>();
  const queue: { soul: Soul; path: Soul[] }[] = [{ soul: fromSoul, path: [fromSoul] }];
  visited.add(fromSoul.id);

  while (queue.length > 0) {
    const { soul, path } = queue.shift()!;

    const trustedSoulIds = allSouls
      .filter(s => s.trustedBy.includes(soul.id))
      .map(s => s.id);

    for (const trustedId of trustedSoulIds) {
      if (visited.has(trustedId)) continue;

      const trustedSoul = allSouls.find(s => s.id === trustedId);
      if (!trustedSoul) continue;

      const newPath = [...path, trustedSoul];

      if (trustedId === toSoul.id) {
        return {
          souls: newPath,
          degrees: newPath.length - 1
        };
      }

      visited.add(trustedId);
      queue.push({ soul: trustedSoul, path: newPath });
    }
  }

  return null;
}

export function findAllPathsWithinDegrees(
  fromSoul: Soul,
  allSouls: Soul[],
  maxDegrees: number
): Map<string, TrustPath> {
  const paths = new Map<string, TrustPath>();
  const visited = new Set<string>();
  const queue: { soul: Soul; path: Soul[]; degree: number }[] = [
    { soul: fromSoul, path: [fromSoul], degree: 0 }
  ];

  visited.add(fromSoul.id);

  while (queue.length > 0) {
    const { soul, path, degree } = queue.shift()!;

    if (degree >= maxDegrees) continue;

    const trustedSoulIds = allSouls
      .filter(s => s.trustedBy.includes(soul.id))
      .map(s => s.id);

    for (const trustedId of trustedSoulIds) {
      if (visited.has(trustedId)) continue;

      const trustedSoul = allSouls.find(s => s.id === trustedId);
      if (!trustedSoul) continue;

      const newPath = [...path, trustedSoul];
      const newDegree = degree + 1;

      paths.set(trustedId, {
        souls: newPath,
        degrees: newDegree
      });

      visited.add(trustedId);
      queue.push({ soul: trustedSoul, path: newPath, degree: newDegree });
    }
  }

  return paths;
}

export function calculateDegreesOfSeparation(fromSoul: Soul, toSoul: Soul, allSouls: Soul[]): number {
  const path = findTrustPath(fromSoul, toSoul, allSouls);
  return path ? path.degrees : -1;
}
