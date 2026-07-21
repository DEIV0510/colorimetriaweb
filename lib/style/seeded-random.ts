/**
 * PRNG determinista. NUNCA se usa Math.random en la generación de la guía:
 * la pantalla, el PDF y los favoritos deben mostrar exactamente el mismo
 * conjunto para la misma persona, y los tests necesitan ser estables.
 */

/** Hash FNV-1a de 32 bits */
export function hashSeed(seed: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** mulberry32: generador rápido y de buena distribución para este uso */
export function createRandom(seed: string): () => number {
  let a = hashSeed(seed);
  return function next() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Elige un elemento de forma determinista a partir de la semilla */
export function pick<T>(items: readonly T[], seed: string): T | undefined {
  if (items.length === 0) return undefined;
  const random = createRandom(seed);
  return items[Math.floor(random() * items.length)];
}

/**
 * Elige `count` elementos distintos de forma determinista, sin repetir.
 * Devuelve menos de `count` si no hay suficientes.
 */
export function pickMany<T>(items: readonly T[], count: number, seed: string): T[] {
  if (items.length === 0 || count <= 0) return [];
  const random = createRandom(seed);
  const pool = [...items];
  const out: T[] = [];
  while (out.length < count && pool.length > 0) {
    const index = Math.floor(random() * pool.length);
    out.push(pool.splice(index, 1)[0]);
  }
  return out;
}
