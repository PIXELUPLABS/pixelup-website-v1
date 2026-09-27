// Ordered top-to-bottom exactly as they should render — "full" is one
// full-width image, "pair" is two images side by side (50/50 on desktop),
// "triple" is three images side by side (thirds on desktop).
export type ExplorationBlock =
  | { kind: "full"; src: string }
  | { kind: "pair"; srcs: [string, string] }
  | { kind: "triple"; srcs: [string, string, string] };

// Images whose aspect ratio is far from the 1008/584 card frame (e.g. square
// artwork). These render letterboxed with object-contain instead of being
// cropped by object-cover.
export const containedExplorationSrcs = new Set<string>(["/media/explorations/img-78.webp"]);

export const explorationBlocks: ExplorationBlock[] = [
  // { kind: "full", src: "/media/explorations/img-82.webp" },
  // {
  //   kind: "triple",
  //   srcs: [
  //     "/media/explorations/img-89.webp",
  //     "/media/explorations/img-90.webp",
  //     "/media/explorations/img-91.webp",
  //   ],
  // },
  // {
  //   kind: "triple",
  //   srcs: [
  //     "/media/explorations/img-77.webp",
  //     "/media/explorations/img-78.webp",
  //     "/media/explorations/img-79.webp",
  //   ],
  // },
  { kind: "full", src: "/media/explorations/img-84.webp" },
  { kind: "full", src: "/media/explorations/img-80.webp" },
  { kind: "pair", srcs: ["/media/explorations/img-83.webp", "/media/explorations/img-85.webp"] },
  // { kind: "pair", srcs: ["/media/explorations/img-78.webp", "/media/explorations/img-77.webp"] },
  // {
  //   kind: "triple",
  //   srcs: [
  //     "/media/explorations/img-74.webp",
  //     "/media/explorations/img-75.webp",
  //     "/media/explorations/img-76.webp",
  //   ],
  // },
  { kind: "full", src: "/media/explorations/img-81.webp" },
  { kind: "full", src: "/media/explorations/img-82.webp" },
  { kind: "pair", srcs: ["/media/explorations/img-64.webp", "/media/explorations/img-65.webp"] },
  { kind: "full", src: "/media/explorations/img-63.webp" },
  { kind: "full", src: "/media/explorations/img-69.webp" },
  { kind: "pair", srcs: ["/media/explorations/img-66.webp", "/media/explorations/img-67.webp"] },
  { kind: "full", src: "/media/explorations/img-71.webp" },
  { kind: "full", src: "/media/explorations/img-72.webp" },
  { kind: "pair", srcs: ["/media/explorations/img-68.webp", "/media/explorations/img-70.webp"] },
  { kind: "full", src: "/media/explorations/img-73.webp" },
  { kind: "pair", srcs: ["/media/explorations/img-48.webp", "/media/explorations/img-49.webp"] },
  { kind: "full", src: "/media/explorations/img-37.webp" },
  { kind: "full", src: "/media/explorations/img-38.webp" },
  { kind: "pair", srcs: ["/media/explorations/img-3.webp", "/media/explorations/img-5.webp"] },
  { kind: "full", src: "/media/explorations/img-4.webp" },
  { kind: "full", src: "/media/explorations/img-32.webp" },
  { kind: "pair", srcs: ["/media/explorations/img-41.webp", "/media/explorations/img-42.webp"] },
  { kind: "full", src: "/media/explorations/img-31.webp" },
  { kind: "full", src: "/media/explorations/img-6.webp" },
  { kind: "pair", srcs: ["/media/explorations/img-35.webp", "/media/explorations/img-7.webp"] },
  { kind: "full", src: "/media/explorations/img-43.webp" },
  { kind: "full", src: "/media/explorations/img-8.webp" },
  { kind: "pair", srcs: ["/media/explorations/img-12.webp", "/media/explorations/img-13.webp"] },
  { kind: "full", src: "/media/explorations/img-10.webp" },
  { kind: "full", src: "/media/explorations/img-11.webp" },
  { kind: "pair", srcs: ["/media/explorations/img-16.webp", "/media/explorations/img-17.webp"] },
  { kind: "full", src: "/media/explorations/img-56.webp" },
  { kind: "full", src: "/media/explorations/img-55.webp" },
  { kind: "pair", srcs: ["/media/explorations/img-20.webp", "/media/explorations/img-21.webp"] },
  { kind: "full", src: "/media/explorations/img-22.webp" },
  { kind: "full", src: "/media/explorations/img-57.webp" },
  { kind: "pair", srcs: ["/media/explorations/img-24.webp", "/media/explorations/img-25.webp"] },
  { kind: "full", src: "/media/explorations/img-26.webp" },
  { kind: "full", src: "/media/explorations/img-29.webp" },
  { kind: "pair", srcs: ["/media/explorations/img-28.webp", "/media/explorations/img-27.webp"] },
  { kind: "full", src: "/media/explorations/img-39.png" },
  { kind: "full", src: "/media/explorations/img-44.webp" },
  { kind: "pair", srcs: ["/media/explorations/img-33.webp", "/media/explorations/img-34.webp"] },
  { kind: "full", src: "/media/explorations/img-36.webp" },
  { kind: "full", src: "/media/explorations/img-45.webp" },
  { kind: "pair", srcs: ["/media/explorations/img-46.webp", "/media/explorations/img-47.webp"] },
  { kind: "full", src: "/media/explorations/img-50.webp" },
  { kind: "full", src: "/media/explorations/img-52.webp" },
  { kind: "pair", srcs: ["/media/explorations/img-51.webp", "/media/explorations/img-53.webp"] },
  { kind: "full", src: "/media/explorations/img-58.webp" },
  { kind: "full", src: "/media/explorations/img-61.webp" },
  { kind: "pair", srcs: ["/media/explorations/img-60.webp", "/media/explorations/img-59.webp"] },
];
