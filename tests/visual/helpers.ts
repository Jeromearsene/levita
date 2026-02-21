import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { Page } from "@playwright/test";

const __dirname = dirname(fileURLToPath(import.meta.url));
const cssPath = resolve(__dirname, "../../packages/core/src/style.css");
const css = readFileSync(cssPath, "utf8");

/** Base styles applied to all visual test pages. */
const baseStyles = `
	body {
		margin: 0;
		background: #1a1a2e;
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 300px;
	}
	.card {
		width: 200px;
		height: 150px;
		background: linear-gradient(145deg, #2a2a4e, #1e3a5f);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 16px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #e0e0e0;
		font-family: system-ui, sans-serif;
		font-size: 14px;
		position: relative;
		overflow: hidden;
	}
`;

/**
 * Set up a visual test page with Levita CSS and a card element.
 * Returns the card's CSS selector for further interaction.
 */
export const setupPage = async (page: Page, bodyContent: string): Promise<void> => {
	await page.setContent(`
		<!doctype html>
		<html>
			<head>
				<style>${css}</style>
				<style>${baseStyles}</style>
			</head>
			<body>${bodyContent}</body>
		</html>
	`);
};
