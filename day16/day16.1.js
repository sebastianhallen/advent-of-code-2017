require('../lib/array-extensions');
const fs = require('fs');
const inputFile = process.argv.pop();

function spin(size) {
  return list => {
    const spinners = list.splice(list.length - size);
    spinners.reverse().forEach(s => list.unshift(s));
  };
}

function exchange(a, b) {
  return list => {
    const aValue = list[a];
    const bValue = list[b];
    list[b] = aValue;
    list[a] = bValue;
  };
}

function partner(a, b) {
  return list => {
    const aPosition = list.indexOf(a);
    const bPosition = list.indexOf(b);
    const aValue = list[aPosition];
    const bValue = list[bPosition];
    list[bPosition] = aValue;
    list[aPosition] = bValue;
  };
}

function parse(line) {
  const spinPattern = /^s(\d+)$/;
  const exchangePattern = /^x(\d+)\/(\d+)$/;
  const partnerPattern = /^p([^/]+)\/(.+)$/;

  return line.split(',').map(move => {
    if (spinPattern.test(move)) {
      const size = parseInt(spinPattern.exec(move)[1], 10);
      return spin(size);
    }

    if (exchangePattern.test(move)) {
      const match = exchangePattern.exec(move);
      const a = parseInt(match[1], 10);
      const b = parseInt(match[2], 10);
      return exchange(a, b);
    }

    if (partnerPattern.test(move)) {
      const match = partnerPattern.exec(move);
      const a = match[1];
      const b = match[2];
      return partner(a, b);
    }

    throw new Error(`invalid move: ${move}`);
  });
}

function lineup(size) {
  return [...Array(size).keys()]
    .map(i => String.fromCharCode(i + 'a'.charCodeAt()));
}

const sample = lineup(5);
parse('s1,x3/4,pe/b').map(move => move(sample));
console.log(sample.join(''));


fs.readFile(inputFile, (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const programs = lineup(16);
  parse(data.toString()).map(move => move(programs));
  console.log(programs.join(''));
});
