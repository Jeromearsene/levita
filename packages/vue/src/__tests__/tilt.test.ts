import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { Tilt } from "../index.js";

describe("Tilt (Vue)", () => {
	it("renders slot content", () => {
		const wrapper = mount(Tilt, {
			props: { gyroscope: false },
			slots: { default: "<span>Hello</span>" },
		});
		expect(wrapper.text()).toBe("Hello");
	});

	it("adds levita class to container", () => {
		const wrapper = mount(Tilt, {
			props: { gyroscope: false },
		});
		expect(wrapper.element.classList.contains("levita")).toBe(true);
	});

	it("cleans up on unmount", () => {
		const wrapper = mount(Tilt, {
			props: { glare: true, gyroscope: false },
		});
		expect(wrapper.element.querySelector(".levita-glare")).not.toBeNull();

		wrapper.unmount();
	});

	it("passes CSS class through", () => {
		const wrapper = mount(Tilt, {
			props: { gyroscope: false },
			attrs: { class: "my-card" },
		});
		expect(wrapper.element.classList.contains("my-card")).toBe(true);
	});
});
