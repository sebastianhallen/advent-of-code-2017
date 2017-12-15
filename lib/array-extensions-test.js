require('./array-extensions');

function test(check, expected, extension) {
  const actual = JSON.stringify(check());
  const expectedString = JSON.stringify(expected);
  if (actual !== expectedString) {
    console.log(`${extension} is broken: ${check} returns ${actual} instead of ${expectedString}`);
    process.exit(1);
  }
  console.log(`${check} === ${expectedString} --- ok!`)
}


test(() => [1, 2, 3].sum(), 6, 'sum');
test(() => [{a: 1}, {a: 2}, {a: 3}].sum(x => x.a), 6, 'sum');
test(() => [1, 2, 1, 1, 1].any(i => i === 2), true, 'any');
test(() => [1, 2, 1, 1, 1].any(i => i === 3), false, 'any');
test(() => [1, 1, 1, 1].unique(), [1], 'unique');
test(() => [1, 1, 2, 2, 1].unique(), [1, 2], 'unique');
test(() => [{a: 1}, {a: 1}, {a: 2}, {a: 1}].unique(x => x.a === 2), [{a: 2}], 'unique');
test(() => [1, 2, 3].last(), 3, 'last');

console.log('everything is ok');