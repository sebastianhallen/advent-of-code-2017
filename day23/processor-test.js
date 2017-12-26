const processor = require('./processor');

const instructions = [
  'set a 10',
  'sub b 5',
  'set c a',
  'mul b -1',
  'mul b 2',
  'sub a b',
  'jnz a -2',
  //'jnz b -2',
].map(processor.parse);

const state = { position: 0 };
instructions.forEach(instr => console.log(processor.invoke(instr, state)));

state.position = 0;
do {
  if (state.position >= instructions.length || state.position < 0) {
    console.log(`program ended at position ${state.position}`);
    process.exit(0)
  }
  const current = instructions[state.position];
  processor.invoke(current, state);
  if (current.instruction === 'jnz') process.exit(0)
}
while(true);
