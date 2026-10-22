let wakeLock: any = null;

export async function requestWakeLock() {
  if (typeof window !== 'undefined' && 'wakeLock' in navigator) {
    try {
      wakeLock = await (navigator as any).wakeLock.request('screen');
      wakeLock.addEventListener('release', () => {
        wakeLock = null;
      });
      return true;
    } catch (err) {
      // Puede fallar si la batería es muy baja o no tiene permiso
      return false;
    }
  }
  return false;
}

export async function releaseWakeLock() {
  if (wakeLock) {
    try {
      await wakeLock.release();
    } catch (e) {}
    wakeLock = null;
  }
}

/**
 * Mantiene la pantalla encendida automáticamente mientras la pestaña esté activa.
 */
export function autoWakeLock() {
  if (typeof window === 'undefined') return;

  requestWakeLock();

  document.addEventListener('visibilitychange', async () => {
    if (document.visibilityState === 'visible') {
      await requestWakeLock();
    }
  });
}
