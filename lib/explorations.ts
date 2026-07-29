// Ordered top-to-bottom exactly as they should render — "full" is one
// full-width image, "pair" is two images side by side (50/50 on desktop).
export type ExplorationBlock =
  | { kind: "full"; src: string }
  | { kind: "pair"; srcs: [string, string] };

export const explorationBlocks: ExplorationBlock[] = [
  { kind: "full", src: "/media/explorations/img-37.webp" },
  { kind: "full", src: "/media/explorations/img-32.webp" },
  { kind: "pair", srcs: ["/media/explorations/img-33.webp", "/media/explorations/img-34.webp"] },
  { kind: "full", src: "/media/explorations/img-31.webp" },
  { kind: "full", src: "/media/explorations/img-6.webp" },
  { kind: "pair", srcs: ["/media/explorations/img-35.webp", "/media/explorations/img-7.webp"] },
  { kind: "full", src: "/media/explorations/img-36.webp" },
  { kind: "full", src: "/media/explorations/img-8.webp" },
  { kind: "pair", srcs: ["/media/explorations/img-12.webp", "/media/explorations/img-13.webp"] },
  { kind: "full", src: "/media/explorations/img-10.webp" },
  { kind: "full", src: "/media/explorations/img-11.webp" },
  { kind: "pair", srcs: ["/media/explorations/img-16.webp", "/media/explorations/img-17.webp"] },
  { kind: "full", src: "/media/explorations/img-18.webp" },
  { kind: "full", src: "/media/explorations/img-19.webp" },
  { kind: "pair", srcs: ["/media/explorations/img-20.webp", "/media/explorations/img-21.webp"] },
  { kind: "full", src: "/media/explorations/img-22.webp" },
  { kind: "full", src: "/media/explorations/img-23.webp" },
  { kind: "pair", srcs: ["/media/explorations/img-24.webp", "/media/explorations/img-25.webp"] },
  { kind: "full", src: "/media/explorations/img-26.webp" },
  { kind: "full", src: "/media/explorations/img-29.webp" },
  { kind: "pair", srcs: ["/media/explorations/img-28.webp", "/media/explorations/img-27.webp"] },
];
