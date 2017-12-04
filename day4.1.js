const { test } = require('./fluff');
const fs = require('fs');

const sample1 = [{
  input: 'aa bb cc dd ee ',
  answer: 1,
}, {
  input: 'aa bb cc dd aa',
  answer: 0,
}, {
  input: 'aa bb cc dd aaa',
  answer: 1,
}];

const challenge1 = [{
  input: '',
  answer: 0,
}];

function solve(passwords) {
  const tokenFreqs = passwords.map(password =>
    password.split(' ')
    .reduce((tokens, curr) => {
      if (!tokens[curr]) {
        tokens[curr] = 1;
      } else {
        tokens[curr] += 1;
      }

      return tokens;
    }, {})
  );
  
  return tokenFreqs.filter(tokenFreq => Object.values(tokenFreq).filter(x => x !== 1).length === 0).length;
}

console.log(solve(['aa bb cc dd ee']), solve(['aa bb cc dd ee']) === 1);
console.log(solve(['aa bb cc dd aa']), solve(['aa bb cc dd aa']) === 0);
console.log(solve(['aa bb cc dd aaa']), solve(['aa bb cc dd aaa']) === 1);

fs.readFile('day4.input', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  const passwords = data.toString('utf8').split('\n');
  console.log(solve(passwords));
});
