export const ideographicSpace = "\u3000";
export type IdeographicSpace = typeof ideographicSpace;

export const graphemeSegmenter = new Intl.Segmenter(undefined, {
  granularity: "grapheme",
});
