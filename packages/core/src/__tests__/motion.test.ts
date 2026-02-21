import { describe, expect, it, vi } from "vitest";
import { MotionSensor } from "../sensors/motion.js";

/** Dispatch a deviceorientation event with the given beta/gamma values. */
const fireOrientation = (beta: number, gamma: number): void => {
	const event = new Event("deviceorientation");
	Object.defineProperty(event, "beta", { value: beta });
	Object.defineProperty(event, "gamma", { value: gamma });
	window.dispatchEvent(event);
};

describe("MotionSensor", () => {
	it("isSupported returns true when DeviceOrientationEvent exists", () => {
		expect(MotionSensor.isSupported()).toBe(true);
	});

	it("does not start without permission", () => {
		const onMove = vi.fn();
		const sensor = new MotionSensor(onMove, null);
		sensor.start();

		fireOrientation(0, 0);
		expect(onMove).not.toHaveBeenCalled();
	});

	it("requestPermission grants on Android (no requestPermission method)", async () => {
		const onMove = vi.fn();
		const sensor = new MotionSensor(onMove, null);
		const granted = await sensor.requestPermission();
		expect(granted).toBe(true);
	});

	it("normalizes device orientation to [-1, 1]", async () => {
		const onMove = vi.fn();
		const sensor = new MotionSensor(onMove, null, -45, 45, 1);
		await sensor.requestPermission();
		sensor.start();

		fireOrientation(0, 0);

		expect(onMove).toHaveBeenCalledOnce();
		const result = onMove.mock.calls[0]?.[0];
		expect(result.x).toBe(0);
		expect(result.y).toBe(0);

		sensor.stop();
	});

	it("clamps values outside angle range", async () => {
		const onMove = vi.fn();
		const sensor = new MotionSensor(onMove, null, -45, 45, 1);
		await sensor.requestPermission();
		sensor.start();

		fireOrientation(90, -90);

		const result = onMove.mock.calls[0]?.[0];
		expect(result.x).toBe(-1);
		expect(result.y).toBe(1);

		sensor.stop();
	});

	it("respects axis lock", async () => {
		const onMove = vi.fn();
		const sensor = new MotionSensor(onMove, "x", -45, 45, 1);
		await sensor.requestPermission();
		sensor.start();

		fireOrientation(20, 20);

		const result = onMove.mock.calls[0]?.[0];
		expect(result.x).not.toBe(0);
		expect(result.y).toBe(0);

		sensor.stop();
	});

	it("does not fire events after stop()", async () => {
		const onMove = vi.fn();
		const sensor = new MotionSensor(onMove, null, -45, 45, 1);
		await sensor.requestPermission();
		sensor.start();
		sensor.stop();

		fireOrientation(20, 20);
		expect(onMove).not.toHaveBeenCalled();
	});
});
