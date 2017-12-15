const fs = require('fs');
const sample = `pbga (66)
xhth (57)
ebii (61)
havc (66)
ktlj (57)
fwft (72) -> ktlj, cntj, xhth
qoyq (66)
padx (45) -> pbga, havc, qoyq
tknk (41) -> ugml, padx, fwft
jptl (61)
ugml (68) -> gyxo, ebii, jptl
gyxo (61)
cntj (57)`.split('\n').map(parse);

function parse(line) {
  const pattern = /^([^ ]+) \((\d+)\)\s*(|->\s*(.+))$/.exec(line);
  return {
    name: pattern[1],
    weight: pattern[2],
    children: pattern[4] ? pattern[4].split(',').map(c => c.trim()) : [],
  };
}

function solve(data) {
  const children = data
    .reduce((children, curr) => children.concat(curr.children), []);

  return data.filter(node => !children.includes(node.name));
}

fs.readFile('day7.input', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const input = data.toString().split('\n').map(parse);
  console.log(solve(input));
});

//console.log(solve(sample));
