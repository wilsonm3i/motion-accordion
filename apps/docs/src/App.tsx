import type { ReactNode } from "react";
import pkg from "motion-accordion/package.json";
import {
  MotionAccordion,
  type MotionAccordionItem,
} from "motion-accordion";
import { Playground } from "./Playground";

const faqItems: MotionAccordionItem[] = [
  {
    id: "what-is-motion-accordion",
    title: "What is motion accordion?",
    content:
      "It is a polished accordion demo that combines Base UI structure with Framer Motion transitions to make each expansion feel clear and tactile.",
  },
  {
    id: "why-does-it-feel-responsive",
    title: "Why does it feel responsive?",
    content:
      "The trigger icon rotates with a spring, the panel height eases open, and the body copy fades in with a slight offset so the whole interaction reads as one gesture.",
  },
  {
    id: "how-is-content-organized",
    title: "How is the content organized?",
    content:
      "Each card keeps the question prominent, constrains the reading width, and reveals only one answer at a time so the layout stays easy to scan.",
  },
  {
    id: "does-it-support-accessibility",
    title: "Does it support accessibility preferences?",
    content:
      "Yes. Reduced-motion users get the same interaction without animated timing, which keeps the accordion usable without relying on movement.",
  },
  {
    id: "where-should-i-use-it",
    title: "Where should I use it?",
    content:
      "It works well for product details, onboarding steps, feature explainers, and FAQ sections where motion should reinforce structure instead of distract from it.",
  },
];

const installCommand = "npm install motion-accordion";

const usageSnippet = String.raw`import { MotionAccordion } from "motion-accordion";

const items = [
  {
    id: "what-is-motion-accordion",
    title: "What is motion accordion?",
    content: "It is a polished accordion demo with tactile motion.",
  },
  {
    id: "why-does-it-feel-responsive",
    title: "Why does it feel responsive?",
    content: "The icon, panel height, and copy animate as one gesture.",
  },
];

export function FAQ() {
  return <MotionAccordion items={items} />;
}`;

const customizationSnippet = String.raw`import type { CSSProperties } from "react";
import { MotionAccordion } from "motion-accordion";

const accordionStyle = {
  "--motion-accordion-accent": "#ff6a3d",
  "--motion-accordion-panel-duration": "360ms",
  "--motion-accordion-content-duration": "240ms",
  "--motion-accordion-content-delay": "100ms",
} as CSSProperties;

export function FAQ() {
  return <MotionAccordion items={items} multiple style={accordionStyle} />;
}`;

const githubUrl = "https://github.com/wilsonm3i/motion-accordion.git";
const npmUrl = "https://www.npmjs.com/package/motion-accordion";

function getCurrentPath() {
  const normalizedPath = window.location.pathname.replace(/\/+$/, "");

  return normalizedPath === "" ? "/" : normalizedPath;
}

function CodeBlock({
  children,
  terminal = false,
}: {
  children: string;
  terminal?: boolean;
}) {
  return (
    <div className="docs-code">
      <pre>
        <code>
          {terminal ? <span className="docs-code__prompt">$ </span> : null}
          {children}
        </code>
      </pre>
    </div>
  );
}

function Section({
  title,
  children,
  testId,
}: {
  title: string;
  children: ReactNode;
  testId?: string;
}) {
  return (
    <section className="docs-section" data-testid={testId}>
      <h2 className="docs-section__title">{title}</h2>
      {children}
    </section>
  );
}

function PageHeader({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <header className="docs-header">
      <div className="docs-header__title-row">
        <h1 className="docs-header__title">{title}</h1>
        {children}
      </div>

      <p className="docs-header__description">{description}</p>
    </header>
  );
}

function DocsHomePage() {
  return (
    <main className="docs-page">
      <PageHeader
        title="MotionAccordion"
        description="A springy accordion demo with smooth panel reveals, restrained sequencing, and reduced-motion support built in."
      >
        <a
          className="docs-header__version"
          href={npmUrl}
          target="_blank"
          rel="noreferrer"
        >
          v{pkg.version}
        </a>
        <a className="docs-header__version" href="/playground">
          Playground
        </a>
        <a
          className="docs-header__version"
          href={githubUrl}
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
      </PageHeader>

      <Section title="Demo" testId="faq-demo">
        <MotionAccordion items={faqItems} />
      </Section>

      <Section title="Installation">
        <CodeBlock terminal>{installCommand}</CodeBlock>
      </Section>

      <Section title="Usage">
        <CodeBlock>{usageSnippet}</CodeBlock>
        <p className="docs-note">
          Use <code>multiple</code> to keep more than one item open. Accent
          color and motion timing are controlled with CSS variables, so you can
          tune them inline or in your stylesheet.
        </p>
        <CodeBlock>{customizationSnippet}</CodeBlock>
      </Section>
    </main>
  );
}

function PlaygroundPage() {
  return (
    <main className="docs-page docs-page--playground" data-testid="playground-page">
      <PageHeader
        title="Playground"
        description="Tune MotionAccordion timing, accent, and open behavior in real time."
      >
        <a className="docs-header__version" href="/">
          Docs
        </a>
        <a
          className="docs-header__version"
          href={npmUrl}
          target="_blank"
          rel="noreferrer"
        >
          v{pkg.version}
        </a>
        <a
          className="docs-header__version"
          href={githubUrl}
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
      </PageHeader>

      <Playground items={faqItems} />
    </main>
  );
}

export default function App() {
  return getCurrentPath() === "/playground" ? <PlaygroundPage /> : <DocsHomePage />;
}
