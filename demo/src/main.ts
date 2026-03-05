import { Levita } from "levita-js";
import "levita-js/style.css";
import { fetchStars } from "./github.js";
import { initGyro } from "./gyro.js";
import { init } from "./lib.js";
import { initPlayground } from "./playground.js";

// ── Hero ──
init("card-hero", { glare: true, shadow: true, gyroscope: false });

// ── Showcase ──
init("card-profile", { glare: true, shadow: true, gyroscope: false });
init("card-product", { glare: true, shadow: true, gyroscope: false });
init("card-poster", { glare: true, shadow: true, gyroscope: false });
init("card-artwork", { glare: true, shadow: true, gyroscope: false });

// ── High Depth ──
init("card-high-depth", {
	glare: true,
	shadow: true,
	gyroscope: false,
	max: 10,
	perspective: 1500,
});

// ── Grouped ──
const groupedContainer = document.getElementById("container-grouped");
if (groupedContainer) {
	const cards = groupedContainer.querySelectorAll<HTMLElement>(".card-grouped");
	for (const card of cards) {
		new Levita(card, {
			eventsEl: groupedContainer,
			glare: true,
			shadow: true,
			gyroscope: false,
			max: 25,
		});
	}
}

// ── Sections ──
initPlayground();
initGyro();
fetchStars();
