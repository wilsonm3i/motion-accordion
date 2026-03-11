// @vitest-environment node

import * as React from "react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { MotionAccordion } from "../src/MotionAccordion";

describe("MotionAccordion SSR", () => {
  it("renders to string without browser globals", () => {
    const html = renderToString(
      <MotionAccordion
        items={[
          {
            id: "server",
            title: "Does SSR work?",
            content: "The component renders without touching window during SSR.",
          },
        ]}
        defaultValue="server"
      />,
    );

    expect(html).toContain("Does SSR work?");
    expect(html).toContain("data-slot=\"root\"");
  });
});
