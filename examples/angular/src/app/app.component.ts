import { Component } from "@angular/core";
import { LevitaDirective } from "@levita-js/angular";

@Component({
	selector: "app-root",
	standalone: true,
	imports: [LevitaDirective],
	template: `
    <div [levita]="{ glare: true, maxGlare: 0.5, shadow: true }" class="card">
      Angular
    </div>
  `,
})
export class App {}
