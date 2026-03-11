# motion-accordion

`motion-accordion` is a React accordion component with built-in motion, polished default styles, and reduced-motion support.

## Install

```bash
npm install motion-accordion
```

This package expects `react` and `react-dom` to already exist in your app.

## Usage

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

The default styles are loaded automatically when you import the component. You can also import the stylesheet directly from `motion-accordion/styles.css`.

## Props

- `items`: accordion rows to render.
- `multiple`: allow more than one item to stay open.
- `allowCollapse`: keep one panel open when set to `false`.
- `value` / `defaultValue`: controlled or uncontrolled open state.
- `onValueChange`: state change callback for single or multiple mode.

## License

MIT
