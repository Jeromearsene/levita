import "levita-js/style.css";
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
