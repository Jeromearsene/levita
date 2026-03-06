import artworkImg from "@assets/showcase-artwork.webp";
import posterImg from "@assets/showcase-poster.webp";
import productImg from "@assets/showcase-product.webp";
import profileImg from "@assets/showcase-profile.webp";
import { Tilt } from "./Tilt";

/**
 * Showcase section displaying various use cases for the Levita library.
 */
export function Showcase() {
	return (
		<section class="max-w-5xl mx-auto px-16 sm:px-8 py-16">
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
	);
}
