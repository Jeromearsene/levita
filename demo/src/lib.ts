import { Levita } from "levita-js";

/** Initialize a Levita instance on an element found by ID. */
export const init = (id: string, options: ConstructorParameters<typeof Levita>[1]) => {
	const el = document.getElementById(id);
	if (el) return new Levita(el, options);
};
