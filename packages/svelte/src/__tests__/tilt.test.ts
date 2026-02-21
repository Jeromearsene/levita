import { describe, expect, it } from "vitest";
import { tilt } from "../index.js";

describe("tilt (Svelte action)", () => {
	it("adds levita class to element", () => {
		const el = document.createElement("div");
		const action = tilt(el, { gyroscope: false });

		expect(el.classList.contains("levita")).toBe(true);

		action.destroy();
	});

	it("creates glare element when enabled", () => {
		const el = document.createElement("div");
		const action = tilt(el, { glare: true, gyroscope: false });

		expect(el.querySelector(".levita-glare")).not.toBeNull();

		action.destroy();
	});

	it("cleans up on destroy", () => {
		const el = document.createElement("div");
		const action = tilt(el, { glare: true, gyroscope: false });

		action.destroy();

		expect(el.classList.contains("levita")).toBe(false);
	});

	it("recreates instance on update", () => {
		const el = document.createElement("div");
		const action = tilt(el, { gyroscope: false });

		expect(el.querySelector(".levita-glare")).toBeNull();

		action.update({ glare: true, gyroscope: false });

		expect(el.querySelector(".levita-glare")).not.toBeNull();

		action.destroy();
	});
});
