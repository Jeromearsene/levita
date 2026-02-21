export interface Layer {
	el: HTMLElement;
	offset: number;
}

export function scanLayers(container: HTMLElement): Layer[] {
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
}

export function cleanupLayers(layers: Layer[]): void {
	for (const layer of layers) {
		layer.el.style.removeProperty("--levita-offset");
	}
}
