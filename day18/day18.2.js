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

  // console.log(state.name, instruction, x, typeof value === 'undefined' ? '' : value, '\t\t\t\t', state.queue.length, '\t\t', state.otherState.queue.length);
  if (!state[x]) {
    state[x] = 0;
  }

  return {
    snd: () => {
      state.position = state.position + 1;
      state.sendCounter = state.sendCounter + 1;
      state.otherState.queue.push(/^(-|\d)+$/.test(x) ? parseInt(x, 10) : state[x]);

      return state;
    },
    set: () => {
      state.position = state.position + 1;
      state[x] = value;
      return state;
    },
    add: () => {
      state.position = state.position + 1;
      state[x] = state[x] + value;
      return state;
    },
    mul: () => {
      state.position = state.position + 1;
      state[x] = state[x] * value;
      return state;
    },
    mod: () => {
      state.position = state.position + 1;
      state[x] = state[x] % value;
      return state;
    },
    rcv: () => {
      if (state.queue.length) {
        state[x] = state.queue.shift();
        state.position = state.position + 1;
        return state;
      }
      
      if (state.otherState.waitingForInput) {
        console.log('DEADLOCK', state.name, 'send counter', state.sendCounter);
        console.log('DEADLOCK', state.otherState.name, 'send counter', state.otherState.sendCounter);
        process.exit(0);
      }

      state.waitingForInput = true;
      return state;
    },
    jgz: () => {
      const check = /^(-|\d)+$/.test(x) ? parseInt(x, 10) : state[x];
      if (check > 0) {
        state.position = state.position + value;
      } else {
        state.position = state.position + 1;
      }

      return state;
    },
  }[instruction]();
}

function solve(instructions, state0, state1) {
  do {
    if (state0.position >= instructions.length || state1.position >= instructions.length) {
      console.log(`program ended at position ${state0.position}`);
      console.log(`program ended at position ${state1.position}`);
      return {
        state0,
        state1,
      };
    }
    const curr0 = instructions[state0.position];
    const curr1 = instructions[state1.position];
    invoke(curr0.instruction, curr0.x, curr0.y, state0);
    invoke(curr1.instruction, curr1.x, curr1.y, state1);
  }
  while(true);
}

fs.readFile(inputFile, (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const input = data.toString().split('\n').map(parse);
  const state0 = { p: 0, position: 0, queue: [], sendCounter: 0, name: 'CORE-0' };
  const state1 = { p: 1, position: 0, queue: [], sendCounter: 0, name: 'CORE-1' };

  state0.otherState = state1;
  state1.otherState = state0;
  console.log(solve(input, state0, state1));
});
