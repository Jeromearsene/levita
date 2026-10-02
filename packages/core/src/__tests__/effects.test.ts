import { describe, expect, it, vi } from "vitest";
import { DEFAULT_OPTIONS } from "../constants.js";
import { createGlarePlugin, GlareEffect } from "../effects/glare.js";
import { createShadowPlugin, ShadowEffect } from "../effects/shadow.js";
import type { PluginContext } from "../types.js";

describe("GlareEffect", () => {
	it("creates glare DOM elements", () => {
		const el = document.createElement("div");
		const glare = new GlareEffect(el, 0.5);

		expect(el.querySelector(".levita-glare")).not.toBeNull();
		expect(el.querySelector(".levita-glare-inner")).not.toBeNull();

		glare.destroy();
	});

	it("sets position relative if element is static", () => {
		const el = document.createElement("div");
		document.body.appendChild(el);
		const glare = new GlareEffect(el, 0.5);

		expect(el.style.position).toBe("relative");

		glare.destroy();
		el.remove();
	});

	it("does not override existing position", () => {
		const el = document.createElement("div");
		el.style.position = "absolute";
		document.body.appendChild(el);
		const glare = new GlareEffect(el, 0.5);

		expect(el.style.position).toBe("absolute");

		glare.destroy();
		el.remove();
	});

	it("updates glare CSS custom properties", () => {
		const el = document.createElement("div");
		const glare = new GlareEffect(el, 0.5);

		glare.update(1, 1);

		const inner = el.querySelector(".levita-glare-inner") as HTMLElement;
		expect(inner.style.getPropertyValue("--levita-glare-x")).toBe("100%");
		expect(inner.style.getPropertyValue("--levita-glare-y")).toBe("100%");

		glare.destroy();
	});

	it("removes DOM elements on destroy", () => {
		const el = document.createElement("div");
		const glare = new GlareEffect(el, 0.5);
		glare.destroy();

		expect(el.querySelector(".levita-glare")).toBeNull();
	});
});

describe("createGlarePlugin", () => {
	const makeContext = (): PluginContext => ({
		element: document.createElement("div"),
		options: { ...DEFAULT_OPTIONS },
		on: vi.fn(),
	});

	it("creates DOM elements on init", () => {
		const ctx = makeContext();
		const plugin = createGlarePlugin({ maxGlare: 0.5 });

		plugin.init(ctx);

		expect(ctx.element.querySelector(".levita-glare")).not.toBeNull();
		expect(ctx.element.querySelector(".levita-glare-inner")).not.toBeNull();

		plugin.destroy();
	});

	it("updates CSS custom properties on update", () => {
		const ctx = makeContext();
		const plugin = createGlarePlugin({ maxGlare: 0.5 });

		plugin.init(ctx);
		plugin.update({ x: 10, y: 10, percentX: 1, percentY: 1 });

		const inner = ctx.element.querySelector(".levita-glare-inner") as HTMLElement;
		expect(inner.style.getPropertyValue("--levita-glare-x")).toBe("100%");
		expect(inner.style.getPropertyValue("--levita-glare-y")).toBe("100%");

		plugin.destroy();
	});

	it("resets glare to neutral on reset", () => {
		const ctx = makeContext();
		const plugin = createGlarePlugin({ maxGlare: 0.5 });

		plugin.init(ctx);
		plugin.update({ x: 10, y: 10, percentX: 1, percentY: 1 });
		plugin.reset?.();

		const inner = ctx.element.querySelector(".levita-glare-inner") as HTMLElement;
		expect(inner.style.getPropertyValue("--levita-glare-x")).toBe("50%");
		expect(inner.style.getPropertyValue("--levita-glare-y")).toBe("50%");
		expect(inner.style.getPropertyValue("--levita-glare-opacity")).toBe("0");

		plugin.destroy();
	});

	it("cleans up on destroy", () => {
		const ctx = makeContext();
		const plugin = createGlarePlugin({ maxGlare: 0.5 });

		plugin.init(ctx);
		plugin.destroy();

		expect(ctx.element.querySelector(".levita-glare")).toBeNull();
	});
});

describe("ShadowEffect", () => {
	it("adds levita-shadow class", () => {
		const el = document.createElement("div");
		const shadow = new ShadowEffect(el);

		expect(el.classList.contains("levita-shadow")).toBe(true);

		shadow.destroy();
	});

	it("updates shadow CSS custom properties", () => {
		const el = document.createElement("div");
		const shadow = new ShadowEffect(el, 20);

		shadow.update(0.5, -0.5);

		expect(el.style.getPropertyValue("--levita-shadow-x")).toBe("10px");
		expect(el.style.getPropertyValue("--levita-shadow-y")).toBe("-10px");

		shadow.destroy();
	});

	it("cleans up on destroy", () => {
		const el = document.createElement("div");
		const shadow = new ShadowEffect(el);
		shadow.destroy();

		expect(el.classList.contains("levita-shadow")).toBe(false);
		expect(el.style.getPropertyValue("--levita-shadow-x")).toBe("");
	});
});

describe("createShadowPlugin", () => {
	const makeContext = (el: HTMLElement): PluginContext => ({
		element: el,
		options: { ...DEFAULT_OPTIONS },
		on: vi.fn(),
	});

	it("adds shadow class on init", () => {
		const el = document.createElement("div");
		const plugin = createShadowPlugin();

		plugin.init(makeContext(el));

		expect(el.classList.contains("levita-shadow")).toBe(true);

		plugin.destroy();
	});

	it("updates shadow CSS custom properties on update", () => {
		const el = document.createElement("div");
		const plugin = createShadowPlugin();

		plugin.init(makeContext(el));
		plugin.update({ x: 7.5, y: -7.5, percentX: 0.5, percentY: -0.5 });

		expect(el.style.getPropertyValue("--levita-shadow-x")).toBe("10px");
		expect(el.style.getPropertyValue("--levita-shadow-y")).toBe("-10px");

		plugin.destroy();
	});

	it("resets shadow to neutral on reset", () => {
		const el = document.createElement("div");
		const plugin = createShadowPlugin();

		plugin.init(makeContext(el));
		plugin.update({ x: 7.5, y: -7.5, percentX: 0.5, percentY: -0.5 });
		plugin.reset?.();

		expect(el.style.getPropertyValue("--levita-shadow-x")).toBe("0px");
		expect(el.style.getPropertyValue("--levita-shadow-y")).toBe("0px");

		plugin.destroy();
	});

	it("cleans up on destroy", () => {
		const el = document.createElement("div");
		const plugin = createShadowPlugin();

		plugin.init(makeContext(el));
		plugin.destroy();

		expect(el.classList.contains("levita-shadow")).toBe(false);
		expect(el.style.getPropertyValue("--levita-shadow-x")).toBe("");
		expect(el.style.getPropertyValue("--levita-shadow-y")).toBe("");
	});
});
