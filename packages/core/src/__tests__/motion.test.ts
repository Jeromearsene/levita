import { describe, expect, it, vi } from "vitest";
import { MotionSensor } from "../sensors/motion.js";

/** Dispatch a deviceorientation event with the given beta/gamma values. */
const fireOrientation = (beta: number | null, gamma: number | null): void => {
	const event = new Event("deviceorientation");
	Object.defineProperty(event, "beta", { value: beta });
	Object.defineProperty(event, "gamma", { value: gamma });
	window.dispatchEvent(event);
};

/** Fire a warmup event to get past the initial skip, then fire the actual event. */
const warmupAndFire = (beta: number, gamma: number): void => {
	fireOrientation(0, 0); // warmup (skipped)
	fireOrientation(beta, gamma);
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

	it("skips first event for sensor warmup", async () => {
		const onMove = vi.fn();
		const sensor = new MotionSensor(onMove, null, -45, 45, 1);
		await sensor.requestPermission();
		sensor.start();

		fireOrientation(0, 0);
		expect(onMove).not.toHaveBeenCalled();

		fireOrientation(0, 0);
		expect(onMove).toHaveBeenCalledOnce();

		sensor.stop();
	});

	it("normalizes device orientation to [-1, 1]", async () => {
		const onMove = vi.fn();
		const sensor = new MotionSensor(onMove, null, -45, 45, 1);
		await sensor.requestPermission();
		sensor.start();

		warmupAndFire(0, 0);

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

		// Warmup + calibration event
		warmupAndFire(0, 0);
		// Exceeds range relative to baseline
		fireOrientation(90, -90);

		const result = onMove.mock.calls[1]?.[0];
		expect(result.x).toBe(-1);
		expect(result.y).toBe(1);

		sensor.stop();
	});

	it("respects axis lock", async () => {
		const onMove = vi.fn();
		const sensor = new MotionSensor(onMove, "x", -45, 45, 1);
		await sensor.requestPermission();
		sensor.start();

		// Warmup + calibrate at origin, then tilt
		warmupAndFire(0, 0);
		fireOrientation(20, 20);

		const result = onMove.mock.calls[1]?.[0];
		expect(result.x).not.toBe(0);
		expect(result.y).toBe(0);

		sensor.stop();
	});

	it("calibrates from initial device position", async () => {
		const onMove = vi.fn();
		const sensor = new MotionSensor(onMove, null, -45, 45, 1);
		await sensor.requestPermission();
		sensor.start();

		// Warmup
		fireOrientation(0, 0);

		// Phone held at 45° (natural reading position) — this becomes the baseline
		fireOrientation(45, 10);
		expect(onMove.mock.calls[0]?.[0].x).toBe(0);
		expect(onMove.mock.calls[0]?.[0].y).toBe(0);

		// Tilt 20° further from baseline → should register proportional tilt
		fireOrientation(65, 30);
		const result = onMove.mock.calls[1]?.[0];
		expect(result.x).toBeCloseTo(20 / 45, 5);
		expect(result.y).toBeCloseTo(20 / 45, 5);

		sensor.stop();
	});

	it("recalibrates on restart", async () => {
		const onMove = vi.fn();
		const sensor = new MotionSensor(onMove, null, -45, 45, 1);
		await sensor.requestPermission();
		sensor.start();

		warmupAndFire(30, 10);
		sensor.stop();

		onMove.mockClear();
		sensor.start();

		// New baseline should be 50/20, not 30/10
		warmupAndFire(50, 20);
		expect(onMove.mock.calls[0]?.[0].x).toBe(0);
		expect(onMove.mock.calls[0]?.[0].y).toBe(0);

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

	it("ignores events with null beta and gamma", async () => {
		const onMove = vi.fn();
		const sensor = new MotionSensor(onMove, null, -45, 45, 1);
		await sensor.requestPermission();
		sensor.start();

		fireOrientation(null, null);
		fireOrientation(null, null);
		expect(onMove).not.toHaveBeenCalled();

		sensor.stop();
	});

	it("calls onFirstEvent on first valid orientation after warmup", async () => {
		const onMove = vi.fn();
		const onFirstEvent = vi.fn();
		const sensor = new MotionSensor(onMove, null, -45, 45, 1, onFirstEvent);
		await sensor.requestPermission();
		sensor.start();

		// Null events don't count
		fireOrientation(null, null);
		expect(onFirstEvent).not.toHaveBeenCalled();

		// First valid event is warmup — skipped, no callback yet
		fireOrientation(5, 5);
		expect(onFirstEvent).not.toHaveBeenCalled();

		// Second valid event triggers callback
		fireOrientation(10, 10);
		expect(onFirstEvent).toHaveBeenCalledOnce();

		// Not called again
		fireOrientation(20, 20);
		expect(onFirstEvent).toHaveBeenCalledOnce();

		sensor.stop();
	});
});
