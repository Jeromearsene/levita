import type { LevitaOptions } from "./types.js";

/** All keys of `LevitaOptions`, derived from `DEFAULT_OPTIONS`. */
export const OPTION_KEYS: readonly (keyof LevitaOptions)[] = [
	"max",
	"perspective",
	"scale",
	"speed",
	"easing",
	"reverse",
	"axis",
	"reset",
	"glare",
	"maxGlare",
	"shadow",
	"gyroscope",
	"disabled",
] as const;

/**
 * Build a partial `LevitaOptions` object from a source,
 * including only keys that are explicitly defined.
 */
export const buildOptions = (source: Partial<LevitaOptions>): Partial<LevitaOptions> => {
	const options: Partial<LevitaOptions> = {};
	for (const key of OPTION_KEYS) {
		if (source[key] !== undefined) {
			// biome-ignore lint/suspicious/noExplicitAny: generic key assignment
			(options as any)[key] = source[key];
		}
	}
	return options;
};

export const DEFAULT_OPTIONS: LevitaOptions = {
	max: 15,
	perspective: 1000,
	scale: 1.05,
	speed: 200,
	easing: "ease-out",
	reverse: false,
	axis: null,
	reset: true,
	glare: false,
	maxGlare: 0.5,
	shadow: false,
	gyroscope: "auto",
	disabled: false,
};
