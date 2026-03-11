import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MotionAccordion, type MotionAccordionItem } from "../src";

const items: MotionAccordionItem[] = [
  {
    id: "responsiveness",
    title: "Why does it feel responsive?",
    content:
      "The trigger icon, panel reveal, and copy transition all resolve as one gesture.",
  },
  {
    id: "structure",
    title: "How is the content organized?",
    content: (
      <div>
        <p>Each item keeps the title prominent while limiting line length in the panel.</p>
        <a href="https://example.com/accessibility">Read the accessibility note</a>
      </div>
    ),
  },
  {
    id: "disabled",
    title: "Can one item be disabled?",
    content: "Yes. Disabled items stay present but do not open.",
    disabled: true,
  },
];

describe("MotionAccordion", () => {
  beforeEach(() => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  it("renders the accordion structure with all triggers collapsed by default", () => {
    render(<MotionAccordion items={items} />);

    const buttons = screen.getAllByRole("button");

    expect(buttons).toHaveLength(3);
    expect(buttons[0]).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByText("Why does it feel responsive?")).toBeVisible();
  });

  it("opens the default item in uncontrolled mode", () => {
    render(<MotionAccordion items={items} defaultValue="responsiveness" />);

    expect(
      screen.getByRole("button", { name: "Why does it feel responsive?" }),
    ).toHaveAttribute("aria-expanded", "true");
    expect(
      screen.getByText(
        "The trigger icon, panel reveal, and copy transition all resolve as one gesture.",
      ),
    ).toBeVisible();
  });

  it("supports controlled usage", async () => {
    const user = userEvent.setup();

    function ControlledExample() {
      const [value, setValue] = React.useState<string | null>("responsiveness");

      return (
        <MotionAccordion items={items} value={value} onValueChange={setValue} />
      );
    }

    render(<ControlledExample />);

    await user.click(
      screen.getByRole("button", { name: "How is the content organized?" }),
    );

    expect(
      screen.getByRole("button", { name: "Why does it feel responsive?" }),
    ).toHaveAttribute("aria-expanded", "false");
    expect(
      screen.getByRole("button", { name: "How is the content organized?" }),
    ).toHaveAttribute("aria-expanded", "true");
  });

  it("allows multiple items to stay open in uncontrolled mode", async () => {
    const user = userEvent.setup();

    render(
      <MotionAccordion
        multiple
        items={items}
        defaultValue={["responsiveness"]}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: "How is the content organized?" }),
    );

    expect(
      screen.getByRole("button", { name: "Why does it feel responsive?" }),
    ).toHaveAttribute("aria-expanded", "true");
    expect(
      screen.getByRole("button", { name: "How is the content organized?" }),
    ).toHaveAttribute("aria-expanded", "true");
  });

  it("supports controlled multiple usage with array values", async () => {
    const user = userEvent.setup();
    const handleValueChange = vi.fn<(value: string[]) => void>();

    function ControlledExample() {
      const [value, setValue] = React.useState<string[]>(["responsiveness"]);

      return (
        <MotionAccordion
          multiple
          items={items}
          value={value}
          onValueChange={(nextValue) => {
            handleValueChange(nextValue);
            setValue(nextValue);
          }}
        />
      );
    }

    render(<ControlledExample />);

    await user.click(
      screen.getByRole("button", { name: "How is the content organized?" }),
    );

    expect(handleValueChange).toHaveBeenLastCalledWith([
      "responsiveness",
      "structure",
    ]);
    expect(
      screen.getByRole("button", { name: "Why does it feel responsive?" }),
    ).toHaveAttribute("aria-expanded", "true");
    expect(
      screen.getByRole("button", { name: "How is the content organized?" }),
    ).toHaveAttribute("aria-expanded", "true");

    await user.click(
      screen.getByRole("button", { name: "Why does it feel responsive?" }),
    );

    expect(handleValueChange).toHaveBeenLastCalledWith(["structure"]);
    expect(
      screen.getByRole("button", { name: "Why does it feel responsive?" }),
    ).toHaveAttribute("aria-expanded", "false");
    expect(
      screen.getByRole("button", { name: "How is the content organized?" }),
    ).toHaveAttribute("aria-expanded", "true");
  });

  it("toggles items in uncontrolled mode", async () => {
    const user = userEvent.setup();

    render(<MotionAccordion items={items} />);

    const button = screen.getByRole("button", {
      name: "Why does it feel responsive?",
    });

    await user.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");

    await user.click(button);
    expect(button).toHaveAttribute("aria-expanded", "false");
  });

  it("keeps the current item open when allowCollapse is false", async () => {
    const user = userEvent.setup();

    render(
      <MotionAccordion
        items={items}
        defaultValue="responsiveness"
        allowCollapse={false}
      />,
    );

    const button = screen.getByRole("button", {
      name: "Why does it feel responsive?",
    });

    await user.click(button);

    expect(button).toHaveAttribute("aria-expanded", "true");
  });

  it("keeps the last open item expanded in multiple mode when allowCollapse is false", async () => {
    const user = userEvent.setup();

    render(
      <MotionAccordion
        multiple
        items={items}
        defaultValue={["responsiveness", "structure"]}
        allowCollapse={false}
      />,
    );

    const firstButton = screen.getByRole("button", {
      name: "Why does it feel responsive?",
    });
    const secondButton = screen.getByRole("button", {
      name: "How is the content organized?",
    });

    await user.click(firstButton);

    expect(firstButton).toHaveAttribute("aria-expanded", "false");
    expect(secondButton).toHaveAttribute("aria-expanded", "true");

    await user.click(secondButton);

    expect(secondButton).toHaveAttribute("aria-expanded", "true");
  });

  it("keeps disabled items closed", async () => {
    const user = userEvent.setup();

    render(<MotionAccordion items={items} />);

    const button = screen.getByRole("button", {
      name: "Can one item be disabled?",
    });

    expect(button).toHaveAttribute("aria-disabled", "true");

    await user.click(button);

    expect(button).toHaveAttribute("aria-expanded", "false");
  });

  it("renders string content as a paragraph and preserves JSX content", () => {
    render(<MotionAccordion items={items} defaultValue="structure" />);

    expect(
      screen.getByText(
        "The trigger icon, panel reveal, and copy transition all resolve as one gesture.",
      ).tagName,
    ).toBe("P");

    expect(
      screen.getByRole("link", { name: "Read the accessibility note" }),
    ).toHaveAttribute("href", "https://example.com/accessibility");
  });

  it("keeps keyboard navigation intact", async () => {
    const user = userEvent.setup();

    render(<MotionAccordion items={items} />);

    await user.tab();
    expect(
      screen.getByRole("button", { name: "Why does it feel responsive?" }),
    ).toHaveFocus();

    await user.keyboard("{ArrowDown}");
    expect(
      screen.getByRole("button", { name: "How is the content organized?" }),
    ).toHaveFocus();
  });

  it("passes an automated axe accessibility check", async () => {
    const { container } = render(
      <MotionAccordion items={items} defaultValue="responsiveness" />,
    );

    const results = await axe(container);

    expect(results.violations).toHaveLength(0);
  });

  it("stays usable when reduced motion is requested", async () => {
    const user = userEvent.setup();

    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: query === "(prefers-reduced-motion: reduce)",
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    render(<MotionAccordion items={items} />);

    const button = screen.getByRole("button", {
      name: "Why does it feel responsive?",
    });

    await user.click(button);

    expect(button).toHaveAttribute("aria-expanded", "true");
  });
});
