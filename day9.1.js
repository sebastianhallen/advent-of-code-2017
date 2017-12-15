const fs = require('fs');
const sampleIndex = parseInt(process.argv.pop(), 10);
const inputFile = process.argv.pop();


function debug() {
  if (inputFile.endsWith('.sample')) {
    console.log.apply(null, arguments);
  }
}

function parse(line) {
  const tokens = line.split('');
  
  return tokens.reduce((result, token) => {
    const state = result.state.pop();

    if (/\s/.test(token)) {
      result.state.push(state);
      return result;
    }

    if (state === 'skip') {
      return result;
    }

    if (token === '!') {
      result.state.push(state);
      result.state.push('skip');
      return result;
    }

    if (token === '<' && state !== 'garbage') {
      result.state.push(state);
      result.state.push('garbage');
      return result;
    }

    if (state === 'garbage') {
      if (token !== '>') {
        result.garbage += 1;
        result.state.push('garbage');
      }

      return result;
    }

    if (token === '{') {
      result.depth += 1;
      result.score += result.depth;
      return result;
    }

    if (token === '}') {
      result.depth -= 1;
    }
    return result;
  }, { score: 0, garbage: 0, depth: 0, state: ['root'] });
}

fs.readFile(inputFile, (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const input = data.toString().split('\n').filter((x, i) => i === sampleIndex).map(parse)[0];

  console.log(`garbage: ${input.garbage}`);
  console.log(`score: ${input.score}`);
});
