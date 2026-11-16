"use client";

import { Fragment, useState, type ReactNode } from "react";
import type { FaqItem } from "@/lib/case-studies";

const linkClass = "text-white underline underline-offset-2 transition-opacity hover:opacity-70";

/** Inline `[label](href)` links inside an answer. Site paths stay in the tab;
    anything absolute opens a new one, like the trailing href/linkLabel link. */
function renderInline(text: string): ReactNode[] {
  return text.split(/(\[[^\]]+\]\([^)\s]+\))/g).map((part, i) => {
    const link = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
    if (!link) return <Fragment key={i}>{part}</Fragment>;
    const [, label, href] = link;
    const external = /^https?:\/\//.test(href);
    return (
      <a
        key={i}
        href={href}
        className={linkClass}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {label}
      </a>
    );
  });
}

type AnswerBlock = { list: boolean; lines: string[] };

/** An answer's blocks: blank lines separate paragraphs, and consecutive lines
    starting with "- " become a list. A plain one-line answer (every FAQ before
    /faq) renders as a single paragraph, exactly as it did before. */
function answerBlocks(text: string) {
  const blocks: AnswerBlock[] = [];
  for (const chunk of text.split(/\n\s*\n/)) {
    // A blank line always starts a new block, so `current` resets per chunk.
    let current: AnswerBlock | null = null;
    for (const raw of chunk.split("\n")) {
      const line = raw.trim();
      if (!line) continue;
      const list = line.startsWith("- ");
      const body = list ? line.slice(2) : line;
      if (current && current.list === list) {
        current.lines.push(body);
      } else {
        current = { list, lines: [body] };
        blocks.push(current);
      }
    }
  }
  return blocks;
}

function PlusMinusIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={`shrink-0 text-white transition-transform duration-300 ease-out ${
        open ? "rotate-180" : ""
      }`}
    >
      <path d="M5 12h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      {/* Vertical bar folds away as the item opens: + morphs into −. */}
      <path
        d="M12 5v14"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        className={`origin-center transition-all duration-300 ease-out ${
          open ? "rotate-90 opacity-0" : ""
        }`}
      />
    </svg>
  );
}

/** FAQ accordion — one item open at a time, first item open by default (as in Figma).
    `defaultOpenIndex` lets /faq open a deep-linked question instead (null opens none). */
export function CaseFaq({
  items,
  defaultOpenIndex = 0,
}: {
  items: FaqItem[];
  defaultOpenIndex?: number | null;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpenIndex);

  return (
    <div className="flex flex-col divide-y-[0.5px] divide-hairline">
      {items.map((item, index) => {
        const open = openIndex === index;
        return (
          <div
            key={item.q}
            id={item.id}
            className={`py-3 first:pt-0 last:pb-0 ${item.id ? "scroll-mt-24" : ""}`}
          >
            {/* h3 wraps the button (headings can't nest inside <button>) so
                each question is a real heading in the page outline — matches
                the FAQPage schema's Question/Answer pairs. */}
            <h3>
              <button
                type="button"
                aria-expanded={open}
                onClick={() => setOpenIndex(open ? null : index)}
                className="group flex w-full cursor-pointer items-center justify-between gap-2 text-left"
              >
                <span className="text-[16px] leading-[1.5] text-white transition-opacity duration-200 group-hover:opacity-60">
                  {item.q}
                </span>
                <span
                  className={`flex h-4.5 w-8 shrink-0 items-center justify-center transition-colors duration-200 group-hover:opacity-60 ${
                    open ? "bg-accent" : "bg-[#3E3E3E]"
                  }`}
                >
                  <PlusMinusIcon open={open} />
                </span>
              </button>
            </h3>
            {/* Answer stays in the DOM; grid-rows animates the height. */}
            <div
              className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <div
                  className={`flex flex-col gap-3 pt-3 text-[16px] leading-[1.5] text-white/60 transition-opacity duration-300 ${
                    open ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {answerBlocks(item.a).map((block, b, all) => {
                    if (block.list) {
                      return (
                        <ul key={b} className="flex list-disc flex-col gap-1 pl-5 marker:text-white/30">
                          {block.lines.map((line, l) => (
                            <li key={l}>{renderInline(line)}</li>
                          ))}
                        </ul>
                      );
                    }
                    return (
                      <p key={b}>
                        {renderInline(block.lines.join(" "))}
                        {b === all.length - 1 && item.href && item.linkLabel ? (
                          <>
                            {" "}
                            <a
                              href={item.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={linkClass}
                            >
                              {item.linkLabel}
                            </a>
                          </>
                        ) : null}
                      </p>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
