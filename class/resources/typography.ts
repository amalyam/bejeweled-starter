export const ideographicSpace = "\u3000";
export type IdeographicSpace = typeof ideographicSpace;

export const graphemeSegmenter = new Intl.Segmenter(undefined, {
  granularity: "grapheme",
});

interface Box {
  corners: {
    topLeft: string;
    topRight: string;
    bottomLeft: string;
    bottomRight: string;
  };
  vertical: string;
  horizontal: string;

  beginText: string;
  endText: string;
}

export const doubleLineBox: Box = {
  corners: {
    topLeft: "\u2554",
    topRight: "\u2557",
    bottomLeft: "\u255A",
    bottomRight: "\u255D",
  },
  vertical: "\u2551",
  horizontal: "\u2550",
  beginText: "\u2561",
  endText: "\u255E",
};
