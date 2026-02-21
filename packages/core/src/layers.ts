/** Represents a child element with a parallax depth offset. */
export interface Layer {
	/** The DOM element */
	el: HTMLElement;
	/** The depth offset value (positive = forward, negative = back) */
	offset: number;
}

/**
 * Scan a container for children with `data-levita-offset` attributes
 * and set the `--levita-offset` CSS custom property on each one.
 *
 * The CSS stylesheet uses this variable with `translateZ()` to position
 * layers at different depths — no JS runs per animation frame.
 *
 * @param container - The parent element to scan for layer children
 * @returns Array of discovered layers with their elements and offsets
 */
export const scanLayers = (container: HTMLElement): Layer[] => {
	const elements = container.querySelectorAll<HTMLElement>("[data-levita-offset]");
	const layers: Layer[] = [];

	for (const el of elements) {
		const raw = el.dataset.levitaOffset;
		const offset = Number.parseFloat(raw ?? "0");
		if (!Number.isNaN(offset)) {
			el.style.setProperty("--levita-offset", String(offset));
			layers.push({ el, offset });
		}
	}

	return layers;
};

/**
 * Remove the `--levita-offset` CSS custom property from all layer elements.
 *
 * @param layers - The layers to clean up
 */
export const cleanupLayers = (layers: Layer[]): void => {
	for (const layer of layers) {
		layer.el.style.removeProperty("--levita-offset");
	}
};
