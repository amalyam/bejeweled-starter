import Screen from "./screen";
import Cursor from "./cursor";
import Match from "./interface_matches";
import EmptySpaces from "./interface_emptyspaces";
import { parseSampleData } from "./parse-sample-data";

export type GamePiece = string; // make this more specific

interface RunOptions {
  useSampleData?: boolean;
}

//tuple type Coordinate = [row: number, column: number];
//type Coordinate = { row: number; column: number };

class Bejeweled {
  public screen = new Screen<GamePiece>(8, 8, false);
  public cursor = new Cursor(8, 8, this.screen);
  public fruit: string[] = ["🍓", "🥝", "🍊", "🍋", "🥥", "🍉", "🍌", "🍒"];
  //other fruit "🍎", " 🍇",
  public points: number = 0;

  /*
  Things to do:
    - remove all matches from starting board before gameplay
      -> update so that any matches in randomly generated board are removed before gameplay
        - make check and remove methods more modular to do this
        - what if a horiz + vert swap have overlap?

  - add leaderboard?
  - options for timed play vs free play
  - add constant text for score, controls
  - refactor cursor to use screen rows + cols (num?)
  - refactor coordinates to use Coordinate type
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
    //add pause/activate commands?

    //add info log to console with # of matches

    let piece1 = this.screen.getGrid(
      this.cursor.center[1],
      this.cursor.center[0]
    );
    let piece2 = this.screen.getGrid(this.cursor.row, this.cursor.col);

    //swap piece1 and piece2 if they are not the same emoji
    if (piece1 !== piece2) {
      this.screen.setGrid(this.cursor.center[1], this.cursor.center[0], piece2);
      this.screen.setGrid(this.cursor.row, this.cursor.col, piece1);
    }

    // check if the swap resulted in a match
    let result = this.swapCheck();

    // if the swap did not result in a match
    if (!result) {
      //swap pieces back
      this.screen.setGrid(this.cursor.center[1], this.cursor.center[0], piece1);
      this.screen.setGrid(this.cursor.row, this.cursor.col, piece2);
      //setTimeout(, 250);
      this.cursor.tempCursorColor = "red";
      this.cursor.setBackgroundColor();
    }
  }

  swapCheck(): Match<GamePiece>[] | false {
    //returns matches or false;
    let matches = this.checkForMatches();

    /* if there are matches: 
       - remove pieces
       - add new pieces
       - total points
       - return to normal cursor state
       */
    if (matches.length) {
      this.removePieces(matches);
      const emptySpaces = this.piecesFall();
      this.newPieces(emptySpaces);
      this.points = this.calculateScore(matches);
      this.select();
      return matches;
    } else {
      // return false to swap() to undo the swap
      return false;
    }
  }

  checkForMatches(): Match<GamePiece>[] {
    let horizMatches = this.horizontalCheck();
    let vertMatches = this.verticalCheck();

    return [...horizMatches, ...vertMatches];
  }

  removePieces(matches: Match<GamePiece>[]) {
    //turn each space of a match into an empty space

    for (let { length, row, col, matchType } of matches) {
      //take length, row, col for each obj in matchArr
      for (let offset = 0; offset < length; offset++) {
        if (matchType === "horizontal") {
          this.screen.setGrid(row, col + offset, null);
        } else if (matchType === "vertical") {
          this.screen.setGrid(row + offset, col, null);
        }
      }
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

  piecesFall() {
    //if there are pieces above the empty spaces,
    //move the pieces down to the bottom of the grid
    let emptySpaces: EmptySpaces[] = [];

    for (let col = 0; col < 8; col++) {
      let count = 0;
      for (let row = 7; row >= 0; row--) {
        if (this.screen.getGrid(row, col) === null) {
          count++;
        } else if (count > 0) {
          this.screen.setGrid(row + count, col, this.screen.getGrid(row, col)); //move the to the lowest open position in the col
          this.screen.setGrid(row, col, null);
        }
      }
      if (count > 0) {
        emptySpaces.push({ col, numSpaces: count });
      }
    }

    return emptySpaces;
  }

  newPieces(emptySpaces: EmptySpaces[]) {
    //randomly generate as many new pieces for each column as it has empty spaces
    this.screen.render();
    for (let coordinates of emptySpaces) {
      for (let row = coordinates.numSpaces - 1; row >= 0; row--) {
        this.screen.setGrid(
          row,
          coordinates.col,
          this.fruit[Math.floor(Math.random() * this.fruit.length)]
        );
        this.screen.render();
      }
    }
  }

  calculateScore(matches: Match<GamePiece>[]) {
    //set score based on number of matches, including combo points

    return matches.length * 25;
  }

  loadBoard(useSampleData: boolean) {
    const sampleGrid = useSampleData ? parseSampleData() : [];
    for (let col = 0; col < this.grid.length; col++) {
      for (let row = 0; row < this.grid.length; row++) {
        this.grid[row][col] = useSampleData
          ? sampleGrid[row][col]
          : this.fruit[Math.floor(Math.random() * this.fruit.length)];
      }
    }
    this.screen.debugConsole.logInfo("Initialized grid");
    this.screen.render();
  }
}

export default Bejeweled;
