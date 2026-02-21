import { describe, expect, it } from "vitest";
import { GlareEffect } from "../effects/glare.js";
import { ShadowEffect } from "../effects/shadow.js";

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
