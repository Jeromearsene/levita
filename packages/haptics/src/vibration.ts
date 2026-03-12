import type { HapticPreset } from "./types.js";

/** Vibration duration in milliseconds for each preset. */
const PRESETS: Record<HapticPreset, number> = {
	light: 15,
	medium: 25,
	heavy: 35,
};

export const triggerPreset = (preset: HapticPreset): void => {
	navigator.vibrate(PRESETS[preset]);
};

export const stopVibration = (): void => {
	navigator.vibrate(0);
};
