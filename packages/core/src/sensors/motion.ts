import type { Axis } from "../types.js";
import type { SensorCallback } from "./pointer.js";

interface DeviceOrientationEvt extends Event {
	beta: number | null;
	gamma: number | null;
}

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

	constructor(onMove: SensorCallback, axis: Axis, minAngle = -45, maxAngle = 45, smoothing = 0.15) {
		this.onMove = onMove;
		this.axis = axis;
		this.minAngle = minAngle;
		this.maxAngle = maxAngle;
		this.smoothing = smoothing;

		this.handleOrientation = this.handleOrientation.bind(this);
	}

	static isSupported(): boolean {
		return typeof window !== "undefined" && "DeviceOrientationEvent" in window;
	}

	static needsPermission(): boolean {
		return (
			typeof DeviceOrientationEvent !== "undefined" && "requestPermission" in DeviceOrientationEvent
		);
	}

	async requestPermission(): Promise<boolean> {
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
	}

	start(): void {
		if (this.active || !this.permitted) return;
		this.active = true;
		window.addEventListener("deviceorientation", this.handleOrientation);
	}

	stop(): void {
		if (!this.active) return;
		this.active = false;
		window.removeEventListener("deviceorientation", this.handleOrientation);
	}

	setAxis(axis: Axis): void {
		this.axis = axis;
	}

	private handleOrientation(e: Event): void {
		const evt = e as DeviceOrientationEvt;
		const beta = evt.beta ?? 0;
		const gamma = evt.gamma ?? 0;

		const range = this.maxAngle - this.minAngle;
		const rawX = this.axis === "y" ? 0 : this.clamp(((gamma - this.minAngle) / range) * 2 - 1);
		const rawY = this.axis === "x" ? 0 : this.clamp(((beta - this.minAngle) / range) * 2 - 1);

		this.lastX = this.lastX + (rawX - this.lastX) * this.smoothing;
		this.lastY = this.lastY + (rawY - this.lastY) * this.smoothing;

		this.onMove({ x: this.lastX, y: this.lastY });
	}

	private clamp(value: number): number {
		return Math.max(-1, Math.min(1, value));
	}
}
