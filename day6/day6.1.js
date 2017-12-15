const { test } = require('../lib/fluff');

const sample = [{
  input: [0, 2, 7, 0],
  answer: 0,
}];
const challenge = {
  input: [4,	10,	4,	1,	8,	4,	9,	14,	5,	1,	14,	15,	0,	15,	3,	5]
}

function mostBlocks(blocks) {
  let mostIndex = -1;
  let most = -1;

  blocks.forEach((block, index) => {
    if (block > most) {
      most = block;
      mostIndex = index;
    }
  })
  return mostIndex;
}

function redistribute(blocks, mostIndex) {
  let blocksToRedistribute = blocks[mostIndex];
  let index = mostIndex;

  console.log(`${blocks[mostIndex]} (${mostIndex}): ${blocks}`);
  blocks[mostIndex] = 0;
  while (blocksToRedistribute > 0) {
    if (++index === blocks.length) {
      index = 0;
    }

    blocks[index] += 1;
    --blocksToRedistribute;
    console.log(`${blocks[mostIndex]} (${mostIndex}): ${blocks}`);
  }
  console.log(blocks)
  return blocks;
}

function solve(blocks) {
  const seen = [];
  do {
    seen.push(blocks.join('-'));
    redistribute(blocks, mostBlocks(blocks));
    
  } while(!seen.includes(blocks.join('-')));

  return seen.length;
}

console.log(solve(sample[0].input));
console.log(solve(challenge.input));
//test(solve, sample, false, 'test 1')
//test(solve, challenge1, false, 'challenge 1');
