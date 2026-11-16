"use client";

import Link from "next/link";
import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { ArrowIcon } from "@/components/ArrowIcon";
import { ctaButtonBase, ctaButtonPadding } from "@/components/cta-button-styles";
import { SectionNav } from "@/components/SectionNav";
import type { SwipeCreator } from "@/lib/swipe/creators";
import { compactNumber, platformLabel, profileUrl } from "@/lib/swipe/format";
import type { SwipeCategory, SwipePlatform, SwipePost } from "@/lib/swipe/posts";
import { SwipeCreatorCard } from "./SwipeCreatorCard";
import { CreatorMonogram, PlatformIcon } from "./SwipeGlyphs";
import { SwipePostCard } from "./SwipePostCard";
import { warmEmbed } from "./SwipePostEmbed";
import { SwipePostViewer } from "./SwipePostViewer";

type PlatformFilter = "all" | SwipePlatform;
type CategoryFilter = "all" | SwipeCategory;
type Sort = "newest" | "liked";

/** Section tops clear the sticky Navbar (and the mobile filter strip below
    desk). Defined here so the page has no outside dependency for it. */
const sectionScrollMargin = "scroll-mt-28 desk:scroll-mt-16";
/** Divides evenly into the grid's 1, 2 and 3 columns. */
const PAGE_SIZE = 24;
/** Picks dated within this many days of the newest one are tagged "New". */
const LATEST_WINDOW_DAYS = 14;
const platforms: SwipePlatform[] = ["x", "linkedin"];

const labelClass = "text-[12px] font-medium uppercase tracking-[0.04em] text-label-grey";
const monoClass = "font-mono text-[12px] uppercase leading-none tracking-[0.04em] text-label-grey";
const textButton =
  "cursor-pointer font-button text-[12px] font-semibold uppercase tracking-[-0.02em] text-white transition-colors hover:text-white/70";
const profileCircle =
  "flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full border-[0.5px] border-hairline text-white/60 transition-colors hover:bg-button-dark hover:text-white";

/** ArticleFilters' sharp pill: dashed hairline at rest, button-dark when
    pressed. Never accent; on /swipe the accent is SectionNav's marker and the
    viewer's Copy prompt. */
function pillClass(active: boolean) {
  return `shrink-0 cursor-pointer whitespace-nowrap rounded-none px-3 py-1 font-button text-[12px] font-semibold uppercase tracking-[-0.02em] transition-colors ${
    active
      ? "border border-transparent bg-button-dark text-white"
      : "border border-dashed border-hairline bg-transparent text-white/40 hover:bg-button-dark"
  }`;
}

function Pill({
  active,
  onClick,
  children,
  ...rest
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick" | "children">) {
  return (
    <button type="button" aria-pressed={active} onClick={onClick} className={pillClass(active)} {...rest}>
      {children}
    </button>
  );
}

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function SearchField({
  id,
  value,
  onChange,
  onEscape,
  inputRef,
  autoFocus,
  showShortcut,
  className = "",
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  onEscape: () => void;
  inputRef?: React.RefObject<HTMLInputElement | null>;
  autoFocus?: boolean;
  showShortcut?: boolean;
  className?: string;
}) {
  return (
    <label
      htmlFor={id}
      className={`items-center gap-3 border-[0.5px] border-hairline px-3 py-2.5 text-white/40 focus-within:border-white/40 ${className}`}
    >
      <span className="sr-only">Search posts and creators</span>
      <SearchIcon />
      <input
        ref={inputRef}
        id={id}
        type="search"
        value={value}
        autoFocus={autoFocus}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            onEscape();
            event.currentTarget.blur();
          }
        }}
        placeholder="Search posts and creators"
        className="min-w-0 flex-1 bg-transparent text-[14px] text-white outline-none placeholder:text-white/40"
      />
      {showShortcut && <kbd className="shrink-0 font-mono text-[12px] leading-none text-label-grey">⌘K</kbd>}
    </label>
  );
}

/**
 * Hairline grid for posts and creators: every cell draws its own right and
 * bottom rule and the wrapper clips the last column's right rule, so the grid
 * ends flush at any column count. Filler cells close a partial last row.
 */
function HairlineGrid({
  className,
  children,
  ...rest
}: { className: string; children: React.ReactNode } & React.HTMLAttributes<HTMLUListElement>) {
  return (
    <div className="overflow-hidden">
      <ul
        className={`-mr-px grid [&>li]:border-r-[0.5px] [&>li]:border-b-[0.5px] [&>li]:border-hairline ${className}`}
        {...rest}
      >
        {children}
      </ul>
    </div>
  );
}

/** Empty <li>s that keep a partial last row ruled at 1 / 2 / 3 columns. */
function postFillers(count: number) {
  const need2 = count % 2;
  const need3 = (3 - (count % 3)) % 3;
  return (
    <>
      {(need2 > 0 || need3 > 0) && (
        <li aria-hidden="true" className={`hidden ${need2 ? "min-[700px]:block" : ""} ${need3 ? "desk:block" : "desk:hidden"}`} />
      )}
      {need3 === 2 && <li aria-hidden="true" className="hidden desk:block" />}
    </>
  );
}

/** Same, for the creator grid's 2 / 3 columns. */
function creatorFillers(count: number) {
  const need2 = count % 2;
  const need3 = (3 - (count % 3)) % 3;
  return (
    <>
      {(need2 > 0 || need3 > 0) && (
        <li aria-hidden="true" className={`${need2 ? "block" : "hidden"} ${need3 ? "desk:block" : "desk:hidden"}`} />
      )}
      {need3 === 2 && <li aria-hidden="true" className="hidden desk:block" />}
    </>
  );
}

function daysBetween(a: string, b: string) {
  return Math.abs(Date.parse(`${a}T00:00:00Z`) - Date.parse(`${b}T00:00:00Z`)) / 86_400_000;
}

function matchesQuery(haystack: (string | undefined)[], query: string) {
  if (!query) return true;
  return haystack.some((value) => value?.toLowerCase().includes(query));
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Rewrites ?post= / ?creator= on the current URL, keeping the rest. */
function writeUrl(update: (params: URLSearchParams) => void, mode: "push" | "replace") {
  const url = new URL(window.location.href);
  update(url.searchParams);
  const next = `${url.pathname}${url.search}${url.hash}`;
  if (mode === "push") window.history.pushState(null, "", next);
  else window.history.replaceState(null, "", next);
}

/**
 * The whole /swipe tool: the sticky sidebar (intro, search, filters, index,
 * credit), the mobile filter strip, the post feed, the creator directory and
 * the post viewer, all on one state model. `intro` is the server-rendered
 * heading block; `children` (badges + Footer) render at the end of <main>.
 *
 * URL state: ?post=<id> opens the viewer, ?creator=<id> selects a creator.
 * Both use the native history API, which Next.js syncs with its router.
 */
export function SwipeExplorer({
  posts,
  creators,
  categories,
  intro,
  children,
}: {
  posts: SwipePost[];
  creators: SwipeCreator[];
  categories: SwipeCategory[];
  intro: React.ReactNode;
  children: React.ReactNode;
}) {
  const [platform, setPlatform] = useState<PlatformFilter>("all");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [query, setQuery] = useState("");
  const [creatorId, setCreatorId] = useState<string | null>(null);
  const [sort, setSort] = useState<Sort>("newest");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [openPostId, setOpenPostId] = useState<string | null>(null);
  const [viewerList, setViewerList] = useState<string[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());

  const deskSearchRef = useRef<HTMLInputElement>(null);
  const mobileSearchRef = useRef<HTMLInputElement>(null);
  const postsRef = useRef<HTMLElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  /** The viewer added a history entry (opened from a card), so closing pops it. */
  const pushedRef = useRef(false);

  const postsById = useMemo(() => new Map(posts.map((post) => [post.id, post])), [posts]);
  const creatorsById = useMemo(() => new Map(creators.map((creator) => [creator.id, creator])), [creators]);
  const orderById = useMemo(() => new Map(posts.map((post, index) => [post.id, index])), [posts]);

  const newestDay = useMemo(
    () => posts.map((post) => post.date).filter((date) => date.length === 10).sort().at(-1) ?? "",
    [posts],
  );
  const currentYear = newestDay.slice(0, 4);
  const isNew = useMemo(
    () =>
      new Set(
        posts
          .filter((post) => newestDay && post.date.length === 10 && daysBetween(post.date, newestDay) < LATEST_WINDOW_DAYS)
          .map((post) => post.id),
      ),
    [posts, newestDay],
  );

  const creatorStats = useMemo(() => {
    const stats = new Map<string, { count: number; likes: number; since: string }>();
    for (const post of posts) {
      const current = stats.get(post.creator) ?? { count: 0, likes: 0, since: post.date.slice(0, 4) };
      current.count += 1;
      current.likes += post.likes;
      if (post.date.slice(0, 4) < current.since) current.since = post.date.slice(0, 4);
      stats.set(post.creator, current);
    }
    return stats;
  }, [posts]);

  const postMatches = useCallback(
    (post: SwipePost, opts: { ignoreCreator?: boolean } = {}) => {
      if (platform !== "all" && post.platform !== platform) return false;
      if (category !== "all" && post.category !== category) return false;
      if (!opts.ignoreCreator && creatorId && post.creator !== creatorId) return false;
      const creator = creatorsById.get(post.creator);
      return matchesQuery(
        [post.title, post.summary, post.category, post.format, post.hook, creator?.name, creator?.x, creator?.linkedin, creator?.role],
        deferredQuery,
      );
    },
    [platform, category, creatorId, deferredQuery, creatorsById],
  );

  const visiblePosts = useMemo(() => {
    const list = posts.filter((post) => postMatches(post));
    if (sort === "liked") {
      list.sort((a, b) => b.likes - a.likes || orderById.get(a.id)! - orderById.get(b.id)!);
    }
    return list;
  }, [posts, postMatches, sort, orderById]);

  // Never narrowed by the selected creator, so the directory stays complete
  // and you can jump straight from one creator to another.
  const visibleCreators = useMemo(() => {
    const withMatches = new Set(posts.filter((post) => postMatches(post, { ignoreCreator: true })).map((post) => post.creator));
    return creators.filter(
      (creator) =>
        withMatches.has(creator.id) ||
        (deferredQuery !== "" && matchesQuery([creator.name, creator.x, creator.linkedin, creator.role], deferredQuery)),
    );
  }, [creators, posts, postMatches, deferredQuery]);

  const matchingCreatorCount = useMemo(() => new Set(visiblePosts.map((post) => post.creator)).size, [visiblePosts]);
  const selectedCreator = creatorId ? creatorsById.get(creatorId) : undefined;
  const filtersActive = platform !== "all" || category !== "all" || query.trim() !== "" || !!creatorId;
  const creatorsNarrowed = platform !== "all" || category !== "all" || deferredQuery !== "";

  /** After a filter change: if the feed's top has scrolled away above the
      sticky chrome, bring it back. Below it, leave the scroll alone. */
  const revealPosts = useCallback((always = false) => {
    window.requestAnimationFrame(() => {
      const section = postsRef.current;
      if (!section) return;
      const top = section.getBoundingClientRect().top;
      if (top < 64 || (always && top > window.innerHeight)) {
        section.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
      }
    });
  }, []);

  /** Reads ?creator= and ?post= into state; used on mount and on Back/Forward. */
  const applyLocation = useCallback(
    (initial: boolean) => {
      const params = new URLSearchParams(window.location.search);
      const creatorParam = params.get("creator");
      const postParam = params.get("post");
      const validCreator = creatorParam && creatorsById.has(creatorParam) ? creatorParam : null;
      const validPost = postParam && postsById.has(postParam) ? postParam : null;

      setCreatorId(validCreator);
      if (validPost) {
        const list = posts.filter((post) => !validCreator || post.creator === validCreator).map((post) => post.id);
        const index = Math.max(0, list.indexOf(validPost));
        setVisibleCount(Math.max(PAGE_SIZE, Math.ceil((index + 1) / PAGE_SIZE) * PAGE_SIZE));
        setViewerList(list.includes(validPost) ? list : [validPost]);
        setOpenPostId(validPost);
      } else {
        setOpenPostId(null);
        pushedRef.current = false;
      }
      if (initial && ((creatorParam && !validCreator) || (postParam && !validPost))) {
        writeUrl((p) => {
          if (!validCreator) p.delete("creator");
          if (!validPost) p.delete("post");
        }, "replace");
      }
    },
    [creatorsById, postsById, posts],
  );

  // The URL is external state: read it once on the first frame after
  // hydration (so server and client render the same default view first),
  // then again on every Back/Forward.
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => applyLocation(true));
    const onPopState = () => applyLocation(false);
    window.addEventListener("popstate", onPopState);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("popstate", onPopState);
    };
  }, [applyLocation]);

  // ⌘K / Ctrl+K, and "/" when not typing, jump to whichever search is shown.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (openPostId) return;
      const typing =
        event.target instanceof HTMLElement &&
        (event.target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(event.target.tagName));
      if (!((event.key === "k" && (event.metaKey || event.ctrlKey)) || (event.key === "/" && !typing))) return;
      event.preventDefault();
      const desk = deskSearchRef.current;
      if (desk && desk.offsetParent !== null) {
        desk.focus();
        desk.select();
      } else {
        setSearchOpen(true);
        window.requestAnimationFrame(() => mobileSearchRef.current?.focus());
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [openPostId]);

  // Keep the pressed pill in view inside the mobile strip (never scrollIntoView,
  // which would move the page too).
  useEffect(() => {
    const strip = stripRef.current;
    const pressed = strip?.querySelector<HTMLElement>('[data-strip-filter][aria-pressed="true"]');
    if (!strip || !pressed) return;
    strip.scrollTo({
      left: pressed.offsetLeft - (strip.clientWidth - pressed.offsetWidth) / 2,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  }, [platform, category]);

  function afterFilterChange() {
    setVisibleCount(PAGE_SIZE);
    revealPosts();
  }

  function changePlatform(value: PlatformFilter) {
    setPlatform(value);
    afterFilterChange();
  }

  function changeCategory(value: CategoryFilter) {
    setCategory(value);
    afterFilterChange();
  }

  function changeQuery(value: string) {
    setQuery(value);
    afterFilterChange();
  }

  function changeSort(value: Sort) {
    setSort(value);
    afterFilterChange();
  }

  function resetFilters() {
    setPlatform("all");
    setCategory("all");
    setQuery("");
    setCreatorId(null);
    setVisibleCount(PAGE_SIZE);
    writeUrl((p) => p.delete("creator"), "replace");
    revealPosts();
  }

  function closeViewer() {
    const lastId = openPostId;
    if (pushedRef.current) {
      // Pops the ?post= entry; the popstate handler closes the viewer.
      pushedRef.current = false;
      window.history.back();
    } else {
      setOpenPostId(null);
      writeUrl((p) => p.delete("post"), "replace");
    }
    // Hand focus back to the card of the post that was showing.
    window.requestAnimationFrame(() => {
      document.querySelector<HTMLElement>(`[data-post-trigger="${lastId}"]`)?.focus({ preventScroll: false });
    });
  }

  function selectCreator(id: string) {
    const next = creatorId === id ? null : id;
    if (openPostId) {
      setOpenPostId(null);
      pushedRef.current = false;
    }
    setQuery("");
    setCreatorId(next);
    setVisibleCount(PAGE_SIZE);
    writeUrl((p) => {
      p.delete("post");
      if (next) p.set("creator", next);
      else p.delete("creator");
    }, "replace");
    revealPosts(true);
  }

  function clearCreator() {
    setCreatorId(null);
    setVisibleCount(PAGE_SIZE);
    writeUrl((p) => p.delete("creator"), "replace");
  }

  function stepCreator(direction: 1 | -1) {
    if (!creatorId || visibleCreators.length === 0) return;
    const index = visibleCreators.findIndex((creator) => creator.id === creatorId);
    const next = visibleCreators[(index + direction + visibleCreators.length) % visibleCreators.length];
    if (next && next.id !== creatorId) selectCreator(next.id);
  }

  function openPost(id: string) {
    const post = postsById.get(id);
    if (post) warmEmbed(post.platform);
    setViewerList(visiblePosts.map((p) => p.id));
    setOpenPostId(id);
    pushedRef.current = true;
    writeUrl((p) => p.set("post", id), "push");
  }

  function stepPost(direction: 1 | -1) {
    if (!openPostId || viewerList.length === 0) return;
    const index = viewerList.indexOf(openPostId);
    const nextId = viewerList[(index + direction + viewerList.length) % viewerList.length];
    const post = postsById.get(nextId);
    if (post) warmEmbed(post.platform);
    // Keep the card for the post on screen behind the viewer, so focus can
    // return to a real card on close.
    const feedIndex = visiblePosts.findIndex((p) => p.id === nextId);
    if (feedIndex >= visibleCount) setVisibleCount(Math.ceil((feedIndex + 1) / PAGE_SIZE) * PAGE_SIZE);
    setOpenPostId(nextId);
    writeUrl((p) => p.set("post", nextId), "replace");
  }

  function showMore() {
    const firstNew = visiblePosts[visibleCount]?.id;
    setVisibleCount((count) => count + PAGE_SIZE);
    window.requestAnimationFrame(() => {
      if (firstNew) document.querySelector<HTMLElement>(`[data-post-trigger="${firstNew}"]`)?.focus();
    });
  }

  /** Hover (mouse only) or keyboard focus on a card preloads its embed. */
  function warmFrom(target: EventTarget | null) {
    const cell = target instanceof Element ? target.closest<HTMLElement>("[data-platform]") : null;
    const value = cell?.dataset.platform;
    if (value === "x" || value === "linkedin") warmEmbed(value);
  }

  const shownCount = Math.min(visiblePosts.length, visibleCount);
  const remaining = visiblePosts.length - shownCount;
  const openPost_ = openPostId ? postsById.get(openPostId) ?? null : null;
  const openCreator = openPost_ ? creatorsById.get(openPost_.creator) ?? null : null;
  const viewerPosition = openPostId ? viewerList.indexOf(openPostId) + 1 : 0;

  const sortPills = (
    <div role="group" aria-label="Sort" className="flex gap-2">
      <Pill active={sort === "newest"} onClick={() => changeSort("newest")}>
        Newest
      </Pill>
      <Pill active={sort === "liked"} onClick={() => changeSort("liked")} title="Likes counted when each post was picked">
        Most liked
      </Pill>
    </div>
  );

  const countLine = (() => {
    if (!filtersActive || creatorId) {
      return (
        <>
          <span className="text-white">{posts.length}</span> · <span className="text-white">{creators.length}</span> creators
        </>
      );
    }
    return (
      <>
        <span className="text-white">{visiblePosts.length}</span> of {posts.length} ·{" "}
        <span className="text-white">{matchingCreatorCount}</span> {matchingCreatorCount === 1 ? "creator" : "creators"}
        {deferredQuery && <> · &ldquo;{query.trim()}&rdquo;</>}
      </>
    );
  })();

  const creatorStat = selectedCreator ? creatorStats.get(selectedCreator.id) : undefined;
  const creatorSubline = selectedCreator
    ? [selectedCreator.role, selectedCreator.x ? `@${selectedCreator.x}` : null].filter(Boolean).join(" · ") ||
      platformLabel.linkedin
    : "";
  const stepNames = (() => {
    if (!selectedCreator || visibleCreators.length < 2) return null;
    const index = visibleCreators.findIndex((creator) => creator.id === selectedCreator.id);
    const at = (offset: number) => visibleCreators[(index + offset + visibleCreators.length) % visibleCreators.length];
    return { prev: at(-1), next: at(1) };
  })();

  return (
    <div className="relative flex flex-col desk:flex-row">
      {/* Sidebar: the intro on every width; the tool's controls from desk. */}
      <aside
        aria-labelledby="swipe-title"
        className="desk:w-[405px] desk:shrink-0 desk:border-r-[0.5px] desk:border-hairline"
      >
        <div className="desk:sticky desk:top-16 desk:flex desk:h-[calc(100vh-4rem)] desk:flex-col">
          <div className="no-scrollbar flex flex-col gap-6 px-5 py-6 desk:min-h-0 desk:flex-1 desk:overflow-y-auto">
            {intro}

            <SearchField
              id="swipe-search-desk"
              inputRef={deskSearchRef}
              value={query}
              onChange={changeQuery}
              onEscape={() => changeQuery("")}
              showShortcut
              className="hidden desk:flex"
            />

            <div className="hidden flex-col gap-4 desk:flex">
              <div role="group" aria-labelledby="swipe-platform-label" className="flex flex-col gap-2.5">
                <p id="swipe-platform-label" className={labelClass}>Platform</p>
                <div className="flex flex-wrap gap-2">
                  <Pill active={platform === "all"} onClick={() => changePlatform("all")}>All</Pill>
                  {platforms.map((value) => (
                    <Pill key={value} active={platform === value} onClick={() => changePlatform(value)}>
                      {platformLabel[value]}
                    </Pill>
                  ))}
                </div>
              </div>
              <div role="group" aria-labelledby="swipe-category-label" className="flex flex-col gap-2.5">
                <p id="swipe-category-label" className={labelClass}>Category</p>
                <div className="flex flex-wrap gap-2">
                  <Pill active={category === "all"} onClick={() => changeCategory("all")}>All</Pill>
                  {categories.map((value) => (
                    <Pill key={value} active={category === value} onClick={() => changeCategory(value)}>
                      {value}
                    </Pill>
                  ))}
                </div>
              </div>
              {selectedCreator && (
                <div role="group" aria-labelledby="swipe-creator-label" className="flex flex-col gap-2.5">
                  <p id="swipe-creator-label" className={labelClass}>Creator</p>
                  <div className="flex flex-wrap gap-2">
                    <Pill active onClick={clearCreator} aria-label={`Remove creator filter: ${selectedCreator.name}`}>
                      {selectedCreator.name} ×
                    </Pill>
                  </div>
                </div>
              )}
              {filtersActive && (
                <button type="button" onClick={resetFilters} className={`${textButton} w-fit`}>
                  Clear filters
                </button>
              )}
            </div>

            <div className="hidden flex-col gap-3 desk:flex">
              <p className={labelClass}>On this page</p>
              <div className="-mx-5">
                <SectionNav
                  variant="list"
                  items={[
                    { id: "posts", index: "01", label: "Posts", count: String(posts.length) },
                    { id: "creators", index: "02", label: "Creators", count: String(creators.length) },
                  ]}
                />
              </div>
            </div>

            <div className="hidden desk:mt-auto desk:block">
              <Link
                href="/"
                className={`${ctaButtonBase} ${ctaButtonPadding} w-full gap-8 bg-button-dark text-white hover:bg-white/[0.12]`}
              >
                <span>MADE BY PIXELUP LABS</span>
                <ArrowIcon />
              </Link>
            </div>
          </div>
        </div>
      </aside>

      <main className="min-w-0 flex-1">
        {/* Mobile filter strip, pinned under the Navbar */}
        <div className="sticky top-16 z-20 border-y-[0.5px] border-hairline bg-base desk:hidden">
          <div
            ref={stripRef}
            role="toolbar"
            aria-label="Filters"
            className="no-scrollbar flex h-12 items-center gap-2 overflow-x-auto px-5"
          >
            {filtersActive && (
              <button type="button" onClick={resetFilters} aria-label="Clear filters" className={pillClass(true)}>
                Clear ×
              </button>
            )}
            {selectedCreator && (
              <button
                type="button"
                onClick={clearCreator}
                aria-label={`Remove creator filter: ${selectedCreator.name}`}
                className={pillClass(true)}
              >
                {selectedCreator.name} ×
              </button>
            )}
            <button
              type="button"
              onClick={() => setSearchOpen((open) => !open)}
              aria-expanded={searchOpen || query !== ""}
              aria-controls="swipe-search-row"
              className={`${pillClass(searchOpen || query !== "")} flex items-center`}
            >
              <SearchIcon />
              <span className="sr-only">Search</span>
            </button>
            <a
              href="#creators"
              onClick={(event) => {
                event.preventDefault();
                document.getElementById("creators")?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
                window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}#creators`);
              }}
              className={pillClass(false)}
            >
              Creators {creators.length}
            </a>
            <span aria-hidden="true" className="h-4 shrink-0 border-l-[0.5px] border-hairline" />
            {platforms.map((value) => (
              <button
                key={value}
                type="button"
                data-strip-filter
                aria-pressed={platform === value}
                onClick={() => changePlatform(platform === value ? "all" : value)}
                className={pillClass(platform === value)}
              >
                {platformLabel[value]}
              </button>
            ))}
            <span aria-hidden="true" className="h-4 shrink-0 border-l-[0.5px] border-hairline" />
            {categories.map((value) => (
              <button
                key={value}
                type="button"
                data-strip-filter
                aria-pressed={category === value}
                onClick={() => changeCategory(category === value ? "all" : value)}
                className={pillClass(category === value)}
              >
                {value}
              </button>
            ))}
          </div>
          {(searchOpen || query !== "") && (
            <div id="swipe-search-row" className="px-5 pb-3">
              <SearchField
                id="swipe-search-mobile"
                inputRef={mobileSearchRef}
                value={query}
                onChange={changeQuery}
                onEscape={() => {
                  changeQuery("");
                  setSearchOpen(false);
                }}
                autoFocus
                className="flex h-11"
              />
            </div>
          )}
        </div>

        <section
          ref={postsRef}
          id="posts"
          aria-labelledby="posts-heading"
          className={sectionScrollMargin}
        >
          {selectedCreator ? (
            <div className="fade-up flex flex-col gap-4 border-b-[0.5px] border-hairline px-5 py-5 [animation-duration:0.25s]">
              <div className="flex items-center gap-4">
                <CreatorMonogram creator={selectedCreator} size="lg" />
                <div className="min-w-0 flex-1">
                  <h2
                    id="posts-heading"
                    className="truncate text-[24px] font-medium leading-[1.1] tracking-display text-white"
                  >
                    {selectedCreator.name}
                  </h2>
                  <p className="truncate text-[14px] text-white/60">{creatorSubline}</p>
                </div>
                <button type="button" onClick={clearCreator} className={`${textButton} shrink-0`}>
                  All creators ×
                </button>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p aria-live="polite" className={monoClass}>
                  {visiblePosts.length === creatorStat?.count ? (
                    <>
                      <span className="text-white">{creatorStat.count}</span> {creatorStat.count === 1 ? "post" : "posts"} ·{" "}
                      <span className="text-white">{compactNumber(creatorStat.likes)}</span> likes when picked · since{" "}
                      {creatorStat.since}
                    </>
                  ) : (
                    <>
                      <span className="text-white">{visiblePosts.length}</span> of {creatorStat?.count ?? 0} posts match
                      your filters
                    </>
                  )}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  {platforms.map((profile) => {
                    const href = profileUrl(selectedCreator, profile);
                    if (!href) return null;
                    return (
                      <a
                        key={profile}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${selectedCreator.name} on ${platformLabel[profile]}`}
                        title={`${selectedCreator.name} on ${platformLabel[profile]}`}
                        className={profileCircle}
                      >
                        <PlatformIcon platform={profile} size={14} />
                      </a>
                    );
                  })}
                  {stepNames && (
                    <>
                      <span aria-hidden="true" className="h-5 border-l-[0.5px] border-hairline" />
                      <button
                        type="button"
                        onClick={() => stepCreator(-1)}
                        aria-label={`Previous creator: ${stepNames.prev.name}`}
                        className={profileCircle}
                      >
                        <span className="rotate-180">
                          <ArrowIcon size={14} />
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => stepCreator(1)}
                        aria-label={`Next creator: ${stepNames.next.name}`}
                        className={profileCircle}
                      >
                        <ArrowIcon size={14} />
                      </button>
                    </>
                  )}
                  <span aria-hidden="true" className="h-5 border-l-[0.5px] border-hairline" />
                  {sortPills}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-b-[0.5px] border-hairline px-5 py-4">
              <div className="flex items-baseline gap-3">
                <h2 id="posts-heading" className="text-[24px] font-medium leading-none tracking-display text-white">
                  Posts
                </h2>
                <p aria-live="polite" className={monoClass}>
                  {countLine}
                </p>
              </div>
              {sortPills}
            </div>
          )}

          {visiblePosts.length === 0 ? (
            <div className="flex flex-col items-start gap-3 border-b-[0.5px] border-hairline p-5">
              {selectedCreator ? (
                <>
                  <p className="text-[14px] text-white/60">
                    {selectedCreator.name} has no{category !== "all" ? ` ${category}` : ""} posts
                    {platform !== "all" ? ` on ${platformLabel[platform]}` : ""}
                    {deferredQuery ? ` matching “${query.trim()}”` : ""} in the swipe file.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setPlatform("all");
                      setCategory("all");
                      setQuery("");
                    }}
                    className={textButton}
                  >
                    Show all {creatorStat?.count ?? 0} posts
                  </button>
                </>
              ) : (
                <>
                  <p className="text-[14px] text-white/60">
                    {deferredQuery ? `No posts match “${query.trim()}”.` : "No posts match these filters."}
                  </p>
                  <button type="button" onClick={resetFilters} className={textButton}>
                    Clear filters
                  </button>
                  <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-[12px] text-label-grey">
                    Try a creator:
                    {creators.slice(0, 3).map((creator) => (
                      <button
                        key={creator.id}
                        type="button"
                        onClick={() => {
                          setPlatform("all");
                          setCategory("all");
                          selectCreator(creator.id);
                        }}
                        className="cursor-pointer text-[12px] text-white hover:underline"
                      >
                        {creator.name}
                      </button>
                    ))}
                  </p>
                </>
              )}
            </div>
          ) : (
            <HairlineGrid
              className="grid-cols-1 min-[700px]:grid-cols-2 desk:grid-cols-3"
              onPointerOver={(event) => {
                if (event.pointerType === "mouse") warmFrom(event.target);
              }}
              onFocus={(event) => warmFrom(event.target)}
            >
              {/* Only the shown page renders, not all 189 with `hidden`: each card
                  is ~3 KB of HTML, and some directory badge checkers refuse
                  pages over ~500 KB. */}
              {visiblePosts.slice(0, visibleCount).map((post, index) => {
                const creator = creatorsById.get(post.creator);
                if (!creator) return null;
                return (
                  <li key={post.id} data-post-id={post.id} data-platform={post.platform}>
                    <div
                      className="fade-up h-full"
                      style={index < 12 ? { animationDelay: `${Math.min(150 + index * 30, 400)}ms` } : undefined}
                    >
                      <SwipePostCard
                        post={post}
                        creator={creator}
                        isNew={isNew.has(post.id)}
                        currentYear={currentYear}
                        onOpen={openPost}
                        onSelectCreator={selectCreator}
                      />
                    </div>
                  </li>
                );
              })}
              {postFillers(shownCount)}
            </HairlineGrid>
          )}

          {remaining > 0 && (
            <div className="flex flex-col items-center gap-3 border-b-[0.5px] border-hairline px-5 py-8">
              <p className={monoClass}>
                Showing <span className="text-white">{shownCount}</span> of {visiblePosts.length}
              </p>
              <button
                type="button"
                onClick={showMore}
                className={`${ctaButtonBase} ${ctaButtonPadding} w-full max-w-80 cursor-pointer gap-8 bg-button-dark text-white hover:bg-white/[0.12]`}
              >
                <span>{remaining <= PAGE_SIZE ? `SHOW THE LAST ${remaining}` : `SHOW ${PAGE_SIZE} MORE`}</span>
                <span className="rotate-90">
                  <ArrowIcon />
                </span>
              </button>
            </div>
          )}
        </section>

        <section id="creators" aria-labelledby="creators-heading" className={sectionScrollMargin}>
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b-[0.5px] border-hairline px-5 py-4">
            <div className="flex items-baseline gap-3">
              <h2 id="creators-heading" className="text-[24px] font-medium leading-none tracking-display text-white">
                Creators
              </h2>
              <p aria-live="polite" className={monoClass}>
                {creatorsNarrowed ? (
                  <>
                    <span className="text-white">{visibleCreators.length}</span> of {creators.length}
                  </>
                ) : (
                  <span className="text-white">{creators.length}</span>
                )}
              </p>
            </div>
            <p className="text-[14px] text-white/60">Most featured first. Pick one to see their posts.</p>
          </div>
          {visibleCreators.length === 0 ? (
            <div className="flex flex-col items-start gap-3 border-b-[0.5px] border-hairline p-5">
              <p className="text-[14px] text-white/60">
                {deferredQuery ? `No creators match “${query.trim()}”.` : "No creators match these filters."}
              </p>
              <button type="button" onClick={resetFilters} className={textButton}>
                {deferredQuery ? "Clear search" : "Clear filters"}
              </button>
            </div>
          ) : (
            <HairlineGrid className="grid-cols-2 desk:grid-cols-3">
              {visibleCreators.map((creator) => (
                <li key={creator.id}>
                  <SwipeCreatorCard
                    creator={creator}
                    postCount={creatorStats.get(creator.id)?.count ?? 0}
                    selected={creator.id === creatorId}
                    onSelect={selectCreator}
                  />
                </li>
              ))}
              {creatorFillers(visibleCreators.length)}
            </HairlineGrid>
          )}
        </section>

        {children}
      </main>

      <SwipePostViewer
        post={openPost_}
        creator={openCreator}
        position={viewerPosition}
        total={viewerList.length}
        onPrev={() => stepPost(-1)}
        onNext={() => stepPost(1)}
        onClose={closeViewer}
        onSelectCreator={selectCreator}
      />
    </div>
  );
}
