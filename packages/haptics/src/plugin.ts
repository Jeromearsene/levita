import type { LevitaPlugin, TiltValues } from "levita-js";
import type { HapticsOptions } from "./types.js";
import { stopVibration, triggerPreset } from "./vibration.js";

const MAX_TILT_THRESHOLD = 0.95;

const DEFAULT_FEEDBACK_EVENTS: Required<HapticsOptions>["feedbackEvents"] = {
	enter: "light",
	leave: "light",
	maxTilt: "medium",
};

/**
 * Haptic feedback plugin for Levita.
 *
 * Vibrates on discrete tilt events (enter, leave, maxTilt) on Android devices.
 * Uses the standard Vibration API (`navigator.vibrate`).
 * iOS Safari does not support this API — use {@link isHapticsSupported}
 * to conditionally enable the plugin.
 *
 * @example
 * ```ts
 * import { Levita } from 'levita-js';
 * import { haptics, isHapticsSupported } from '@levita-js/haptics';
 *
 * new Levita(el, {
 *   plugins: isHapticsSupported() ? [haptics()] : []
 * });
 * ```
 */
export const haptics = (options: HapticsOptions = {}): LevitaPlugin => {
	const feedbackEvents = {
		...DEFAULT_FEEDBACK_EVENTS,
		...options.feedbackEvents,
	};

	let atMaxTilt = false;

	return {
		name: "haptics",

		init(context) {
			const { enter, leave } = feedbackEvents;

			if (enter) {
				context.on("enter", () => triggerPreset(enter));
			}
			if (leave) {
				context.on("leave", () => triggerPreset(leave));
			}
		},

		update(values: TiltValues) {
			if (!feedbackEvents.maxTilt) return;

			const isAtMax =
				Math.abs(values.percentX) >= MAX_TILT_THRESHOLD ||
				Math.abs(values.percentY) >= MAX_TILT_THRESHOLD;

			if (isAtMax && !atMaxTilt) {
				triggerPreset(feedbackEvents.maxTilt);
				atMaxTilt = true;
			} else if (!isAtMax) {
				atMaxTilt = false;
			}
		},

		reset() {
			atMaxTilt = false;
		},

		destroy() {
			stopVibration();
		},
	};
};
