/** Create a mock DOM element suitable for Levita benchmarks. */
export const createEl = (): HTMLElement => {
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
	document.body.appendChild(el);
	return el;
};
