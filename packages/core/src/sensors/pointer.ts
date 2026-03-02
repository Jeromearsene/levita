import type { Axis } from "../types.js";

/** Normalized sensor output with values in [-1, 1] range. */
export interface SensorOutput {
	/** Normalized X position [-1, 1] */
	x: number;
	/** Normalized Y position [-1, 1] */
	y: number;
}

/** Callback invoked when sensor detects movement. */
export type SensorCallback = (values: SensorOutput) => void;

/**
 * Tracks pointer (mouse/touch) position over an element and normalizes
 * it to a [-1, 1] range relative to the element's bounds.
 *
 * Uses PointerEvent for unified mouse + touch input.
 */
export class PointerSensor {
	private eventsEl: HTMLElement;
	private onMove: SensorCallback;
	private onEnter: (() => void) | null;
	private onLeave: (() => void) | null;
	private axis: Axis;
	private active = false;
	private rect: DOMRect | null = null;
	private isPointerDown = false;

	constructor(
		el: HTMLElement,
		onMove: SensorCallback,
		onEnter: (() => void) | null,
		onLeave: (() => void) | null,
		axis: Axis,
		eventsEl: HTMLElement | null = null,
	) {
		this.eventsEl = eventsEl ?? el;
		this.onMove = onMove;
		this.onEnter = onEnter;
		this.onLeave = onLeave;
		this.axis = axis;
	}

	/** Start listening to pointer events. */
	start = (): void => {
		if (this.active) return;
		this.active = true;
		this.eventsEl.addEventListener("pointermove", this.handlePointerMove);
		this.eventsEl.addEventListener("pointerenter", this.handlePointerEnter);
		this.eventsEl.addEventListener("pointerleave", this.handlePointerLeave);
		this.eventsEl.addEventListener("pointerdown", this.handlePointerDown);
		this.eventsEl.addEventListener("pointerup", this.handlePointerUp);
		this.eventsEl.addEventListener("pointercancel", this.handlePointerUp);
	};

	/** Stop listening and remove all pointer event listeners. */
	stop = (): void => {
		if (!this.active) return;
		this.active = false;
		this.eventsEl.removeEventListener("pointermove", this.handlePointerMove);
		this.eventsEl.removeEventListener("pointerenter", this.handlePointerEnter);
		this.eventsEl.removeEventListener("pointerleave", this.handlePointerLeave);
		this.eventsEl.removeEventListener("pointerdown", this.handlePointerDown);
		this.eventsEl.removeEventListener("pointerup", this.handlePointerUp);
		this.eventsEl.removeEventListener("pointercancel", this.handlePointerUp);
	};

	/** Update the axis lock at runtime. */
	setAxis = (axis: Axis): void => {
		this.axis = axis;
	};

	private handlePointerDown = (e: PointerEvent): void => {
		this.isPointerDown = true;
		this.eventsEl.setPointerCapture(e.pointerId);
		this.handlePointerEnter();
		this.handlePointerMove(e);
	};

	private handlePointerUp = (e: PointerEvent): void => {
		this.isPointerDown = false;
		this.eventsEl.releasePointerCapture(e.pointerId);
		this.handlePointerLeave();
	};

	/**
	 * Compute normalized [-1, 1] position from pointer coordinates
	 * relative to the element's bounding rect. Respects axis locking.
	 */
	private handlePointerMove = (e: PointerEvent): void => {
		// On touch devices, pointermove might be the only event we get after pointerdown
		if (!this.rect) {
			this.rect = this.eventsEl.getBoundingClientRect();
		}
		if (!this.rect) return;

		const rawX = (e.clientX - this.rect.left) / this.rect.width;
		const rawY = (e.clientY - this.rect.top) / this.rect.height;

		// Check if pointer is still within bounds (especially for mouse move without down)
		const isOut = rawX < 0 || rawX > 1 || rawY < 0 || rawY > 1;

		if (isOut && !this.isPointerDown) {
			this.handlePointerLeave();
			return;
		}

		// Clamp values if pointer is captured but outside bounds
		const clampedX = Math.max(0, Math.min(1, rawX));
		const clampedY = Math.max(0, Math.min(1, rawY));

		const x = this.axis === "y" ? 0 : clampedX * 2 - 1;
		const y = this.axis === "x" ? 0 : clampedY * 2 - 1;

		this.onMove({ x, y });
	};

	private handlePointerEnter = (): void => {
		this.rect = this.eventsEl.getBoundingClientRect();
		this.onEnter?.();
	};

	private handlePointerLeave = (): void => {
		this.rect = null;
		this.onLeave?.();
	};
}
