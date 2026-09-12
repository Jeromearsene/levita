import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../vibration.js", () => ({
	triggerPreset: vi.fn(),
	stopVibration: vi.fn(),
}));

import type { PluginContext, TiltValues } from "levita-js";
import { DEFAULT_OPTIONS } from "levita-js";
import { haptics } from "../plugin.js";
import { stopVibration, triggerPreset } from "../vibration.js";

type Callback = (...args: never[]) => unknown;
type TestContext = PluginContext & { emit(event: string, data?: unknown): void };

const createContext = (): TestContext => {
	const listeners = new Map<string, Set<Callback>>();
	return {
		element: document.createElement("div"),
		options: { ...DEFAULT_OPTIONS, plugins: [] },
		on: vi.fn((event: string, handler: Callback) => {
			if (!listeners.has(event)) listeners.set(event, new Set());
			listeners.get(event)?.add(handler);
		}) as PluginContext["on"],
		emit(event: string, data?: unknown) {
			for (const fn of listeners.get(event) ?? []) {
				fn(data as never);
			}
		},
	};
};

const makeTilt = (percentX: number, percentY: number): TiltValues => ({
	x: percentX * 15,
	y: percentY * 15,
	percentX,
	percentY,
});

describe("haptics plugin", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("has name 'haptics'", () => {
		const plugin = haptics();
		expect(plugin.name).toBe("haptics");
	});

	describe("feedback events", () => {
		it("triggers preset on enter event", () => {
			const ctx = createContext();
			const plugin = haptics();
			plugin.init(ctx);

			ctx.emit("enter");

			expect(triggerPreset).toHaveBeenCalledWith("light");
		});

		it("triggers preset on leave event", () => {
			const ctx = createContext();
			const plugin = haptics();
			plugin.init(ctx);

			ctx.emit("leave");

			expect(triggerPreset).toHaveBeenCalledWith("light");
		});

		it("uses custom presets", () => {
			const ctx = createContext();
			const plugin = haptics({ feedbackEvents: { enter: "heavy", leave: "medium" } });
			plugin.init(ctx);

			ctx.emit("enter");
			expect(triggerPreset).toHaveBeenCalledWith("heavy");

			ctx.emit("leave");
			expect(triggerPreset).toHaveBeenCalledWith("medium");
		});

		it("does not register enter when set to false", () => {
			const ctx = createContext();
			const plugin = haptics({ feedbackEvents: { enter: false } });
			plugin.init(ctx);

			ctx.emit("enter");

			expect(triggerPreset).not.toHaveBeenCalled();
		});

		it("does not register leave when set to false", () => {
			const ctx = createContext();
			const plugin = haptics({ feedbackEvents: { leave: false } });
			plugin.init(ctx);

			ctx.emit("leave");

			expect(triggerPreset).not.toHaveBeenCalled();
		});
	});

	describe("maxTilt detection", () => {
		it("triggers preset on maxTilt reached", () => {
			const ctx = createContext();
			const plugin = haptics();
			plugin.init(ctx);

			plugin.update(makeTilt(0.96, 0));

			expect(triggerPreset).toHaveBeenCalledWith("medium");
		});

		it("does not trigger maxTilt twice without returning to non-max first", () => {
			const ctx = createContext();
			const plugin = haptics();
			plugin.init(ctx);

			plugin.update(makeTilt(0.96, 0));
			expect(triggerPreset).toHaveBeenCalledTimes(1);

			plugin.update(makeTilt(0.97, 0));
			expect(triggerPreset).toHaveBeenCalledTimes(1);

			plugin.update(makeTilt(0.5, 0));
			plugin.update(makeTilt(0.96, 0));
			expect(triggerPreset).toHaveBeenCalledTimes(2);
		});

		it("does not trigger when maxTilt is false", () => {
			const ctx = createContext();
			const plugin = haptics({ feedbackEvents: { maxTilt: false } });
			plugin.init(ctx);

			plugin.update(makeTilt(0.96, 0));

			expect(triggerPreset).not.toHaveBeenCalled();
		});
	});

	it("cleans up on destroy", () => {
		const plugin = haptics();
		plugin.init(createContext());
		plugin.destroy();

		expect(stopVibration).toHaveBeenCalled();
	});

	it("reset clears maxTilt state", () => {
		const ctx = createContext();
		const plugin = haptics();
		plugin.init(ctx);

		plugin.update(makeTilt(0.96, 0));
		expect(triggerPreset).toHaveBeenCalledTimes(1);

		plugin.reset?.();

		plugin.update(makeTilt(0.96, 0));
		expect(triggerPreset).toHaveBeenCalledTimes(2);
	});
});
