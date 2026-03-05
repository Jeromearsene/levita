import "levita-js/style.css";
import { useEffect } from "preact/hooks";
import { Accelerometer } from "./components/Accelerometer";
import { CssFrameworks } from "./components/CssFrameworks";
import { Footer } from "./components/Footer";
import { GroupedCards } from "./components/GroupedCards";
import { Hero } from "./components/Hero";
import { HighDepth } from "./components/HighDepth";
import { Playground } from "./components/Playground";
import { Showcase } from "./components/Showcase";

/**
 * Main Application component for the Levita Demo.
 * Orchestrates the various sections of the landing page.
 */
export function App() {
	useEffect(() => {
		// Handle hash navigation on initial load (e.g. #playground)
		if (window.location.hash) {
			const id = window.location.hash.substring(1);
			const el = document.getElementById(id);
			if (el) {
				// Small delay to ensure browser rendering is complete
				setTimeout(() => {
					el.scrollIntoView({ behavior: "smooth" });
				}, 100);
			}
		}
	}, []);

	return (
		<>
			<Hero />
			<Showcase />
			<CssFrameworks />
			<HighDepth />
			<GroupedCards />
			<Playground />
			<Accelerometer />
			<Footer />
		</>
	);
}
