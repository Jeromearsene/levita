import type { HapticPreset } from "./types.js";

/** Vibration duration in milliseconds for each preset. */
const PRESETS: Record<HapticPreset, number> = {
	light: 15,
	medium: 25,
	heavy: 35,
};

const vibrate = (pattern: number): void => {
	if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
		navigator.vibrate(pattern);
	}
};

export const triggerPreset = (preset: HapticPreset): void => {
	vibrate(PRESETS[preset]);
};

export const stopVibration = (): void => {
	vibrate(0);
};
