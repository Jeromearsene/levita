export class ShadowEffect {
	private el: HTMLElement;
	private maxOffset: number;

	constructor(el: HTMLElement, maxOffset = 20) {
		this.el = el;
		this.maxOffset = maxOffset;
		this.el.classList.add("levita-shadow");
	}

	update(normalizedX: number, normalizedY: number): void {
		const shadowX = normalizedX * this.maxOffset;
		const shadowY = normalizedY * this.maxOffset;

		this.el.style.setProperty("--levita-shadow-x", `${shadowX}px`);
		this.el.style.setProperty("--levita-shadow-y", `${shadowY}px`);
	}

	destroy(): void {
		this.el.classList.remove("levita-shadow");
		this.el.style.removeProperty("--levita-shadow-x");
		this.el.style.removeProperty("--levita-shadow-y");
	}
}
