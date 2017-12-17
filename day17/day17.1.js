require('../lib/array-extensions');

function solve(numberOfSteps) {
  const buffer = [0];
  let currentPosition = 0;
  let currentValue = 0;

  function insert(position, value) {
    buffer.splice(position + 1, 0, value);
    ++currentPosition;
  }

  function nextPosition(current) {
    const newPosition = current + numberOfSteps;
    if (newPosition >= buffer.length) {
      return newPosition % buffer.length;
    }

    return newPosition;
  }

  while(currentValue < 2017) {
    currentPosition = nextPosition(currentPosition);
    insert(currentPosition, ++currentValue);
  }

  console.log([].concat(
    '...', 
    buffer.slice(currentPosition - 2, currentPosition),
    `(${buffer[currentPosition]})`,
    buffer.slice(currentPosition + 1, currentPosition + 3, '...'),
    '...',
  ));
}

solve(3);
solve(344);