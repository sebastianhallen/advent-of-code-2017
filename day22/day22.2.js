const fs = require('fs');
const chalk = require('chalk');
const inputFile = process.argv.pop();

const clean = '.';
const infected = '#';
const weakened = 'W';
const flagged = 'F'

let bursts = 0;

function node(initialState) {
  let state = initialState;
  function toggle() {
    const stateShifts = {};
    stateShifts[clean] = weakened;
    stateShifts[weakened] = infected;
    stateShifts[infected] = flagged;
    stateShifts[flagged] = clean;

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
    direction = turn(node.state());
    node.toggle();

    if (direction === 'up') y = y - 1;
    if (direction === 'down') y = y + 1;
    if (direction === 'left') x = x - 1;
    if (direction === 'right') x = x + 1;
  }

  function turn(state) {
    if (state === clean) {
      return {
        'up': 'left',
        'down': 'right',
        'left': 'down',
        'right': 'up',
      }[direction];
    }

    if (state === weakened) {
      return direction;
    }

    if (state === infected) {
      return {
        'up': 'right',
        'down': 'left',
        'left': 'up',
        'right': 'down',
      }[direction];
    }

    if (state === flagged) {
      return {
        'up': 'down',
        'down': 'up',
        'left': 'right',
        'right': 'left',
      }[direction];
    }

    throw new Error(`unhandled turn state '${state}'`);
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
  while (i++ < 10000000) {
    c.tick();
    //g.print(c);
  }

  console.log(bursts)
});