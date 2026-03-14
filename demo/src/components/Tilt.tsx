import { Levita, type LevitaEventMap, type LevitaOptions, type LevitaPlugin } from "levita-js";
import type { ComponentChildren } from "preact";
import { useEffect, useRef } from "preact/hooks";

interface TiltProps {
	children?: ComponentChildren;
	options?: Partial<LevitaOptions>;
	plugins?: LevitaPlugin[];
	class?: string;
	id?: string;
	onMove?: (values: LevitaEventMap["move"]) => void;
}

export function Tilt({
	children,
	options = {},
	plugins,
	class: className = "",
	id = "",
	onMove,
}: TiltProps) {
	const elRef = useRef<HTMLDivElement>(null);
	const instanceRef = useRef<Levita | null>(null);

	useEffect(() => {
		if (elRef.current) {
			const opts = plugins ? { ...options, plugins } : options;
			instanceRef.current = new Levita(elRef.current, opts);
			if (onMove) {
				instanceRef.current.on("move", onMove);
			}
		}

		return () => {
			instanceRef.current?.destroy();
		};
	}, [options, plugins, onMove]);

	return (
		<div ref={elRef} id={id} className={`levita ${className}`}>
			{children}
		</div>
	);
}
