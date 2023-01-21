/* import "source-map-support/register";
import { expect } from "chai";

import Bejeweled, { GamePiece } from "../class/bejeweled";
import Screen from "../class/screen";
import Cursor from "../class/cursor";

describe("Bejeweled", function () {
  let screen: Screen<GamePiece>;
  let cursor: Cursor<GamePiece>;

  beforeEach(function () {
    screen = new Screen<GamePiece>(8, 8, false);
    cursor = new Cursor(8, 8, screen);
  });

  // Add tests for setting up a basic board
  it("initializes an 8x8 grid", function () {
    expect(cursor.row).to.equal(0);
    expect(cursor.col).to.equal(0);
    //why not expect(Screen.numRows).to.equal(8)?
  });

  // Add tests for a valid swap that matches 3
  // -> 3 same items horizontally or vertically
  it("recognizes a horizontal match", function () {
    grid = [
      [" ", " ", " ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " ", " ", " "],
      [" ", " ", "🍓", "🍓", "🍓", " ", " ", " "],
      [" ", " ", " ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " ", " ", " "],
    ];
    expect(Bejeweled.checkForMatches()).to.be.true;
  });

  it("recognizes a horizontal match of more than 3 pieces", function () {
    grid = [
      [" ", " ", " ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " ", " ", " "],
      ["🍓", "🍓", "🍓", "🍓", "🍓", " ", " "],
    ];
    expect(checkForMatches()).to.be.true;
  });

  it("recognizes a vertical match", function () {
    grid = [
      [" ", " ", " ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " ", " ", " "],
      [" ", " ", "🍓", " ", " ", " ", " ", " "],
      [" ", " ", "🍓", " ", " ", " ", " ", " "],
      [" ", " ", "🍓", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " ", " ", " "],
    ];
    expect(checkForMatches()).to.be.true;
  });

  it("recognizes a vertical match of more than 3 pieces", function () {
    grid = [
      [" ", " ", " ", " ", " ", " ", " ", "🍓"],
      [" ", " ", " ", " ", " ", " ", " ", "🍓"],
      [" ", " ", " ", " ", " ", " ", " ", "🍓"],
      [" ", " ", " ", " ", " ", " ", " ", "🍓"],
      [" ", " ", " ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " ", " ", " "],
    ];
    expect(checkForMatches()).to.be.true;
  });

  it("recognizes a diagonal SW/NE match", function () {
    grid = [
      [" ", " ", " ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " ", " ", " "],
      [" ", " ", " ", "🍓", " ", " ", " ", " "],
      [" ", " ", "🍓", " ", " ", " ", " ", " "],
      [" ", "🍓", " ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " ", " ", " "],
    ];
    expect(checkForMatches()).to.equal(1);
  });

  it("recognizes diagonal SW/NE matches of more than 3 pieces", function () {
    grid = [
      [" ", " ", " ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " ", " ", " "],
      [" ", " ", " ", "🍓", " ", " ", " ", " "],
      [" ", " ", "🍓", " ", " ", " ", " ", " "],
      [" ", "🍓", " ", " ", " ", " ", " ", " "],
      ["🍓", " ", " ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " ", " ", " "],
    ];
    expect(checkForMatches()).to.equal(1);
  });

  it("recognizes a diagonal NW/SE match", function () {
    grid = [
      [" ", " ", " ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " ", " ", " "],
      [" ", " ", " ", "🍓", " ", " ", " ", " "],
      [" ", " ", " ", " ", "🍓", " ", " ", " "],
      [" ", " ", " ", " ", " ", "🍓", " ", " "],
    ];
    expect(checkForMatches()).to.equal(1);
  });

  it("recognizes a diagonal NW/SE match of more than 3 pieces", function () {
    grid = [
      [" ", " ", " ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", "🍓", " ", " ", " "],
      [" ", " ", " ", " ", " ", "🍓", " ", " "],
      [" ", " ", " ", " ", " ", " ", "🍓", " "],
      [" ", " ", " ", " ", " ", " ", " ", "🍓"],
    ];
    expect(checkForMatches()).to.be.true;
  });

  // Add tests for swaps that set up combos
  // -> more than one match in a turn
  it("recognizes a swap that results in a combo", function () {
    expect(checkForMatches()).to.be.above(1);
  });

  // Add tests to check if there are no possible valid moves
  // ->
  it("checks for no possible valid moves", function () {});

  it("prevents illegal moves", function () {
    //swap must result in a match
    expect(checkForMatches()).to.be.false;
  });
});
 */
