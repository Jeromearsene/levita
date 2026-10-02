import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { isHapticsSupported } from "../support.js";
import { stopVibration, triggerPreset } from "../vibration.js";

describe("vibration", () => {
	beforeEach(() => {
		Object.defineProperty(navigator, "vibrate", {
			value: vi.fn(),
			configurable: true,
		});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe("triggerPreset", () => {
		it('calls vibrate with "light" pattern', () => {
			triggerPreset("light");
			expect(navigator.vibrate).toHaveBeenCalledWith(15);
		});

		it('calls vibrate with "heavy" pattern', () => {
			triggerPreset("heavy");
			expect(navigator.vibrate).toHaveBeenCalledWith(35);
		});

		it('calls vibrate with "medium" pattern', () => {
			triggerPreset("medium");
			expect(navigator.vibrate).toHaveBeenCalledWith(25);
		});
	});

	describe("stopVibration", () => {
		it("calls vibrate(0) to cancel", () => {
			stopVibration();
			expect(navigator.vibrate).toHaveBeenCalledWith(0);
		});
	});
});

describe("isHapticsSupported", () => {
	const originalVibrate = navigator.vibrate;

	afterEach(() => {
		Object.defineProperty(navigator, "vibrate", {
			value: originalVibrate,
			configurable: true,
		});
	});

	it("returns true when navigator.vibrate exists", () => {
		Object.defineProperty(navigator, "vibrate", {
			value: vi.fn(),
			configurable: true,
		});
		expect(isHapticsSupported()).toBe(true);
	});

	it("returns false when navigator.vibrate is undefined", () => {
		Object.defineProperty(navigator, "vibrate", {
			value: undefined,
			configurable: true,
		});
		expect(isHapticsSupported()).toBe(false);
	});
});
