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
	private el: HTMLElement;
	private onMove: SensorCallback;
	private onEnter: (() => void) | null;
	private onLeave: (() => void) | null;
	private axis: Axis;
	private active = false;
	private rect: DOMRect | null = null;

	constructor(
		el: HTMLElement,
		onMove: SensorCallback,
		onEnter: (() => void) | null,
		onLeave: (() => void) | null,
		axis: Axis,
	) {
		this.el = el;
		this.onMove = onMove;
		this.onEnter = onEnter;
		this.onLeave = onLeave;
		this.axis = axis;
	}

	/** Start listening to pointer events on the element. */
	start = (): void => {
		if (this.active) return;
		this.active = true;
		this.el.addEventListener("pointermove", this.handlePointerMove);
		this.el.addEventListener("pointerenter", this.handlePointerEnter);
		this.el.addEventListener("pointerleave", this.handlePointerLeave);
	};

	/** Stop listening and remove all pointer event listeners. */
	stop = (): void => {
		if (!this.active) return;
		this.active = false;
		this.el.removeEventListener("pointermove", this.handlePointerMove);
		this.el.removeEventListener("pointerenter", this.handlePointerEnter);
		this.el.removeEventListener("pointerleave", this.handlePointerLeave);
	};

	/** Update the axis lock at runtime. */
	setAxis = (axis: Axis): void => {
		this.axis = axis;
	};

	/**
	 * Compute normalized [-1, 1] position from pointer coordinates
	 * relative to the element's bounding rect. Respects axis locking.
	 */
	private handlePointerMove = (e: PointerEvent): void => {
		if (!this.rect) return;
		const rawX = (e.clientX - this.rect.left) / this.rect.width;
		const rawY = (e.clientY - this.rect.top) / this.rect.height;

		const x = this.axis === "y" ? 0 : rawX * 2 - 1;
		const y = this.axis === "x" ? 0 : rawY * 2 - 1;

		this.onMove({ x, y });
	};

	private handlePointerEnter = (): void => {
		this.rect = this.el.getBoundingClientRect();
		this.onEnter?.();
	};

	private handlePointerLeave = (): void => {
		this.rect = null;
		this.onLeave?.();
	};
}
