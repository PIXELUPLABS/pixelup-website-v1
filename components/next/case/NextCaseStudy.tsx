import Image from 'next/image';
import { Emphasis } from '@/components/case-study/Emphasis';
import { ScrollVideo } from '@/components/case-study/ScrollVideo';
import { Roll } from '@/components/2027/ui';
import type { CaseStoryBlock as StoryBlock, CaseStudy, MediaBlock, MediaSlot } from '@/lib/case-studies';
import type { Project } from '@/lib/projects';
import CaseBar from './CaseBar';
import CrossfadeFrame from './CrossfadeFrame';

/*
 * The 2026 site's case study layout (/next/case-studies/replay) for a story-format case study. The story's
 * blocks become its chapters: the context block is 00 Overview, each writeup starts a chapter and the
 * galleries after it fill that chapter's media column, and the closing writeup is the outcome.
 */

type Gallery = Extract<StoryBlock, { kind: 'gallery' }>;
type Writeup = Extract<StoryBlock, { kind: 'afterLaunch' }>;
type Context = Extract<StoryBlock, { kind: 'context' }>;
type Chapter = { label: string; statement?: string; paragraphs: string[]; galleries: Gallery[] };

const ratio = (slot: MediaSlot) => (slot.intrinsicSize ? slot.intrinsicSize.width / slot.intrinsicSize.height : 16 / 9);

/** "Iteration 2: Direction 1, pushed further." → label "Iteration 2", statement "Direction 1, pushed further." */
function split(heading: string, fallback: string) {
  const i = heading.indexOf(': ');
  if (i < 0) return { label: fallback, statement: heading };
  const rest = heading.slice(i + 2);
  return { label: heading.slice(0, i), statement: rest.charAt(0).toUpperCase() + rest.slice(1) };
}

function chaptersOf(blocks: StoryBlock[]) {
  const context = blocks.find((b): b is Context => b.kind === 'context');
  const overview: Gallery[] = [];
  const chapters: Chapter[] = [];
  let outcome: Writeup | undefined;
  // Standalone media after the outcome closes the page full bleed.
  const closing: MediaBlock[] = [];
  for (const b of blocks) {
    if (b.kind === 'media' && outcome) closing.push(b.media);
    else if (b.kind === 'afterLaunch') {
      if (b.id === 'after-launch') outcome = b;
      else {
        const fallback = b.id === 'writeup-moodboards' ? 'Moodboards' : 'Chapter';
        chapters.push({ ...split(b.heading, fallback), paragraphs: b.paragraphs, galleries: [] });
      }
    } else if (b.kind === 'gallery') {
      (chapters.at(-1)?.galleries ?? overview).push(b);
    }
  }
  return { context, overview, chapters, outcome, closing };
}

function Media({ slot, sizes, priority }: { slot: MediaSlot; sizes: string; priority?: boolean }) {
  const m = slot.media;
  if (!m) return null;
  if (m.type === 'video') {
    return slot.playOnView ? (
      <ScrollVideo media={m} label={slot.alt} className="ncs-frame__img" />
    ) : (
      <video className="ncs-frame__img" src={m.src} poster={m.poster} aria-label={slot.alt} autoPlay loop muted playsInline />
    );
  }
  if (slot.crossfade) {
    return <CrossfadeFrame srcs={[m.src, ...slot.crossfade.srcs]} alt={slot.alt ?? ''} sizes={sizes} interval={slot.crossfade.interval} />;
  }
  return (
    <Image src={m.src} alt={slot.alt ?? ''} fill sizes={sizes} priority={priority} className="ncs-frame__img" />
  );
}

/** A fixed-aspect frame. Side-by-side frames share one aspect so they line up; each is cropped by at most a sliver. */
function Frame({ slot, aspect, sizes, priority }: { slot: MediaSlot; aspect: number; sizes: string; priority?: boolean }) {
  return (
    <figure className="ncs-frame" style={{ aspectRatio: aspect.toFixed(4) }}>
      <span className="ncs-frame__zoom">
        <Media slot={slot} sizes={sizes} priority={priority} />
      </span>
    </figure>
  );
}

function Block({ block }: { block: MediaBlock }) {
  if (block.kind === 'full') {
    return <Frame slot={block.slot} aspect={ratio(block.slot)} sizes="(min-width: 1024px) 50vw, 100vw" />;
  }
  if (block.kind === 'strip') {
    const { slot } = block;
    if (slot.media?.type !== 'image' || !slot.intrinsicSize) return null;
    const { width, height } = slot.intrinsicSize;
    return (
      <div className="ncs-marq" role="img" aria-label={slot.alt}>
        <div className="ncs-marq__track" style={{ ['--dur' as string]: `${block.duration ?? 40}s` }}>
          {[0, 1].map((copy) => (
            <Image key={copy} src={slot.media!.src} alt="" aria-hidden="true" width={width} height={height} sizes="200vw" />
          ))}
        </div>
      </div>
    );
  }
  const aspect = block.slots.reduce((sum, s) => sum + ratio(s), 0) / block.slots.length;
  const sizes = block.slots.length === 3 ? '(min-width: 1024px) 17vw, 100vw' : '(min-width: 1024px) 25vw, 100vw';
  return (
    <div className="ncs-pair">
      {block.slots.map((slot, i) => (
        <Frame key={i} slot={slot} aspect={aspect} sizes={sizes} />
      ))}
    </div>
  );
}

function MediaColumn({ galleries }: { galleries: Gallery[] }) {
  return (
    <div className="ncs-mc">
      {galleries.map((g) => (
        <div key={g.id} className="ncs-mc">
          <p className="ncs-cap">
            <span className="ncs-cap__t">{g.heading}</span>
            {g.intro && (
              <span className="ncs-cap__d">
                <Emphasis text={g.intro} />
              </span>
            )}
          </p>
          {g.media.map((block, i) => (
            <Block key={i} block={block} />
          ))}
        </div>
      ))}
    </div>
  );
}

function Label({ n, title }: { n: string; title: string }) {
  return (
    <p className="ncs-lab">
      <span className="ncs-lab__n">
        <span>{n}</span>
      </span>
      <span className="ncs-lab__t">{title}</span>
    </p>
  );
}

export default function NextCaseStudy({
  study,
  next,
  nextIndex,
  total,
}: {
  study: CaseStudy;
  next?: Project;
  nextIndex?: number;
  total?: number;
}) {
  const story = study.story;
  if (!story) return null;
  const { context, overview, chapters, outcome, closing } = chaptersOf(story.blocks);
  const pad = (n: number) => String(n).padStart(2, '0');
  const site = study.info.links?.[0];
  const outcomeN = pad(chapters.length + 1);

  return (
    <article className="ncs">
      <CaseBar client={story.company} closeHref="/" site={site && { href: site.href, label: 'Open website' }} />

      <header className="ncs-top">
        <h1 className="ncs-title">{story.headline}</h1>
        <dl className="ncs-meta">
          {story.statusBadge && (
            <div>
              <dt>Focus</dt>
              <dd>{story.statusBadge}</dd>
            </div>
          )}
          <div>
            <dt>Year</dt>
            <dd>{study.info.year}</dd>
          </div>
          <div>
            <dt>Deliverables</dt>
            <dd>
              {study.info.involvement.map((d) => (
                <span key={d}>{d}</span>
              ))}
            </dd>
          </div>
        </dl>
      </header>

      <div className="ncs-hero">
        <Frame slot={study.hero} aspect={ratio(study.hero) || 16 / 9} sizes="100vw" priority />
      </div>

      {story.summary && (
        <p className="ncs-lede">
          <Emphasis text={story.summary} />
        </p>
      )}

      {context && (
        <section className="ncs-ch ncs-ch--ov" data-chapter="Overview" data-n="00">
          <div className="ncs-row ncs-row--l">
            <div className="ncs-tb">
              <Label n="00" title="Overview" />
              <p className="ncs-sub">{context.heading}</p>
              <div className="ncs-cols">
                <dl>
                  {context.items.map((it) => (
                    <div key={it.label} className="ncs-it">
                      <dt>{it.label}</dt>
                      <dd>
                        <Emphasis text={it.text} />
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
            <MediaColumn galleries={overview} />
          </div>
        </section>
      )}

      {chapters.map((ch, i) => {
        const n = pad(i + 1);
        return (
          <section key={n} className="ncs-ch" data-chapter={ch.label} data-n={n}>
            {ch.statement && <h2 className="ncs-st">{ch.statement}</h2>}
            <div className={`ncs-row ${i % 2 ? 'ncs-row--l' : 'ncs-row--r'}`}>
              <div className="ncs-tb">
                <Label n={n} title={ch.label} />
                <div className="ncs-cols">
                  {ch.paragraphs.map((p) => (
                    <p key={p}>
                      <Emphasis text={p} />
                    </p>
                  ))}
                </div>
              </div>
              <MediaColumn galleries={ch.galleries} />
            </div>
          </section>
        );
      })}

      {outcome && (
        <section className="ncs-ch" data-chapter="Outcome" data-n={outcomeN}>
          <h2 className="ncs-st">{outcome.heading}</h2>
          <div className="ncs-row ncs-row--t">
            <div className="ncs-tb">
              <Label n={outcomeN} title="Outcome" />
              <div className="ncs-cols">
                {outcome.paragraphs.map((p) => (
                  <p key={p}>
                    <Emphasis text={p} />
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {closing.map(
        (block, i) =>
          block.kind === 'full' && (
            <div key={i} className="ncs-hero">
              <Frame slot={block.slot} aspect={ratio(block.slot)} sizes="100vw" />
            </div>
          ),
      )}

      {next && (
        <a href={next.href} className="ncs-next" aria-label={`Next project: ${next.label}`}>
          <i className="ncs-hr" aria-hidden="true" />
          <span className="ncs-next__lab">Next project</span>
          {nextIndex !== undefined && total !== undefined && (
            <span className="ncs-next__count">
              {pad(nextIndex)}/{pad(total)}
            </span>
          )}
          <div className="ncs-next__thumb">
            <figure className="ncs-frame" style={{ aspectRatio: '1' }}>
              <span className="ncs-frame__zoom">
                {next.media.type === 'image' ? (
                  <Image src={next.cardImage ?? next.media.src} alt={next.alt} fill sizes="50vw" className="ncs-frame__img" />
                ) : (
                  <video className="ncs-frame__img" src={next.media.src} poster={next.media.poster} aria-label={next.alt} autoPlay loop muted playsInline />
                )}
              </span>
            </figure>
          </div>
          {next.tagline && <span className="ncs-next__line">{next.tagline}</span>}
          <span className="ncs-next__name">
            <Roll>{next.label}</Roll>
          </span>
        </a>
      )}
    </article>
  );
}
