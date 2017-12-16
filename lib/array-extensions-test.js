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

function throws(check, expected, extension) {
  try {
    check();
  } catch (error) {
    test(() => error.message, expected, extension);
    return;
  }

  console.log(`${extension} is broken: ${check} doesn't throw.`);
  process.exit(0);
}


test(() => [1, 2, 3].sum(), 6, 'sum');
test(() => [{a: 1}, {a: 2}, {a: 3}].sum(x => x.a), 6, 'sum');
test(() => [1, 1, 1, 1].unique(), [1], 'unique');
test(() => [1, 1, 2, 2, 1].unique(), [1, 2], 'unique');
test(() => [{a: 1}, {a: 1, note: 'will be removed'}, {a: 2}, {a: 1, note: 'will be removed'}].unique(x => x.a), [{a: 1}, {a: 2}], 'unique');
test(() => [1, 2, 3].last(), 3, 'last');
test(() => [{a: '1', b: 'b'}, {a: '2'}, {a: '1'}, {a: 'b'}].groupBy(x => x.a), {
  '1': [{a: '1', b: 'b'},  {a: '1'}],
  '2': [{a: '2'}],
  'b': [{a: 'b'}],
}, 'groupBy');
throws(() => [{a: 2}].groupBy(x => x.a), "group by key must be a string -- '2' (number) will not work...", 'groupBy');
test(() => [1, 2, 3, 4, 5].circularSlice(3, 6), [4, 5, 1, 2], 'circularSlice');
test(() => [1, 2, 3, 4, 5].circularSlice(3, 2), [4, 5, 1, 2, 3], 'circularSlice')
test(() => [1, 2, 3, 4, 5].circularSlice(3, 12), [4, 5, 1, 2, 3], 'circularSlice')

console.log('everything is ok');