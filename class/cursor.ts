import Screen, { Color, GridSpace } from "./screen";

export default class Cursor<Player extends string> {
  public row = 0;
  public col = 0;

  public gridColor: Color = "black";
  public cursorColor: Color = "yellow";
  public textColor: Color = "magenta"; //not working

  constructor(
    public numRows: number,
    public numCols: number,
    public screen: Screen<Player>
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

    if (this.row < 2) {
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

    if (this.col < 2) {
      this.col++;
    }

    this.setBackgroundColor();
  }

  return(playerTurn: GridSpace<Player>) {
    this.resetBackgroundColor();
    this.setTextColor();
    this.screen.setGrid(this.row, this.col, playerTurn);
  }
}
