import { Levita } from "levita-js";
import { bench, describe } from "vitest";
import { createEl } from "./helpers.js";

describe("CSS property updates", () => {
	bench("Levita — pointer move update", () => {
		const el = createEl();
		const instance = new Levita(el, { gyroscope: false });

		el.dispatchEvent(
			new PointerEvent("pointermove", { clientX: 100 + Math.random() * 100, clientY: 100 }),
		);

		instance.destroy();
		el.remove();
	});

	bench("Levita — pointer move with glare + shadow", () => {
		const el = createEl();
		const instance = new Levita(el, { glare: true, shadow: true, gyroscope: false });

		el.dispatchEvent(
			new PointerEvent("pointermove", { clientX: 100 + Math.random() * 100, clientY: 100 }),
		);

		instance.destroy();
		el.remove();
	});
});
