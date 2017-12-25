const fs = require('fs');
const rule = require('./rule');
const square = require('./square');

function parse(line) {
  const match = /([./#]+) => ([./#]+)/.exec(line);

  return rule(match[1], match[2]);
}

/*
  xxy|yzz
  xxy|yzz
  xxy|yzz
  ---+---
  aab|bcc
  aab|bcc
  aab|bcc

  xx|yy|zz
  xx|yy|zz
  --+--+--
  xx|yy|zz
  aa|bb|cc
  --+--+--
  aa|bb|cc
  aa|bb|cc

  xxyyzz/xxyyzz/xxyyzz/aabbcc/aabbcc/aabbcc

*/

const sqr6 = square('abc123/def456/ijk789/lmn0AB/opqCDE/rstF01');
console.log(JSON.stringify(sqr6.partition()));


fs.readFile('day21.input', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const rules = data.toString().split('\n').map(parse);
  let sqr = square('.#./..#/###');
  sqr.print();
  let i = 0;
  while(i++ < 18) {
    sqr = sqr.enhance(rules);
    sqr.print();
    console.log(i)
  }

  console.log(sqr.data.split('').filter(x => x === '#').length);
  // too high 2813946
});
