export function vibrate(pattern: number | number[]): void {
  if ('vibrate' in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch (err) {
      // Silently fail if vibration is not supported
    }
  }
}

export function vibrateSuccess(): void {
  vibrate([100, 50, 100]);
}

export function vibrateMalaComplete(): void {
  vibrate([200, 100, 200, 100, 200]);
}
