import Screen from "./screen";
import Cursor from "./cursor";
import Match from "./interface_matches";
import EmptySpaces from "./interface_emptyspaces";

export type GamePiece = string; // make this more specific

class Bejeweled {
  public screen = new Screen<GamePiece>(8, 8, false);
  public cursor = new Cursor(8, 8, this.screen);
  public fruit: string[] = [
    "🍓",
    "🥝",
    "🍊",
    "🍋",
    "🍇",
    "🍉",
    "🍌",
    "🍎",
    "🍒",
  ];

  /** Convenience accessor for the screen's grid */
  public get grid() {
    return this.screen.grid;
  }

  /**
   * Run the game. This should handle:
   *  - initializing the Screen
   *  - setting up game logic
   */
  run() {
    this.screen.initialize();
    this.cursor.setBackgroundColor();
    /*     // unnecessary because setBackgroundColor already calls this, but here for clarity
    this.screen.render();
 */
  }

  checkForMatches() {
    let horizMatches = this.horizontalCheck();
    let vertMatches = this.verticalCheck();
    let diagMatches = this.diagonalCheck();
    let matchesNum = 0;
    let combo: number;

    if (horizMatches) {
      matchesNum += horizMatches.length;
      this.horizRemove(horizMatches);
    }
    if (vertMatches) {
      matchesNum += vertMatches.length;
      this.vertRemove(vertMatches);
    }
    if (diagMatches) {
      matchesNum += diagMatches.length;
      this.diagRemove(diagMatches);
    }

    if (matchesNum > 1) {
      //set points for combos -> combo =
    }
    //add delay timers for some actions so user sees each game state?
    this.piecesFall();
  }

  horizontalCheck() {
    let matches: Match[] = [];
    for (let row = 0; row < this.grid.length; row++) {
      this.grid[row].reduce((accumulator, value, col) => {
        if (accumulator[0] !== value && accumulator.length >= 3) {
          matches.push({
            length: accumulator.length,
            row,
            col: col - accumulator.length,
          });
        }
        return value + (accumulator[0] === value ? accumulator : "");
      }, "");
    }

    return matches;
  }

  verticalCheck() {
    let matches: Match[] = [];

    for (let col = 0; col < 8; col++) {
      let streak = "";
      for (let row = 0; row < this.grid.length; row++) {
        let val = this.grid[col][row];
        if (streak[0] === val) {
          streak.concat(val);
        } else {
          if (streak.length >= 3) {
            matches.push({
              length: streak.length,
              row: row - streak.length,
              col,
            });
          }
          streak = val;
        }
      }
    }
    return matches;
  }

  diagonalCheck() {
    let matches: Match[] = [];

    for (let col = 0; col < 8; col++) {
      let streak = "";
      for (let row = 0; row < this.grid.length; row++) {
        let val = this.grid[col][row];
        if (streak[0] === val) {
          streak.concat(val);
        } else {
          if (streak.length >= 3) {
            matches.push({
              length: streak.length,
              row: row - streak.length,
              col: col - streak.length,
            });
          }
          streak = val;
        }
      }
    }
    return matches;
  }

  horizRemove(matchArr: Match[]) {
    //turn each space of a match into an empty space

    for (let matchNum = 0; matchNum < matchArr.length; matchNum++) {
      for (let row = matchArr[matchNum].row; row < 8; row++) {
        for (
          let col = matchArr[matchNum].col;
          col < matchArr[matchNum].col + matchArr[matchNum].length;
          col++
        ) {
          this.grid[col][row] = " ";
        }
      }
    }
  }

  vertRemove(matchArr: Match[]) {
    for (let matchNum = 0; matchNum < matchArr.length; matchNum++) {
      for (let col = 0; col < 8; col++) {
        for (
          let row = matchArr[matchNum].row;
          row < matchArr[matchNum].row + matchArr[matchNum].length;
          row++
        ) {
          this.grid[col][row] = " ";
        }
      }
    }
  }

  diagRemove(matchArr: Match[]) {
    for (let matchNum = 0; matchNum < matchArr.length; matchNum++) {
      for (let row = matchArr[matchNum].row; row < 8; row++) {
        for (
          let col = matchArr[matchNum].col;
          col < matchArr[matchNum].col + matchArr[matchNum].length;
          col++
        ) {
          this.grid[col][row] = " ";
        }
      }
    }
  }

  piecesFall() {
    //if there are pieces above the empty spaces,
    //move the pieces down to the bottom of the grid
    let emptySpaces: EmptySpaces[] = [];

    for (let col = 0; col < 8; col++) {
      let count = 0;
      for (let row = 8; row >= 0; row++) {
        if (this.grid[col][row] === " ") {
          count++;
        } else if (count > 0) {
          this.grid[col][row - count] = this.grid[col][row];
          this.grid[col][row] = " ";
        }
        if (row === 0) {
          emptySpaces.push({ col, numSpaces: count });
        }
      }
    }

    this.newPieces(emptySpaces);
  }

  newPieces(emptySpaces: EmptySpaces[]) {
    //randomly generate as many new pieces for each column as it has empty spaces
    for (let col = 0; col < 8; col++) {
      if (emptySpaces[col]) {
        let blanks = emptySpaces[col].numSpaces;
        for (let newPieces = blanks - 1; newPieces >= 0; newPieces++) {
          this.grid[col][newPieces] =
            this.fruit[Math.floor(Math.random() * this.fruit.length)];
        }
      }
    }
  }
}

export default Bejeweled;
