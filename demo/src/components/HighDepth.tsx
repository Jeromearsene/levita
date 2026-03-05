import { Tilt } from "./Tilt";

/**
 * Section demonstrating complex multi-layered parallax effects with high depth.
 */
export function HighDepth() {
	return (
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
	);
}
