import { site } from '@/lib/2027/site';
import CopyEmail from './CopyEmail';
import FooterGradient from './FooterGradient';
import { ArrowSwap, StatusDots } from './ui';

type Props = {
  /** `null` drops the eyebrow. */
  eyebrow?: string | null;
  email?: string;
  note?: string;
  /** Links in the footer bar's corner; defaults to the 2026 site's placeholders. */
  legal?: { label: string; href: string }[];
};

export default function Footer({ eyebrow = 'New business', email = site.email, note = `${site.status} right now. Say hello.`, legal = site.legal }: Props = {}) {
  // The echo repeats the address shown above it, so a page with its own address doesn't print two.
  const echo = [
    'Brand, websites and motion for AI companies',
    `${email}, @dakshpixelup, pixeluplabs.com`,
    `PIXELUP LABS © ${new Date().getFullYear()}, all rights reserved`,
  ];

  return (
    <footer className="foot" id="contact">
      <FooterGradient />
      <div className="foot__cta">
        {eyebrow && (
          <p className="foot__eyebrow" data-reveal="fade">
            {eyebrow}
          </p>
        )}
        <CopyEmail email={email} />
        <p className="foot__note" data-reveal="fade">
          <StatusDots />
          <span>{note}</span>
        </p>
      </div>

      <div className="foot__bar">
        <div className="foot__links">
          <a href={`mailto:${email}`} className="u-link">
            {email}
          </a>
          {site.socials.map((s) => (
            <a key={s.label} href={s.href} className="foot__social" target="_blank" rel="noreferrer">
              <span className="u-link">{s.label}</span>
              <ArrowSwap rotate={-45} />
            </a>
          ))}
        </div>

        <div className="foot__echo" aria-hidden="true">
          {[0, 1, 2].map((b) => (
            <span className="echo__block" key={b}>
              {echo.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </span>
          ))}
        </div>

        <div className="foot__legal">
          {legal.map((l) => (
            <a key={l.label} href={l.href} className="u-link">
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
