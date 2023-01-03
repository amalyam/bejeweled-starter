let grid = [
  ["🍓", "🍉", "🍊", "🍊", "🍊", "🍊", "🍊", "🍊"],
  ["🍓", "🍉", "🍉", "🍉", "🥝", "🍊", "🍌", "🍒"],
  ["🍓", "🍉", "🍉", "🥝", "🥝", "🥝", "🍌", "🍒"],
  ["🍓", "🍓", "🍓", "🍓", "🥝", "🥝", "🥝", "🥝"],
];
//
function horizontalCheck() {
  let matches = [];
  for (let row = 0; row < grid.length; row++) {
    grid[row].reduce((accumulator, value, col) => {
      if (accumulator[0] === value && col + 1 === grid[row].length) {
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
    }, []);
  }

  return matches;
}

//console.log(grid.length);
console.log(horizontalCheck(grid));

/*
 let streak = ["🍉"];

console.log(grid[1] === streak[0]);

if (grid[1] === streak[0]) {
  streak += grid[1];
} */

//console.log(streak);
