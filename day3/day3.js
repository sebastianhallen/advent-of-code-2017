const { test } = require('../lib/fluff');

const sample1 = [{
  input: 1,
  answer: 0,
}, {
  input: 12,
  answer: 3,
}, {
  input: 23,
  answer: 2,
}, {
  input: 1024,
  answer: 31,
}];

const sample2 = [{
  input: '',
  answer: 0,
}, {
  input: '',
  answer: 0,
}];

const challenge1 = [{
  input: 347991,
  answer: 480,
}];

const challenge2 = [{
  input: '',
  answer: 0,
}];

function nextDirection(direction) {
  return {
    u: 'l',
    l: 'd',
    d: 'r',
    r: 'u',
  }[direction];
}

function nextPosition(position, direction) {
  const newPosition = {
    u: { x: position.x, y: position.y + 1, direction },
    l: { x: position.x - 1, y: position.y, direction },
    d: { x: position.x, y: position.y - 1, direction },
    r: { x: position.x + 1, y: position.y, direction },
  }[direction];

  newPosition.distance = newPosition.distance = Math.abs(newPosition.x) + Math.abs(newPosition.y);
  return newPosition;
}

function solve(data, isPart2) {
  let numberOfSteps = 0;
  let index = 1;
  const solutions = [...Array(data.input).keys()]
    .map(i => {
      if (i !== 0 && i % 2 === 0) {
        ++numberOfSteps;
      } 
      return numberOfSteps + 1; 
    })
    .reduce((res, curr) => {
      if (res.totalSteps >= data.input) {
        return res;
      }
      res.direction = nextDirection(res.direction);
      res.totalSteps += curr;
      if (--res.step === 0) {
        
        res.step = curr;
      }
      res.directions = res.directions.concat([...Array(curr)].map(() => res.direction));
      return res;
    }, {currentPosition: { x:0, y:1 }, step: 1, direction: 'd', totalSteps: 0, directions: [] })
    .directions.reduce((res, direction) => {
      const next = nextPosition(res.currentPosition, direction);
      next.number = ++index;
      res.positions.push(next);
      res.currentPosition = next;
      return res;
    }, { currentPosition: { x: 0, y: 0 }, positions: [] })
    .positions;

  const solution = solutions.filter(s => s.number === data.input);
  if (solution.length === 0) return 0;

  return solution[0].distance;
}

test(solve, sample1, false, 'test 1')
test(solve, challenge1, false, 'challenge 1');
//test(solve, sample2, true, 'test 2')
//test(solve, challenge2, true, 'challenge 2');
