/**
 * Utilidad global para gestionar los jugadores de la junta en localStorage.
 */

const STORAGE_KEY = 'juntapp_party_players';

export function getPlayers(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

export function setPlayers(players: string[]): void {
  if (typeof window === 'undefined') return;
  const cleaned = players
    .map(p => p.trim())
    .filter(p => p.length > 0);
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
  
  // Notificar a toda la ventana / componentes que los jugadores cambiaron
  window.dispatchEvent(new CustomEvent('party-players-updated', {
    detail: { players: cleaned }
  }));
}

export function addPlayer(name: string): string[] {
  const current = getPlayers();
  const trimmed = name.trim();
  if (!trimmed) return current;
  
  // Evitar duplicados exactos insensibles a mayúsculas
  if (current.some(p => p.toLowerCase() === trimmed.toLowerCase())) {
    return current;
  }
  
  const updated = [...current, trimmed];
  setPlayers(updated);
  return updated;
}

export function removePlayer(index: number): string[] {
  const current = getPlayers();
  if (index < 0 || index >= current.length) return current;
  
  const updated = current.filter((_, i) => i !== index);
  setPlayers(updated);
  return updated;
}

export function clearPlayers(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new CustomEvent('party-players-updated', {
    detail: { players: [] }
  }));
}

export function onPlayersChange(callback: (players: string[]) => void): () => void {
  if (typeof window === 'undefined') return () => {};
  
  const handler = (e: Event) => {
    const custom = e as CustomEvent<{ players: string[] }>;
    callback(custom.detail?.players || getPlayers());
  };
  
  window.addEventListener('party-players-updated', handler);
  // También escuchar cambios de localStorage entre pestañas
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY) {
      callback(getPlayers());
    }
  });
  
  return () => {
    window.removeEventListener('party-players-updated', handler);
  };
}
