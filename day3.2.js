function calculateNextStep(y, x, previousRound, stepLength, walkedSteps, previousDirection) {
  const next = {
    round: previousRound,
    stepLength,
  };

  if (stepLength === 0) {
    return {
      y: 0,
      x: 0,
      round: 1,
      stepLength: 1,
      walkedSteps: 0,
      direction: 'right',
    }
  }

  next.walkedSteps = walkedSteps + 1;

  if (walkedSteps === stepLength) {
    if (previousRound === 2) {
      next.stepLength = (stepLength + 1);
      next.round = 1;
    } else {
      next.round = previousRound + 1;
    }

    next.direction = nextDirection(previousDirection);
    next.walkedSteps = 1;
  } else {
    next.direction = previousDirection;
    next.stepLength = stepLength;
  }

  const nextPosition = {
    up:     { y: y + 1, x       },
    down:   { y: y - 1, x       },
    left:   { y,        x: x - 1},
    right:  { y,        x: x + 1},
  }[next.direction];
  
  return Object.assign({}, next, nextPosition);
}

function nextDirection(direction) {
  return {
    up: 'left',
    left: 'down',
    down: 'right',
    right: 'up',
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

function grid(initial) {
  const data = initial ? initial : [[1]];

  function grow() {
    data.forEach(line => {
      line.unshift(0);
      line.push(0);
    });
    data.unshift([...Array(data[0].length)].map(() => 0));
    data.push([...Array(data[0].length)].map(() => 0));
  }
  
  function print() {
    console.log('[[ GRID ]]')
    for (let i = data.length - 1; i >= 0; --i) {
      console.log(data[i]);
    }
    console.log();
  }

  function origo() {
    return Math.ceil(data.length / 2) - 1;
  }

  function spiral(until, setter) {
    function walk(y, x, round, stepLength, walkedSteps, direction) {
      if (data.length <= (Math.abs(x) + origo() + 1)|| data.length <= (Math.abs(y) + origo() + 1)) {
        grow();
      }
  
      const nY = y + origo();
      const nX = x + origo();
      data[nY][nX] = setter(nY, nX, data);
      print();
      if (until(nY, nX, data)) {
        return {
          y: nY,
          x: nY,
          value: data[nY][nX],
        };
      }

      const next = calculateNextStep(y, x, round, stepLength, walkedSteps, direction);
      return walk(next.y, next.x, next.round, next.stepLength, next.walkedSteps, next.direction);
    }

    return walk(0, 0, 0, 0, 0, 'down');
  }

  return {
    grow,
    print,
    data,
    origo,
    spiral,
  }
}

const g = grid();
g.print();

let i = 0;
console.log(g.spiral(
  (y, x, data) => data[y][x] > 347991,
  (y, x, data) => {
    const surrounding = 
      data[y + 1][x - 1]  + data[y + 1][x]  + data[y + 1][x + 1] +
      data[y    ][x - 1]  + data[y    ][x]  + data[y    ][x + 1] +
      data[y - 1][x - 1]  + data[y - 1][x]  + data[y - 1][x + 1];
    //console.log(data[y - 1][x - 1]  , data[y - 1][x]  , data[y - 1][x + 1]);
    //console.log(data[y    ][x - 1]  , data[y    ][x]   , data[y    ][x + 1]);
    //console.log(data[y + 1][x - 1]  , data[y + 1][x]  , data[y + 1][x + 1]);
    //console.log('surrounding: ', surrounding);
    return surrounding;
  }
));