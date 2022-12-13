import Command from "./command";

const keypress = require("keypress");

type ColorCode = `\x1b[${string}m`;
export type GridSpace<Piece extends string> = Piece | " ";

const colorCodes = {
  black: "\x1b[30m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
} satisfies Record<string, ColorCode>;

export type Color = keyof typeof colorCodes;

const bgColorCodes = {
  //background color
  black: "\x1b[40m",
  red: "\x1b[41m",
  green: "\x1b[42m",
  yellow: "\x1b[43m",
  blue: "\x1b[44m",
  cyan: "\x1b[46m",
  white: "\x1b[47m",
  magenta: "\x1b[45m",
} satisfies Record<Color, ColorCode>;

export default class Screen<Piece extends string> {
  static defaultTextColor = colorCodes.white;
  static defaultBackgroundColor = bgColorCodes.black;

  numCols = 0;
  numRows = 0;
  grid: GridSpace<Piece>[][] = [];

  borderChar = " ";
  spacerCount = 1;

  gridLines = false;

  textColors: ColorCode[][] = [];
  backgroundColors: ColorCode[][] = [];

  commands: Record<string, Command> = {};

  initialized = false;

  message = "";
  quitMessage: string = "";

  constructor(numRows: number, numCols: number, gridLines: boolean) {
    this.numRows = numRows;
    this.numCols = numCols;
    this.gridLines = gridLines;
    this.reset();
  }
  reset() {
    this.grid = [];
    this.textColors = [];
    this.backgroundColors = [];

    for (let row = 0; row < this.numRows; row++) {
      this.grid.push(new Array(this.numCols).fill(" "));
      this.textColors.push(
        new Array(this.numCols).fill(Screen.defaultTextColor)
      );
      this.backgroundColors.push(
        new Array(this.numCols).fill(Screen.defaultBackgroundColor)
      );
    }

    this.setQuitMessage("\nThank you for playing! \nGoodbye.\n");
    const quitCmd = new Command("q", "quit the game", this.quit);
    this.commands["q"] = quitCmd;

    this.initialized = true;

    this.waitForInput();
  }

  printCommands() {
    console.log("");

    for (let cmd in this.commands) {
      let description = this.commands[cmd].description;
      console.log(`  ${cmd} - ${description}`);
    }

    console.log("");
  }

  waitForInput() {
    keypress(process.stdin);

    process.stdin.on("keypress", (ch, key) => {
      if (!key) {
        console.log("Warning: Unknown keypress");
      } else if (!this.commands.hasOwnProperty(key.name)) {
        this.render();
        console.log(`${key.name} not supported.`);
        this.printCommands();
      } else {
        this.render();
        this.commands[key.name].execute();
      }
    });

    process.stdin.setRawMode(true);
    process.stdin.resume();
  }

  setGrid(row: number, col: number, char: GridSpace<Piece>) {
    if (!this.initialized) return;

    if (char.length !== 1) {
      throw new Error("invalid grid character");
    }
    this.grid[row][col] = char;
  }

  addCommand(key: string, description: string, action: () => void) {
    if (key === "q") {
      throw new Error("you cannot overwrite 'q'");
    }

    this.commands[key] = new Command(key, description, action);
  }

  setQuitMessage(quitMessage: string) {
    this.quitMessage = quitMessage;
  }

  quit(showMessage = true) {
    if (showMessage) console.log(this.quitMessage);
    process.exit(1);
  }

  render() {
    if (!this.initialized) return;

    const spacer = new Array(this.spacerCount).fill(" ").join("");

    console.clear();

    let borderLength = this.numCols * (this.spacerCount * 2 + 1) + 2;
    if (this.gridLines) borderLength += this.numCols - 1;
    let horizontalBorder = new Array(borderLength)
      .fill(this.borderChar)
      .join("");

    console.log(horizontalBorder);

    for (let row = 0; row < this.numRows; row++) {
      const rowCopy: string[] = [...this.grid[row]];

      for (let col = 0; col < this.numCols; col++) {
        let textColor = this.textColors[row][col]
          ? this.textColors[row][col]
          : "";
        let backgroundColor = this.backgroundColors[row][col]
          ? this.backgroundColors[row][col]
          : "";
        if (!(textColor && backgroundColor)) textColor = "\x1b[0m";

        let vertLine = this.gridLines && col > 0 ? "|" : "";
        rowCopy[
          col
        ] = `${Screen.defaultBackgroundColor}${vertLine}\x1b[0m${textColor}${backgroundColor}${spacer}${rowCopy[col]}${spacer}\x1b[0m`;
      }

      if (this.gridLines && row > 0) {
        let horizontalGridLine = new Array(rowCopy.length * 4 - 1).fill("-");
        horizontalGridLine.unshift(
          `${this.borderChar}${Screen.defaultBackgroundColor}`
        );
        horizontalGridLine.push(`\x1b[0m${this.borderChar}`);
        console.log(horizontalGridLine.join(""));
      }

      // console.log(rowCopy);

      rowCopy.unshift(`${this.borderChar}`);
      rowCopy.push(`${this.borderChar}`);

      console.log(rowCopy.join(""));
    }

    console.log(horizontalBorder);

    console.log("");

    console.log(this.message);
  }

  setTextColor(row: number, col: number, color: Color) {
    if (!this.initialized) return;

    let code = colorCodes[color];

    if (!code) {
      throw new Error("Invalid color");
    }

    this.textColors[row][col] = code;
  }

  setBackgroundColor(row: number, col: number, color: Color) {
    if (!this.initialized) return;

    let code = bgColorCodes[color];

    if (!code) {
      throw new Error("Invalid background color");
    }

    this.backgroundColors[row][col] = code;
  }

  setMessage(msg: string) {
    this.message = msg;
  }
}
