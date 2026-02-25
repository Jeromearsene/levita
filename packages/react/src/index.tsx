import type { LevitaOptions } from "levita";
import { buildOptions, Levita } from "levita";
import {
	forwardRef,
	type HTMLAttributes,
	type ReactNode,
	useEffect,
	useImperativeHandle,
	useRef,
} from "react";

/** Props accepted by the `<Tilt>` component. */
export interface TiltProps
	extends Partial<LevitaOptions>,
		Omit<HTMLAttributes<HTMLDivElement>, "onAnimationEnd"> {
	children?: ReactNode;
}

/** Imperative handle exposed via `ref` on the `<Tilt>` component. */
export interface TiltRef {
	/** The underlying DOM element. */
	element: HTMLDivElement | null;
	/** The Levita instance driving the tilt effect. */
	instance: Levita | null;
	/** Request accelerometer permission (must be called from a user gesture on iOS). */
	requestPermission: () => Promise<boolean>;
}

/**
 * React wrapper for the Levita 3D tilt effect.
 *
 * Accepts all `LevitaOptions` as props alongside standard `<div>` attributes.
 * The Levita instance is created on mount and destroyed on unmount.
 * Changing any tilt prop recreates the instance.
 *
 * @example
 * ```tsx
 * import { Tilt } from '@levita/react';
 * import 'levita/style.css';
 *
 * <Tilt glare shadow max={20}>
 *   <h1>Hello</h1>
 * </Tilt>
 * ```
 */
export const Tilt = forwardRef<TiltRef, TiltProps>(
	(
		{
			max,
			perspective,
			scale,
			speed,
			easing,
			reverse,
			axis,
			reset,
			glare,
			maxGlare,
			shadow,
			gyroscope,
			disabled,
			eventsEl,
			children,
			...rest
		},
		ref,
	) => {
		const elRef = useRef<HTMLDivElement>(null);
		const instanceRef = useRef<Levita | null>(null);

		useImperativeHandle(ref, () => ({
			get element() {
				return elRef.current;
			},
			get instance() {
				return instanceRef.current;
			},
			requestPermission: async () => {
				return (await instanceRef.current?.requestPermission()) ?? false;
			},
		}));

		useEffect(() => {
			if (!elRef.current) return;

			const options = buildOptions({
				max,
				perspective,
				scale,
				speed,
				easing,
				reverse,
				axis,
				reset,
				glare,
				maxGlare,
				shadow,
				gyroscope,
				disabled,
				eventsEl,
			});

			instanceRef.current = new Levita(elRef.current, options);

			return () => {
				instanceRef.current?.destroy();
				instanceRef.current = null;
			};
		}, [
			max,
			perspective,
			scale,
			speed,
			easing,
			reverse,
			axis,
			reset,
			glare,
			maxGlare,
			shadow,
			gyroscope,
			disabled,
			eventsEl,
		]);
		return (
			<div ref={elRef} {...rest}>
				{children}
			</div>
		);
	},
);
