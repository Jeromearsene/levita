import type { LevitaOptions } from "levita";
import { buildOptions, Levita } from "levita";

/**
 * Svelte action that applies the Levita 3D tilt effect to an element.
 *
 * @example
 * ```svelte
 * <script>
 *   import { tilt } from '@levita/svelte';
 *   import 'levita/style.css';
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
