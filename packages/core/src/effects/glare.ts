export class GlareEffect {
	private container: HTMLElement;
	private inner: HTMLElement;
	private maxOpacity: number;

	constructor(el: HTMLElement, maxOpacity: number) {
		this.maxOpacity = maxOpacity;

		this.container = document.createElement("div");
		this.container.classList.add("levita-glare");

		this.inner = document.createElement("div");
		this.inner.classList.add("levita-glare-inner");

		this.container.appendChild(this.inner);
		el.appendChild(this.container);

		if (!el.style.position || el.style.position === "static") {
			el.style.position = "relative";
		}
	}

	update(normalizedX: number, normalizedY: number): void {
		const glareX = ((normalizedX + 1) / 2) * 100;
		const glareY = ((normalizedY + 1) / 2) * 100;
		const intensity = Math.sqrt(normalizedX ** 2 + normalizedY ** 2) / Math.SQRT2;

		this.inner.style.setProperty("--levita-glare-x", `${glareX}%`);
		this.inner.style.setProperty("--levita-glare-y", `${glareY}%`);
		this.inner.style.setProperty("--levita-glare-opacity", `${intensity * this.maxOpacity}`);
	}

	destroy(): void {
		this.container.remove();
	}
}
