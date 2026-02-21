import { describe, expect, it } from "vitest";
import { cleanupLayers, scanLayers } from "../layers.js";

describe("scanLayers", () => {
	it("finds elements with data-levita-offset", () => {
		const container = document.createElement("div");
		const child1 = document.createElement("div");
		child1.dataset.levitaOffset = "5";
		const child2 = document.createElement("div");
		child2.dataset.levitaOffset = "-3";
		container.appendChild(child1);
		container.appendChild(child2);

		const layers = scanLayers(container);

		expect(layers).toHaveLength(2);
		expect(layers[0]?.offset).toBe(5);
		expect(layers[1]?.offset).toBe(-3);
	});

	it("sets --levita-offset CSS variable on each layer", () => {
		const container = document.createElement("div");
		const child = document.createElement("div");
		child.dataset.levitaOffset = "10";
		container.appendChild(child);

		scanLayers(container);

		expect(child.style.getPropertyValue("--levita-offset")).toBe("10");
	});

	it("ignores elements with invalid offset values", () => {
		const container = document.createElement("div");
		const child = document.createElement("div");
		child.dataset.levitaOffset = "notanumber";
		container.appendChild(child);

		const layers = scanLayers(container);
		expect(layers).toHaveLength(0);
	});

	it("returns empty array when no layers exist", () => {
		const container = document.createElement("div");
		const layers = scanLayers(container);
		expect(layers).toHaveLength(0);
	});
});

describe("cleanupLayers", () => {
	it("removes --levita-offset from all layer elements", () => {
		const container = document.createElement("div");
		const child = document.createElement("div");
		child.dataset.levitaOffset = "5";
		container.appendChild(child);

		const layers = scanLayers(container);
		cleanupLayers(layers);

		expect(child.style.getPropertyValue("--levita-offset")).toBe("");
	});
});
