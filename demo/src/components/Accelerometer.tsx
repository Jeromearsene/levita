import type { LevitaEventMap, LevitaOptions } from "levita-js";
import { useCallback, useMemo, useState } from "preact/hooks";
import { Tilt } from "./Tilt";

/**
 * Section dedicated to mobile device sensors (gyroscope/accelerometer).
 * Shows a visual feedback of the device's orientation.
 */
export function Accelerometer() {
	const [gyroInfo, setGyroInfo] = useState("Tap the card on a mobile device to enable gyroscope.");

	/** Stable reference for tilt options to avoid unnecessary re-initializations. */
	const tiltOptions = useMemo<Partial<LevitaOptions>>(
		() => ({ gyroscope: "auto", glare: true, shadow: true }),
		[],
	);

	/** Updates the UI with current tilt degrees from the sensor. */
	const handleGyroMove = useCallback((values: LevitaEventMap["move"]) => {
		setGyroInfo(`Gyro active — x: ${values.x.toFixed(1)}° y: ${values.y.toFixed(1)}°`);
	}, []);

	return (
		<section class="max-w-5xl mx-auto px-16 sm:px-8 py-16">
			<h2 class="text-3xl font-bold text-center mb-2">Accelerometer</h2>
			<p class="text-center text-gray-400 mb-10">Works on mobile devices with gyroscope support</p>

			<div class="flex flex-col items-center gap-6">
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
		</section>
	);
}
