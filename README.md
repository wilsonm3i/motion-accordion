# Motion Accordion

`MotionAccordion` is a small monorepo for an open-source React accordion component with built-in motion, polished default styles, and reduced-motion support.

## Packages

- `motion-accordion`: the publishable React component package.
- `docs`: the docs site and interactive playground.

## Quick Start

```bash
pnpm install
pnpm dev
```

The root dev script watches the component package in library mode and serves the docs app against the built package output.

## Scripts

- `pnpm dev`: run the library build watcher and docs app together.
- `pnpm build`: build the package and the docs app.
- `pnpm lint`: run ESLint across the workspace.
- `pnpm typecheck`: run TypeScript checks across the workspace.
- `pnpm test:unit`: run the package unit tests.
- `pnpm test:e2e`: build the workspace and run Playwright against the docs site.
- `pnpm changeset`: create a release note for the next version.
- `pnpm version-packages`: apply pending Changesets.
- `pnpm release`: build and publish through Changesets.

## Package Usage

```bash
npm install motion-accordion
```

```tsx
import type { CSSProperties } from "react";
import { MotionAccordion } from "motion-accordion";

const items = [
  {
    id: "latency",
    title: "Why does this feel responsive?",
    content: "The icon, panel height, and copy animation are sequenced as one gesture.",
  },
];

const accordionStyle = {
  "--motion-accordion-accent": "#ff6a3d",
  "--motion-accordion-panel-duration": "360ms",
  "--motion-accordion-content-duration": "240ms",
  "--motion-accordion-content-delay": "100ms",
} as CSSProperties;

export function Example() {
  return (
    <MotionAccordion
      items={items}
      defaultValue="latency"
      multiple
      style={accordionStyle}
    />
  );
}
```

The component auto-loads its default styles. A direct CSS export also exists at `motion-accordion/styles.css`.
Use `multiple` to keep more than one item open. Accent color and motion timing are customized with the CSS variables shown above.

## Release Flow

1. Run `pnpm changeset` after changes that affect the package.
2. Merge to `main`.
3. The release workflow opens or updates a version PR.
4. Merging that PR publishes the package with the configured `NPM_TOKEN`.
