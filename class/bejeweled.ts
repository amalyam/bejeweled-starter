import Screen from "./screen";
import Cursor from "./cursor";
import Match from "./interface_matches";
import EmptySpaces from "./interface_emptyspaces";

export type GamePiece = string; // make this more specific

class Bejeweled {
  public screen = new Screen<GamePiece>(8, 8, false);
  public cursor = new Cursor(8, 8, this.screen);
  public fruit: string[] = ["🍓", "🥝", "🍊", "🍋", "🥥", "🍉", "🍌", "🍒"];
  //other fruit "🍎", " 🍇",
  public score: number = 0;

  /*
  Things to do (in this order):
  - fix remove methods
  - fix piecesFall
  - fix horizontalCheck? (sometimes registering match of 2 at end of row)
  
  - fix swap issue: pieces don't swap back properly if swap doesn't result in match


  - add leaderboard?
  - options for timed play vs free play
  - add constant text for score, controls
  - check for row,col issues in checkForMatches and helper methods?
  */

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

    this.screen.addCommand(
      "left",
      "move cursor left",
      this.cursor.left.bind(this.cursor)
    );

    this.screen.addCommand(
      "right",
      "move cursor right",
      this.cursor.right.bind(this.cursor)
    );

    this.screen.addCommand(
      "up",
      "move cursor up",
      this.cursor.up.bind(this.cursor)
    );

    this.screen.addCommand(
      "down",
      "move cursor down",
      this.cursor.down.bind(this.cursor)
    );

    this.screen.addCommand(
      "space",
      "select/deselect a fruit",
      this.select.bind(this) //sets context to Bejeweled, binds the select method, otherwise context of 'this' is addCommand()
    );

    this.screen.addCommand(
      "return",
      "confirm swap choice",
      this.swap.bind(this)
    );

    this.cursor.setBackgroundColor();
    /*     // unnecessary because setBackgroundColor already calls this, but here for clarity
    this.screen.render();
 */

    this.loadBoard();
  }

  select() {
    //press spacebar selects/deselects a fruit.

    if (this.cursor.selected) {
      this.cursor.selected = false;
      this.cursor.resetBackgroundColor();
      this.cursor.cursorColor = this.cursor.originalCurCol;
      this.cursor.setBackgroundColor();
    } else {
      this.cursor.selected = true;
      this.cursor.resetBackgroundColor();
      this.cursor.cursorColor = "yellow";
      this.cursor.setBackgroundColor();
      // how to keep center the old cursor color, even if the cursor moves over it?
      this.cursor.center = [this.cursor.col, this.cursor.row];
    }
  }

  swap() {
    //if selected, arrow keys swap selected piece with piece in that direction
    //add pause commands
    let piece1 = this.grid[this.cursor.center[1]][this.cursor.center[0]];
    let piece2 = this.grid[this.cursor.row][this.cursor.col];

    if (piece1 !== piece2) {
      this.grid[this.cursor.center[1]][this.cursor.center[0]] = piece2;
      this.grid[this.cursor.row][this.cursor.col] = piece1;
      this.screen.render();

      let result: number | false = this.checkForMatches();

      console.log(result);

      if (!result) {
        this.grid[this.cursor.center[1]][this.cursor.center[0]] = piece1;
        this.grid[this.cursor.row][this.cursor.col] = piece2;
        //setTimeout(, 250);
        //create new function for pieces swap, setTimeout cb to that function, separate out render
        this.screen.render();
      } else {
        this.score = result;
        this.select();
      }

      //add activate commands
    }
    //run checkForMatches -> if returns no matches, swap pieces back
    //else, checkForMatches will remove pieces, check for combos, total points, add new pieces
  }

  checkForMatches() {
    let horizMatches = this.horizontalCheck();
    let vertMatches = this.verticalCheck();
    //let diagMatches = this.diagonalCheck();
    let matchesNum = 0;

    if (horizMatches) {
      matchesNum += horizMatches.length;
      this.horizRemove(horizMatches);
    }
    if (vertMatches) {
      matchesNum += vertMatches.length;
      this.vertRemove(vertMatches);
    }

    if (matchesNum >= 1) {
      //set points for combos
      // setTimeout(this.piecesFall, 4000);
      return matchesNum * 25;
    } else {
      //undo swap
      return false;
    }
    //add delay timers for some actions so user sees each game state?
  }

  horizontalCheck() {
    let matches: Match[] = [];
    for (let row = 0; row < this.grid.length; row++) {
      this.grid[row].reduce((accumulator, value, col) => {
        //catch matches at the end of a row
        if (accumulator[0] === value && col + 1 === this.grid[row].length) {
          matches.push({
            length: accumulator.length + 1,
            row,
            col: col - accumulator.length,
          });
        } else if (accumulator[0] !== value && accumulator.length >= 3) {
          matches.push({
            length: accumulator.length,
            row,
            col: col - accumulator.length,
          });
        }
        return accumulator[0] === value ? [value].concat(accumulator) : [value];
      }, [] as string[]); //or put `: string[]` next to accumulator above
    }

    return matches;
  }

  verticalCheck() {
    let matches: Match[] = [];

    for (let col = 0; col < 8; col++) {
      let streak: [string] = [""];
      for (let row = 0; row < this.grid.length; row++) {
        let val = this.grid[row][col];
        if (streak[0] === val) {
          streak.concat(val);
        }
        if (
          streak.length >= 3 &&
          (streak[0] !== val || col + 1 === this.grid[row].length)
        ) {
          matches.push({
            length: streak.length,
            row: row - streak.length,
            col,
          });
        }
        streak = [val];
      }
    }
    return matches;
  }

  /*  
no diagonal matches in Bejeweled lol
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
  } */

  horizRemove(matchArr: Match[]) {
    //turn each space of a match into an empty space

    for (let { length, row, col } of matchArr) {
      //take length, row, col for each obj in matchArr
      for (let offset = 0; offset < length; offset++) {
        this.grid[row][col + offset] = " ";
      }
    }
  }

  vertRemove(matchArr: Match[]) {
    for (let { length, row, col } of matchArr) {
      //take length, row, col for each obj in matchArr
      for (let offset = 0; offset < length; offset++) {
        this.grid[row + offset][col] = " ";
      }
    }
  }

  /*   diagRemove(matchArr: Match[]) {
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
  } */

  piecesFall() {
    //if there are pieces above the empty spaces,
    //move the pieces down to the bottom of the grid
    let emptySpaces: EmptySpaces[] = [];

    for (let col = 0; col < 8; col++) {
      let count = 0;
      for (let row = 7; row >= 0; row--) {
        if (this.grid[row][col] === " ") {
          count++;
        } else {
          if (count > 0) {
            this.grid[row - count][col] = this.grid[row][col]; //move the to the lowest open position in the col
            this.grid[row][col] = " ";
          }
          if (row === 0) {
            emptySpaces.push({ col, numSpaces: count });
            count = 0;
          }
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
          this.grid[newPieces][col] =
            this.fruit[Math.floor(Math.random() * this.fruit.length)];
        }
      }
    }
  }

  loadBoard() {
    for (let col = 0; col < this.grid.length; col++) {
      for (let row = 0; row < this.grid.length; row++) {
        this.grid[row][col] =
          this.fruit[Math.floor(Math.random() * this.fruit.length)];
      }
    }
    this.screen.render();
  }
}

export default Bejeweled;
