const { test } = require('../lib/fluff');
const fs = require('fs');

const sample1 = [{
  input: ['abcde fghij'],
  answer: 1,
}, {
  input: ['abcde xyz ecdab'],
  answer: 0,
}, {
  input: ['a ab abc abd abf abj'],
  answer: 1,
}, {
  input: ['iiii oiii ooii oooi oooo'],
  answer: 1,
}, {
  input: ['iiii oiii ooii oooi oooo'],
  answer: 1,
}, {
  input: ['oiii ioii iioi iiio'],
  answer: 0,
}];

function hasAnagrams(password) {
  const sortedTokens = password.split(' ').map(token => token.split('').sort().join('')).join(' ');
  console.log(countTokensFreq(password))

  Object.keys(countTokensFreq(data)).map(token => token.split('').join(''))
  console.log(`sorted: ${sortedTokens}`);
  return countTokensFreq(sortedTokens) === 1;
}


function solve(passwords) {
  const tokenFreqs = passwords.map(password =>
    password.split(' ')
    .reduce((tokens, currUnsorted) => {
      const curr = currUnsorted.split('').sort().join('');
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
sample1.forEach(s => console.log(solve(s.input), solve(s.input) === s.answer));
fs.readFile('day4.input', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  const passwords = data.toString('utf8').split('\n');
  console.log(solve(passwords));
});
