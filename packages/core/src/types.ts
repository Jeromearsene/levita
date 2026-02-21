export type Axis = "x" | "y" | null;
export type GyroscopeMode = "auto" | boolean;

export interface LevitaOptions {
	/** Max tilt angle in degrees. Default: 15 */
	max: number;
	/** CSS perspective in px. Default: 1000 */
	perspective: number;
	/** Scale factor on hover. Default: 1.05 */
	scale: number;
	/** Transition duration in ms. Default: 400 */
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

export const DEFAULT_OPTIONS: LevitaOptions = {
	max: 15,
	perspective: 1000,
	scale: 1.05,
	speed: 400,
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
