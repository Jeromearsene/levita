import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Tilt } from "../index.js";

// Support for React 17 and below in some testing environments
// @ts-expect-error - IS_REACT_ACT_ENVIRONMENT is not in globalThis types
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

afterEach(cleanup);

describe("Tilt (React)", () => {
	it("renders children", () => {
		const { getByText } = render(
			<Tilt gyroscope={false}>
				<span>Hello</span>
			</Tilt>,
		);
		expect(getByText("Hello")).toBeDefined();
	});

	it("adds levita class to container", () => {
		const { container } = render(<Tilt gyroscope={false} />);
		const el = container.firstElementChild as HTMLElement;
		expect(el).not.toBeNull();
		expect(el.classList.contains("levita")).toBe(true);
	});

	it("passes className through", () => {
		const { container } = render(<Tilt className="my-card" gyroscope={false} />);
		const el = container.firstElementChild as HTMLElement;
		expect(el).not.toBeNull();
		expect(el.classList.contains("my-card")).toBe(true);
	});

	it("cleans up on unmount", () => {
		const { container, unmount } = render(<Tilt glare gyroscope={false} />);
		const el = container.firstElementChild as HTMLElement;
		expect(el).not.toBeNull();
		expect(el?.querySelector(".levita-glare")).not.toBeNull();

		unmount();
		expect(container.firstElementChild).toBeNull();
	});
});
