/* import "source-map-support/register";
import { expect } from "chai";

import Cursor from "../class/cursor";
import Screen from "./mocks/screen.mock";

describe("Cursor", function () {
  let cursor: Cursor<string>;

  beforeEach(function () {
    cursor = new Cursor(3, 3, new Screen());
  });

  it("initializes for a 3x3 grid", function () {
    expect(cursor.row).to.equal(0);
    expect(cursor.col).to.equal(0);
  });

  it("correctly processes down inputs", function () {
    cursor.down();
    expect([cursor.row, cursor.col]).to.deep.equal([1, 0]);

    cursor.down();
    expect([cursor.row, cursor.col]).to.deep.equal([2, 0]);

    cursor.down();
    expect([cursor.row, cursor.col]).to.deep.equal([2, 0]);
  });

  it("correctly processes up inputs", function () {
    cursor.up();
    expect([cursor.row, cursor.col]).to.deep.equal([0, 0]);

    cursor.down();
    expect([cursor.row, cursor.col]).to.deep.equal([1, 0]);

    cursor.up();
    expect([cursor.row, cursor.col]).to.deep.equal([0, 0]);
  });

  it("processes right inputs", function () {
    cursor.right();
    expect([cursor.row, cursor.col]).to.deep.equal([0, 1]);

    cursor.right();
    expect([cursor.row, cursor.col]).to.deep.equal([0, 2]);

    cursor.right();
    expect([cursor.row, cursor.col]).to.deep.equal([0, 2]);
  });

  it("processes left inputs", function () {
    cursor.left();
    expect([cursor.row, cursor.col]).to.deep.equal([0, 0]);

    cursor.right();
    expect([cursor.row, cursor.col]).to.deep.equal([0, 1]);

    cursor.left();
    expect([cursor.row, cursor.col]).to.deep.equal([0, 0]);
  });

  it("properly selects a gem", function () {});

  it("swaps gems properly", function () {});
});
 */
