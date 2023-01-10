import { colorCodes, resetColor } from "./resources/colors";
import { doubleLineBox } from "./resources/typography";

enum Verbosity {
  debug,
  info,
}

class LogLine {
  public time = new Date();

  constructor(public message: string, public verbosity: Verbosity) {}

  toString({
    colored = true,
    padded,
  }: { colored?: boolean; padded?: number } = {}) {
    let str = `${colored ? colorCodes.black : ""}[${
      Verbosity[this.verbosity]
    }] ${this.timeString}${colored ? resetColor : ""} | ${this.message}`;
    if (padded) {
      return str.padEnd(padded + colorCodes.black.length + resetColor.length);
    }
    return str;
  }

  get length(): number {
    return this.toString({ colored: false }).length;
  }

  get timeString() {
    return this.time.toLocaleString().padEnd(20);
  }
}

class ConsoleViewport {
  #box = doubleLineBox;
  #text: LogLine[] = [];
  #maxChars: number;
  #horizontalBorder: string;
  #enabled: boolean;

  constructor(text: LogLine[]) {
    this.#text = text;

    // TODO: Use segmenter for better visual spacing
    this.#maxChars = Math.max(0, ...text.map((line) => line.length));
    this.#enabled = this.#maxChars > 0;
    this.#horizontalBorder = this.#box.horizontal.repeat(this.#maxChars + 2);
  }

  getLine(row: number): string {
    if (!this.#enabled) return "";
    return `${this.#box.vertical} ${
      this.#text[this.#text.length - row - 1]?.toString({
        padded: this.#maxChars,
      }) ?? " ".repeat(this.#maxChars)
    } ${this.#box.vertical}`;
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
    }${title}${this.#box.endText}${this.#box.horizontal.repeat(
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
  static getVerbosity(levelString: string | undefined): Verbosity {
    return (
      {
        debug: Verbosity.debug,
        info: Verbosity.info,
      }[levelString ?? ""] ?? Verbosity.info
    );
  }

  #text: LogLine[] = [];

  constructor(private verbosity: Verbosity) {}

  #makeLogger =
    (verbosity: Verbosity) =>
    (...args: any[]) => {
      if (verbosity < this.verbosity) return;
      this.#text.push(
        new LogLine(args.map((arg) => String(arg)).join(" "), verbosity)
      );
    };

  logInfo = this.#makeLogger(Verbosity.info);
  logDebug = this.#makeLogger(Verbosity.debug);

  getViewport(numberOfLines: number) {
    return new ConsoleViewport(this.#text.slice(-numberOfLines));
  }
}
