---
"levita-js": patch
---

Reduce text blur on hover during 3D transforms by using scale3d(s, s, 1) instead of scale3d(s, s, s), making preserve-3d conditional to elements with parallax layers, rounding rotation values to 2 decimals, and applying will-change dynamically during interaction only.
