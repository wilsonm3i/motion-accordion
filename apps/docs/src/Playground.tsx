import type { CSSProperties, ReactNode } from "react";
import { useState } from "react";
import { MotionAccordion, type MotionAccordionItem } from "motion-accordion";
import { AccentColorField } from "./AccentColorField";

const PANEL_DURATION_RANGE = {
  min: 160,
  max: 520,
  step: 20,
};

const CONTENT_DURATION_RANGE = {
  min: 120,
  max: 360,
  step: 20,
};

const CONTENT_DELAY_RANGE = {
  min: 0,
  max: 180,
  step: 10,
};

const DEFAULT_PANEL_DURATION = 320;
const DEFAULT_CONTENT_DURATION = 220;
const DEFAULT_CONTENT_DELAY = 80;
const DEFAULT_ACCENT_COLOR = "#1a88f8";

function isHexColor(value: string) {
  return /^#[0-9a-f]{6}$/i.test(value);
}

function getFirstOpenItemId(items: MotionAccordionItem[], openIds: string[]) {
  return items.find((item) => openIds.includes(item.id))?.id ?? null;
}

function Control({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="docs-playground__control">
      <span className="docs-playground__control-label">{label}</span>
      <div className="docs-playground__control-value">{children}</div>
    </div>
  );
}

function TimingSlider({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="docs-playground__slider-row">
      <span className="docs-playground__slider-label">{label}</span>
      <input
        aria-label={label}
        className="docs-playground__slider"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <span className="docs-playground__slider-value">{value}ms</span>
    </label>
  );
}

export function Playground({ items }: { items: MotionAccordionItem[] }) {
  const [panelDuration, setPanelDuration] = useState(DEFAULT_PANEL_DURATION);
  const [contentDuration, setContentDuration] = useState(DEFAULT_CONTENT_DURATION);
  const [contentDelay, setContentDelay] = useState(DEFAULT_CONTENT_DELAY);
  const [accentColor, setAccentColor] = useState(DEFAULT_ACCENT_COLOR);
  const [accentDraft, setAccentDraft] = useState(DEFAULT_ACCENT_COLOR);
  const [singleOpen, setSingleOpen] = useState(true);
  const [openIds, setOpenIds] = useState<string[]>(() =>
    items[0] ? [items[0].id] : [],
  );
  const isAccentDraftValid = isHexColor(accentDraft);

  const previewStyle = {
    "--motion-accordion-accent": accentColor,
    "--motion-accordion-panel-duration": `${panelDuration}ms`,
    "--motion-accordion-content-duration": `${contentDuration}ms`,
    "--motion-accordion-content-delay": `${contentDelay}ms`,
  } as CSSProperties;

  const commitAccentDraft = () => {
    const nextValue = accentDraft.trim();

    if (!isHexColor(nextValue)) {
      setAccentDraft(accentColor);
      return;
    }

    const normalizedValue = nextValue.toLowerCase();
    setAccentColor(normalizedValue);
    setAccentDraft(normalizedValue);
  };

  const handleAccentDraftChange = (nextValue: string) => {
    if (isHexColor(nextValue)) {
      const normalizedValue = nextValue.toLowerCase();
      setAccentColor(normalizedValue);
      setAccentDraft(normalizedValue);
      return;
    }

    setAccentDraft(nextValue);
  };

  const handleAccentPickerChange = (nextValue: string) => {
    const normalizedValue = nextValue.toLowerCase();
    setAccentColor(normalizedValue);
    setAccentDraft(normalizedValue);
  };

  const handleOpenModeToggle = () => {
    setSingleOpen((currentValue) => {
      const nextSingleOpen = !currentValue;

      if (nextSingleOpen) {
        setOpenIds((currentOpenIds) => {
          const firstOpenItemId = getFirstOpenItemId(items, currentOpenIds);

          return firstOpenItemId ? [firstOpenItemId] : [];
        });
      }

      return nextSingleOpen;
    });
  };

  return (
    <div className="docs-playground" data-testid="playground-panel">
      <div
        className="docs-playground__preview"
        data-testid="playground-preview"
      >
        {singleOpen ? (
          <MotionAccordion
            items={items}
            style={previewStyle}
            value={openIds[0] ?? null}
            onValueChange={(nextValue) =>
              setOpenIds(nextValue ? [nextValue] : [])
            }
          />
        ) : (
          <MotionAccordion
            multiple
            items={items}
            style={previewStyle}
            value={openIds}
            onValueChange={setOpenIds}
          />
        )}
      </div>

      <div className="docs-playground__panel">
        <Control label="Latency">
          <div className="docs-playground__latency">
            <TimingSlider
              label="Panel duration"
              value={panelDuration}
              onChange={setPanelDuration}
              {...PANEL_DURATION_RANGE}
            />
            <TimingSlider
              label="Content duration"
              value={contentDuration}
              onChange={setContentDuration}
              {...CONTENT_DURATION_RANGE}
            />
            <TimingSlider
              label="Content delay"
              value={contentDelay}
              onChange={setContentDelay}
              {...CONTENT_DELAY_RANGE}
            />
          </div>
        </Control>

        <div className="docs-playground__divider" />

        <Control label="Accent color">
          <AccentColorField
            id="playground-accent-color"
            label="Accent color"
            value={accentColor}
            draftValue={accentDraft}
            isValid={isAccentDraftValid}
            onDraftChange={handleAccentDraftChange}
            onPickerChange={handleAccentPickerChange}
            onCommitDraft={commitAccentDraft}
          />
        </Control>

        <div className="docs-playground__divider" />

        <Control label="Single-open">
          <button
            type="button"
            className="docs-playground__toggle"
            aria-pressed={singleOpen}
            data-active={singleOpen || undefined}
            onClick={handleOpenModeToggle}
          >
            Only one open
          </button>
        </Control>
      </div>
    </div>
  );
}
