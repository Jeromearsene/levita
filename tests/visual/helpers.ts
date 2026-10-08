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

/**
 * Set up a page for animated recording with faster transitions.
 */
export const setupAnimatedPage = async (page: Page, bodyContent: string): Promise<void> => {
	const fastTransition = `
		body {
			position: relative;
			overflow: hidden;
			background:
				radial-gradient(ellipse at 50% 115%, rgba(61, 74, 170, 0.5), transparent 52%),
				linear-gradient(145deg, #11152a, #080a14 65%);
		}
		body::before {
			content: "";
			position: absolute;
			inset: 0;
			pointer-events: none;
			background-image:
				linear-gradient(rgba(177, 190, 255, 0.045) 1px, transparent 1px),
				linear-gradient(90deg, rgba(177, 190, 255, 0.045) 1px, transparent 1px);
			background-size: 32px 32px;
			mask-image: linear-gradient(to bottom, transparent, black 30%, black 75%, transparent);
		}
		.levita { --levita-speed: 100ms; }
		.card-stage { position: relative; width: 240px; height: 180px; }
		.card-parallax { position: relative; }
		.card-shadow {
			position: absolute;
			inset: 0;
			border-radius: 19px;
			background: #121328;
		}
		.card {
			position: relative;
			z-index: 1;
			margin: 0;
			box-sizing: border-box;
			width: 240px;
			height: 180px;
			padding: 17px 18px;
			border: 1px solid rgba(210, 218, 255, 0.2);
			border-radius: 19px;
			background:
				linear-gradient(130deg, rgba(255, 255, 255, 0.1), transparent 48%),
				linear-gradient(145deg, #262b56 0%, #171a39 54%, #121328 100%);
			box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.13), 0 24px 55px rgba(0, 0, 0, 0.38);
			color: #f4f5ff;
			font-family: Inter, ui-sans-serif, system-ui, sans-serif;
			text-align: left;
		}
		.card-art {
			position: absolute;
			width: 116px;
			height: 116px;
			top: 34px;
			right: 2px;
			border: 1px solid rgba(195, 204, 255, 0.21);
			border-radius: 50%;
			background: radial-gradient(circle, rgba(115, 129, 255, 0.16), transparent 68%);
			box-shadow: 0 0 34px rgba(100, 104, 255, 0.2);
		}
		.card-art::before, .card-art::after {
			content: "";
			position: absolute;
			border: 1px solid rgba(203, 211, 255, 0.3);
			border-radius: 50%;
			transform: rotate(-28deg) scaleY(0.38);
		}
		.card-art::before { inset: 10px -7px; }
		.card-art::after { inset: -7px 10px; transform: rotate(35deg) scaleX(0.4); }
		.card-orb {
			position: absolute;
			width: 59px;
			height: 59px;
			top: 62px;
			right: 30px;
			border-radius: 50%;
			background: radial-gradient(circle at 32% 27%, #fff 0, #a8b9ff 12%, #737cf6 38%, #bd74e8 68%, #553b9d 100%);
			box-shadow: 0 0 24px rgba(137, 122, 255, 0.85), 0 0 55px rgba(93, 108, 255, 0.36);
		}
		.card-orb::after {
			content: "";
			position: absolute;
			inset: 8px 14px 11px 8px;
			border-radius: 50%;
			background: radial-gradient(ellipse at 30% 25%, rgba(255, 255, 255, 0.52), rgba(255, 255, 255, 0.18) 36%, transparent 78%);
		}
		.card-parallax .card-orb { top: 34px; right: 50px; }
		.card-parallax .card-art {
			border-width: 2px;
			border-color: rgba(205, 213, 255, 0.36);
		}
		.card-parallax .card-art::before,
		.card-parallax .card-art::after {
			border-width: 2px;
			border-color: rgba(218, 225, 255, 0.52);
		}
		.card-active { position: relative; }
		.active-scene { position: absolute; inset: 0; overflow: hidden; background: linear-gradient(155deg, #f9a45c 0%, #c46086 38%, #433a7e 69%, #172544 100%); }
		.active-scene::before {
			content: "";
			position: absolute;
			inset: 0;
			background-image: radial-gradient(circle, rgba(255,255,255,.9) 0 1px, transparent 1.5px), radial-gradient(circle, rgba(255,255,255,.55) 0 1px, transparent 1.5px);
			background-size: 47px 43px, 71px 61px;
			background-position: 8px 4px, 23px 18px;
			opacity: .45;
		}
		.active-sun { position: absolute; top: 44px; right: 41px; width: 42px; height: 42px; border-radius: 50%; background: radial-gradient(circle at 34% 30%, #fff7cf, #ffc46d 62%, #f28c74); box-shadow: 0 0 30px rgba(255, 192, 125, .58); }
		.active-ridge { position: absolute; right: -20px; bottom: 0; left: -20px; }
		.active-ridge-back { height: 112px; background: linear-gradient(145deg, #7b5a9a, #39406c); clip-path: polygon(0 68%, 20% 30%, 39% 66%, 63% 15%, 83% 58%, 100% 34%, 100% 100%, 0 100%); filter: drop-shadow(0 -1px 0 rgba(255, 210, 232, 0.42)); }
		.active-ridge-front { height: 75px; background: linear-gradient(155deg, #394d73, #182640); clip-path: polygon(0 55%, 22% 25%, 42% 57%, 65% 17%, 82% 52%, 100% 30%, 100% 100%, 0 100%); filter: drop-shadow(0 -1px 0 rgba(177, 204, 255, 0.42)); }
		.active-shade { position: absolute; inset: 0; z-index: 1; background: linear-gradient(90deg, rgba(12, 17, 39, .58), transparent 85%), linear-gradient(0deg, rgba(9, 14, 31, .62), transparent 75%); }
		.card-top, .card-bottom { position: relative; z-index: 1; display: flex; align-items: center; justify-content: space-between; }
		.card-top { position: absolute; top: 17px; right: 18px; left: 18px; }
		.card-brand { color: #f5f6ff; font-size: 10px; font-weight: 800; letter-spacing: 0.18em; }
		.card-brand span { color: #9ca7ff; }
		.card-number { color: #b9beeb; font-size: 8px; letter-spacing: 0.1em; }
		.card-copy { position: absolute; z-index: 2; left: 19px; bottom: 41px; }
		.card-eyebrow { display: block; margin-bottom: 7px; color: #aab2ff; font-size: 7px; font-weight: 700; letter-spacing: 0.16em; }
		.card-copy strong { display: block; font-size: 23px; font-weight: 600; letter-spacing: -0.055em; line-height: 0.98; }
		.card-bottom { position: absolute; right: 18px; bottom: 15px; left: 19px; padding-top: 9px; border-top: 1px solid rgba(208, 214, 255, 0.16); color: #c3c7e5; font-size: 7px; font-weight: 600; letter-spacing: 0.14em; }
		.card-arrow { color: #aab2ff; font-size: 12px; }
	`;
	await page.setContent(`
		<!doctype html>
		<html>
			<head>
				<style>${css}</style>
				<style>${baseStyles}</style>
				<style>${fastTransition}</style>
			</head>
			<body>${bodyContent}</body>
		</html>
	`);
};
