import { expect, test, type Page } from "@playwright/test";

const DEFAULT_ACCENT_COLOR = "#1a88f8";

function getPlaygroundAccordion(page: Page) {
  return page.getByTestId("playground-preview").locator(".motion-accordion").first();
}

async function expectAccentColor(page: Page, value: string) {
  const accordion = getPlaygroundAccordion(page);

  await expect(accordion).toBeVisible();
  await expect.poll(async () => {
    return accordion.evaluate((element) =>
      getComputedStyle(element).getPropertyValue("--motion-accordion-accent").trim(),
    );
  }).toBe(value);
}

async function clickAt(page: Page, selector: string, position: { x: number; y: number }) {
  const target = page.locator(selector);

  await expect(target).toBeVisible();

  const box = await target.boundingBox();

  if (!box) {
    throw new Error(`Missing bounding box for ${selector}`);
  }

  await page.mouse.click(box.x + position.x, box.y + position.y);
}

test("renders the docs homepage with install instructions", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      name: "MotionAccordion",
      exact: true,
      level: 1,
    }),
  ).toBeVisible();
  await expect(page.getByText("npm install motion-accordion")).toBeVisible();
  await expect(
    page
      .getByTestId("faq-demo")
      .getByRole("button", { name: "What is motion accordion?" }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Playground" })).toBeVisible();
});

test("allows multiple items to stay open in the playground", async ({ page }) => {
  await page.goto("/playground");

  const playground = page.getByTestId("playground-page");

  await expect(page.getByLabel("Panel duration")).toBeVisible();
  await expect(page.getByLabel("Accent color picker")).toBeVisible();
  await expect(page.getByRole("button", { name: "Only one open" })).toBeVisible();

  await playground.getByRole("button", { name: "Only one open" }).click();
  await playground
    .getByRole("button", { name: "Why does it feel responsive?" })
    .click();

  await expect(
    playground.getByRole("button", { name: "What is motion accordion?" }),
  ).toHaveAttribute("aria-expanded", "true");
  await expect(
    playground.getByRole("button", { name: "Why does it feel responsive?" }),
  ).toHaveAttribute("aria-expanded", "true");
});

test("normalizes a valid accent hex value and updates the preview", async ({ page }) => {
  await page.goto("/playground");

  const accentInput = page.getByLabel("Accent color hex");
  const accentTrigger = page.getByLabel("Accent color picker");

  await accentInput.fill("FF6600");

  await expect(accentInput).toHaveValue("#ff6600");
  await expect(accentTrigger).toHaveCSS("background-color", "rgb(255, 102, 0)");
  await expectAccentColor(page, "#ff6600");
});

test("keeps the last valid accent color until an invalid draft is committed", async ({
  page,
}) => {
  await page.goto("/playground");

  const accentInput = page.getByLabel("Accent color hex");
  const accentTrigger = page.getByLabel("Accent color picker");

  await accentInput.fill("GGGGGG");

  await expect(accentInput).toHaveValue("#GGGGGG");
  await expect(accentTrigger).toHaveCSS("background-color", "rgb(255, 255, 255)");
  await expectAccentColor(page, DEFAULT_ACCENT_COLOR);

  await accentInput.blur();

  await expect(accentInput).toHaveValue(DEFAULT_ACCENT_COLOR);
  await expect(accentTrigger).toHaveCSS("background-color", "rgb(26, 136, 248)");
  await expectAccentColor(page, DEFAULT_ACCENT_COLOR);
});

test("syncs the accent input and preview when the picker changes color", async ({
  page,
}) => {
  await page.goto("/playground");

  const accentInput = page.getByLabel("Accent color hex");

  await page.getByLabel("Accent color picker").click();
  await expect(page.locator(".docs-playground__accent-popover")).toBeVisible();

  await clickAt(page, ".docs-playground__accent-picker .react-colorful__hue", {
    x: 1,
    y: 12,
  });
  await clickAt(
    page,
    ".docs-playground__accent-picker .react-colorful__saturation",
    {
      x: 198,
      y: 1,
    },
  );

  await expect.poll(async () => accentInput.inputValue()).not.toBe(DEFAULT_ACCENT_COLOR);

  const nextValue = await accentInput.inputValue();
  expect(nextValue).toMatch(/^#[0-9a-f]{6}$/);
  await expectAccentColor(page, nextValue);
});

test("matches the FAQ visual snapshot", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByTestId("faq-demo")).toHaveScreenshot("faq-demo.png", {
    animations: "disabled",
    caret: "hide",
  });
});

test("matches the playground visual snapshot", async ({ page }) => {
  await page.goto("/playground");

  await expect(page.getByTestId("playground-page")).toHaveScreenshot(
    "playground.png",
    {
      animations: "disabled",
      caret: "hide",
    },
  );
});
