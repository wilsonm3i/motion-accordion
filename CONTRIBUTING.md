# Contributing

## Local setup

```bash
pnpm install
pnpm dev
```

The docs app intentionally imports `motion-accordion` through the built package entry, not directly from source. Use the root `dev` script so the library stays rebuilt in watch mode while the docs site is running.

## Quality gates

Before opening a PR, run:

```bash
pnpm lint
pnpm typecheck
pnpm test:unit
pnpm test:e2e
```

## Releasing

- Add a Changeset for any package-facing change with `pnpm changeset`.
- Keep the public API centered on a single `<MotionAccordion />` component.
- Preserve reduced-motion behavior and keyboard accessibility when changing animation or structure.
