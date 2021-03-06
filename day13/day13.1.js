const fs = require('fs');
const inputFile = process.argv.pop();

function parse(line) {
  const parsed = /^(\d+): (\d+)$/.exec(line);
  return {
    depth: parseInt(parsed[1], 10),
    range: parseInt(parsed[2], 10),
  };
}

function buildFirewall(input) {
  const last = input[input.length - 1];

  const firewall = [...Array(last.depth + 1).keys()].map(i => {
    const match = input.filter(layer => layer.depth === i);
    if (match.length === 0) {
      return {};
    }

    return Object.assign({ scanner: 0, direction: 'd' }, match[0]);
  });

  return firewall;
}

function stepScanners(firewall) {
  firewall.forEach(layer => {
    if (layer.scanner !== undefined) {
      if (layer.direction === 'd') {
        if (layer.scanner === layer.range - 1) {
          layer.direction = 'u';
          layer.scanner = layer.scanner - 1;
        } else {
          layer.scanner = layer.scanner + 1;
        }
      } else {
        if (layer.scanner === 0) {
          layer.direction = 'd';
          layer.scanner = 1;
        } else {
          layer.scanner -= 1;
        }
      }
    }
  });
}

function willBeCaught(firewall, position) {
  const layer = firewall[position];
  return layer.scanner === 0;
}

function solve(rawInput) {
  const input = rawInput.split('\n').map(parse);
  const firewall = buildFirewall(input);
  const caughtPosition = [];
  let playerPosition = -1;
  while (firewall[++playerPosition]) {
    if (willBeCaught(firewall, playerPosition)) {
      caughtPosition.push(playerPosition);
    }
    // console.log(willBeCaught(firewall, playerPosition), firewall);
    stepScanners(firewall);
  }

  return caughtPosition.reduce((severity, position) => {
    const layer = firewall[position];
    return severity + layer.depth * layer.range;
  }, 0);
}

fs.readFile(inputFile, (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  console.log(solve(data.toString()));
});
