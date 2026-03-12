import type { HAPTIC_PRESETS } from "./constants.js";

export type HapticPreset = (typeof HAPTIC_PRESETS)[number];

export interface HapticFeedbackEvents {
	/** Vibrate on pointer enter. Default: 'light' */
	enter?: HapticPreset | false;
	/** Vibrate on pointer leave. Default: 'light' */
	leave?: HapticPreset | false;
	/** Vibrate when max tilt angle is reached. Default: 'medium' */
	maxTilt?: HapticPreset | false;
}

export interface HapticsOptions {
	/** Configure which events trigger feedback. */
	feedbackEvents?: HapticFeedbackEvents;
}
