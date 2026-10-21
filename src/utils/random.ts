/**
 * Genera un hash a partir de un string para inicializar la semilla.
 * xmur3 - un hash simple de 32 bits.
 */
function xmur3(str: string) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = h << 13 | h >>> 19;
  }
  return function() {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return (h ^= h >>> 16) >>> 0;
  }
}

/**
 * Pseudo-Random Number Generator (PRNG) usando Mulberry32
 * Retorna un número flotante entre 0 (inclusivo) y 1 (exclusivo)
 */
export function mulberry32(a: number) {
  return function() {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}

/**
 * Inicializa el PRNG con una semilla (string) y devuelve una función que
 * al ejecutarse devuelve un número aleatorio entre 0 y 1.
 */
export function createSeededRandom(seedString: string) {
  const seed = xmur3(seedString)();
  return mulberry32(seed);
}

/**
 * Shuffle de un arreglo usando un generador aleatorio proveído.
 */
export function seededShuffle<T>(array: T[], randomFunc: () => number): T[] {
  const arr = [...array];
  let currentIndex = arr.length, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(randomFunc() * currentIndex);
    currentIndex--;
    [arr[currentIndex], arr[randomIndex]] = [arr[randomIndex], arr[currentIndex]];
  }

  return arr;
}
