import { describe, expect, it, vi } from "vitest";
import { PointerSensor } from "../sensors/pointer.js";

const createEl = (): HTMLElement => {
	const el = document.createElement("div");
	el.getBoundingClientRect = () => ({
		x: 0,
		y: 0,
		width: 200,
		height: 100,
		top: 0,
		left: 0,
		right: 200,
		bottom: 100,
		toJSON: () => ({}),
	});
	return el;
};

/** Dispatch a pointermove event on the given element. */
const firePointerMove = (el: HTMLElement, clientX: number, clientY: number): void => {
	el.dispatchEvent(new PointerEvent("pointerenter", { clientX, clientY }));
	el.dispatchEvent(new PointerEvent("pointermove", { clientX, clientY }));
};

describe("PointerSensor", () => {
	it("normalizes pointer position to [-1, 1]", () => {
		const el = createEl();
		const onMove = vi.fn();
		const sensor = new PointerSensor(el, onMove, null, null, null);
		sensor.start();

		// Center of element -> (0, 0)
		firePointerMove(el, 100, 50);
		expect(onMove).toHaveBeenCalledWith({ x: 0, y: 0 });

		// Top-left corner -> (-1, -1)
		firePointerMove(el, 0, 0);
		expect(onMove).toHaveBeenCalledWith({ x: -1, y: -1 });

		// Bottom-right corner -> (1, 1)
		firePointerMove(el, 200, 100);
		expect(onMove).toHaveBeenCalledWith({ x: 1, y: 1 });

		sensor.stop();
	});

	it("locks to x axis when axis='x'", () => {
		const el = createEl();
		const onMove = vi.fn();
		const sensor = new PointerSensor(el, onMove, null, null, "x");
		sensor.start();

		firePointerMove(el, 150, 75);
		const result = onMove.mock.calls[0]?.[0];
		expect(result.x).not.toBe(0);
		expect(result.y).toBe(0);

		sensor.stop();
	});

	it("locks to y axis when axis='y'", () => {
		const el = createEl();
		const onMove = vi.fn();
		const sensor = new PointerSensor(el, onMove, null, null, "y");
		sensor.start();

		firePointerMove(el, 150, 75);
		const result = onMove.mock.calls[0]?.[0];
		expect(result.x).toBe(0);
		expect(result.y).not.toBe(0);

		sensor.stop();
	});

	it("calls onEnter and onLeave callbacks", () => {
		const el = createEl();
		const onEnter = vi.fn();
		const onLeave = vi.fn();
		const sensor = new PointerSensor(el, vi.fn(), onEnter, onLeave, null);
		sensor.start();

		el.dispatchEvent(new PointerEvent("pointerenter"));
		expect(onEnter).toHaveBeenCalledOnce();

		el.dispatchEvent(new PointerEvent("pointerleave"));
		expect(onLeave).toHaveBeenCalledOnce();

		sensor.stop();
	});

	it("does not fire events after stop()", () => {
		const el = createEl();
		const onMove = vi.fn();
		const sensor = new PointerSensor(el, onMove, null, null, null);
		sensor.start();
		sensor.stop();

		firePointerMove(el, 100, 50);
		expect(onMove).not.toHaveBeenCalled();
	});
});
