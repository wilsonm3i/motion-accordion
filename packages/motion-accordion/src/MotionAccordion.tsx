import * as React from "react";
import { Accordion, type AccordionRoot } from "@base-ui/react/accordion";
import { motion, useReducedMotion } from "framer-motion";

export type MotionAccordionItem = {
  id: string;
  title: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
};

type MotionAccordionCommonProps = React.HTMLAttributes<HTMLDivElement> & {
  items: MotionAccordionItem[];
  allowCollapse?: boolean;
};

export type MotionAccordionSingleProps = MotionAccordionCommonProps & {
  multiple?: false;
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
};

export type MotionAccordionMultipleProps = MotionAccordionCommonProps & {
  multiple: true;
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
};

export type MotionAccordionProps =
  | MotionAccordionSingleProps
  | MotionAccordionMultipleProps;

const ICON_SPRING = {
  type: "spring" as const,
  mass: 0.45,
  damping: 20,
  stiffness: 230,
};

function joinClassNames(...classNames: Array<string | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

function renderContent(content: React.ReactNode) {
  if (typeof content === "string") {
    return <p className="motion-accordion__paragraph">{content}</p>;
  }

  return content;
}

function normalizeOpenItemIds(
  value: AccordionRoot.State["value"] | string | string[] | null | undefined,
  itemIds: string[],
  multiple: boolean,
) {
  const validItemIds = new Set(itemIds);
  const nextValues = Array.isArray(value)
    ? value
    : value === null || value === undefined
      ? []
      : [value];
  const nextOpenItemIds: string[] = [];

  for (const nextValue of nextValues) {
    if (typeof nextValue !== "string" || !validItemIds.has(nextValue)) {
      continue;
    }

    if (nextOpenItemIds.includes(nextValue)) {
      continue;
    }

    nextOpenItemIds.push(nextValue);

    if (!multiple) {
      break;
    }
  }

  return nextOpenItemIds;
}

function areOpenItemIdsEqual(nextValue: string[], currentValue: string[]) {
  if (nextValue.length !== currentValue.length) {
    return false;
  }

  return nextValue.every((value, index) => value === currentValue[index]);
}

function getNextOpenItemIds(
  nextValue: AccordionRoot.State["value"],
  currentValue: string[],
  allowCollapse: boolean,
  itemIds: string[],
  multiple: boolean,
) {
  const nextOpenItemIds = normalizeOpenItemIds(nextValue, itemIds, multiple);

  if (nextOpenItemIds.length === 0 && !allowCollapse && currentValue.length > 0) {
    return currentValue;
  }

  return nextOpenItemIds;
}

function MotionAccordionIcon({
  open,
  reducedMotion,
}: {
  open: boolean;
  reducedMotion: boolean;
}) {
  const transition = reducedMotion ? { duration: 0 } : ICON_SPRING;
  const state = open ? "open" : "closed";

  return (
    <svg
      className="motion-accordion__icon"
      data-slot="icon"
      data-state={state}
      width="52"
      height="52"
      viewBox="0 0 52 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <motion.path
        d="M19 25.5H26L33 25.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        initial={false}
        animate={{ rotateZ: open ? 180 : 0 }}
        transition={transition}
        style={{ transformOrigin: "center" }}
      />
      <motion.path
        d="M26 18.5L26 25.5L26 32.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        initial={false}
        animate={{ scale: open ? 0 : 1, rotateZ: open ? 80 : 0 }}
        transition={transition}
        style={{ transformOrigin: "center" }}
      />
    </svg>
  );
}

export const MotionAccordion = React.forwardRef<
  HTMLDivElement,
  MotionAccordionProps
>(function MotionAccordion(
  {
    items,
    value,
    defaultValue,
    onValueChange,
    multiple = false,
    allowCollapse = true,
    className,
    ...restProps
  },
  ref,
) {
  const reducedMotion = Boolean(useReducedMotion());
  const isControlled = value !== undefined;
  const itemIds = items.map((item) => item.id);
  const [uncontrolledValue, setUncontrolledValue] = React.useState<string[]>(
    () => normalizeOpenItemIds(defaultValue, itemIds, multiple),
  );
  const openItemIds = isControlled
    ? normalizeOpenItemIds(value, itemIds, multiple)
    : normalizeOpenItemIds(uncontrolledValue, itemIds, multiple);

  React.useEffect(() => {
    if (isControlled) {
      return;
    }

    setUncontrolledValue((currentValue) => {
      const nextOpenItemIds = normalizeOpenItemIds(currentValue, itemIds, multiple);

      return areOpenItemIdsEqual(nextOpenItemIds, currentValue)
        ? currentValue
        : nextOpenItemIds;
    });
  }, [isControlled, itemIds, multiple]);

  return (
    <Accordion.Root
      {...restProps}
      ref={ref}
      value={openItemIds}
      multiple={multiple}
      onValueChange={(nextValue) => {
        const nextOpenItemIds = getNextOpenItemIds(
          nextValue,
          openItemIds,
          allowCollapse,
          itemIds,
          multiple,
        );

        if (areOpenItemIdsEqual(nextOpenItemIds, openItemIds)) {
          return;
        }

        if (!isControlled) {
          setUncontrolledValue(nextOpenItemIds);
        }

        if (multiple) {
          (onValueChange as MotionAccordionMultipleProps["onValueChange"])?.(
            nextOpenItemIds,
          );

          return;
        }

        (onValueChange as MotionAccordionSingleProps["onValueChange"])?.(
          nextOpenItemIds[0] ?? null,
        );
      }}
      className={joinClassNames("motion-accordion", className)}
      data-slot="root"
    >
      {items.map((item) => (
        <Accordion.Item
          key={item.id}
          value={item.id}
          disabled={item.disabled}
          render={(props, state) => (
            <div
              {...props}
              className={joinClassNames(
                typeof props.className === "string" ? props.className : undefined,
                "motion-accordion__item",
              )}
              data-slot="item"
              data-state={state.open ? "open" : "closed"}
            />
          )}
        >
          <div className="motion-accordion__surface">
            <Accordion.Header className="motion-accordion__header">
              <Accordion.Trigger
                render={(props, state) => (
                  <button
                    {...props}
                    className={joinClassNames(
                      typeof props.className === "string"
                        ? props.className
                        : undefined,
                      "motion-accordion__trigger",
                    )}
                    data-slot="trigger"
                    data-state={state.open ? "open" : "closed"}
                  >
                    <span className="motion-accordion__title">{item.title}</span>
                    <MotionAccordionIcon
                      open={state.open}
                      reducedMotion={reducedMotion}
                    />
                  </button>
                )}
              />
            </Accordion.Header>

            <Accordion.Panel
              keepMounted
              render={(props, state) => (
                <div
                  {...props}
                  className={joinClassNames(
                    typeof props.className === "string" ? props.className : undefined,
                    "motion-accordion__panel",
                  )}
                  data-slot="panel"
                  data-state={state.open ? "open" : "closed"}
                  aria-hidden={!state.open}
                  inert={!state.open}
                >
                  <div
                    className="motion-accordion__content"
                    data-slot="content"
                    data-state={state.open ? "open" : "closed"}
                  >
                    {renderContent(item.content)}
                  </div>
                </div>
              )}
            />
          </div>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
});

MotionAccordion.displayName = "MotionAccordion";
