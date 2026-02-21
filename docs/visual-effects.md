# Visual Effects Reference

> These screenshots are generated automatically by Playwright visual tests.
> They always reflect the current state of the CSS effects.
> Run `pnpm test:visual:update` to regenerate them.

## Basic Tilt (at rest)

The card at its neutral position, with no tilt applied.

![Basic tilt at rest](../tests/visual/snapshots/basic-tilt-at-rest/rest.png)

## Tilt Applied

Card tilted at 10deg X / -8deg Y with scale 1.05.

![Tilt applied](../tests/visual/snapshots/tilt-tilted/tilted.png)

## Glare Effect

Light reflection overlay following a simulated cursor position (70%, 30%).

![Glare effect](../tests/visual/snapshots/glare-effect/glare.png)

## Shadow Effect

Dynamic drop shadow offset based on tilt angle.

![Shadow effect](../tests/visual/snapshots/shadow-effect/shadow.png)

## Glare + Shadow Combined

Both effects active simultaneously with a tilted card.

![Combined effects](../tests/visual/snapshots/glare-and-shadow-combined/combined.png)

## Parallax Layers

Multi-depth layers positioned at different Z offsets (-5, 0, 10).

![Parallax layers](../tests/visual/snapshots/parallax-layers/layers.png)
