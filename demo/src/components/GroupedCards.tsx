import abbeyRoadImg from "@assets/abbey-road.webp";
import darkSideImg from "@assets/dark-side.webp";
import forEmmaImg from "@assets/for-emma.webp";
import { Levita } from "levita-js";
import { useEffect, useRef } from "preact/hooks";

/**
 * Section showcasing multiple cards sharing a single event container.
 * This is useful for performance when many elements need to react to the same pointer movement.
 */
export function GroupedCards() {
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

	return (
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
					<div data-levita-offset="120" class="absolute bottom-12 left-[25px] right-0 text-center">
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
	);
}
