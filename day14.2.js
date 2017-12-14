const knotHash = require('./knothash');

function asBits(hex) {
  const bits = parseInt(hex, 16).toString(2);
  const paddingSize = 4 - bits.length;
  const padding = paddingSize === 0 ? '' : [...Array(paddingSize)].map(_ => '0').join('');
  return `${padding}${bits}`;
}

function solve(input, gridSize = 128) {
  return [...Array(gridSize).keys()].map(i => `${input}-${i}`)
    .map(rowInput => knotHash(256, rowInput))
    .map(hash => hash.split('').map(asBits).join(''))
    .map(row => row.replace(/0/g, '.').replace(/1/g, '#'))
    .map(row => row.split(''));
}

function getCandidates(grid, existing, row, col) {
  const candidates = [];
  function add(r, c, direction) {
    const cell = {
      row: r,
      col: c,
      direction,
      id: `(${row}:${col})`,
    };

    if(!isKnown(candidates, cell) && !isKnown(existing, cell) && grid[r][c] === '#') {
      candidates.push(cell);
    }
  }

  function isKnown(list, c) {
    return list.filter(e => e.col === c.col && e.row === c.row).length;
  }


  if (row > 0) {
    add(row - 1, col, 'above');
  }
  if (row < grid.length - 1) {
    add(row + 1, col, 'below');
  } 
  if (col > 0) {
    add(row, col - 1, 'left');
  } 
  if (col < grid[row].length - 1) {
    add(row, col + 1, 'right');
  }

  return candidates;
}

function topUngrouped(grid) {
  let rowIndex = -1;
  return grid.reduce((result, row) => {
    if (result !== -1) return result;

    ++rowIndex
    if (row.includes('#')) {
      return rowIndex;
    }

    return -1;
  }, -1)
}

function group(grid) {
  let groupId = 0;
  let row = topUngrouped(grid);

  while(row !== -1) {
    ++groupId;
    let col = grid[row].indexOf('#');
    let candidates = [];
    let candidates_new = [{ row, col, }];

    while(candidates_new.length !== 0) {
      candidates = candidates.concat(candidates_new);
      candidates_new = candidates_new
        .map(candidate => getCandidates(grid, candidates, candidate.row, candidate.col))
        .reduce((cs, c) => cs.concat(c), [])
        .filter((value, index, self) => self.findIndex(x => x.col === value.col && x.row === value.row) === index)      
    }

    candidates.forEach(c => grid[c.row][c.col] = groupId);

    row = topUngrouped(grid);
  }

  return groupId;
}

const grid = solve('flqrgnkx');
console.log(group(grid));
