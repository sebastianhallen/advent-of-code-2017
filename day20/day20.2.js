const fs = require('fs');
const inputFile = process.argv.pop();

function parse(line) {
  function parseChunk(pattern) {
    const chunk = pattern.exec(line)[1];
    const parts = chunk.split(',').map(p => parseInt(p.trim(), 10));
    return {
      x: parts[0],
      y: parts[1],
      z: parts[2],
    };
  }

  return particle(
    parseChunk(/p=<([^>]+)>/),
    parseChunk(/v=<([^>]+)>/),
    parseChunk(/a=<([^>]+)>/),
  );
}

function particle(p, v, a) {
  const id = asState();
  const previousStates = [];
  const previousDistances = [];
  let totalDistance = 0;

  function asState() {
    return `p=<${p.x},${p.y},${p.z}>, v=<${v.x},${v.y},${v.z}}>, a=<${a.x},${a.y},${a.z}>`;
  }

  function addPreviousState() {
    previousStates.push(asState());
  }

  function isInSeenState() {
    return previousStates.includes(asState());
  }

  function addDistance() {
    const distance = Math.abs(p.x) + Math.abs(p.y) + Math.abs(p.z);
    totalDistance = totalDistance + distance;
    previousDistances.push(distance);
  }

  function averageDistance() {
    return totalDistance / previousDistances.length;
  }

  function increase(a, b) {
    a.x = a.x + b.x;
    a.y = a.y + b.y;
    a.z = a.z + b.z;
  }

  function tick() {
    addPreviousState();
    addDistance();
    increase(v, a);
    increase(p, v);
  }

  function checkCollision(other) {
    if (other.id === id) {
      return false;
    }

    return p.x === other.p.x && p.y === other.p.y && p.z === other.p.z;
  }

  return {
    id,
    tick,
    isInSeenState,
    asState,
    averageDistance,
    checkCollision,
    p,
  };
}

function solve(particles) {
  let uncollided = particles.slice();

  while(true) {
    uncollided = uncollided.filter(p => !uncollided.some(other => p.checkCollision(other)));
    uncollided.forEach(p => p.tick());

    if (uncollided.length === 1) {
      return uncollided[0];
    }

    console.log('uncollided', uncollided.length);
  }
}

fs.readFile(inputFile, (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const particles = data.toString().split('\n').map(parse);
  console.log(solve(particles));
});
