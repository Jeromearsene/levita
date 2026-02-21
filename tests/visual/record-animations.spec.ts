import { test } from "@playwright/test";
import { setupAnimatedPage } from "./helpers.js";

/**
 * Record animated GIFs for documentation.
 * NOT run in CI — use `pnpm test:visual:record` to regenerate.
 */

/** Animate custom properties along a circular cursor path. */
const animateCircle = async (
	page: import("@playwright/test").Page,
	opts: { glare?: boolean; shadow?: boolean } = {},
	steps = 40,
	duration = 2000,
) => {
	const delay = duration / steps;
	const max = 15; // max tilt degrees

	for (let i = 0; i <= steps; i++) {
		const angle = (i / steps) * Math.PI * 2;
		const nx = Math.cos(angle); // normalized [-1, 1]
		const ny = Math.sin(angle);

		await page.evaluate(
			({ nx, ny, max, glare, shadow }) => {
				const el = document.querySelector(".card") as HTMLElement;
				el.style.setProperty("--levita-y", `${(nx * max).toFixed(1)}deg`);
				el.style.setProperty("--levita-x", `${(-ny * max).toFixed(1)}deg`);
				el.style.setProperty("--levita-scale", "1.05");

				if (glare) {
					const inner = el.querySelector(".levita-glare-inner") as HTMLElement;
					if (inner) {
						inner.style.setProperty("--levita-glare-x", `${(((nx + 1) / 2) * 100).toFixed(0)}%`);
						inner.style.setProperty("--levita-glare-y", `${(((ny + 1) / 2) * 100).toFixed(0)}%`);
						inner.style.setProperty("--levita-glare-opacity", "0.4");
					}
				}

				if (shadow) {
					el.style.setProperty("--levita-shadow-x", `${(nx * 10).toFixed(1)}px`);
					el.style.setProperty("--levita-shadow-y", `${(ny * 10).toFixed(1)}px`);
				}
			},
			{ nx, ny, max, glare: opts.glare, shadow: opts.shadow },
		);
		await page.waitForTimeout(delay);
	}

	// Reset to rest
	await page.evaluate(() => {
		const el = document.querySelector(".card") as HTMLElement;
		el.style.setProperty("--levita-x", "0deg");
		el.style.setProperty("--levita-y", "0deg");
		el.style.setProperty("--levita-scale", "1");
		const inner = el.querySelector(".levita-glare-inner") as HTMLElement;
		if (inner) inner.style.setProperty("--levita-glare-opacity", "0");
		el.style.setProperty("--levita-shadow-x", "0px");
		el.style.setProperty("--levita-shadow-y", "0px");
	});
	await page.waitForTimeout(600);
};

const GLARE_HTML = `<div class="levita-glare"><div class="levita-glare-inner"></div></div>`;

test.use({
	video: { mode: "on", size: { width: 400, height: 300 } },
});

test("tilt-demo", async ({ page }) => {
	await setupAnimatedPage(page, '<div class="card levita">Tilt</div>');
	await animateCircle(page);
});

test("glare-demo", async ({ page }) => {
	await setupAnimatedPage(
		page,
		`<div class="card levita" style="position: relative;">Glare${GLARE_HTML}</div>`,
	);
	await animateCircle(page, { glare: true });
});

test("shadow-demo", async ({ page }) => {
	await setupAnimatedPage(page, '<div class="card levita levita-shadow">Shadow</div>');
	await animateCircle(page, { shadow: true });
});

test("combined-demo", async ({ page }) => {
	await setupAnimatedPage(
		page,
		`<div class="card levita levita-shadow" style="position: relative;">Combined${GLARE_HTML}</div>`,
	);
	await animateCircle(page, { glare: true, shadow: true });
});
