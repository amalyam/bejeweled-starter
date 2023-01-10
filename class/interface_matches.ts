/**
 * eventually convert this to a class that has:
 * - toString method: "pretty prints" for debugging
 * - indexes: gets all of the indexes in the match (row, col)
 */
interface Match<Piece extends string> {
  character: Piece;
  length: number;
  row: number;
  col: number;
  matchType: "horizontal" | "vertical";
}

export default Match;
//export type Matches = Match[];
