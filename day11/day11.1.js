const fs = require('fs');
const inputFile = process.argv.pop();

function parse(line) {
  return line.split(',');
}

function distance(position) {
  const x_abs = Math.abs(position.x);
  const y_abs = Math.abs(position.y);

  if (x_abs >= y_abs) {
    return x_abs;
  } else {
    return Math.abs(position.x + ((position.y - position.x) / 2));
  }

}

function longWalk(steps) {
  let max = 0;
  const target = steps.reduce((curr, step) => {
    const next = curr[step]();
    max = Math.max(max, distance(next.position()));
    return next;
  }, cell(0, 0));

  console.log(`furthest distance: ${max}`);
  return target;
}

function solve(steps) {
  const goalCell = longWalk(steps);
  return distance(goalCell.position());
}

function cell(y, x) {
  return {
    n: () => cell(y + 1, x),
    ne: () => cell(y + 1, x + 1),
    se: () => cell(y - 1, x + 1),
    s:  () => cell(y - 1, x),
    sw: () => cell(y - 1, x - 1),
    nw: () => cell(y + 1, x - 1),
    position: () => ({ y, x }),
  };
}

fs.readFile(inputFile, (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const input = data.toString()
    .split('\n').map(parse)
    .forEach(steps => {
      const distance = solve(steps);
      console.log(distance);
    });
});
