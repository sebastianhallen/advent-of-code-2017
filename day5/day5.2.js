const { test } = require('../lib/fluff');
const fs = require('fs');

const sample = {
  input: [0, 3, 0, 1, -3],
  answer: 1,
};

function print(instructions, pointer) {
  console.log(instructions.map((instruction, i) => i === pointer ? `(${instruction})` : instruction));
}

function modifyInstruction(instruction) {
  if (instruction >= 3) {
    return instruction - 1;
  }
  return instruction + 1;
}

function solve(instructions) {
  let pointer = 0;
  for(let i = 1; true; i++) {
    //print(instructions, pointer);
    instruction = instructions[pointer];
    instructions[pointer] = modifyInstruction(instructions[pointer]);
    
    pointer += instruction;

    if (pointer >= instructions.length) {
      //print(instructions);
      return i;
    }
  }
}

console.log(solve(sample.input))

fs.readFile('day5.input', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  console.log(solve(data.toString().split('\n').map(i => parseInt(i, 10))));
});