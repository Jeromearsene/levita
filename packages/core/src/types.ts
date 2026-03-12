export type Axis = "x" | "y" | null;
export type GyroscopeMode = "auto" | boolean;

/**
 * Options that can be updated at runtime via `update()`.
 * Limited to lightweight options that don't require DOM mutations.
 */
export type UpdatableOptions = Pick<
	LevitaOptions,
	"max" | "scale" | "speed" | "easing" | "perspective" | "reverse" | "axis" | "reset"
>;

export interface LevitaOptions {
	/** Max tilt angle in degrees. Default: 15 */
	max: number;
	/** CSS perspective in px. Default: 1000 */
	perspective: number;
	/** Scale factor on hover. Default: 1.05 */
	scale: number;
	/** Transition duration in ms. Default: 200 */
	speed: number;
	/** CSS transition easing. Default: 'ease-out' */
	easing: string;
	/** Invert tilt direction. Default: false */
	reverse: boolean;
	/** Restrict tilt to a single axis. Default: null (both) */
	axis: Axis;
	/** Reset tilt on pointer leave. Default: true */
	reset: boolean;
	/** Enable glare effect. Default: false */
	glare: boolean;
	/** Max glare opacity (0-1). Default: 0.5 */
	maxGlare: number;
	/** Enable dynamic shadow. Default: false */
	shadow: boolean;
	/** Gyroscope mode. Default: 'auto' */
	gyroscope: GyroscopeMode;
	/** Disable the effect. Default: false */
	disabled: boolean;
	/** Element to listen for pointer events on. Default: the element itself */
	eventsEl: HTMLElement | null;
	/** External plugins to extend Levita. Default: [] */
	plugins: LevitaPlugin[];
}

export interface TiltValues {
	/** Tilt angle on X axis in degrees */
	x: number;
	/** Tilt angle on Y axis in degrees */
	y: number;
	/** Normalized X position [-1, 1] */
	percentX: number;
	/** Normalized Y position [-1, 1] */
	percentY: number;
}

export interface LevitaEventMap {
	move: TiltValues;
	enter: undefined;
	leave: undefined;
}

export type EventCallback<T> = (data: T) => void;

export interface PluginContext {
	/** The DOM element the tilt effect is applied to */
	element: HTMLElement;
	/** Current Levita options */
	options: LevitaOptions;
	/** Subscribe to Levita events */
	on: <K extends keyof LevitaEventMap>(
		event: K,
		callback: EventCallback<LevitaEventMap[K]>,
	) => void;
}

export interface LevitaPlugin {
	/** Unique plugin name (used for debugging) */
	name: string;
	/** Called once when the Levita instance initializes */
	init(context: PluginContext): void;
	/** Called on every tilt update (inside rAF) */
	update(values: TiltValues): void;
	/** Called when the element resets to neutral position (optional) */
	reset?(): void;
	/** Called when the Levita instance is destroyed — must clean up */
	destroy(): void;
}
