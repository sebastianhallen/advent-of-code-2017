const processor = require('./processor');
const fs = require('fs');
const inputFile = process.argv.pop();

function solve(instructions) {
  const state = { position: 0 };

  do {
    if (state.position >= instructions.length || state.position < 0) {
      console.log(`program ended at position ${state.position}`);
      return state;
    }
    const current = instructions[state.position];
    processor.invoke(current, state);
  }
  while(true);
}

fs.readFile(inputFile, (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const input = data.toString().split('\n').map(processor.parse);
  console.log(solve(input));
  console.log('done: ', processor.mulCount());
});
