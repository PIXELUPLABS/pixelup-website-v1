'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

/** Images stacked in one frame, fading from one to the next every `interval` ms. Reduced motion rests on the first. */
export default function CrossfadeFrame({
  srcs,
  alt,
  sizes,
  interval = 1500,
}: {
  srcs: string[];
  alt: string;
  sizes: string;
  interval?: number;
}) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => setActive((i) => (i + 1) % srcs.length), interval);
    return () => clearInterval(id);
  }, [srcs.length, interval]);

  return srcs.map((src, i) => (
    <Image
      key={src}
      src={src}
      alt={i === 0 ? alt : ''}
      aria-hidden={i === 0 ? undefined : true}
      fill
      sizes={sizes}
      className="ncs-frame__img ncs-xf"
      style={{ opacity: i === active ? 1 : 0 }}
    />
  ));
}
