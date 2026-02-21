import { expect, test } from "@playwright/test";
import { setupPage } from "./helpers.js";

test("basic tilt at rest", async ({ page }) => {
	await setupPage(page, '<div class="card levita">Basic Tilt</div>');
	await expect(page).toHaveScreenshot("rest.png");
});

test("tilt tilted", async ({ page }) => {
	await setupPage(page, '<div class="card levita">Tilted</div>');
	await page.evaluate(() => {
		const el = document.querySelector(".card") as HTMLElement;
		el.style.setProperty("--levita-x", "10deg");
		el.style.setProperty("--levita-y", "-8deg");
		el.style.setProperty("--levita-scale", "1.05");
	});
	// Wait for CSS transition to complete
	await page.waitForTimeout(500);
	await expect(page).toHaveScreenshot("tilted.png");
});

test("glare effect", async ({ page }) => {
	await setupPage(
		page,
		`<div class="card levita" style="position: relative;">
			Glare
			<div class="levita-glare">
				<div class="levita-glare-inner" style="--levita-glare-opacity: 0.4; --levita-glare-x: 70%; --levita-glare-y: 30%;"></div>
			</div>
		</div>`,
	);
	await expect(page).toHaveScreenshot("glare.png");
});

test("shadow effect", async ({ page }) => {
	await setupPage(
		page,
		`<div class="card levita levita-shadow" style="--levita-shadow-x: 8px; --levita-shadow-y: -6px;">
			Shadow
		</div>`,
	);
	await expect(page).toHaveScreenshot("shadow.png");
});

test("glare and shadow combined", async ({ page }) => {
	await setupPage(
		page,
		`<div class="card levita levita-shadow" style="position: relative; --levita-x: 8deg; --levita-y: -5deg; --levita-scale: 1.05; --levita-shadow-x: 6px; --levita-shadow-y: -4px;">
			Combined
			<div class="levita-glare">
				<div class="levita-glare-inner" style="--levita-glare-opacity: 0.35; --levita-glare-x: 65%; --levita-glare-y: 35%;"></div>
			</div>
		</div>`,
	);
	await page.waitForTimeout(500);
	await expect(page).toHaveScreenshot("combined.png");
});

test("parallax layers", async ({ page }) => {
	await setupPage(
		page,
		`<div class="card levita" style="position: relative; --levita-x: 5deg; --levita-y: -3deg;">
			<div data-levita-offset="-5" style="--levita-offset: -5; position: absolute; top: 15%; left: 10%; background: rgba(102, 126, 234, 0.3); padding: 4px 10px; border-radius: 6px; font-size: 11px; color: #e0e0e0; font-family: system-ui;">Back</div>
			<div data-levita-offset="0" style="--levita-offset: 0; background: rgba(118, 75, 162, 0.4); padding: 4px 10px; border-radius: 6px; font-size: 11px; color: #e0e0e0; font-family: system-ui;">Middle</div>
			<div data-levita-offset="10" style="--levita-offset: 10; position: absolute; bottom: 15%; right: 10%; background: rgba(234, 102, 180, 0.5); padding: 4px 10px; border-radius: 6px; font-size: 11px; color: #e0e0e0; font-family: system-ui;">Front</div>
		</div>`,
	);
	await page.waitForTimeout(500);
	await expect(page).toHaveScreenshot("layers.png");
});
