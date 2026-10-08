import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import { test } from "@playwright/test";
import { setupAnimatedPage } from "./helpers.js";

/**
 * Record animated WebP previews for documentation.
 * Generate the documentation animation assets with `pnpm test:visual:record`.
 */

/** Animate custom properties along a circular cursor path. */
const animateCircle = async (
	page: import("@playwright/test").Page,
	framesDirectory: string,
	opts: { glare?: boolean; shadow?: boolean } = {},
	steps = 40,
	duration = 2000,
) => {
	const delay = duration / steps;
	const max = 15; // max tilt degrees

	// Start and end at the same point so the animation loops without a snap.
	await page.evaluate(
		({ max, glare, shadow }) => {
			const el = document.querySelector(".card") as HTMLElement;
			el.style.setProperty("--levita-y", `${max}deg`);
			el.style.setProperty("--levita-x", "0deg");
			el.style.setProperty("--levita-scale", "1.05");
			el.style.setProperty("--levita-percent-x", "1");
			el.style.setProperty("--levita-percent-y", "0");

			if (glare) {
				const inner = el.querySelector(".levita-glare-inner") as HTMLElement;
				if (inner) {
					inner.style.setProperty("--levita-glare-x", "100%");
					inner.style.setProperty("--levita-glare-y", "50%");
					inner.style.setProperty("--levita-glare-opacity", "0.4");
				}
			}

			if (shadow) {
				const shadowLayer = document.querySelector(".card-shadow") as HTMLElement;
				shadowLayer.style.setProperty("--levita-shadow-x", "10px");
				shadowLayer.style.setProperty("--levita-shadow-y", "0px");
			}
		},
		{ max, glare: opts.glare, shadow: opts.shadow },
	);
	await page.waitForTimeout(150);
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
				el.style.setProperty("--levita-percent-x", nx.toFixed(3));
				el.style.setProperty("--levita-percent-y", ny.toFixed(3));

				if (glare) {
					const inner = el.querySelector(".levita-glare-inner") as HTMLElement;
					if (inner) {
						inner.style.setProperty("--levita-glare-x", `${(((nx + 1) / 2) * 100).toFixed(0)}%`);
						inner.style.setProperty("--levita-glare-y", `${(((ny + 1) / 2) * 100).toFixed(0)}%`);
						inner.style.setProperty("--levita-glare-opacity", "0.4");
					}
				}

				if (shadow) {
					const shadowLayer = document.querySelector(".card-shadow") as HTMLElement;
					shadowLayer.style.setProperty("--levita-shadow-x", `${(nx * 10).toFixed(1)}px`);
					shadowLayer.style.setProperty("--levita-shadow-y", `${(ny * 10).toFixed(1)}px`);
				}
			},
			{ nx, ny, max, glare: opts.glare, shadow: opts.shadow },
		);
		await page.waitForTimeout(delay);
		await page.screenshot({ path: join(framesDirectory, `frame-${String(i).padStart(4, "0")}.png`), scale: "device" });
	}
};

const GLARE_HTML = `<div class="levita-glare"><div class="levita-glare-inner"></div></div>`;

const showcaseCard = (effect: string, options: { glare?: boolean; shadow?: boolean } = {}) => `
	<div class="card-stage">
		${options.shadow ? '<div class="card-shadow levita-shadow" aria-hidden="true"></div>' : ""}
		<div class="card levita">
			<div class="card-art" aria-hidden="true"></div>
			<div class="card-orb" aria-hidden="true"></div>
			<div class="card-top">
				<span class="card-brand">LE<span>V</span>ITA</span>
				<span class="card-number">01 / ${effect}</span>
			</div>
			<div class="card-copy">
				<span class="card-eyebrow">A NEW DIMENSION OF UI</span>
				<strong>Feel the<br>difference.</strong>
			</div>
			<div class="card-bottom"><span>MOVE TO EXPLORE</span><span class="card-arrow">↗</span></div>
			${options.glare ? GLARE_HTML : ""}
		</div>
	</div>
`;

const parallaxCard = () => `
	<div class="card card-parallax levita">
		<div class="card-art" data-levita-offset="0" style="--levita-offset: 0" aria-hidden="true"></div>
		<div class="card-orb" data-levita-offset="180" style="--levita-offset: 180" aria-hidden="true"></div>
		<div class="card-top">
			<span class="card-brand">LE<span>V</span>ITA</span>
		</div>
		<div class="card-copy">
			<span class="card-eyebrow">LAYERED DEPTH</span>
			<strong>Layers<br>in motion.</strong>
		</div>
		<div class="card-bottom"><span>MOVE TO EXPLORE</span><span class="card-arrow">↗</span></div>
	</div>
`;

const activeOffsetCard = () => `
	<div class="card card-active levita" style="--levita-active-offset: 18px; --levita-active-scale: 1.2;">
		<div class="active-scene" data-levita-active aria-hidden="true">
			<div class="active-sun"></div>
			<div class="active-ridge active-ridge-back"></div>
			<div class="active-ridge active-ridge-front"></div>
		</div>
		<div class="active-shade" aria-hidden="true"></div>
		<div class="card-top">
			<span class="card-brand">LE<span>V</span>ITA</span>
			<span class="card-number">03 / DISCOVERY</span>
		</div>
		<div class="card-copy">
			<span class="card-eyebrow">A WINDOW INTO MORE</span>
			<strong>Every angle<br>reveals more.</strong>
		</div>
		<div class="card-bottom"><span>MOVE TO EXPLORE</span><span class="card-arrow">↗</span></div>
	</div>
`;

test("tilt-demo", async ({ page }, testInfo) => {
	await setupAnimatedPage(page, showcaseCard("TILT"));
	await mkdir(testInfo.outputDir, { recursive: true });
	await animateCircle(page, testInfo.outputDir);
});

test("glare-demo", async ({ page }, testInfo) => {
	await setupAnimatedPage(page, showcaseCard("GLARE", { glare: true }));
	await mkdir(testInfo.outputDir, { recursive: true });
	await animateCircle(page, testInfo.outputDir, { glare: true });
});

test("shadow-demo", async ({ page }, testInfo) => {
	await setupAnimatedPage(page, showcaseCard("SHADOW", { shadow: true }));
	await mkdir(testInfo.outputDir, { recursive: true });
	await animateCircle(page, testInfo.outputDir, { shadow: true });
});

test("combined-demo", async ({ page }, testInfo) => {
	await setupAnimatedPage(page, showcaseCard("FULL EFFECT", { glare: true, shadow: true }));
	await mkdir(testInfo.outputDir, { recursive: true });
	await animateCircle(page, testInfo.outputDir, { glare: true, shadow: true });
});

test("parallax-demo", async ({ page }, testInfo) => {
	await setupAnimatedPage(page, parallaxCard());
	await mkdir(testInfo.outputDir, { recursive: true });
	await animateCircle(page, testInfo.outputDir);
});

test("active-offset-demo", async ({ page }, testInfo) => {
	await setupAnimatedPage(page, activeOffsetCard());
	await mkdir(testInfo.outputDir, { recursive: true });
	await animateCircle(page, testInfo.outputDir);
});
