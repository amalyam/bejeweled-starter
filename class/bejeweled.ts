import Screen from "./screen";
import Cursor from "./cursor";

type GamePiece = string; // make this more specific

class Bejeweled {
  public screen = new Screen<GamePiece>(8, 8, false);
  public cursor = new Cursor(8, 8, this.screen);

  // Convenience accessor for the grid
  public get grid() {
    return this.screen.grid;
  }

  run() {
    this.cursor.setBackgroundColor();
    // unnecessary because setBackgroundColor already calls this, but here for clarity
    this.screen.render();

    // Add game logic here
  }

  checkForMatches() {
    // Fill this in
  }
}

export default Bejeweled;
