import type { Axis } from "../types.js";
import type { SensorCallback } from "./pointer.js";

interface DeviceOrientationEvt extends Event {
	beta: number | null;
	gamma: number | null;
}

export interface MotionSensorOptions {
	/** Callback receiving normalized { x, y } values */
	onMove: SensorCallback;
	/** Restrict input to a single axis, or null for both */
	axis: Axis;
	/** Minimum device angle mapped to -1 (default: -30) */
	minAngle?: number;
	/** Maximum device angle mapped to 1 (default: 30) */
	maxAngle?: number;
	/** Exponential moving average factor 0-1 (default: 0.15, lower = smoother) */
	smoothing?: number;
	/** Called once when the first valid deviceorientation event is received */
	onFirstEvent?: (() => void) | null;
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
	private onFirstEvent: (() => void) | null;
	private axis: Axis;
	private active = false;
	private permitted = false;
	private receivedEvent = false;
	private warmup = false;
	private minAngle: number;
	private maxAngle: number;
	private smoothing: number;
	private lastX = 0;
	private lastY = 0;
	private baseBeta: number | null = null;
	private baseGamma: number | null = null;

	constructor({
		onMove,
		axis,
		minAngle = -30,
		maxAngle = 30,
		smoothing = 0.15,
		onFirstEvent = null,
	}: MotionSensorOptions) {
		this.onMove = onMove;
		this.axis = axis;
		this.minAngle = minAngle;
		this.maxAngle = maxAngle;
		this.smoothing = smoothing;
		this.onFirstEvent = onFirstEvent;
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
		this.receivedEvent = false;
		this.warmup = false;
		this.baseBeta = null;
		this.baseGamma = null;
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

	/** Update the angle range at runtime. */
	setRange = (minAngle: number, maxAngle: number): void => {
		this.minAngle = minAngle;
		this.maxAngle = maxAngle;
	};

	/** Update the smoothing factor at runtime. */
	setSmoothing = (smoothing: number): void => {
		this.smoothing = smoothing;
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
		if (evt.beta === null && evt.gamma === null) return;

		// Skip first event — some Android browsers fire stale sensor data
		// that doesn't reflect the actual device position.
		if (!this.warmup) {
			this.warmup = true;
			return;
		}

		const beta = evt.beta ?? 0;
		const gamma = evt.gamma ?? 0;

		// Notify on first valid event (used for pointer→motion handoff)
		if (!this.receivedEvent) {
			this.receivedEvent = true;
			this.onFirstEvent?.();
		}

		// Calibrate: capture the first reading as the neutral position
		if (this.baseBeta === null) {
			this.baseBeta = beta;
			this.baseGamma = gamma;
		}

		// Compute tilt relative to initial device position
		const relativeBeta = beta - this.baseBeta;
		const relativeGamma = gamma - (this.baseGamma as number);

		const range = this.maxAngle - this.minAngle;
		const rawX = this.axis === "y" ? 0 : this.clamp(relativeGamma / (range / 2));
		const rawY = this.axis === "x" ? 0 : this.clamp(relativeBeta / (range / 2));

		this.lastX = this.lastX + (rawX - this.lastX) * this.smoothing;
		this.lastY = this.lastY + (rawY - this.lastY) * this.smoothing;

		this.onMove({ x: this.lastX, y: this.lastY });
	};

	/** Clamp a value to the [-1, 1] range. */
	private clamp = (value: number): number => {
		return Math.max(-1, Math.min(1, value));
	};
}
