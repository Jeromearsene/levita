import { Levita } from "levita-js";
import "levita-js/style.css";

/** Initialize a Levita instance on an element found by ID. */
const init = (id: string, options: ConstructorParameters<typeof Levita>[1]) => {
	const el = document.getElementById(id);
	if (el) return new Levita(el, options);
};

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

// ── Playground ──
{
	const playgroundEl = document.getElementById("card-playground");
	const controls = document.getElementById("playground-controls");
	const snippetEl = document.getElementById("playground-snippet");
	const resetBtn = document.getElementById("ctrl-reset");

	if (playgroundEl && controls) {
		let playgroundInstance = new Levita(playgroundEl, { gyroscope: false });

		const input = (id: string) => document.getElementById(`ctrl-${id}`) as HTMLInputElement;

		const defaults = {
			max: 15,
			perspective: 1000,
			scale: 1.05,
			speed: 200,
			reverse: false,
			glare: false,
			maxGlare: 0.5,
			shadow: false,
			disabled: false,
		};

		const readOptions = () => ({
			max: Number(input("max").value),
			perspective: Number(input("perspective").value),
			scale: Number(input("scale").value),
			speed: Number(input("speed").value),
			reverse: input("reverse").checked,
			glare: input("glare").checked,
			maxGlare: Number(input("maxGlare").value),
			shadow: input("shadow").checked,
			disabled: input("disabled").checked,
			gyroscope: false as const,
		});

		const syncOutputs = () => {
			for (const id of ["max", "perspective", "scale", "speed", "maxGlare"]) {
				const out = document.getElementById(`out-${id}`);
				if (out) out.textContent = input(id).value;
			}
		};

		const updateSnippet = () => {
			if (!snippetEl) return;
			const opts = readOptions();
			const entries: string[] = [];

			if (opts.max !== defaults.max) entries.push(`  max: ${opts.max}`);
			if (opts.perspective !== defaults.perspective)
				entries.push(`  perspective: ${opts.perspective}`);
			if (opts.scale !== defaults.scale) entries.push(`  scale: ${opts.scale}`);
			if (opts.speed !== defaults.speed) entries.push(`  speed: ${opts.speed}`);
			if (opts.reverse !== defaults.reverse) entries.push(`  reverse: ${opts.reverse}`);
			if (opts.glare !== defaults.glare) entries.push(`  glare: ${opts.glare}`);
			if (opts.glare && opts.maxGlare !== defaults.maxGlare)
				entries.push(`  maxGlare: ${opts.maxGlare}`);
			if (opts.shadow !== defaults.shadow) entries.push(`  shadow: ${opts.shadow}`);
			if (opts.disabled !== defaults.disabled) entries.push(`  disabled: ${opts.disabled}`);

			if (entries.length === 0) {
				snippetEl.textContent = "new Levita(el);";
			} else {
				snippetEl.textContent = `new Levita(el, {\n${entries.join(",\n")},\n});`;
			}
		};

		const resetControls = () => {
			input("max").value = String(defaults.max);
			input("perspective").value = String(defaults.perspective);
			input("scale").value = String(defaults.scale);
			input("speed").value = String(defaults.speed);
			input("reverse").checked = defaults.reverse;
			input("glare").checked = defaults.glare;
			input("maxGlare").value = String(defaults.maxGlare);
			input("shadow").checked = defaults.shadow;
			input("disabled").checked = defaults.disabled;
			syncOutputs();
			updateSnippet();
			playgroundInstance.destroy();
			playgroundInstance = new Levita(playgroundEl, { gyroscope: false });
		};

		controls.addEventListener("input", () => {
			syncOutputs();
			updateSnippet();
			playgroundInstance.destroy();
			playgroundInstance = new Levita(playgroundEl, readOptions());
		});

		resetBtn?.addEventListener("click", resetControls);
	}
}

// ── Gyroscope ──
const gyroInstance = init("card-gyro", { gyroscope: "auto", glare: true, shadow: true });
const gyroInfo = document.getElementById("gyro-info");

if (gyroInstance && gyroInfo) {
	gyroInstance.on("move", ({ x, y }) => {
		gyroInfo.textContent = `Gyro active — x: ${x.toFixed(1)}° y: ${y.toFixed(1)}°`;
	});
}
