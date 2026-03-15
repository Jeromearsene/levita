import posterImg from "@assets/showcase-poster.webp";
import type { HapticPreset } from "@levita-js/haptics";
import { HAPTIC_PRESETS, haptics, isHapticsSupported } from "@levita-js/haptics";
import type { LevitaOptions, LevitaPlugin } from "levita-js";
import { useMemo, useState } from "preact/hooks";
import type { Framework } from "../constants";
import { CodeTabs } from "./CodeTabs";
import { Tilt } from "./Tilt";

/**
 * Interactive playground component.
 * Allows users to tweak Levita parameters and see the resulting code for various frameworks.
 */
export function Playground() {
	const [currentFramework, setCurrentFramework] = useState<Framework>("vanilla");

	/** Current options state, subset of LevitaOptions used in the playground. */
	const [opts, setOpts] = useState<Partial<LevitaOptions>>({
		max: 15,
		perspective: 1000,
		scale: 1.05,
		speed: 200,
		reverse: false,
		glare: false,
		maxGlare: 0.5,
		shadow: false,
		disabled: false,
	});

	const hapticsSupported = useMemo(() => isHapticsSupported(), []);
	const [hapticsEnabled, setHapticsEnabled] = useState(false);
	const [hapticsIntensity, setHapticsIntensity] = useState<HapticPreset>("light");

	const plugins: LevitaPlugin[] = useMemo(
		() =>
			hapticsEnabled
				? [
						haptics({
							feedbackEvents: {
								enter: hapticsIntensity,
								leave: hapticsIntensity,
								maxTilt: hapticsIntensity,
							},
						}),
					]
				: [],
		[hapticsEnabled, hapticsIntensity],
	);

	/** Default values for comparison to only show modified props in snippets. */
	const defaults = useMemo(
		() => ({
			max: 15,
			perspective: 1000,
			scale: 1.05,
			speed: 200,
			reverse: false,
			glare: false,
			maxGlare: 0.5,
			shadow: false,
			disabled: false,
		}),
		[],
	);

	/** Generates all code snippets for every framework based on current options. */
	const snippets = useMemo(() => {
		const buildSnippet = (framework: Framework): string => {
			const props: string[] = [];
			if (opts.max !== defaults.max) props.push(`max={${opts.max}}`);
			if (opts.perspective !== defaults.perspective)
				props.push(`perspective={${opts.perspective}}`);
			if (opts.scale !== defaults.scale) props.push(`scale={${opts.scale}}`);
			if (opts.speed !== defaults.speed) props.push(`speed={${opts.speed}}`);
			if (opts.reverse) props.push("reverse");
			if (opts.glare) props.push("glare");
			if (opts.glare && opts.maxGlare !== defaults.maxGlare)
				props.push(`maxGlare={${opts.maxGlare}}`);
			if (opts.shadow) props.push("shadow");
			if (opts.disabled) props.push("disabled");

			const propsString = props.length > 0 ? ` ${props.join(" ")}` : "";

			switch (framework) {
				case "react":
					return `<Tilt${propsString}>\n  <div className="card">React</div>\n</Tilt>`;
				case "vue": {
					const vueProps = props.map((p) => (p.includes("={") ? `:${p.replace(/={|}/g, "")}` : p));
					return `<Tilt${vueProps.length > 0 ? ` ${vueProps.join(" ")}` : ""}>\n  <div class="card">Vue</div>\n</Tilt>`;
				}
				case "svelte": {
					const svelteOpts = props
						.map((p) => (p.includes("={") ? p.replace(/={|}/g, ": ") : `${p}: true`))
						.join(", ");
					return `<div use:tilt${svelteOpts.length > 0 ? `={{ ${svelteOpts} }}` : ""} class="card">\n  Svelte\n</div>`;
				}
				case "angular": {
					const angOpts = props
						.map((p) => {
							if (p.includes("={"))
								return p
									.replace(/={|}/g, ": ")
									.replace(
										/max:|perspective:|scale:|speed:|maxGlare:/,
										(m) => `${m.slice(0, -1)}:`,
									);
							return `${p}: true`;
						})
						.join(", ");
					const angPropsString = angOpts.length > 0 ? `[levita]="{ ${angOpts} }"` : "levita";
					return `<div ${angPropsString} class="card">\n  Angular\n</div>`;
				}
				default: {
					const entries: string[] = [];
					if (opts.max !== defaults.max) entries.push(`  max: ${opts.max}`);
					if (opts.perspective !== defaults.perspective)
						entries.push(`  perspective: ${opts.perspective}`);
					if (opts.scale !== defaults.scale) entries.push(`  scale: ${opts.scale}`);
					if (opts.speed !== defaults.speed) entries.push(`  speed: ${opts.speed}`);
					if (opts.reverse) entries.push(`  reverse: ${opts.reverse}`);
					if (opts.glare) entries.push(`  glare: ${opts.glare}`);
					if (opts.glare && opts.maxGlare !== defaults.maxGlare)
						entries.push(`  maxGlare: ${opts.maxGlare}`);
					if (opts.shadow) entries.push(`  shadow: ${opts.shadow}`);
					if (opts.disabled) entries.push(`  disabled: ${opts.disabled}`);

					return entries.length === 0
						? "new Levita(el);"
						: `new Levita(el, {\n${entries.join(",\n")},\n});`;
				}
			}
		};

		return {
			vanilla: buildSnippet("vanilla"),
			react: buildSnippet("react"),
			vue: buildSnippet("vue"),
			svelte: buildSnippet("svelte"),
			angular: buildSnippet("angular"),
		};
	}, [opts, defaults]);

	const openStackBlitz = () => {
		window.open(
			`https://stackblitz.com/github/Jeromearsene/levita/tree/main/examples/${currentFramework}`,
			"_blank",
		);
	};

	const resetPlayground = () => {
		setOpts({ ...defaults });
		setHapticsEnabled(false);
		setHapticsIntensity("light");
	};

	/** Helper to update a single option in the state. */
	const updateOpt = <K extends keyof LevitaOptions>(key: K, val: LevitaOptions[K]) => {
		setOpts((prev) => ({ ...prev, [key]: val }));
	};

	return (
		<section id="playground" class="max-w-5xl mx-auto px-16 sm:px-8 py-16">
			<h2 class="text-3xl font-bold text-center mb-2">Playground</h2>
			<p class="text-center text-gray-400 mb-10">Tweak every parameter in real-time</p>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
				<div class="flex items-center justify-center">
					<Tilt
						options={opts}
						plugins={plugins}
						class="relative aspect-[3/4] w-full rounded-2xl bg-surface border border-border cursor-pointer"
					>
						<img
							src={posterImg}
							alt="Preview"
							data-levita-offset="0"
							class="absolute inset-0 size-full object-cover rounded-[inherit]"
						/>
						<div
							data-levita-offset="45"
							class="absolute inset-0 flex items-center justify-center z-10"
						>
							<p class="text-3xl font-bold uppercase tracking-wider drop-shadow-lg text-white">
								{currentFramework.charAt(0).toUpperCase() + currentFramework.slice(1)}
							</p>
						</div>
					</Tilt>
				</div>

				<div class="flex flex-col gap-6">
					<div class="flex flex-col gap-3">
						{(
							Object.entries(opts) as [keyof LevitaOptions, LevitaOptions[keyof LevitaOptions]][]
						).map(([key, value]) => {
							if (typeof value === "number") {
								return (
									<label key={key} class="flex flex-col gap-1 text-sm text-gray-400">
										<span class="flex justify-between">
											{key} <output class="text-accent font-semibold tabular-nums">{value}</output>
										</span>
										<input
											type="range"
											value={value}
											onInput={(e) => updateOpt(key, Number(e.currentTarget.value))}
											min={key === "scale" ? 1 : key === "perspective" ? 300 : 0}
											max={
												key === "scale"
													? 1.3
													: key === "perspective"
														? 2000
														: key === "speed"
															? 1000
															: 45
											}
											step={key === "scale" ? 0.01 : key === "maxGlare" ? 0.05 : 1}
											class="w-full accent-accent"
										/>
									</label>
								);
							}
							if (typeof value === "boolean") {
								return (
									<label key={key} class="flex items-center justify-between text-sm text-gray-400">
										<span>{key}</span>
										<input
											type="checkbox"
											checked={value}
											onChange={(e) => updateOpt(key, e.currentTarget.checked)}
											class="toggle-switch"
										/>
									</label>
								);
							}
							return null;
						})}
						{hapticsSupported && (
							<div class="flex flex-col gap-2 pt-2 border-t border-border">
								<label class="flex items-center justify-between text-sm text-gray-400">
									<span>haptics</span>
									<input
										type="checkbox"
										checked={hapticsEnabled}
										onChange={(e) => setHapticsEnabled(e.currentTarget.checked)}
										class="toggle-switch"
									/>
								</label>
								{hapticsEnabled && (
									<div class="flex gap-1.5">
										{HAPTIC_PRESETS.map((preset) => (
											<button
												key={preset}
												type="button"
												class={`flex-1 px-2 py-1 text-xs font-semibold rounded-md transition ${hapticsIntensity === preset ? "bg-accent text-bg" : "bg-surface text-gray-400 border border-border hover:text-white"}`}
												onClick={() => setHapticsIntensity(preset)}
											>
												{preset}
											</button>
										))}
									</div>
								)}
							</div>
						)}
						<button
							type="button"
							class="w-full px-4 py-2 text-sm rounded-lg bg-surface text-gray-400 border border-border hover:border-white/20 transition"
							onClick={resetPlayground}
						>
							Reset
						</button>
					</div>

					<CodeTabs snippets={snippets} onFrameworkChange={setCurrentFramework}>
						<button
							type="button"
							onClick={openStackBlitz}
							class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface border border-white/20 text-xs font-semibold text-gray-300 hover:text-white hover:bg-slate-700 hover:border-accent transition shadow-xl"
						>
							<svg
								width="14"
								height="14"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
							>
								<title>StackBlitz</title>
								<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
							</svg>
							StackBlitz
						</button>
					</CodeTabs>
				</div>
			</div>
		</section>
	);
}
