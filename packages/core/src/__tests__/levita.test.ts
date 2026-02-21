import { describe, expect, it, vi } from "vitest";
import { Levita } from "../levita.js";

function createEl(): HTMLElement {
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
}

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

		el.dispatchEvent(new PointerEvent("pointermove", { clientX: 150, clientY: 150 }));

		expect(onMove).toHaveBeenCalledOnce();
		expect(el.style.getPropertyValue("--levita-x")).not.toBe("0deg");

		instance.destroy();
	});

	it("resets transform on pointer leave when reset=true", () => {
		const el = createEl();
		const instance = new Levita(el, { reset: true, gyroscope: false });

		el.dispatchEvent(new PointerEvent("pointermove", { clientX: 150, clientY: 150 }));
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

	it("enable() re-activates after disable()", () => {
		const el = createEl();
		const onMove = vi.fn();
		const instance = new Levita(el, { gyroscope: false });
		instance.on("move", onMove);

		instance.disable();
		el.dispatchEvent(new PointerEvent("pointermove", { clientX: 150, clientY: 150 }));
		expect(onMove).not.toHaveBeenCalled();

		instance.enable();
		el.dispatchEvent(new PointerEvent("pointermove", { clientX: 150, clientY: 150 }));
		expect(onMove).toHaveBeenCalledOnce();

		instance.destroy();
	});
});
