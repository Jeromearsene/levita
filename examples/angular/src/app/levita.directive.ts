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

@Directive({
	selector: "[levita]",
	standalone: true,
})
export class LevitaDirective implements OnChanges, OnDestroy {
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
}
