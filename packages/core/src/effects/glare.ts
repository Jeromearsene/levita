/**
 * Creates a radial gradient overlay that follows the tilt position,
 * simulating light reflection on the surface.
 *
 * Injects two DOM elements (.levita-glare > .levita-glare-inner) into
 * the target element. Position and opacity are driven by CSS custom
 * properties — no JS runs per animation frame.
 */
export class GlareEffect {
	private container: HTMLElement;
	private inner: HTMLElement;
	private maxOpacity: number;

	/**
	 * @param el - The element to attach the glare overlay to
	 * @param maxOpacity - Maximum glare opacity (0-1)
	 */
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

	/**
	 * Update glare position and intensity based on normalized tilt values.
	 * Sets CSS custom properties that the stylesheet uses for rendering.
	 *
	 * @param normalizedX - Horizontal position [-1, 1]
	 * @param normalizedY - Vertical position [-1, 1]
	 */
	update = (normalizedX: number, normalizedY: number): void => {
		const glareX = ((normalizedX + 1) / 2) * 100;
		const glareY = ((normalizedY + 1) / 2) * 100;
		const intensity = Math.sqrt(normalizedX ** 2 + normalizedY ** 2) / Math.SQRT2;

		this.inner.style.setProperty("--levita-glare-x", `${glareX}%`);
		this.inner.style.setProperty("--levita-glare-y", `${glareY}%`);
		this.inner.style.setProperty("--levita-glare-opacity", `${intensity * this.maxOpacity}`);
	};

	/** Remove the glare DOM elements from the parent. */
	destroy = (): void => {
		this.container.remove();
	};
}
