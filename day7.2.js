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
    weight: parseInt(pattern[2], 10),
    children: pattern[4] ? pattern[4].split(',').map(c => c.trim()) : [],
  };
}

function asTree(data) {
  const nodes = data.map(node => {
    const parent = data.filter(n => n.children.includes(node.name));
    if (parent.length > 0) {
      node.parent = parent[0];
    }

    return node;
  });

  const root = nodes.filter(node => !node.parent)[0];
  function appendChildren(rootNode, level = 0) {
    rootNode.level = level;
    rootNode.children = rootNode.children.map(child => appendChildren(nodes.filter(node => node.name === child)[0], level + 1));
    rootNode.levelWeight = rootNode.weight + rootNode.children.reduce((w, child) => w + child.levelWeight, 0);
    return rootNode;
  }

  return appendChildren(root)
}

function traverse(root, visitNode) {
  visitNode(root);
  root.children.forEach(child => traverse(child, visitNode));
}

function isBalanced(node) {
  const childW = childWeights(node);
  if (childW.length > 1) {
    return false;
  }

  return true;
}

function childWeights(node) {
  const childWeights = [...new Set(node.children.map(c => c.levelWeight))];
  return childWeights;
}

function solve(data) {  
  const tree = asTree(data);
  let minLevelWeight = tree.levelWeight;
  let minLevelWeightParent = tree;

  traverse(tree, node => {
    if (isBalanced(node) && !isBalanced(node.parent) && minLevelWeight > node.parent.levelWeight) {
      if (minLevelWeight > node.parent.levelWeight) {
        minLevelWeight = node.parent.levelWeight;
        minLevelWeightParent = node.parent;
      }
    }
  });

  console.log(`one of the following nodes has the wrong weight: 
${minLevelWeightParent.children.map(c => `${c.name} ${c.levelWeight} : ${c.weight}`).join('\n')}  
`);
}

fs.readFile('day7.input', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const input = data.toString().split('\n').map(parse);
  console.log(solve(input));
});
