import { Levita, type LevitaEventMap } from "levita-js";
import "levita-js/style.css";
import abbeyRoadImg from "@assets/abbey-road.webp";
import darkSideImg from "@assets/dark-side.webp";
import forEmmaImg from "@assets/for-emma.webp";
import heroImg from "@assets/hero.webp";
import artworkImg from "@assets/showcase-artwork.webp";
import posterImg from "@assets/showcase-poster.webp";
import productImg from "@assets/showcase-product.webp";
import profileImg from "@assets/showcase-profile.webp";
import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import { Tilt } from "./components/Tilt";

interface PlaygroundOpts {
	max: number;
	perspective: number;
	scale: number;
	speed: number;
	reverse: boolean;
	glare: boolean;
	maxGlare: number;
	shadow: boolean;
	disabled: boolean;
	gyroscope: false;
}

export function App() {
	// ── GitHub Stars ──
	const [githubStars, setGithubStars] = useState("GitHub");
	useEffect(() => {
		fetch("https://api.github.com/repos/Jeromearsene/levita")
			.then((res) => res.json())
			.then((data) => {
				if (data.stargazers_count !== undefined) {
					setGithubStars(`${data.stargazers_count.toLocaleString()} stars`);
				}
			})
			.catch(() => {});
	}, []);

	// ── Playground State ──
	const [currentFramework, setCurrentFramework] = useState("vanilla");
	const [opts, setOpts] = useState<PlaygroundOpts>({
		max: 15,
		perspective: 1000,
		scale: 1.05,
		speed: 200,
		reverse: false,
		glare: false,
		maxGlare: 0.5,
		shadow: false,
		disabled: false,
		gyroscope: false,
	});

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

	const snippet = useMemo(() => {
		const props: string[] = [];
		if (opts.max !== defaults.max) props.push(`max={${opts.max}}`);
		if (opts.perspective !== defaults.perspective) props.push(`perspective={${opts.perspective}}`);
		if (opts.scale !== defaults.scale) props.push(`scale={${opts.scale}}`);
		if (opts.speed !== defaults.speed) props.push(`speed={${opts.speed}}`);
		if (opts.reverse) props.push("reverse");
		if (opts.glare) props.push("glare");
		if (opts.glare && opts.maxGlare !== defaults.maxGlare)
			props.push(`maxGlare={${opts.maxGlare}}`);
		if (opts.shadow) props.push("shadow");
		if (opts.disabled) props.push("disabled");

		const propsString = props.length > 0 ? ` ${props.join(" ")}` : "";

		switch (currentFramework) {
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
	}, [currentFramework, opts, defaults]);

	const [copyStatus, setCopyStatus] = useState(false);
	const copyCode = () => {
		navigator.clipboard.writeText(snippet);
		setCopyStatus(true);
		setTimeout(() => setCopyStatus(false), 2000);
	};

	const openStackBlitz = () => {
		window.open(
			`https://stackblitz.com/github/Jeromearsene/levita/tree/main/examples/${currentFramework}`,
			"_blank",
		);
	};

	const resetPlayground = () => {
		setOpts({ ...defaults, gyroscope: false });
	};

	// ── Gyroscope ──
	const [gyroInfo, setGyroInfo] = useState("Tap the card on a mobile device to enable gyroscope.");
	const handleGyroMove = (values: LevitaEventMap["move"]) => {
		setGyroInfo(`Gyro active — x: ${values.x.toFixed(1)}° y: ${values.y.toFixed(1)}°`);
	};

	// ── Grouped ──
	const groupedRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		if (groupedRef.current) {
			const cards = groupedRef.current.querySelectorAll<HTMLElement>(".card-grouped");
			const instances: Levita[] = [];
			for (const card of cards) {
				instances.push(
					new Levita(card, {
						eventsEl: groupedRef.current || undefined,
						glare: true,
						shadow: true,
						gyroscope: false,
						max: 25,
					}),
				);
			}
			return () => {
				for (const inst of instances) inst.destroy();
			};
		}
	}, []);

	const updateOpt = <K extends keyof PlaygroundOpts>(key: K, val: PlaygroundOpts[K]) => {
		setOpts((prev) => ({ ...prev, [key]: val }));
	};

	return (
		<>
			{/* Hero */}
			<section class="flex flex-col items-center justify-center min-h-screen px-8 text-center">
				<h1 class="bg-linear-to-br from-accent to-accent-end bg-clip-text text-transparent text-5xl sm:text-7xl font-bold leading-tight">
					Levita
				</h1>
				<p class="text-gray-400 text-lg mt-2 mb-12">
					Lightweight 3D tilt & parallax with accelerometer support
				</p>

				<Tilt
					options={{ glare: true, shadow: true, gyroscope: false }}
					id="card-hero"
					class="relative w-[min(480px,90vw)] aspect-[4/3] rounded-2xl bg-surface border border-border"
				>
					<img
						src={heroImg}
						alt="Alps landscape"
						data-levita-offset="0"
						class="absolute inset-0 size-full object-cover rounded-[inherit]"
					/>
					<div
						data-levita-offset="50"
						class="absolute inset-0 flex flex-col items-center justify-center z-10"
					>
						<p class="text-5xl font-bold text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.7)]">
							Explore
						</p>
						<p class="text-lg text-gray-200 mt-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">
							The Alps
						</p>
					</div>
				</Tilt>

				<div class="flex gap-4 mt-10">
					<a
						href="https://github.com/Jeromearsene/levita#getting-started"
						class="inline-flex items-center px-7 py-3 rounded-xl font-semibold bg-linear-to-br from-accent to-accent-end text-bg hover:opacity-90 transition"
					>
						Get Started
					</a>
					<a
						href="https://github.com/Jeromearsene/levita"
						class="inline-flex items-center px-7 py-3 rounded-xl font-semibold border border-border text-white hover:border-white/20 transition"
					>
						GitHub
					</a>
				</div>
				<p class="text-gray-500 text-sm mt-4">~2KB gzipped</p>
			</section>

			{/* Showcase */}
			<section class="max-w-5xl mx-auto px-8 py-16">
				<h2 class="text-3xl font-bold text-center mb-2">Showcase</h2>
				<p class="text-center text-gray-400 mb-10">Hover the cards to see the effect in action</p>

				<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
					<Tilt
						options={{ glare: true, shadow: true, gyroscope: false }}
						class="relative aspect-[3/4] rounded-2xl bg-surface border border-border cursor-pointer"
					>
						<img
							src={profileImg}
							alt="Profile"
							data-levita-offset="0"
							class="absolute inset-0 size-full object-cover rounded-[inherit]"
						/>
						<div data-levita-offset="45" class="absolute bottom-6 left-6 right-6 z-10">
							<p class="text-2xl font-bold drop-shadow-lg">Jane Doe</p>
							<p class="text-sm text-gray-300 mt-1 drop-shadow-lg">Designer</p>
						</div>
					</Tilt>

					<Tilt
						options={{ glare: true, shadow: true, gyroscope: false }}
						class="relative aspect-[3/4] rounded-2xl bg-surface border border-border cursor-pointer"
					>
						<img
							src={productImg}
							alt="Product"
							data-levita-offset="0"
							class="absolute inset-0 size-full object-cover rounded-[inherit]"
						/>
						<div
							data-levita-offset="50"
							class="absolute top-5 right-5 flex flex-col items-end gap-2 z-10"
						>
							<span class="px-3 py-1 rounded-full text-xs font-semibold bg-linear-to-br from-accent to-accent-end text-bg drop-shadow-lg">
								New
							</span>
							<p class="text-3xl font-bold drop-shadow-lg">€129</p>
						</div>
					</Tilt>

					<Tilt
						options={{ glare: true, shadow: true, gyroscope: false }}
						class="relative aspect-[3/4] rounded-2xl bg-surface border border-border cursor-pointer"
					>
						<img
							src={posterImg}
							alt="Poster"
							data-levita-offset="0"
							class="absolute inset-0 size-full object-cover rounded-[inherit]"
						/>
						<div
							data-levita-offset="45"
							class="absolute inset-0 flex flex-col items-center justify-center z-10"
						>
							<p class="text-3xl font-bold uppercase tracking-wider drop-shadow-lg">Nightfall</p>
							<p class="text-sm text-gray-300 mt-1 drop-shadow-lg">A visual journey</p>
						</div>
					</Tilt>

					<Tilt
						options={{ glare: true, shadow: true, gyroscope: false }}
						class="relative aspect-[3/4] rounded-2xl bg-surface border border-border cursor-pointer"
					>
						<img
							src={artworkImg}
							alt="Artwork"
							data-levita-offset="0"
							class="absolute inset-0 size-full object-cover rounded-[inherit]"
						/>
						<div
							data-levita-offset="50"
							class="absolute inset-0 flex items-center justify-center z-10"
						>
							<p class="text-3xl font-bold uppercase tracking-wider drop-shadow-lg">Abstract</p>
						</div>
					</Tilt>
				</div>
			</section>

			{/* High Depth */}
			<section class="max-w-5xl mx-auto px-8 py-16">
				<h2 class="text-3xl font-bold text-center mb-2">High Depth Parallax</h2>
				<p class="text-center text-gray-400 mb-10">Layered elements with high offset values</p>

				<div class="flex items-center justify-center">
					<Tilt
						options={{ glare: true, shadow: true, gyroscope: false, max: 10, perspective: 1500 }}
						class="relative w-[min(600px,90vw)] aspect-[16/9] rounded-3xl bg-linear-to-br from-surface to-[#0f172a] border border-border overflow-hidden cursor-pointer"
					>
						<div data-levita-offset="-40" class="absolute inset-0 opacity-30">
							<div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#3b82f6_0%,transparent_70%)]"></div>
						</div>
						<div data-levita-offset="-20" class="absolute inset-0">
							<div class="absolute top-10 left-20 w-1 h-1 bg-white rounded-full"></div>
							<div class="absolute top-40 left-60 w-1.5 h-1.5 bg-white rounded-full opacity-70"></div>
							<div class="absolute top-20 right-40 w-1 h-1 bg-white rounded-full"></div>
							<div class="absolute bottom-40 right-20 w-1 h-1 bg-white rounded-full opacity-50"></div>
						</div>
						<div data-levita-offset="30" class="absolute inset-0 flex items-center justify-center">
							<div class="text-6xl font-black text-white/10 uppercase italic tracking-tighter">
								PARALLAX
							</div>
						</div>
						<div data-levita-offset="80" class="absolute inset-0 flex items-center justify-center">
							<div class="px-8 py-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl">
								<h3 class="text-4xl font-bold text-white bg-linear-to-br from-accent to-accent-end bg-clip-text text-transparent">
									LEVITATE
								</h3>
							</div>
						</div>
						<div data-levita-offset="120" class="absolute top-1/4 right-1/4">
							<div class="w-12 h-12 rounded-xl bg-linear-to-br from-accent to-accent-end shadow-lg rotate-12"></div>
						</div>
						<div data-levita-offset="150" class="absolute bottom-1/4 left-1/4">
							<div class="w-8 h-8 rounded-full bg-white shadow-lg"></div>
						</div>
					</Tilt>
				</div>
			</section>

			{/* Grouped */}
			<section class="max-w-5xl mx-auto px-8 py-16">
				<h2 class="text-3xl font-bold text-center mb-2">Grouped Cards</h2>
				<p class="text-center text-gray-400 mb-10">Multiple cards reacting to a shared container</p>

				<div
					ref={groupedRef}
					class="grid grid-cols-1 sm:grid-cols-3 gap-6 p-10 bg-surface/30 rounded-3xl border border-dashed border-border"
				>
					<div class="relative aspect-square card-grouped rounded-[4px] cursor-pointer">
						<div class="absolute inset-0 pl-[25px] overflow-hidden rounded-r-[4px]">
							<img
								src={darkSideImg}
								alt="Pink Floyd"
								data-levita-offset="0"
								class="absolute inset-0 size-full object-cover rounded-[inherit]"
							/>
						</div>
						<div
							data-levita-offset="40"
							class="absolute inset-0 pl-[25px] bg-[radial-gradient(circle_at_50%_45%,rgba(255,255,255,0.1)_0%,transparent_60%)]"
						></div>
						<div
							data-levita-offset="120"
							class="absolute bottom-12 left-[25px] right-0 text-center"
						>
							<p class="text-white font-serif text-sm tracking-[0.4em] uppercase opacity-40">
								Pink Floyd
							</p>
							<p class="text-white font-serif text-2xl font-bold tracking-widest mt-1">DARK SIDE</p>
						</div>
						<div class="card-thickness"></div>
					</div>

					<div class="relative aspect-square card-grouped rounded-[4px] cursor-pointer">
						<div class="absolute inset-0 pl-[25px] overflow-hidden rounded-r-[4px]">
							<img
								src={abbeyRoadImg}
								alt="The Beatles"
								data-levita-offset="0"
								class="absolute inset-0 size-full object-cover rounded-[inherit]"
							/>
						</div>
						<div
							data-levita-offset="40"
							class="absolute inset-0 pl-[25px] bg-linear-to-b from-black/40 via-transparent to-transparent"
						></div>
						<div data-levita-offset="150" class="absolute top-8 left-[25px] right-0 text-center">
							<p class="text-white font-black text-3xl uppercase tracking-[0.4em]">Abbey Road</p>
						</div>
						<div class="card-thickness"></div>
					</div>

					<div class="relative aspect-square card-grouped rounded-[4px] cursor-pointer">
						<div class="absolute inset-0 pl-[25px] overflow-hidden rounded-r-[4px]">
							<img
								src={forEmmaImg}
								alt="Bon Iver"
								data-levita-offset="0"
								class="absolute inset-0 size-full object-cover rounded-[inherit]"
							/>
						</div>
						<div data-levita-offset="30" class="absolute inset-0 pl-[25px] bg-white/5"></div>
						<div
							data-levita-offset="180"
							class="absolute inset-0 pl-[25px] flex flex-col items-center justify-center"
						>
							<div class="px-8 py-3 border border-white/40 bg-white/5 backdrop-blur-md">
								<p class="text-white font-light text-2xl tracking-[0.4em] uppercase">Bon Iver</p>
							</div>
							<p class="mt-6 text-white text-sm italic font-serif">For Emma, Forever Ago</p>
						</div>
						<div class="card-thickness"></div>
					</div>
				</div>
			</section>

			{/* Playground */}
			<section class="max-w-5xl mx-auto px-8 py-16">
				<h2 class="text-3xl font-bold text-center mb-2">Playground</h2>
				<p class="text-center text-gray-400 mb-10">Tweak every parameter in real-time</p>

				<div class="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
					<div class="flex items-center justify-center">
						<Tilt
							options={opts}
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
							{(Object.entries(opts) as [keyof PlaygroundOpts, number | boolean | string][]).map(
								([key, value]) => {
									if (typeof value === "number") {
										return (
											<label key={key} class="flex flex-col gap-1 text-sm text-gray-400">
												<span class="flex justify-between">
													{key}{" "}
													<output class="text-accent font-semibold tabular-nums">{value}</output>
												</span>
												<input
													type="range"
													value={value}
													onInput={(e) => updateOpt(key as any, Number(e.currentTarget.value))}
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
											<label
												key={key}
												class="flex items-center justify-between text-sm text-gray-400"
											>
												<span>{key}</span>
												<input
													type="checkbox"
													checked={value}
													onChange={(e) => updateOpt(key as any, e.currentTarget.checked)}
													class="toggle-switch"
												/>
											</label>
										);
									}
									return null;
								},
							)}
							<button
								type="button"
								class="w-full px-4 py-2 text-sm rounded-lg bg-surface text-gray-400 border border-border hover:border-white/20 transition"
								onClick={resetPlayground}
							>
								Reset
							</button>
						</div>

						<div class="flex flex-col gap-2">
							<div class="flex gap-2 p-1 bg-surface border border-border rounded-lg overflow-x-auto no-scrollbar">
								{["vanilla", "react", "vue", "svelte"].map((fw) => (
									<button
										key={fw}
										type="button"
										class={`px-4 py-1.5 text-xs font-semibold rounded-md transition ${currentFramework === fw ? "bg-white/10 text-white" : "text-gray-400 hover:text-white"}`}
										onClick={() => setCurrentFramework(fw)}
									>
										{fw.charAt(0).toUpperCase() + fw.slice(1)}
									</button>
								))}
							</div>

							<div class="relative group">
								<pre class="bg-surface border border-border rounded-xl px-5 py-4 font-mono text-sm text-accent leading-relaxed overflow-x-auto min-h-[160px]">
									<code>{snippet}</code>
								</pre>
								<div class="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
									<button
										type="button"
										onClick={copyCode}
										class="p-2 rounded-lg bg-surface border border-white/20 text-gray-300 hover:text-white hover:bg-white/10 transition shadow-xl"
										title="Copy code"
									>
										{copyStatus ? (
											<svg
												width="16"
												height="16"
												viewBox="0 0 24 24"
												fill="none"
												stroke="#2dd4bf"
												stroke-width="2"
											>
												<title>Success</title>
												<polyline points="20 6 9 17 4 12"></polyline>
											</svg>
										) : (
											<svg
												width="16"
												height="16"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												stroke-width="2"
											>
												<title>Copy</title>
												<rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
												<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
											</svg>
										)}
									</button>
									<button
										type="button"
										onClick={openStackBlitz}
										class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface border border-white/20 text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/10 transition shadow-xl"
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
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Gyroscope */}
			<section class="max-w-5xl mx-auto px-8 py-16">
				<h2 class="text-3xl font-bold text-center mb-2">Accelerometer</h2>
				<p class="text-center text-gray-400 mb-10">
					Works on mobile devices with gyroscope support
				</p>

				<div class="flex flex-col items-center gap-6">
					<Tilt
						options={{ gyroscope: "auto", glare: true, shadow: true }}
						onMove={handleGyroMove}
						class="relative w-[min(300px,80vw)] aspect-[3/4] rounded-2xl bg-linear-to-br from-surface to-[#0f172a] border border-border cursor-pointer"
					>
						<div
							data-levita-offset="15"
							class="absolute inset-0 flex flex-col items-center justify-center gap-4 text-gray-400"
						>
							<svg
								class="opacity-50 animate-tilt"
								width="48"
								height="48"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="1.5"
							>
								<title>Gyroscope</title>
								<rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
								<line x1="12" y1="18" x2="12.01" y2="18" />
							</svg>
							<p class="text-sm">Tilt your device</p>
						</div>
					</Tilt>
					<p class="text-gray-500 text-xs">{gyroInfo}</p>
				</div>
			</section>

			{/* Footer */}
			<footer class="border-t border-border mt-16 px-8 py-8">
				<div class="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
					<span class="bg-linear-to-br from-accent to-accent-end bg-clip-text text-transparent font-bold text-lg">
						Levita
					</span>
					<nav class="flex items-center gap-6">
						<a
							href="https://github.com/Jeromearsene/levita"
							target="_blank"
							rel="noopener noreferrer"
							class="flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-border text-gray-400 hover:text-white hover:border-white/20 transition group"
						>
							<svg
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								class="group-hover:scale-110 transition-transform text-white/50 group-hover:text-white"
							>
								<title>GitHub</title>
								<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
							</svg>
							<span class="text-xs font-medium">{githubStars}</span>
						</a>
						<a
							href="https://www.npmjs.com/package/levita"
							class="text-gray-400 text-sm hover:text-white transition"
						>
							npm
						</a>
						<a
							href="https://github.com/Jeromearsene/levita#api"
							class="text-gray-400 text-sm hover:text-white transition"
						>
							Documentation
						</a>
					</nav>
				</div>
			</footer>
		</>
	);
}
