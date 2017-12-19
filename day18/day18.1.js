require('../lib/array-extensions');
const fs = require('fs');
const inputFile = process.argv.pop();

function parse(line) {
  const parsed = /^([a-z]+) ([^ ]+)\s*([a-z]+|[0-9-]+)*$/.exec(line)
  if (!parsed) {
    console.log(line)
    process.exit(0)
  }

  return {
    instruction: parsed[1],
    x: parsed[2],
    y: parsed[3],
  };
}

function invoke(instruction, x, y, state) {
  const value = /^(-|\d)+$/.test(y) ? parseInt(y, 10) : state[y];
  console.log(state.position, instruction, x, value);
  if (!state[x]) {
    state[x] = 0;
  }

  state.position = state.position + 1;
  return {
    snd: () => {
      state.played.push(state[x]);
      return state;
    },
    set: () => {
      state[x] = value;
      return state;
    },
    add: () => {
      state[x] = state[x] + value;
      return state;
    },
    mul: () => {
      state[x] = state[x] * value;
      return state;
    },
    mod: () => {
      state[x] = state[x] % value;
      return state;
    },
    rcv: () => {
      if (state[x] === 0) {
        return state;
      }

      state.recovered.push(state.played.last());
      return state;
    },
    jgz: () => {
      if (state[x] > 0) {
        state.position = state.position + value - 1;
      }

      return state;
    },
  }[instruction]();
}

function solve(instructions) {
  const state = { played: [], recovered: [], position: 0 };

  do {
    if (state.position >= instructions.length) {
      console.log(`program ended at position ${state.position}`);
      return state;
    }
    const current = instructions[state.position];
    invoke(current.instruction, current.x, current.y, state);

    if (state.recovered.length) {
      console.log(state.recovered);
      return state;
    }
  }
  while(true);
}

fs.readFile(inputFile, (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const input = data.toString().split('\n').map(parse);
  console.log(solve(input).recovered);
});
