---
"@levita-js/react": patch
"@levita-js/vue": patch
"@levita-js/svelte": patch
"@levita-js/angular": patch
---

Framework packages now re-export style.css from the core package. Users can import styles directly from their framework package (e.g. `import '@levita-js/react/style.css'`) instead of importing from `levita-js`.
