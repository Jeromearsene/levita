import { Levita } from "levita-js";
import { bench, describe } from "vitest";
import { createEl } from "./helpers.js";

describe("Initialization", () => {
	bench("Levita — basic init", () => {
		const el = createEl();
		const instance = new Levita(el, { gyroscope: false });
		instance.destroy();
		el.remove();
	});

	bench("Levita — init with glare + shadow", () => {
		const el = createEl();
		const instance = new Levita(el, { glare: true, shadow: true, gyroscope: false });
		instance.destroy();
		el.remove();
	});

	bench("Levita — init with 5 layers", () => {
		const el = createEl();
		for (let i = 0; i < 5; i++) {
			const child = document.createElement("div");
			child.dataset.levitaOffset = String(i * 2 - 5);
			el.appendChild(child);
		}
		const instance = new Levita(el, { gyroscope: false });
		instance.destroy();
		el.remove();
	});
});
