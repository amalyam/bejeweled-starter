import Screen from "./screen";
import Cursor from "./cursor";
import Match from "./interface_matches";
import EmptySpaces from "./interface_emptyspaces";
import { parseSampleData } from "./parse-sample-data";

export type GamePiece = string; // make this more specific

interface RunOptions {
  useSampleData?: boolean;
}

class Bejeweled {
  public screen = new Screen<GamePiece>(8, 8, false);
  public cursor = new Cursor(8, 8, this.screen);
  public fruit: string[] = ["🍓", "🥝", "🍊", "🍋", "🥥", "🍉", "🍌", "🍒"];
  //other fruit "🍎", " 🍇",
  public points: number = 0;

  /*
  Things to do (in this order):
  - combine remove methods with bool for vert or horiz
  - fix piecesFall
  - fix horizontalCheck? (sometimes registering match of 2 at end of row)
      - also make simpler overall
  
  - fix swap issue: pieces don't swap back properly if swap doesn't result in match
  - sometimes doesn't allow a swap
  - only clearing pieces after first swap match

  - remove all matches from starting board before gameplay
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
  run({ useSampleData = false }: RunOptions = {}) {
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

    this.loadBoard(useSampleData);
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
    let piece1 = this.screen.getGrid(
      this.cursor.center[1],
      this.cursor.center[0]
    );
    let piece2 = this.screen.getGrid(this.cursor.row, this.cursor.col);

    if (piece1 !== piece2) {
      this.screen.setGrid(this.cursor.center[1], this.cursor.center[0], piece2);
      this.screen.setGrid(this.cursor.row, this.cursor.col, piece1);

      //returns number of matches or false
      let matches = this.checkForMatches();

      console.log(matches);

      if (matches.length) {
        this.removePieces(matches);
        const emptySpaces = this.piecesFall();
        //this.newPieces(emptySpaces);
        this.points = this.calculateScore(matches);
        this.select();
      } else {
        this.screen.setGrid(
          this.cursor.center[1],
          this.cursor.center[0],
          piece1
        );
        this.screen.setGrid(this.cursor.row, this.cursor.col, piece2);
        //setTimeout(, 250);
        this.cursor.tempCursorColor = "red";
        this.cursor.setBackgroundColor();
      }

      //add activate commands
    }
    //run checkForMatches -> if returns no matches, swap pieces back
    //else, checkForMatches will remove pieces, check for combos, total points, add new pieces
  }

  checkForMatches(): Match<GamePiece>[] {
    let horizMatches = this.horizontalCheck();
    let vertMatches = this.verticalCheck();

    return [...horizMatches, ...vertMatches];
  }

  removePieces(matches: Match<GamePiece>[]) {
    const horizMatches = matches.filter(
      (match) => match.matchType === "horizontal"
    );
    const vertMatches = matches.filter(
      (match) => match.matchType === "vertical"
    );

    if (horizMatches.length) {
      this.horizRemove(horizMatches);
    }
    if (vertMatches.length) {
      this.vertRemove(vertMatches);
    }
  }

  horizontalCheck() {
    let matches: Match<GamePiece>[] = [];

    for (let row = 0; row < this.screen.numRows; row++) {
      let partialMatch: Match<GamePiece> | undefined;
      for (let col = 0; col < this.screen.numCols; col++) {
        let value = this.screen.getGrid(row, col) as GamePiece;
        if (partialMatch?.character === value) {
          partialMatch.length++;
        }
        if (
          (partialMatch?.length ?? 0) >= 3 &&
          (partialMatch?.character !== value || col + 1 === this.screen.numCols)
        ) {
          matches.push(partialMatch!); //! means it is def not null/undefined
        }
        if (partialMatch?.character !== value) {
          partialMatch = {
            character: value,
            length: 1,
            row,
            col,
            matchType: "horizontal",
          };
        }
      }
    }
    return matches;
  }

  verticalCheck() {
    let matches: Match<GamePiece>[] = [];

    for (let col = 0; col < this.screen.numCols; col++) {
      let partialMatch: Match<GamePiece> | undefined;
      for (let row = 0; row < this.screen.numRows; row++) {
        let value = this.screen.getGrid(row, col) as GamePiece;
        if (partialMatch?.character === value) {
          partialMatch.length++;
        }
        if (
          (partialMatch?.length ?? 0) >= 3 &&
          (partialMatch?.character !== value || row + 1 === this.screen.numRows)
        ) {
          matches.push(partialMatch!); //! means it is def not null/undefined
        }
        if (partialMatch?.character !== value) {
          partialMatch = {
            character: value,
            length: 1,
            row,
            col,
            matchType: "vertical",
          };
        }
      }
    }
    return matches;
  }

  horizRemove(matchArr: Match<GamePiece>[]) {
    //turn each space of a match into an empty space

    for (let { length, row, col } of matchArr) {
      //take length, row, col for each obj in matchArr
      for (let offset = 0; offset < length; offset++) {
        this.screen.setGrid(row, col + offset, null);
      }
    }
  }

  vertRemove(matchArr: Match<GamePiece>[]) {
    for (let { length, row, col } of matchArr) {
      //take length, row, col for each obj in matchArr
      for (let offset = 0; offset < length; offset++) {
        this.screen.setGrid(row + offset, col, null);
      }
    }
  }

  piecesFall() {
    //if there are pieces above the empty spaces,
    //move the pieces down to the bottom of the grid
    let emptySpaces: EmptySpaces[] = [];

    for (let col = 0; col < 8; col++) {
      let count = 0;
      for (let row = 7; row >= 0; row--) {
        if (this.screen.getGrid(row, col) === null) {
          count++;
        } else {
          if (count > 0) {
            this.screen.setGrid(
              row + count,
              col,
              this.screen.getGrid(row, col)
            ); //move the to the lowest open position in the col
            this.screen.setGrid(row, col, null);

            if (row === 0) {
              emptySpaces.push({ col, numSpaces: count });
              count = 0;
            }
          }
        }
      }
    }

    return emptySpaces;
  }

  newPieces(emptySpaces: EmptySpaces[]) {
    //randomly generate as many new pieces for each column as it has empty spaces
    for (let col = 0; col < 8; col++) {
      if (emptySpaces[col]) {
        let blanks = emptySpaces[col].numSpaces;
        for (let newPieces = blanks - 1; newPieces >= 0; newPieces++) {
          this.screen.setGrid(
            newPieces,
            col,
            this.fruit[Math.floor(Math.random() * this.fruit.length)]
          );
        }
      }
    }
  }

  calculateScore(matches: Match<GamePiece>[]) {
    //set score based on number of matches, including combo points

    return matches.length * 25;
  }

  loadBoard(useSampleData: boolean) {
    const sampleGrid = parseSampleData();
    for (let col = 0; col < this.grid.length; col++) {
      for (let row = 0; row < this.grid.length; row++) {
        this.grid[row][col] = useSampleData
          ? sampleGrid[row][col]
          : this.fruit[Math.floor(Math.random() * this.fruit.length)];
      }
    }
    this.screen.render();
  }
}

export default Bejeweled;
