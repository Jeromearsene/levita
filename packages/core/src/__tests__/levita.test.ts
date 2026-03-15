import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Levita } from "../levita.js";
import type { LevitaPlugin, PluginContext, TiltValues } from "../types.js";

beforeEach(() => {
	vi.useFakeTimers();
});

afterEach(() => {
	vi.useRealTimers();
});

const createEl = (): HTMLElement => {
	const el = document.createElement("div");
	el.getBoundingClientRect = () => ({
		x: 0,
		y: 0,
		width: 200,
		height: 200,
		top: 0,
		left: 0,
		right: 200,
		bottom: 200,
		toJSON: () => ({}),
	});
	return el;
};

describe("Levita", () => {
	it("adds levita class to element on init", () => {
		const el = createEl();
		const instance = new Levita(el);
		expect(el.classList.contains("levita")).toBe(true);
		instance.destroy();
	});

	it("sets CSS custom properties from options", () => {
		const el = createEl();
		const instance = new Levita(el, { perspective: 800, speed: 200, easing: "linear" });

		expect(el.style.getPropertyValue("--levita-perspective")).toBe("800px");
		expect(el.style.getPropertyValue("--levita-speed")).toBe("200ms");
		expect(el.style.getPropertyValue("--levita-easing")).toBe("linear");

		instance.destroy();
	});

	it("updates tilt on pointer move", () => {
		const el = createEl();
		const onMove = vi.fn();
		const instance = new Levita(el, { max: 15, gyroscope: false });
		instance.on("move", onMove);

		el.dispatchEvent(new PointerEvent("pointerenter", { clientX: 150, clientY: 150 }));
		el.dispatchEvent(new PointerEvent("pointermove", { clientX: 150, clientY: 150 }));
		vi.advanceTimersByTime(16);

		expect(onMove).toHaveBeenCalledOnce();
		expect(el.style.getPropertyValue("--levita-x")).not.toBe("0deg");

		instance.destroy();
	});

	it("resets transform on pointer leave when reset=true", () => {
		const el = createEl();
		const instance = new Levita(el, { reset: true, gyroscope: false });

		el.dispatchEvent(new PointerEvent("pointerenter", { clientX: 150, clientY: 150 }));
		el.dispatchEvent(new PointerEvent("pointermove", { clientX: 150, clientY: 150 }));
		vi.advanceTimersByTime(16);
		el.dispatchEvent(new PointerEvent("pointerleave"));

		expect(el.style.getPropertyValue("--levita-x")).toBe("0deg");
		expect(el.style.getPropertyValue("--levita-y")).toBe("0deg");

		instance.destroy();
	});

	it("does not fire events when disabled", () => {
		const el = createEl();
		const onMove = vi.fn();
		const instance = new Levita(el, { disabled: true, gyroscope: false });
		instance.on("move", onMove);

		el.dispatchEvent(new PointerEvent("pointerenter", { clientX: 150, clientY: 150 }));
		el.dispatchEvent(new PointerEvent("pointermove", { clientX: 150, clientY: 150 }));

		expect(onMove).not.toHaveBeenCalled();

		instance.destroy();
	});

	it("cleans up everything on destroy", () => {
		const el = createEl();
		const instance = new Levita(el, { glare: true, shadow: true, gyroscope: false });
		instance.destroy();

		expect(el.classList.contains("levita")).toBe(false);
		expect(el.querySelector(".levita-glare")).toBeNull();
		expect(el.style.getPropertyValue("--levita-perspective")).toBe("");
	});

	it("creates glare effect when glare=true", () => {
		const el = createEl();
		const instance = new Levita(el, { glare: true, gyroscope: false });

		expect(el.querySelector(".levita-glare")).not.toBeNull();

		instance.destroy();
	});

	it("creates shadow effect when shadow=true", () => {
		const el = createEl();
		const instance = new Levita(el, { shadow: true, gyroscope: false });

		expect(el.classList.contains("levita-shadow")).toBe(true);

		instance.destroy();
	});

	it("scans layers on init", () => {
		const el = createEl();
		const child = document.createElement("div");
		child.dataset.levitaOffset = "5";
		el.appendChild(child);

		const instance = new Levita(el, { gyroscope: false });

		expect(child.style.getPropertyValue("--levita-offset")).toBe("5");

		instance.destroy();
	});

	it("emits enter and leave events", () => {
		const el = createEl();
		const onEnter = vi.fn();
		const onLeave = vi.fn();
		const instance = new Levita(el, { gyroscope: false });
		instance.on("enter", onEnter);
		instance.on("leave", onLeave);

		el.dispatchEvent(new PointerEvent("pointerenter"));
		expect(onEnter).toHaveBeenCalledOnce();

		el.dispatchEvent(new PointerEvent("pointerleave"));
		expect(onLeave).toHaveBeenCalledOnce();

		instance.destroy();
	});

	it("off() removes event listener", () => {
		const el = createEl();
		const onMove = vi.fn();
		const instance = new Levita(el, { gyroscope: false });
		instance.on("move", onMove);
		instance.off("move", onMove);

		el.dispatchEvent(new PointerEvent("pointermove", { clientX: 100, clientY: 100 }));

		expect(onMove).not.toHaveBeenCalled();

		instance.destroy();
	});

	it("update() changes CSS properties at runtime", () => {
		const el = createEl();
		const instance = new Levita(el, {
			perspective: 800,
			speed: 200,
			easing: "linear",
			gyroscope: false,
		});

		instance.update({ perspective: 1200, speed: 400, easing: "ease-in" });

		expect(el.style.getPropertyValue("--levita-perspective")).toBe("1200px");
		expect(el.style.getPropertyValue("--levita-speed")).toBe("400ms");
		expect(el.style.getPropertyValue("--levita-easing")).toBe("ease-in");

		instance.destroy();
	});

	it("update() applies max change on next pointer move", () => {
		const el = createEl();
		const onMove = vi.fn();
		const instance = new Levita(el, { max: 15, gyroscope: false });
		instance.on("move", onMove);

		el.dispatchEvent(new PointerEvent("pointerenter", { clientX: 150, clientY: 150 }));
		el.dispatchEvent(new PointerEvent("pointermove", { clientX: 150, clientY: 150 }));
		vi.advanceTimersByTime(16);

		const firstMove = onMove.mock.calls[0]?.[0];

		instance.update({ max: 30 });

		el.dispatchEvent(new PointerEvent("pointermove", { clientX: 150, clientY: 150 }));
		vi.advanceTimersByTime(16);

		const secondMove = onMove.mock.calls[1]?.[0];
		expect(Math.abs(secondMove.x)).toBeGreaterThan(Math.abs(firstMove.x));

		instance.destroy();
	});

	it("update() changes axis on sensors", () => {
		const el = createEl();
		const onMove = vi.fn();
		const instance = new Levita(el, { gyroscope: false });
		instance.on("move", onMove);

		instance.update({ axis: "x" });

		el.dispatchEvent(new PointerEvent("pointerenter", { clientX: 150, clientY: 150 }));
		el.dispatchEvent(new PointerEvent("pointermove", { clientX: 150, clientY: 150 }));
		vi.advanceTimersByTime(16);

		const result = onMove.mock.calls[0]?.[0];
		// axis "x" locks sensor Y to 0, which maps to tilt angle x = 0
		expect(result.x).toBe(0);

		instance.destroy();
	});

	it("enable() re-activates after disable()", () => {
		const el = createEl();
		const onMove = vi.fn();
		const instance = new Levita(el, { gyroscope: false });
		instance.on("move", onMove);

		instance.disable();
		el.dispatchEvent(new PointerEvent("pointerenter", { clientX: 150, clientY: 150 }));
		el.dispatchEvent(new PointerEvent("pointermove", { clientX: 150, clientY: 150 }));
		expect(onMove).not.toHaveBeenCalled();

		instance.enable();
		el.dispatchEvent(new PointerEvent("pointerenter", { clientX: 150, clientY: 150 }));
		el.dispatchEvent(new PointerEvent("pointermove", { clientX: 150, clientY: 150 }));
		vi.advanceTimersByTime(16);
		expect(onMove).toHaveBeenCalledOnce();

		instance.destroy();
	});
});

const createMockPlugin = () => {
	const plugin = {
		name: "mock",
		init: vi.fn<(ctx: PluginContext) => void>(),
		update: vi.fn<(values: TiltValues) => void>(),
		reset: vi.fn<() => void>(),
		destroy: vi.fn<() => void>(),
	};
	return plugin;
};

describe("Plugin system", () => {
	it("calls init on plugins with correct context", () => {
		const el = createEl();
		const plugin = createMockPlugin();
		const instance = new Levita(el, { gyroscope: false, plugins: [plugin] });

		expect(plugin.init).toHaveBeenCalledOnce();
		expect(plugin.init.mock.calls[0]?.[0]).toEqual(
			expect.objectContaining({
				element: el,
				options: expect.any(Object),
				on: expect.any(Function),
			}),
		);

		instance.destroy();
	});

	it("calls update on plugins during tilt", () => {
		const el = createEl();
		const plugin = createMockPlugin();
		const instance = new Levita(el, { gyroscope: false, plugins: [plugin] });

		el.dispatchEvent(new PointerEvent("pointerenter", { clientX: 150, clientY: 150 }));
		el.dispatchEvent(new PointerEvent("pointermove", { clientX: 150, clientY: 150 }));
		vi.advanceTimersByTime(16);

		expect(plugin.update).toHaveBeenCalledOnce();
		const values = plugin.update.mock.calls[0]?.[0];
		expect(values).toHaveProperty("x");
		expect(values).toHaveProperty("y");
		expect(values).toHaveProperty("percentX");
		expect(values).toHaveProperty("percentY");

		instance.destroy();
	});

	it("calls reset on plugins on pointer leave", () => {
		const el = createEl();
		const plugin = createMockPlugin();
		const instance = new Levita(el, { gyroscope: false, reset: true, plugins: [plugin] });

		el.dispatchEvent(new PointerEvent("pointerenter", { clientX: 150, clientY: 150 }));
		el.dispatchEvent(new PointerEvent("pointermove", { clientX: 150, clientY: 150 }));
		vi.advanceTimersByTime(16);
		el.dispatchEvent(new PointerEvent("pointerleave"));

		expect(plugin.reset).toHaveBeenCalledOnce();

		instance.destroy();
	});

	it("calls destroy on plugins", () => {
		const el = createEl();
		const plugin = createMockPlugin();
		const instance = new Levita(el, { gyroscope: false, plugins: [plugin] });

		instance.destroy();

		expect(plugin.destroy).toHaveBeenCalledOnce();
	});

	it("plugins can subscribe to events via context.on", () => {
		const el = createEl();
		const enterHandler = vi.fn();
		const plugin: LevitaPlugin = {
			name: "event-test",
			init(ctx) {
				ctx.on("enter", enterHandler);
			},
			update() {},
			destroy() {},
		};
		const instance = new Levita(el, { gyroscope: false, plugins: [plugin] });

		el.dispatchEvent(new PointerEvent("pointerenter"));
		expect(enterHandler).toHaveBeenCalledOnce();

		instance.destroy();
	});

	it("glare and shadow still work via internal plugins", () => {
		const el = createEl();
		const instance = new Levita(el, { glare: true, shadow: true, gyroscope: false });

		expect(el.querySelector(".levita-glare")).not.toBeNull();
		expect(el.classList.contains("levita-shadow")).toBe(true);

		instance.destroy();

		expect(el.querySelector(".levita-glare")).toBeNull();
		expect(el.classList.contains("levita-shadow")).toBe(false);
	});
});
