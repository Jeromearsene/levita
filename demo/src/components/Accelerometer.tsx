import type { LevitaEventMap, LevitaOptions } from "levita-js";
import { useCallback, useMemo, useState } from "preact/hooks";
import { buildAllSnippets } from "../utils/snippet-builder";
import { CodeTabs } from "./CodeTabs";
import { Tilt } from "./Tilt";

/**
 * Gyroscope playground section.
 * Allows users to tweak gyroscope-related parameters and see the resulting code for various frameworks.
 */
export function Accelerometer() {
	const [gyroInfo, setGyroInfo] = useState("Tap the card on a mobile device to enable gyroscope.");

	const defaults = useMemo(() => ({ max: 15, gyroRange: 60, gyroSmoothing: 0.15 }), []);

	const [opts, setOpts] = useState({ ...defaults });

	const tiltOptions = useMemo<Partial<LevitaOptions>>(
		() => ({
			gyroscope: "auto",
			glare: true,
			shadow: true,
			max: opts.max,
			gyroRange: opts.gyroRange,
			gyroSmoothing: opts.gyroSmoothing,
		}),
		[opts],
	);

	/** Updates the UI with current tilt degrees from the sensor. */
	const handleGyroMove = useCallback((values: LevitaEventMap["move"]) => {
		setGyroInfo(`Gyro active — x: ${values.x.toFixed(1)}° y: ${values.y.toFixed(1)}°`);
	}, []);

	const updateOpt = <K extends keyof typeof opts>(key: K, value: (typeof opts)[K]) => {
		setOpts((prev) => ({ ...prev, [key]: value }));
	};

	const resetOpts = () => setOpts({ ...defaults });

	/** Generates all code snippets for every framework based on current options. */
	const snippets = useMemo(() => {
		const props: string[] = ['gyroscope="auto"'];
		if (opts.max !== defaults.max) props.push(`max={${opts.max}}`);
		if (opts.gyroRange !== defaults.gyroRange) props.push(`gyroRange={${opts.gyroRange}}`);
		if (opts.gyroSmoothing !== defaults.gyroSmoothing)
			props.push(`gyroSmoothing={${opts.gyroSmoothing}}`);

		const entries: string[] = ['  gyroscope: "auto"'];
		if (opts.max !== defaults.max) entries.push(`  max: ${opts.max}`);
		if (opts.gyroRange !== defaults.gyroRange) entries.push(`  gyroRange: ${opts.gyroRange}`);
		if (opts.gyroSmoothing !== defaults.gyroSmoothing)
			entries.push(`  gyroSmoothing: ${opts.gyroSmoothing}`);

		return buildAllSnippets({ props, entries });
	}, [opts, defaults]);

	return (
		<section class="max-w-5xl mx-auto px-16 sm:px-8 py-16">
			<h2 class="text-3xl font-bold text-center mb-2">Accelerometer</h2>
			<p class="text-center text-gray-400 mb-10">Fine-tune gyroscope behavior on mobile devices</p>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
				<div class="flex flex-col items-center gap-4">
					<Tilt
						options={tiltOptions}
						onMove={handleGyroMove}
						class="relative w-[min(300px,60vw)] aspect-[3/4] rounded-2xl bg-linear-to-br from-surface to-[#0f172a] border border-border cursor-pointer"
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

				<div class="flex flex-col gap-6">
					<div class="flex flex-col gap-3">
						<label class="flex flex-col gap-1 text-sm text-gray-400">
							<span class="flex justify-between">
								max <output class="text-accent font-semibold tabular-nums">{opts.max}</output>
							</span>
							<input
								type="range"
								value={opts.max}
								onInput={(e) => updateOpt("max", Number(e.currentTarget.value))}
								min={1}
								max={45}
								step={1}
								class="w-full accent-accent"
							/>
						</label>

						<label class="flex flex-col gap-1 text-sm text-gray-400">
							<span class="flex justify-between">
								gyroRange{" "}
								<output class="text-accent font-semibold tabular-nums">{opts.gyroRange}</output>
							</span>
							<input
								type="range"
								value={opts.gyroRange}
								onInput={(e) => updateOpt("gyroRange", Number(e.currentTarget.value))}
								min={20}
								max={120}
								step={1}
								class="w-full accent-accent"
							/>
						</label>

						<label class="flex flex-col gap-1 text-sm text-gray-400">
							<span class="flex justify-between">
								gyroSmoothing{" "}
								<output class="text-accent font-semibold tabular-nums">
									{opts.gyroSmoothing.toFixed(2)}
								</output>
							</span>
							<input
								type="range"
								value={opts.gyroSmoothing}
								onInput={(e) =>
									updateOpt("gyroSmoothing", Math.round(Number(e.currentTarget.value) * 100) / 100)
								}
								min={0.01}
								max={1}
								step={0.01}
								class="w-full accent-accent"
							/>
						</label>

						<button
							type="button"
							class="w-full px-4 py-2 text-sm rounded-lg bg-surface text-gray-400 border border-border hover:border-white/20 transition"
							onClick={resetOpts}
						>
							Reset
						</button>
					</div>

					<CodeTabs snippets={snippets} />
				</div>
			</div>
		</section>
	);
}
