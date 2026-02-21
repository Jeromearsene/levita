import type { Axis } from "../types.js";
import type { SensorCallback } from "./pointer.js";

interface DeviceOrientationEvt extends Event {
	beta: number | null;
	gamma: number | null;
}

/**
 * Reads device orientation (accelerometer/gyroscope) and normalizes
 * the tilt angles to a [-1, 1] range.
 *
 * Handles iOS 13+ permission flow via async `requestPermission()`.
 * On Android, permission is granted automatically.
 *
 * Uses exponential moving average for smoothing raw sensor data.
 */
export class MotionSensor {
	private onMove: SensorCallback;
	private axis: Axis;
	private active = false;
	private permitted = false;
	private minAngle: number;
	private maxAngle: number;
	private smoothing: number;
	private lastX = 0;
	private lastY = 0;

	/**
	 * @param onMove - Callback receiving normalized { x, y } values
	 * @param axis - Restrict input to a single axis, or null for both
	 * @param minAngle - Minimum device angle mapped to -1 (default: -45)
	 * @param maxAngle - Maximum device angle mapped to 1 (default: 45)
	 * @param smoothing - Exponential moving average factor 0-1 (default: 0.15, lower = smoother)
	 */
	constructor(onMove: SensorCallback, axis: Axis, minAngle = -45, maxAngle = 45, smoothing = 0.15) {
		this.onMove = onMove;
		this.axis = axis;
		this.minAngle = minAngle;
		this.maxAngle = maxAngle;
		this.smoothing = smoothing;
	}

	/** Check if the DeviceOrientationEvent API is available in this environment. */
	static isSupported = (): boolean => {
		return typeof window !== "undefined" && "DeviceOrientationEvent" in window;
	};

	/**
	 * Check if explicit permission is required (iOS 13+).
	 * On Android and desktop, this returns false.
	 */
	static needsPermission = (): boolean => {
		return (
			typeof DeviceOrientationEvent !== "undefined" && "requestPermission" in DeviceOrientationEvent
		);
	};

	/**
	 * Request permission to access device orientation.
	 * On Android, resolves immediately to true.
	 * On iOS 13+, triggers the native permission dialog.
	 * Must be called from a user gesture on iOS.
	 *
	 * @returns Whether permission was granted
	 */
	requestPermission = async (): Promise<boolean> => {
		if (!MotionSensor.isSupported()) return false;

		if (!MotionSensor.needsPermission()) {
			this.permitted = true;
			return true;
		}

		try {
			const DOE = DeviceOrientationEvent as unknown as {
				requestPermission: () => Promise<string>;
			};
			const result = await DOE.requestPermission();
			this.permitted = result === "granted";
			return this.permitted;
		} catch {
			this.permitted = false;
			return false;
		}
	};

	/** Start listening to deviceorientation events. Requires prior permission. */
	start = (): void => {
		if (this.active || !this.permitted) return;
		this.active = true;
		window.addEventListener("deviceorientation", this.handleOrientation);
	};

	/** Stop listening and remove the deviceorientation event listener. */
	stop = (): void => {
		if (!this.active) return;
		this.active = false;
		window.removeEventListener("deviceorientation", this.handleOrientation);
	};

	/** Update the axis lock at runtime. */
	setAxis = (axis: Axis): void => {
		this.axis = axis;
	};

	/**
	 * Normalize device orientation angles to [-1, 1] and apply
	 * exponential moving average smoothing.
	 *
	 * beta = X-axis rotation [-180, 180] (front-back tilt)
	 * gamma = Y-axis rotation [-90, 90] (left-right tilt)
	 */
	private handleOrientation = (e: Event): void => {
		const evt = e as DeviceOrientationEvt;
		const beta = evt.beta ?? 0;
		const gamma = evt.gamma ?? 0;

		const range = this.maxAngle - this.minAngle;
		const rawX = this.axis === "y" ? 0 : this.clamp(((gamma - this.minAngle) / range) * 2 - 1);
		const rawY = this.axis === "x" ? 0 : this.clamp(((beta - this.minAngle) / range) * 2 - 1);

		this.lastX = this.lastX + (rawX - this.lastX) * this.smoothing;
		this.lastY = this.lastY + (rawY - this.lastY) * this.smoothing;

		this.onMove({ x: this.lastX, y: this.lastY });
	};

	/** Clamp a value to the [-1, 1] range. */
	private clamp = (value: number): number => {
		return Math.max(-1, Math.min(1, value));
	};
}
