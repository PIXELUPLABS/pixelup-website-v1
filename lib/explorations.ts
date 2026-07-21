// Ordered top-to-bottom exactly as they should render — "full" is one
// full-width image, "pair" is two images side by side (50/50 on desktop).
export type ExplorationBlock =
  | { kind: "full"; src: string }
  | { kind: "pair"; srcs: [string, string] };

export const explorationBlocks: ExplorationBlock[] = [
  { kind: "full", src: "/media/explorations/img-1.png" },
  { kind: "full", src: "/media/explorations/img-2.png" },
  { kind: "pair", srcs: ["/media/explorations/img-3.png", "/media/explorations/img-4.png"] },
  { kind: "full", src: "/media/explorations/img-5.png" },
  { kind: "pair", srcs: ["/media/explorations/img-6.png", "/media/explorations/img-7.png"] },
  { kind: "full", src: "/media/explorations/img-8.png" },
];
