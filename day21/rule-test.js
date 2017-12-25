const fs = require('fs');
const rule = require('./rule');

function parse(line) {
  const match = /([./#]+) => ([./#]+)/.exec(line);

  return rule(match[1], match[2]);
}

const rules2 = [
  rule('../..', '###/##./##'),
  rule('#./..', '.##/###/...'),
  rule('##/..', '##./###/#..'),
  rule('.#/#.', '.##/#.#/###'),
  rule('##/#.', '.#./###/#..'),
  rule('##/##', '.../#.#/...'),
];

const rules3 = [
  rule('.../.../...', '.#../#.#./..##/.###'),
  rule('#../.../...', '...#/#..#/#.../#.#.'),
  rule('.#./.../...', '.###/..##/.#.#/..#.'),
  rule('##./.../...', '##.#/#.##/..#./...#'),
  rule('#.#/.../...', '.##./####/..../..#.'),
  rule('###/.../...', '...#/..../..../##.#'),
]


rules2.forEach(r => {
  console.log(r.input, r.matches);
})

rules3.forEach(r => {
  console.log(r.input, r.matches.join('\n'));
})


fs.readFile('day21.input', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const rules = data.toString().split('\n').map(parse);
  rules.forEach(r => {
    const matching = rules.filter(c => c.isMatch(r.input));
    console.log('checking: ', r.input, matching[0].input)
    if (matching.length !== 1 || r.input !== matching[0].input) {
      console.log(r)
      console.log(matching);
      throw new Error('rule mismatch');
    }
  });

  console.log('all rules unique')
});