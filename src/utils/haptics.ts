/**
 * Haptic feedback utility using Vibration API with safe fallback
 */

let hapticsEnabled = true;

export const setHapticsEnabled = (val: boolean) => {
  hapticsEnabled = val;
};

export const hapticTick = () => {
  if (!hapticsEnabled || typeof window === 'undefined' || !navigator.vibrate) return;
  try {
    navigator.vibrate(10);
  } catch {
    // ignore
  }
};

export const hapticSuccess = () => {
  if (!hapticsEnabled || typeof window === 'undefined' || !navigator.vibrate) return;
  try {
    navigator.vibrate([15, 40, 25]);
  } catch {
    // ignore
  }
};

export const hapticWarning = () => {
  if (!hapticsEnabled || typeof window === 'undefined' || !navigator.vibrate) return;
  try {
    navigator.vibrate([50, 60, 50, 60, 50]);
  } catch {
    // ignore
  }
};

export const hapticLevelUp = () => {
  if (!hapticsEnabled || typeof window === 'undefined' || !navigator.vibrate) return;
  try {
    navigator.vibrate([30, 50, 40, 50, 80]);
  } catch {
    // ignore
  }
};
