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

	useEffect(() => {
		if (elRef.current) {
			instanceRef.current = new Levita(elRef.current, options);
			if (onMove) {
				instanceRef.current.on("move", onMove);
			}
		}

		return () => {
			instanceRef.current?.destroy();
		};
	}, [options, onMove]);

	return (
		<div ref={elRef} id={id} className={`levita ${className}`}>
			{children}
		</div>
	);
}
