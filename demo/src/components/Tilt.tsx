import { Levita, type LevitaEventMap, type LevitaOptions } from "levita-js";
import type { ComponentChildren } from "preact";
import { useEffect, useRef } from "preact/hooks";

interface TiltProps {
	children?: ComponentChildren;
	options?: Partial<LevitaOptions>;
	class?: string;
	id?: string;
	onMove?: (values: LevitaEventMap["move"]) => void;
}

export function Tilt({
	children,
	options = {},
	class: className = "",
	id = "",
	onMove,
}: TiltProps) {
	const elRef = useRef<HTMLDivElement>(null);
	const instanceRef = useRef<Levita | null>(null);
	const initialOptionsRef = useRef(options);

	// Create instance once — preserves gyroscope permission on iOS
	useEffect(() => {
		if (elRef.current) {
			instanceRef.current = new Levita(elRef.current, initialOptionsRef.current);
			if (onMove) {
				instanceRef.current.on("move", onMove);
			}
		}

		return () => {
			instanceRef.current?.destroy();
		};
	}, [onMove]);

	// Propagate option changes without destroying the instance
	useEffect(() => {
		instanceRef.current?.update(options);
	}, [options]);

	return (
		<div ref={elRef} id={id} className={`levita ${className}`}>
			{children}
		</div>
	);
}
