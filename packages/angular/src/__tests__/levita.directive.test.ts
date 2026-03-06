import "reflect-metadata";
import { Component, ViewChild } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import {
	BrowserDynamicTestingModule,
	platformBrowserDynamicTesting,
} from "@angular/platform-browser-dynamic/testing";
import { describe, expect, it } from "vitest";
import { LevitaDirective } from "../index.js";

// Initialize TestBed environment
TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());

// Basic Component to host the directive
@Component({
	standalone: true,
	imports: [LevitaDirective],
	template: `<div [levita]="{ gyroscope: false }">Hello</div>`,
})
class TestHostComponent {
	@ViewChild(LevitaDirective) directive!: LevitaDirective;
}

describe("LevitaDirective (Angular)", () => {
	it("initializes on mount", async () => {
		const fixture = TestBed.createComponent(TestHostComponent);
		fixture.detectChanges();

		const host = fixture.componentInstance;
		expect(host.directive).toBeDefined();
		expect(host.directive.levitaInstance).toBeDefined();

		const el = fixture.nativeElement.querySelector("div");
		expect(el.classList.contains("levita")).toBe(true);
	});

	it("cleans up on destroy", () => {
		const fixture = TestBed.createComponent(TestHostComponent);
		fixture.detectChanges();

		const el = fixture.nativeElement.querySelector("div");

		fixture.destroy();
		expect(el.classList.contains("levita")).toBe(false);
	});
});
