import abbeyRoadImg from "@assets/abbey-road.webp";
import darkSideImg from "@assets/dark-side.webp";
import forEmmaImg from "@assets/for-emma.webp";
import { Levita } from "levita-js";
import { useEffect, useRef } from "preact/hooks";
import { snippets as groupedCardsSnippets } from "../snippets/grouped-cards";
import { CodeTabs } from "./CodeTabs";

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
		<section class="max-w-5xl mx-auto px-16 sm:px-8 py-16">
			<h2 class="text-3xl font-bold text-center mb-2">Grouped Cards</h2>
			<p class="text-center text-gray-400 mb-10">Multiple cards reacting to a shared container</p>

			<div
				ref={groupedRef}
				class="grid grid-cols-1 sm:grid-cols-3 gap-6 p-10 bg-surface/30 rounded-3xl border border-dashed border-border"
			>
				<div class="relative aspect-square card-grouped rounded-lg overflow-hidden cursor-pointer">
					<img
						src={darkSideImg}
						alt="Pink Floyd — The Dark Side of the Moon"
						data-levita-offset="0"
						class="absolute inset-0 size-full object-cover"
					/>
					<div
						data-levita-offset="15"
						class="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent"
					></div>
					<p
						data-levita-offset="35"
						class="absolute bottom-4 left-0 right-0 text-center text-white/60 text-xs tracking-[0.3em] uppercase"
					>
						Pink Floyd
					</p>
				</div>

				<div class="relative aspect-square card-grouped rounded-lg overflow-hidden cursor-pointer">
					<img
						src={abbeyRoadImg}
						alt="The Beatles — Abbey Road"
						data-levita-offset="0"
						class="absolute inset-0 size-full object-cover"
					/>
					<div
						data-levita-offset="15"
						class="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent"
					></div>
					<p
						data-levita-offset="35"
						class="absolute bottom-4 left-0 right-0 text-center text-white/60 text-xs tracking-[0.3em] uppercase"
					>
						The Beatles
					</p>
				</div>

				<div class="relative aspect-square card-grouped rounded-lg overflow-hidden cursor-pointer">
					<img
						src={forEmmaImg}
						alt="Bon Iver — For Emma, Forever Ago"
						data-levita-offset="0"
						class="absolute inset-0 size-full object-cover"
					/>
					<div
						data-levita-offset="15"
						class="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent"
					></div>
					<p
						data-levita-offset="35"
						class="absolute bottom-4 left-0 right-0 text-center text-white/60 text-xs tracking-[0.3em] uppercase"
					>
						Bon Iver
					</p>
				</div>
			</div>

			<CodeTabs snippets={groupedCardsSnippets} collapsed />
		</section>
	);
}
