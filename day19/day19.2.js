require('../lib/array-extensions');
const fs = require('fs');
const inputFile = process.argv.pop();

function parse(data) {
  const grid = data.split('\n')
    .map(line => line.split(''));
  return grid.map((row, y) => row.map((cell, x) => {
    const up = y > 0 ? grid[y - 1][x] : '';
    const down = y < grid.length - 1 ? grid[y + 1][x] : '';
    const left = x > 0 ? grid[y][x - 1] : '';
    const right = x < row.length - 1 ? grid[y][x + 1] : '';

    return {
      content: cell,
      x,
      y,
      up,
      down,
      left,
      right,
    };
  }));
}

function invertDirection(direction) {
  return {
    up: 'down',
    left: 'right',
    right: 'left',
    down: 'up',
  }[direction];
}

function isJunktion(cell) {
  const check = [cell.up, cell.down, cell.left, cell.right]
    .filter(content => !(/^\s*$/.test(content) || !content))
    .length > 2;

  return check;
}

function getPossibleDirections(cell, previousDirection) {
  const possible = ['up', 'down', 'left', 'right'];
  console.log(previousDirection, cell.content);

  if (isJunktion(cell)) {
    return [previousDirection];
  }

  function removeDirection(direction) {
    if (possible.includes(direction)) {
      possible.splice(possible.indexOf(direction), 1);
    }
  }

  possible.slice().forEach(direction => {
    if (/^\s*$/.test(cell[direction])) {
      removeDirection(direction);
    }

    if(!cell[direction]) {
      removeDirection(direction);
    }
  });
  removeDirection(invertDirection(previousDirection));

  if (cell.content === '|') {
    removeDirection('left');
    removeDirection('right');
  }

  if (cell.content === '-') {
    removeDirection('up');
    removeDirection('down');
  }

  if (cell.content === '+') {
    if (previousDirection === 'up' || previousDirection === 'down') {
      removeDirection('up');
      removeDirection('down');
    } else {
      removeDirection('left');
      removeDirection('right');
    }

  }


  return possible;
}

function move(cell, direction) {
  if (direction === 'up') return { x: cell.x, y: cell.y - 1 };
  if (direction === 'down') return { x: cell.x, y: cell.y + 1 };
  if (direction === 'left') return { x: cell.x - 1, y: cell.y };
  if (direction === 'right') return { x: cell.x + 1, y: cell.y };
}

function solve(grid) {
  let position = {
    y: 0,
    x: grid[0].filter(cell => cell.content === '|')[0].x,
  }
  let previousDirection = 'down';
  let possibleDirections = ['fake'];
  const answer = [];
  let steps = 0;
  for (; possibleDirections.length; steps++) {
    const cell = grid[position.y][position.x];
    if (/[A-Z]/.test(cell.content)) {
      answer.push(cell.content);
    }

    possibleDirections = getPossibleDirections(cell, previousDirection);
    if (possibleDirections.length > 1) {
      console.log('too many options', position, possibleDirections);
      console.log(cell);
      process.exit(0);
    }

    position = move(cell, possibleDirections[0]);
    previousDirection = possibleDirections[0];
  }

  return steps;
}

fs.readFile(inputFile, (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const grid = parse(data.toString());
  console.log(solve(grid));
});
