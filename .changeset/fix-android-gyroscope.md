---
"levita-js": patch
---

Fix gyroscope reliability on Android: use pointerup instead of click for auto-trigger, skip stale first deviceorientation event, filter out null sensor data, and delay pointer-to-motion handoff until a valid sensor event is received.
