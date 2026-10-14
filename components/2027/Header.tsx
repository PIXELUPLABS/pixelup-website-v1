import { site, work } from '@/lib/2027/site';
import MenuToggle from './MenuToggle';
import { ArrowSwap, Roll, StatusDots } from './ui';

export default function Header() {
  // Every link scrolls this page: the 2026 header's /work, /explorations and /blog are still the old design here.
  const links = [
    { label: 'Work', href: '#work', count: work.length },
    { label: 'About', href: '#about' },
    { label: 'Services', href: '#services' },
  ];

  return (
    <header className="hdr">
      <a href="#top" className="hdr__brand" aria-label={`${site.legalName}, back to top`}>
        <span className="mask" data-intro="rise">
          <span className="hdr__logo">
            <Roll>{site.name}</Roll>
            <sup className="hdr__reg">®</sup>
          </span>
        </span>
        <span className="mask hdr__tag-mask" data-intro="rise">
          <span className="hdr__tag">{site.tagline}</span>
        </span>
      </a>

      <nav className="hdr__nav" aria-label="Primary">
        {links.map((l) => (
          <a key={l.href} href={l.href} className="hdr__link">
            <span className="mask" data-intro="rise">
              <span>
                <Roll>{l.label}</Roll>
                {l.count !== undefined && <sup data-count={l.count}>{l.count}</sup>}
              </span>
            </span>
          </a>
        ))}
      </nav>

      <div className="hdr__meta">
        <span className="mask" data-intro="rise">
          <span className="status">
            <StatusDots />
            <i className="status__line" aria-hidden="true" />
            <span>{site.status}</span>
          </span>
        </span>
        <a href="#contact" className="hdr__contact">
          <span className="mask" data-intro="rise">
            <span className="hdr__contact-inner">
              <Roll>Contact</Roll>
              <ArrowSwap />
            </span>
          </span>
          <i className="hdr__line" aria-hidden="true" />
        </a>
      </div>

      <MenuToggle />
    </header>
  );
}
