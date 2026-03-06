import heroImg from "@assets/hero.webp";
import { Tilt } from "./Tilt";

/**
 * Hero section component for the Levita demo.
 * Displays the main title, description, and a featured 3D tilt card.
 */
export function Hero() {
	return (
		<section class="flex flex-col items-center justify-center min-h-screen px-16 sm:px-8 text-center">
			<h1 class="bg-linear-to-br from-accent to-accent-end bg-clip-text text-transparent text-5xl sm:text-7xl font-bold leading-tight">
				Levita
			</h1>
			<p class="text-gray-400 text-lg mt-2 mb-12">
				Lightweight 3D tilt & parallax with accelerometer support
			</p>

			<Tilt
				options={{ glare: true, shadow: true, gyroscope: false }}
				id="card-hero"
				class="relative w-[min(480px,70vw)] aspect-[4/3] rounded-2xl bg-surface border border-border"
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
					<p class="text-lg text-gray-200 mt-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">The Alps</p>
				</div>
			</Tilt>

			<div class="flex gap-4 mt-10">
				<a
					href="https://github.com/Jeromearsene/levita#getting-started"
					target="_blank"
					rel="noopener noreferrer"
					class="inline-flex items-center px-7 py-3 rounded-xl font-semibold bg-linear-to-br from-accent to-accent-end text-bg hover:opacity-90 transition"
				>
					Get Started
				</a>
				<a
					href="https://github.com/Jeromearsene/levita"
					target="_blank"
					rel="noopener noreferrer"
					class="inline-flex items-center px-7 py-3 rounded-xl font-semibold border border-border text-white hover:border-white/20 transition"
				>
					GitHub
				</a>
				<a
					href="https://github.com/users/Jeromearsene/projects/7"
					target="_blank"
					rel="noopener noreferrer"
					class="hidden sm:inline-flex items-center px-7 py-3 rounded-xl font-semibold border border-border text-white hover:border-white/20 transition"
				>
					Roadmap
				</a>
			</div>
			<p class="text-gray-500 text-sm mt-4">~2KB gzipped</p>
		</section>
	);
}
