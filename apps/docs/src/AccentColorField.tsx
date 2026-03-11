import type { KeyboardEvent } from "react";
import { Popover } from "@base-ui/react/popover";
import { HexColorPicker } from "react-colorful";

function normalizeHexDraft(value: string) {
  const trimmedValue = value.trim();
  const rawValue = trimmedValue.replace(/^#+/, "");

  return `#${rawValue}`;
}

export function AccentColorField({
  value,
  draftValue,
  isValid,
  onDraftChange,
  onPickerChange,
  onCommitDraft,
  id,
  label,
}: {
  value: string;
  draftValue: string;
  isValid: boolean;
  onDraftChange: (value: string) => void;
  onPickerChange: (value: string) => void;
  onCommitDraft: () => void;
  id: string;
  label: string;
}) {
  const displayColor = isValid ? draftValue : "#ffffff";

  const handleDraftChange = (nextValue: string) => {
    onDraftChange(normalizeHexDraft(nextValue));
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") {
      return;
    }

    onCommitDraft();
    event.currentTarget.blur();
  };

  return (
    <div className="docs-playground__accent-field" data-invalid={!isValid || undefined}>
      <Popover.Root>
        <div className="docs-playground__accent-row">
          <Popover.Trigger
            type="button"
            aria-label={`${label} picker`}
            className="docs-playground__accent-trigger"
            data-invalid={!isValid || undefined}
            style={{ backgroundColor: displayColor }}
          />

          <input
            id={id}
            name={id}
            type="text"
            aria-label={`${label} hex`}
            aria-invalid={!isValid || undefined}
            className="docs-playground__hex-input"
            value={draftValue}
            onBlur={onCommitDraft}
            onChange={(event) => handleDraftChange(event.target.value)}
            onKeyDown={handleInputKeyDown}
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            inputMode="text"
            maxLength={7}
            placeholder="Select a color"
          />
        </div>

        <Popover.Portal>
          <Popover.Positioner align="center" sideOffset={4}>
            <Popover.Popup
              initialFocus={false}
              className="docs-playground__accent-popover"
            >
              <HexColorPicker
                className="docs-playground__accent-picker"
                color={value}
                onChange={onPickerChange}
              />
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
}
