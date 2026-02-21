import type { Axis } from "../types.js";

export interface SensorOutput {
	/** Normalized X position [-1, 1] */
	x: number;
	/** Normalized Y position [-1, 1] */
	y: number;
}

export type SensorCallback = (values: SensorOutput) => void;

export class PointerSensor {
	private el: HTMLElement;
	private onMove: SensorCallback;
	private onEnter: (() => void) | null;
	private onLeave: (() => void) | null;
	private axis: Axis;
	private active = false;

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

		this.handlePointerMove = this.handlePointerMove.bind(this);
		this.handlePointerEnter = this.handlePointerEnter.bind(this);
		this.handlePointerLeave = this.handlePointerLeave.bind(this);
	}

	start(): void {
		if (this.active) return;
		this.active = true;
		this.el.addEventListener("pointermove", this.handlePointerMove);
		this.el.addEventListener("pointerenter", this.handlePointerEnter);
		this.el.addEventListener("pointerleave", this.handlePointerLeave);
	}

	stop(): void {
		if (!this.active) return;
		this.active = false;
		this.el.removeEventListener("pointermove", this.handlePointerMove);
		this.el.removeEventListener("pointerenter", this.handlePointerEnter);
		this.el.removeEventListener("pointerleave", this.handlePointerLeave);
	}

	setAxis(axis: Axis): void {
		this.axis = axis;
	}

	private handlePointerMove(e: PointerEvent): void {
		const rect = this.el.getBoundingClientRect();
		const rawX = (e.clientX - rect.left) / rect.width;
		const rawY = (e.clientY - rect.top) / rect.height;

		const x = this.axis === "y" ? 0 : rawX * 2 - 1;
		const y = this.axis === "x" ? 0 : rawY * 2 - 1;

		this.onMove({ x, y });
	}

	private handlePointerEnter(): void {
		this.onEnter?.();
	}

	private handlePointerLeave(): void {
		this.onLeave?.();
	}
}
