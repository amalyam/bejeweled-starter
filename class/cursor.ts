import { Color, GridSpace, IScreen } from "./screen";

export default class Cursor<GamePiece extends string> {
  public row = 0;
  public col = 0;

  public gridColor: Color = "black";
  public cursorColor: Color = "cyan";
  public textColor: Color = "magenta"; //not working?

  constructor(
    public numRows: number,
    public numCols: number,
    public screen: IScreen<GamePiece>
  ) {}

  //Use setBackgroundColor and resetBackgroundColor in cursor.js
  //to highlight the cursor's current position on the grid
  resetBackgroundColor() {
    this.screen.setBackgroundColor(this.row, this.col, this.gridColor);
    this.screen.render();
  }

  setBackgroundColor() {
    this.screen.setBackgroundColor(this.row, this.col, this.cursorColor);
    this.screen.render();
  }

  setTextColor() {
    this.screen.setTextColor(this.row, this.col, this.textColor);
    this.screen.render();
  }

  up() {
    this.resetBackgroundColor();

    if (this.row > 0) {
      this.row--;
    }

    this.setBackgroundColor();
  }

  down() {
    this.resetBackgroundColor();

    if (this.row < 8) {
      this.row++;
    }

    this.setBackgroundColor();
  }

  left() {
    this.resetBackgroundColor();

    if (this.col > 0) {
      this.col--;
    }

    this.setBackgroundColor();
  }

  right() {
    this.resetBackgroundColor();

    if (this.col < 8) {
      this.col++;
    }

    this.setBackgroundColor();
  }

  select() {}

  swap() {}

  return(playerTurn: GridSpace<GamePiece>) {
    this.resetBackgroundColor();
    this.setTextColor();
    this.screen.setGrid(this.row, this.col, playerTurn);
  }
}
