const { test } = require('./fluff');

const sample1 = [{
  input: '',
  answer: 0,
}, {
  input: '',
  answer: 0,
}];

const sample2 = [{
  input: '',
  answer: 0,
}, {
  input: '',
  answer: 0,
}];

const challenge1 = [{
  input: '',
  answer: 0,
}];

const challenge2 = [{
  input: '',
  answer: 0,
}];

function solve(data, isPart2) {
  return 1;
}

test(solve, sample1, false, 'test 1')
test(solve, challenge1, false, 'challenge 1');
test(solve, sample2, true, 'test 2')
test(solve, challenge2, true, 'challenge 2');
