import type { LevitaOptions } from "levita-js";
import { buildOptions, Levita } from "levita-js";

/**
 * Svelte action that applies the Levita 3D tilt effect to an element.
 *
 * @example
 * ```svelte
 * <script>
 *   import { tilt } from '@levita-js/svelte';
 *   import 'levita-js/style.css';
 * </script>
 *
 * <div use:tilt={{ glare: true, shadow: true }}>
 *   <h1>Hello</h1>
 * </div>
 * ```
 */
export function tilt(
	node: HTMLElement,
	options?: Partial<LevitaOptions>,
): { update: (options?: Partial<LevitaOptions>) => void; destroy: () => void } {
	let instance = new Levita(node, buildOptions(options ?? {}));

	return {
		update(newOptions?: Partial<LevitaOptions>) {
			instance.destroy();
			instance = new Levita(node, buildOptions(newOptions ?? {}));
		},
		destroy() {
			instance.destroy();
		},
	};
}
