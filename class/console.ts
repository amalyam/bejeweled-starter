type Verbosity = "debug" | "info";

interface LogLine {
  time: Date;
  message: string;
  verbosity: Verbosity;
}

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

const combiningOverline = "\u0305";
const combiningUnderline = "\u0332";

const doubleLineBox: Box = {
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

const boxed = (str: string): string =>
  [...str]
    .map((char) => `${char}${combiningOverline}${combiningUnderline}`)
    .join("");

class ConsoleViewport {
  #box = doubleLineBox;
  #text: LogLine[] = [];
  #maxChars: number;
  #horizontalBorder: string;
  #enabled: boolean;

  constructor(text: LogLine[], enabled: boolean) {
    this.#text = text;

    // TODO: Use segmenter for better visual spacing
    this.#maxChars = Math.max(0, ...text.map((line) => line.message.length));
    this.#enabled = enabled && this.#maxChars > 0;
    this.#horizontalBorder = this.#box.horizontal.repeat(this.#maxChars + 2);
  }

  getLine(row: number): string {
    if (!this.#enabled) return "";
    return `${this.#box.vertical} ${(
      this.#text[this.#text.length - row - 1]?.message ?? ""
    ).padEnd(this.#maxChars)} ${this.#box.vertical}`;
  }

  getTopBorder(): string {
    if (!this.#enabled) return "";
    return `${this.#box.corners.topLeft}${this.#getTopBorderLine()}${
      this.#box.corners.topRight
    }`;
  }

  #getTopBorderLine() {
    let title = "console";
    if (this.#maxChars < title.length + 2) return this.#horizontalBorder;
    let padChars = (this.#maxChars - title.length) / 2;
    return `${this.#box.horizontal.repeat(Math.floor(padChars))}${
      this.#box.beginText
    }${boxed(title)}${this.#box.endText}${this.#box.horizontal.repeat(
      Math.ceil(padChars)
    )}`;
  }

  getBottomBorder(): string {
    if (!this.#enabled) return "";
    return `${this.#box.corners.bottomLeft}${this.#horizontalBorder}${
      this.#box.corners.bottomRight
    }`;
  }
}

export default class Console {
  #text: LogLine[] = [];

  constructor(private enabled: boolean) {}

  #makeLogger =
    (verbosity: Verbosity) =>
    (...args: any[]) => {
      this.#text.push({
        time: new Date(),
        message: args.map((arg) => String(arg)).join(" "),
        verbosity,
      });
    };

  info = this.#makeLogger("info");
  debug = this.#makeLogger("debug");

  getViewport(numberOfLines: number) {
    return new ConsoleViewport(this.#text.slice(-numberOfLines), this.enabled);
  }
}
