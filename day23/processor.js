require('../lib/array-extensions');

let mulCount = 0;
module.exports = {
  parse,
  invoke,
  mulCount: () => mulCount,
}

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

function invoke(cmd, state) {
  const instruction = cmd.instruction;
  const x = cmd.x;
  const y = cmd.y;
  const value = /^(-|\d)+$/.test(y) ? parseInt(y, 10) : state[y];
  console.log(state.position, instruction, x, value);
  if (!state[x]) {
    state[x] = 0;
  }

  return {
    set: () => {
      state[x] = value;
      state.position = state.position + 1;
      return state;
    },
    sub: () => {
      state[x] = state[x] - value;
      state.position = state.position + 1;
      return state;
    },
    mul: () => {
      state[x] = state[x] * value;
      ++mulCount;
      state.position = state.position + 1;
      return state;
    },
    jnz: () => {
      const check = /^(-|\d)+$/.test(x) ? parseInt(x, 10) : state[x];
      if (check !== 0) {
        state.position = state.position + value;
      } else {
        state.position = state.position + 1;
      }

      return state;
    },
  }[instruction]();

  return state;
}
