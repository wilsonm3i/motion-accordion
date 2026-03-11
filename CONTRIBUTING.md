# Contributing

## Local setup

```bash
pnpm install
pnpm build
```

For library changes, keep the public API centered on a single `<MotionAccordion />` component and preserve reduced-motion behavior plus keyboard accessibility.

## Quality gates

Before opening a PR, run:

```bash
pnpm lint
pnpm typecheck
pnpm test
```

## Releasing

- Add a Changeset for any package-facing change with `pnpm changeset`.
