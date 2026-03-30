---
"levita-js": patch
---

Reduce text blur on hover during 3D transforms by using scale3d(s, s, 1) instead of scale3d(s, s, s) to avoid Z-axis scaling that forces full GPU texture treatment of text (Mozilla bug #724614).
