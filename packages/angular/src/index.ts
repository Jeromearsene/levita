import {
	Directive,
	ElementRef,
	Inject,
	Input,
	type OnChanges,
	type OnDestroy,
	type SimpleChanges,
} from "@angular/core";
import { buildOptions, Levita, type LevitaOptions } from "levita-js";

/**
 * Angular directive that applies the Levita 3D tilt effect to an element.
 *
 * @example
 * ```html
 * <div [levita]="{ glare: true, shadow: true }">
 *   <h1>Hello</h1>
 * </div>
 * ```
 */
@Directive({
	selector: "[levita]",
	standalone: true,
})
export class LevitaDirective implements OnChanges, OnDestroy {
	/** Configuration options for the tilt effect. */
	@Input("levita") options?: Partial<LevitaOptions>;

	private instance?: Levita;

	constructor(@Inject(ElementRef) private el: ElementRef<HTMLElement>) {}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes.options) {
			this.initialize();
		}
	}

	ngOnDestroy(): void {
		this.instance?.destroy();
	}

	private initialize(): void {
		this.instance?.destroy();
		this.instance = new Levita(this.el.nativeElement, buildOptions(this.options ?? {}));
	}

	/** Access to the underlying Levita instance. */
	get levitaInstance(): Levita | undefined {
		return this.instance;
	}
}
