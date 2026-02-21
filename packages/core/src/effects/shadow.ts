/**
 * Adds a dynamic drop shadow that shifts based on the tilt angle,
 * reinforcing the 3D depth illusion.
 *
 * Uses CSS custom properties (--levita-shadow-x, --levita-shadow-y)
 * combined with `filter: drop-shadow()` — no JS runs per animation frame.
 */
export class ShadowEffect {
	private el: HTMLElement;
	private maxOffset: number;

	/**
	 * @param el - The element to apply the shadow to
	 * @param maxOffset - Maximum shadow offset in pixels (default: 20)
	 */
	constructor(el: HTMLElement, maxOffset = 20) {
		this.el = el;
		this.maxOffset = maxOffset;
		this.el.classList.add("levita-shadow");
	}

	/**
	 * Update shadow offset based on normalized tilt values.
	 *
	 * @param normalizedX - Horizontal position [-1, 1]
	 * @param normalizedY - Vertical position [-1, 1]
	 */
	update = (normalizedX: number, normalizedY: number): void => {
		const shadowX = normalizedX * this.maxOffset;
		const shadowY = normalizedY * this.maxOffset;

		this.el.style.setProperty("--levita-shadow-x", `${shadowX}px`);
		this.el.style.setProperty("--levita-shadow-y", `${shadowY}px`);
	};

	/** Remove the shadow class and clean up CSS custom properties. */
	destroy = (): void => {
		this.el.classList.remove("levita-shadow");
		this.el.style.removeProperty("--levita-shadow-x");
		this.el.style.removeProperty("--levita-shadow-y");
	};
}
