"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import { CaseFaq } from "@/components/case-study/CaseFaq";
import type { FaqCategory } from "@/lib/faq";

type FaqTabsState = {
  active: string;
  /** Question deep-linked through the URL hash, opened once its tab shows. */
  linkedQuestion: string | null;
  select: (id: string) => void;
};

const FaqTabsContext = createContext<FaqTabsState | null>(null);

function useFaqTabs() {
  const context = useContext(FaqTabsContext);
  if (!context) throw new Error("useFaqTabs must be used inside FaqTabsProvider");
  return context;
}

/**
 * Active tab for /faq, shared by the tab list in the aside and the panels in
 * main (they sit in different columns, like BlogFilterContext on /blog).
 * The URL hash carries the state both ways: /faq#pricing opens that tab, and
 * /faq#<question id> opens the question's tab with that question expanded, so
 * any answer can be linked from a call or an email.
 */
export function FaqTabsProvider({
  index,
  children,
}: {
  /** Tab id → the question ids it holds. */
  index: { id: string; questions: string[] }[];
  children: ReactNode;
}) {
  const [active, setActive] = useState(index[0].id);
  const [linkedQuestion, setLinkedQuestion] = useState<string | null>(null);

  useEffect(() => {
    function fromHash() {
      const hash = decodeURIComponent(window.location.hash.slice(1));
      if (!hash) return;
      const tab = index.find((t) => t.id === hash);
      if (tab) {
        setActive(tab.id);
        setLinkedQuestion(null);
        return;
      }
      const owner = index.find((t) => t.questions.includes(hash));
      if (owner) {
        setActive(owner.id);
        setLinkedQuestion(hash);
      }
    }
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [index]);

  const select = useCallback((id: string) => {
    setActive(id);
    setLinkedQuestion(null);
    window.history.replaceState(null, "", `#${id}`);
    // Bring the new panel's heading into view when the reader had scrolled
    // past it (always on mobile, where the tabs sit above the panels).
    const panel = document.getElementById(`faq-panel-${id}`);
    if (panel && panel.getBoundingClientRect().top < 0) {
      panel.scrollIntoView({ block: "start" });
    }
  }, []);

  const value = useMemo(() => ({ active, linkedQuestion, select }), [active, linkedQuestion, select]);
  return <FaqTabsContext.Provider value={value}>{children}</FaqTabsContext.Provider>;
}

/** Sharp-edged pill tabs, blue when active like the /case-studies tabs; a vertical list on desktop. */
export function FaqTabList({ tabs }: { tabs: { id: string; label: string; count: number }[] }) {
  const { active, select } = useFaqTabs();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const last = tabs.length - 1;
    const next =
      event.key === "ArrowDown" || event.key === "ArrowRight"
        ? index === last ? 0 : index + 1
        : event.key === "ArrowUp" || event.key === "ArrowLeft"
          ? index === 0 ? last : index - 1
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? last
              : null;
    if (next === null) return;
    event.preventDefault();
    select(tabs[next].id);
    refs.current[next]?.focus();
  }

  return (
    <div className="flex flex-col gap-[10px]">
      <p className="text-[12px] font-medium uppercase text-label-grey">Topics:</p>
      <div
        role="tablist"
        aria-label="FAQ topics"
        aria-orientation="vertical"
        className="flex flex-wrap gap-2 desk:flex-col desk:flex-nowrap desk:gap-1.5"
      >
        {tabs.map((tab, index) => {
          const selected = tab.id === active;
          return (
            <button
              key={tab.id}
              ref={(el) => {
                refs.current[index] = el;
              }}
              type="button"
              role="tab"
              id={`faq-tab-${tab.id}`}
              aria-selected={selected}
              aria-controls={`faq-panel-${tab.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => select(tab.id)}
              onKeyDown={(event) => onKeyDown(event, index)}
              className={`flex cursor-pointer items-center gap-2 rounded-none px-3 py-1 text-left font-button text-[12px] font-semibold uppercase tracking-[-0.02em] transition-colors desk:w-full desk:justify-between desk:py-2 ${
                selected
                  ? "border border-transparent bg-accent text-white"
                  : "border border-dashed border-hairline bg-transparent text-white/40 hover:bg-button-dark"
              }`}
            >
              <span>{tab.label}</span>
              <span className="tabular-nums opacity-60">{tab.count}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * One topic's panel: a small topic label and the shared CaseFaq
 * accordion. Every panel is server-rendered with all its answers in the
 * HTML; inactive ones are only `hidden`, so crawlers that don't run
 * JavaScript still read the whole page.
 */
export function FaqPanel({ category }: { category: FaqCategory }) {
  const { active, linkedQuestion } = useFaqTabs();
  const selected = category.id === active;
  const linkedIndex = linkedQuestion ? category.items.findIndex((item) => item.id === linkedQuestion) : -1;

  useEffect(() => {
    if (selected && linkedIndex >= 0 && linkedQuestion) {
      document.getElementById(linkedQuestion)?.scrollIntoView({ block: "start" });
    }
  }, [selected, linkedIndex, linkedQuestion]);

  return (
    <section
      role="tabpanel"
      id={`faq-panel-${category.id}`}
      aria-labelledby={`faq-tab-${category.id}`}
      hidden={!selected}
      tabIndex={0}
      className="scroll-mt-24 focus-visible:outline-none"
    >
      {/* Topic heading for the page outline; questions are the h3s inside CaseFaq. */}
      <h2 className="pb-6 text-[12px] font-medium uppercase text-label-grey">{category.label}</h2>
      {/* Re-keyed on a deep link so the accordion opens that question instead of the first. */}
      <CaseFaq
        key={linkedIndex >= 0 ? `${category.id}:${linkedQuestion}` : category.id}
        items={category.items}
        defaultOpenIndex={linkedIndex >= 0 ? linkedIndex : 0}
      />
    </section>
  );
}
