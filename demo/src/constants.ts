/** List of all supported frameworks in the interactive playground. */
export const FRAMEWORKS = ["vanilla", "react", "vue", "svelte", "angular"] as const;

/** Type representing a supported framework name. */
export type Framework = (typeof FRAMEWORKS)[number];
