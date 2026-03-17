import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("style.css export", () => {
	const distStyle = resolve(__dirname, "../../dist/style.css");
	const coreStyle = resolve(__dirname, "../../node_modules/levita-js/dist/style.css");

	it("should exist in dist", () => {
		expect(() => readFileSync(distStyle, "utf-8")).not.toThrow();
	});

	it("should be identical to levita-js style.css", () => {
		const dist = readFileSync(distStyle, "utf-8");
		const core = readFileSync(coreStyle, "utf-8");
		expect(dist).toBe(core);
	});
});
