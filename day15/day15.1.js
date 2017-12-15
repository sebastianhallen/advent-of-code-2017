function generator(name, factor, startingValue) {
  const previous = [startingValue];

  function next() {
    const prev = previous[previous.length - 1];
    const current = prev * factor % 2147483647;

    previous.push(current);
    return current;
  }

  return { next };
}

function judge() {
  const matches = [];

  function compare(a, b) {
    const isMatch = (0xFFFF & a) === (0xFFFF & b);
    if (isMatch) {
      matches.push({a, b});
    }
  }

  return {
    compare,
    getMatches: () => matches,
  }
}

const j = judge();
const generatorA = generator('A', 16807, 65);
const generatorB = generator('B', 48271, 8921);

console.log('--Gen. A--\t--Gen. B--');
for (let i = 0; i < 5; i++) {
  const a = generatorA.next();
  const b = generatorB.next();
  j.compare(a, b);
  console.log(`${a} \t ${b}`);
}

console.log(`matches (5 iterations): ${j.getMatches().length}`);

for (let i = 0; i < 40000000 - 5; i++) {
  const a = generatorA.next();
  const b = generatorB.next();
  j.compare(a, b);
}

console.log(`matches (40M iterations): ${j.getMatches().length}`);
