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
    //rootNode.childWeights = rootNode.children.map(child => child.weight);
    //rootNode.childWeightsDebug = JSON.stringify(rootNode.childWeights);
    return rootNode;
  }

  
  return appendChildren(root)
}

function traverse(root, visitNode, reverse = false) {
  if (reverse) {
    root.children.forEach(child => traverse(child, visitNode, reverse));
    backpropagate(root, visitNode);
  }
  else {
    visitNode(root);
    root.children.forEach(child => traverse(child, visitNode, reverse));
  }
}

function backpropagate(child, visitNode) {
  //console.log(`backpropagating from ${child.name}: ${child.parent ? child.parent.name : '()'}`);
  if (child.parent) {
    visitNode(child);
    backpropagate(child.parent, visitNode);
  }
}

function isUnbalanced(node) {
  //const childWeights = [...new Set(node.children.map(item => item.weigh))];
  const childWeights = node.children.reduce((freq, child) => {
    const id = `${child.levelWeight}`;
    if (freq[id]) freq[id] += 1;
    else freq[id] = 1;
    return freq;
  }, {});

  console.log(`${node.name}: ${JSON.stringify(childWeights)}`);
  if (Object.keys(childWeights).length > 1) {
    console.log('you done goofed');
    //console.log(node);
    
  }
  return Object.keys(childWeights).length > 1;
/*  return node.children.reduce((freq, child) => {
    const id = `${child.name}`;
    if (freq[id]) freq[id] += 1;
    else freq[id] = 1;
  }, {})*/
}

function isBalanced(node) {
  const childWeights = node.children.reduce((freq, child) => {
    const id = `${child.weight}`;
    if (freq[id]) freq[id] += 1;
    else freq[id] = 1;
    return freq;
  }, {});

  if (Object.keys(childWeights).length == 2) {
    console.log(node);
    console.log(childWeights);
  }
  return Object.keys(childWeights).length <= 1;
}

function solve(data) {  
  const tree = asTree(data);

  traverse(tree, node => {
    if (isBalanced(node)) {
      // console.log('node is balanced')
      //console.log(node);
      //console.log(node.parent);

      if (node.children.length > 0 && node.parent.children.filter(x => !isBalanced(x)).length === 0) {
        console.log('candidate')
        console.log(node.parent)
        //process.exit(0)
        //process.exit(0);
      }
      
    }
  });
return;

  traverse(tree, child => {
    if (child.children.length === 0) {
      child.levelWeight = child.weight;
    }
    const parent = child.parent;
  
    //console.log(child);
    if (parent) {
      if (parent.levelWeight) {
        //console.log(`updating parents levelWeight from ${parent.levelWeight} to ${parent.levelWeight + child.weight} (${parent.levelWeight} + ${child.weight})`);
        parent.levelWeight = parent.levelWeight + child.weight;  
      }
      else {
        //console.log(`setting parents levelWeight to ${parent.weight + child.weight} (${parent.weight} + ${child.weight})`);
        parent.levelWeight = parent.weight + child.weight;
      }
    }
    //console.log('foo')
    //console.log([...new Set(child.children.map(item => item.weight))])
  }, false);

  let n = tree;
  function foo() {
    while(isUnbalanced(n)) {
      for (let i = 0; i < n.children.length; i++) {
        n = n.children[i];
      }
    }
  } 
  foo();
  console.log(n);
  /*
  traverse(tree, node => {
    if (isUnbalanced(node))  {
      console.log('unbalanced node!')
      //console.log(childLevelWeights);
      console.log(node);
      //console.log(`diff: ${childLevelWeights[0]} - ${childLevelWeights[1]} === ${childLevelWeights[0] - childLevelWeights[1]}`)
      //console.log(node.parent);
      //process.exit(0);
    }
  }, true);
  */
 // console.log(tree);
}

//console.log(solve(sample));

fs.readFile('day7.input', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const input = data.toString().split('\n').map(parse);
  console.log(solve(input));
});
