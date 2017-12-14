function reverse(numbers, length, currentPosition) {
  const spillOver = numbers.length - currentPosition - length;
  //console.log(`current position: ${currentPosition}`);
  //console.log(`length: ${length}`);
  //console.log(`spillover: ${spillOver}`)
  if (spillOver < 0) {
    const left = numbers.slice(currentPosition).concat(numbers.slice(0, Math.abs(spillOver))).reverse();
    const right = numbers.slice(Math.abs(spillOver), currentPosition);
    const leftWrapped0 = left.slice(0, left.length + spillOver);
    const leftWrapped1 = left.slice(spillOver);
    //console.log(`${leftWrapped1.join(' ')}) ${right.join(' ')} (${leftWrapped0.join(' ')}`);
    return leftWrapped1.concat(right).concat(leftWrapped0);
  }

  const left = numbers.slice(currentPosition, currentPosition + length).reverse();
  const right0 = numbers.slice(currentPosition + length);
  const right1 = numbers.slice(0, currentPosition);
  //console.log(`${right1.join(' ')} (${left.join(' ')}) ${right0.join(' ')}`)
  return right1.concat(left).concat(right0);
}

function solve(listSize, input, passes = 64) {
  const lengths = getLengths(input);
  let numbers = [...Array(listSize).keys()];
  let currentPosition = 0;
  let skipSize = 0;

  for (let i = 0; i < passes; i++) {
    lengths.forEach(length => {
      if (length > 1) {
        const newNumbers = reverse(numbers, length, currentPosition);
        numbers = newNumbers;  
      } else {
        //console.log(`length: ${length}`);
        //console.log(`numbers.length: ${numbers.length}`);
        //throw new Error('something is not right');
      }

      currentPosition = currentPosition + length + skipSize;
      while (currentPosition > numbers.length) {
        currentPosition = currentPosition - numbers.length;
      } 
  
      ++skipSize;
      //console.log(`current position: ${currentPosition}`);
      //console.log(`skipSize: ${skipSize}`);
      //console.log(numbers.map((n, i) => i === currentPosition ? `[${n}]` : n).join(' '));
      //console.log();
    });
  }
  
  const denseHash = calculateDenseHash(numbers);
  console.log(numbers[0], numbers[1], '=>', numbers[0] * numbers[1]);
  console.log(`dense hash: ${denseHash}`);

  return denseHash;
}

function getLengths(input) {
  return input.split('').map(c => c.charCodeAt()).concat(17, 31, 73, 47, 23);
}

function calculateDenseHash(numbers) {
  const chunks = chunk(numbers, 16);
  const xoredChunks = xorChunks(chunks);
  return xoredChunks.reduce((hash, curr) => hash + toHex(curr), '');
}

function assembleHash(digits) {
  return digits.reduce((hash, curr) => hash + toHex(curr), '');
}

function xorChunks(chunks) {
  return chunks.map(chunk => chunk.reduce((prev, curr) => prev ^curr));
}

function chunk(list, size) {
  return list.reduce((chunks, curr) => {
    const leftInLastChunk = size - chunks[chunks.length - 1].length;
    if (leftInLastChunk === 0) {
      chunks.push([]);
    }
    chunks[chunks.length - 1].push(curr);
    return chunks;
  }, [[]])
}

function toHex(number) {
  const unpadded = number.toString(16);

  return unpadded.length === 1 ? `0${unpadded}` : unpadded;
}


console.log('""', solve(256, '', 64) === 'a2582a3a0e66e6e86e3812dcb672a272');
console.log('"AoC 2017"', solve(256, 'AoC 2017', 64) === '33efeb34ea91902bb2f59c9920caa6cd');
console.log('"1,2,3"', solve(256, '1,2,3', 64) === '3efbe78a8d82f29979031a4aa0b16a9d');
console.log('"1,2,4"', solve(256, '1,2,4', 64) === '63960835bcdc130f0b66d7ff4f6a5a8e');
console.log('70,66,255,2,48,0,54,48,80,141,244,254,160,108,1,41', solve(256, '70,66,255,2,48,0,54,48,80,141,244,254,160,108,1,41', 64));
