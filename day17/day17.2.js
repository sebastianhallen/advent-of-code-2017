require('../lib/array-extensions');

function solve(numberOfSteps, iterations) {
  let bufferSize = 1;
  let currentPosition = 0;
  let currentValue = 0;
  let after0 = 0;

  function insert(position, value) {
    if (position === 0) {
      after0 = value;
    }
    ++bufferSize;
    ++currentPosition;
  }

  function nextPosition(current) {
    const newPosition = current + numberOfSteps;
    if (newPosition >= bufferSize) {
      return newPosition % bufferSize;
    }

    return newPosition;
  }

  while(currentValue < iterations) {
    currentPosition = nextPosition(currentPosition);
    insert(currentPosition, ++currentValue);
  }

  console.log(after0);
}

solve(344, 50000000);