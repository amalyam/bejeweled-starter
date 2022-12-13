import type { IScreen } from "../../class/screen";

type ColorName =
  | "black"
  | "red"
  | "green"
  | "yellow"
  | "blue"
  | "magenta"
  | "cyan"
  | "white";

export default class Screen implements IScreen<string> {
  reset(): void {}
  printCommands(): void {}
  waitForInput(): void {}
  setGrid(row: number, col: number, char: string): void {}
  addCommand(key: string, description: string, action: () => void): void {}
  setQuitMessage(quitMessage: string): void {}
  quit(showMessage?: boolean | undefined): void {}
  render(): void {}
  setTextColor(row: number, col: number, color: ColorName): void {}
  setBackgroundColor(row: number, col: number, color: ColorName): void {}
  setMessage(msg: string): void {}
}
