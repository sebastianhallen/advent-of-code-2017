const fs = require('fs');
const inputFile = process.argv.pop();

function parse(line) {
  const parsed = /^(.+) (inc|dec) ([-0-9]+) if (.+)$/.exec(line);
  return {
    register: parsed[1],
    op: parsed[2],
    diff: parseInt(parsed[3], 10),
    condition: parsed[4],
  };
}

function solve(instructions) {
  const registers = instructions.reduce((reg, instruction) => {
    if (!reg[instruction.register]) {
      reg[instruction.register] = 0;
    }
    return reg;
  }, {});
  
  let max = -1;

  instructions.forEach(instruction => {
    const conditionCommand = `
      ${Object.keys(registers).map(register => `const ${register} = ${registers[register]}`).join('; ')}

      ${instruction.condition};
    `;

    const condition = eval(conditionCommand);
    if (condition) {
      if (instruction.op === 'inc') {
        registers[instruction.register] += instruction.diff;
      }
      if (instruction.op === 'dec') {
        registers[instruction.register] -= instruction.diff;
      }
    }
    max = Math.max.apply(null, [max].concat(...Object.values(registers)));
  });

  const finalMax = Object.values(registers).sort().reverse()[0];
  console.log(`all time high: ${max}`);
  console.log(`final max: ${finalMax}`);
  return {
    max,
    finalMax,
  }
}

fs.readFile(inputFile, (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const input = data.toString().split('\n').map(parse);
  const answer = solve(input);
  console.log(answer);
});
