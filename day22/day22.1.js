const fs = require('fs');
const chalk = require('chalk');
const inputFile = process.argv.pop();

const clean = '.';
const infected = '#';

let bursts = 0;

function node(initialState) {
  let state = initialState;
  function toggle() {
    const stateShifts = {};

    stateShifts[clean] = infected;
    stateShifts[infected] = clean;


    state = stateShifts[state];
    if (state === infected) {
      ++bursts;
    }
  }

  return {
    state: () => state,
    toggle,
  }
}

function carrier(g) {
  let direction = 'up';
  let y = 0;
  let x = 0;

  function tick() {
    const node = g.node(y, x);
    direction = turn(node.state() === infected ? 'right' : 'left');
    node.toggle();

    if (direction === 'up') y = y - 1;
    if (direction === 'down') y = y + 1;
    if (direction === 'left') x = x - 1;
    if (direction === 'right') x = x + 1;
  }

  function turn(way) {
    if (way === 'left') {
      if (direction === 'up') return 'left';
      if (direction === 'left') return 'down';
      if (direction === 'down') return 'right';
      if (direction === 'right') return 'up';
    }

    if (way === 'right') {
      if (direction === 'up') return 'right';
      if (direction === 'left') return 'up';
      if (direction === 'down')  return 'left';
      if (direction === 'right')  return 'down';
    }
  }

  return {
    y: () => y + g.origo(),
    x: () => x + g.origo(),
    direction,
    tick,
  }
}

function grid(rows) {
  const nodes = rows.map(x => x.split('').map(n => node(n)));

  function grow() {
    nodes.forEach(line => {
      line.unshift(node(clean));
      line.push(node(clean));
    });
    nodes.unshift([...Array(nodes[0].length)].map(() => node(clean)));
    nodes.push([...Array(nodes[0].length)].map(() => node(clean)));
  }
  
  function print(_carrier = { x: origo, y: origo }) {
    for (let r = 0; r < nodes.length; r++) {
      const row = nodes[r].map((node, c) => {
        if (c === _carrier.x() && r === _carrier.y()) {
          return chalk.bold.white(node.state());
        }

        return node.state();
      }).join(' ');
      console.log(row);
    }
    console.log();
  }

  function origo() {
    return Math.ceil(nodes.length / 2) - 1;
  }

  function access(y, x) {
    const gY = y + origo();
    const gX = x + origo();
    if (gY >= nodes.length || gY < 0 || gX >= nodes.length || gX < 0) {
      grow();
    }

    return nodes[y + origo()][x + origo()];
  }

  return {
    print,
    origo,
    node: access,
  };
}

fs.readFile(inputFile, (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const g = grid(data.toString().split('\n'));
  const c = carrier(g);
  g.print(c);

  let i = 0;
  while (i++ < 10000) {
    c.tick();
    //g.print(c);
  }

  console.log(bursts)
});