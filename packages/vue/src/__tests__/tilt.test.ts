import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { nextTick } from "vue";
import { Tilt } from "../index.js";

describe("Tilt (Vue)", () => {
	it("renders slot content", async () => {
		const wrapper = mount(Tilt, {
			props: { gyroscope: false },
			slots: { default: "<span>Hello</span>" },
		});
		await nextTick();
		expect(wrapper.text()).toBe("Hello");
	});

	it("adds levita class to container", async () => {
		const wrapper = mount(Tilt, {
			props: { gyroscope: false },
		});
		await nextTick();
		expect(wrapper.element.classList.contains("levita")).toBe(true);
	});

	it("cleans up on unmount", async () => {
		const wrapper = mount(Tilt, {
			props: { glare: true, gyroscope: false },
		});
		await nextTick();
		expect(wrapper.element.querySelector(".levita-glare")).not.toBeNull();

		wrapper.unmount();
	});

	it("passes CSS class through", async () => {
		const wrapper = mount(Tilt, {
			props: { gyroscope: false },
			attrs: { class: "my-card" },
		});
		await nextTick();
		expect(wrapper.element.classList.contains("my-card")).toBe(true);
	});
});
