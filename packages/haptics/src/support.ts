/**
 * Check if the current device supports haptic feedback via the Vibration API.
 *
 * Returns `true` on Android / Chrome where `navigator.vibrate` is available.
 * iOS Safari does not support the Vibration API (WebKit opposes it).
 */
export const isHapticsSupported = (): boolean =>
	typeof navigator !== "undefined" && typeof navigator.vibrate === "function";
