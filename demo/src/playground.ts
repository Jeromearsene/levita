import { Levita } from "levita-js";
import posterUrl from "../assets/showcase-poster.webp";

export function initPlayground() {
	const playgroundEl = document.getElementById("card-playground");
	const controls = document.getElementById("playground-controls");
	const snippetEl = document.getElementById("playground-snippet");
	const resetBtn = document.getElementById("ctrl-reset");
	const tabs = document.getElementById("playground-tabs");
	const copyBtn = document.getElementById("btn-copy");

	if (!playgroundEl || !controls) return;

	let playgroundInstance = new Levita(playgroundEl, { gyroscope: false });
	let currentFramework = "vanilla";

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

	const getCode = (framework: string) => {
		const opts = readOptions();
		const props: string[] = [];

		if (opts.max !== defaults.max) props.push(`max={${opts.max}}`);
		if (opts.perspective !== defaults.perspective)
			props.push(`perspective={${opts.perspective}}`);
		if (opts.scale !== defaults.scale) props.push(`scale={${opts.scale}}`);
		if (opts.speed !== defaults.speed) props.push(`speed={${opts.speed}}`);
		if (opts.reverse !== defaults.reverse) props.push("reverse");
		if (opts.glare !== defaults.glare) props.push("glare");
		if (opts.glare && opts.maxGlare !== defaults.maxGlare)
			props.push(`maxGlare={${opts.maxGlare}}`);
		if (opts.shadow !== defaults.shadow) props.push("shadow");
		if (opts.disabled !== defaults.disabled) props.push("disabled");

		const propsString = props.length > 0 ? ` ${props.join(" ")}` : "";

		switch (framework) {
			case "react":
				return `<Tilt${propsString}>\n  <div className="card">React</div>\n</Tilt>`;
			case "vue": {
				const vueProps = props.map((p) => {
					if (p.includes("={")) return `:${p.replace(/={|}/g, "")}`;
					return p;
				});
				const vuePropsString = vueProps.length > 0 ? ` ${vueProps.join(" ")}` : "";
				return `<Tilt${vuePropsString}>\n  <div class="card">Vue</div>\n</Tilt>`;
			}
			case "svelte": {
				const svelteOpts = props
					.map((p) => {
						if (p.includes("={")) return p.replace(/={|}/g, ": ");
						return `${p}: true`;
					})
					.join(", ");
				const svelteOptsString = svelteOpts.length > 0 ? `={{ ${svelteOpts} }}` : "";
				return `<div use:tilt${svelteOptsString} class="card">\n  Svelte\n</div>`;
			}
			default: {
				// Vanilla
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

				if (entries.length === 0) return "new Levita(el);";
				return `new Levita(el, {\n${entries.join(",\n")},\n});`;
			}
		}
	};

	const updateSnippet = () => {
		if (snippetEl) {
			snippetEl.textContent = getCode(currentFramework);
		}

		// Update preview card content using the imported asset URL to ensure it works on GitHub Pages
		if (playgroundEl) {
			const frameworkName = currentFramework.charAt(0).toUpperCase() + currentFramework.slice(1);
			playgroundEl.innerHTML = `
				<img src="${posterUrl}" alt="Playground preview poster" data-levita-offset="0" class="absolute inset-0 size-full object-cover rounded-[inherit]" />
				<div data-levita-offset="45" class="absolute inset-0 flex items-center justify-center z-10">
					<p class="text-3xl font-bold uppercase tracking-wider drop-shadow-lg text-white">${frameworkName}</p>
				</div>
			`;
			// Re-initialize to pick up new layers from the updated innerHTML
			playgroundInstance.destroy();
			playgroundInstance = new Levita(playgroundEl, readOptions());
		}
	};

	const openInStackBlitz = () => {
		const framework = currentFramework;
		const url = `https://stackblitz.com/github/Jeromearsene/levita/tree/main/examples/${framework}`;
		window.open(url, "_blank");
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

	tabs?.addEventListener("click", (e) => {
		const btn = (e.target as HTMLElement).closest("button");
		if (!btn) return;

		currentFramework = btn.dataset.framework || "vanilla";

		tabs.querySelectorAll("button").forEach((b) => {
			b.classList.remove("bg-white/10", "text-white");
			b.classList.add("text-gray-400");
		});
		btn.classList.add("bg-white/10", "text-white");
		btn.classList.remove("text-gray-400");

		updateSnippet();
	});

	copyBtn?.addEventListener("click", () => {
		const text = snippetEl?.textContent || "";
		navigator.clipboard.writeText(text);
		const originalHtml = copyBtn.innerHTML;
		copyBtn.innerHTML =
			'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2dd4bf" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
		setTimeout(() => {
			copyBtn.innerHTML = originalHtml;
		}, 2000);
	});

	const stackblitzBtn = document.getElementById("btn-stackblitz");
	stackblitzBtn?.addEventListener("click", openInStackBlitz);

	resetBtn?.addEventListener("click", resetControls);
}
