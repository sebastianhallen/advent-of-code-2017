const fs = require('fs');
const rule = require('./rule');
const square = require('./square');

function parse(line) {
  const match = /([./#]+) => ([./#]+)/.exec(line);

  return rule(match[1], match[2]);
}

fs.readFile('day21.input', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const rules = data.toString().split('\n').map(parse);
  let sqr = square('.#./..#/###');
  sqr.print();
  let i = 0;
  while(i++ < 5) {
    sqr = sqr.enhance(rules);
    console.log(i)
  }

  console.log(sqr.data.split('').filter(x => x === '#').length);
});
