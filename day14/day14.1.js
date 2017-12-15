const knotHash = require('../lib/knothash');

function asBits(hex) {
  const bits = parseInt(hex, 16).toString(2);
  const paddingSize = 4 - bits.length;
  const padding = paddingSize === 0 ? '' : [...Array(paddingSize)].map(_ => '0').join('');
  return `${padding}${bits}`;
}

function solve(input, gridSize = 128) {
  return [...Array(gridSize).keys()].map(i => `${input}-${i}`)
    .map(rowInput => knotHash(256, rowInput))
    .map(hash => hash.split('').map(asBits).join(''));
}

function print(rows) {
  rows.forEach(row => {
    console.log(row.replace(/0/g, '.').replace(/1/g, '#'));
  })
}

const grid = solve('flqrgnkx');
const usedCells = grid.reduce((result, row) => result + row.replace(/0/g, '').length, 0);

console.log(usedCells);