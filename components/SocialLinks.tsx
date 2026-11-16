// The company's social profiles as a row of circular icon buttons. Lives in
// the Footer's brand column today; kept in its own module so the nav or a
// contact page can reuse the same row later.
//
// Marks are inlined with fill="currentColor" (the same reason ArrowIcon is)
// so they inherit the muted-to-white hover treatment instead of hardcoding a
// fill. Circles are the one place the design system allows full rounding
// outside pills, per DESIGN.md ("fully-circular elements (social icons...)").

const SOCIALS = [
  {
    name: "X",
    label: "PIXELUP LABS on X",
    href: "https://x.com/pixeluplabs",
    path: "M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z",
  },
  {
    name: "LinkedIn",
    label: "PIXELUP LABS on LinkedIn",
    href: "https://www.linkedin.com/company/pixeluplabs",
    path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  },
  {
    name: "Contra",
    label: "PIXELUP LABS on Contra",
    href: "https://contra.com/daksh_aswal_dt5tfn27",
    path: "M8.53257 4.1249C7.3761 5.8885 5.86224 7.39707 4.09025 8.54825C2.83892 9.4038 1.46713 10.0996 0.00488281 10.6031V11.0068H11.0004V0.0055542H10.6134C10.1069 1.47971 9.40224 2.86386 8.53213 4.1249H8.53257ZM12.9974 0.0055542V11.054H23.9942V10.6503C22.5324 10.1468 21.1615 9.45101 19.9089 8.59546C18.1386 7.44428 16.6234 5.93571 15.467 4.17211C14.5876 2.89783 13.8772 1.4978 13.3694 0.0055542H12.9974ZM23.9942 12.946H12.9974V23.9945H13.3694C13.8772 22.5027 14.5872 21.1022 15.467 19.8279C16.6234 18.0643 18.1391 16.5557 19.9089 15.4046C21.1615 14.5486 22.5324 13.8532 23.9942 13.3497V12.946ZM11.0008 23.9945V12.9932H0.00532404V13.3969C1.46713 13.9004 2.83936 14.5962 4.09069 15.4518C5.86224 16.6029 7.3761 18.112 8.53301 19.8751C9.40312 21.1362 10.1073 22.5199 10.6143 23.994H11.0013L11.0008 23.9945Z",
  },
] as const;

export function SocialLinks() {
  return (
    <ul className="flex items-center gap-2" aria-label="Social profiles">
      {SOCIALS.map((social) => (
        <li key={social.name}>
          <a
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.label}
            title={social.name}
            className="flex h-8 w-8 items-center justify-center rounded-full border-[0.5px] border-hairline text-white/60 transition-colors hover:bg-button-dark hover:text-white"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d={social.path} fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
}
