function reverse(numbers, length, currentPosition) {
  const spillOver = numbers.length - currentPosition - length;
  if (spillOver < 0) {
    const left = numbers.slice(currentPosition).concat(numbers.slice(0, Math.abs(spillOver))).reverse();
    const right = numbers.slice(Math.abs(spillOver), currentPosition);
    const leftWrapped0 = left.slice(0, left.length + spillOver);
    const leftWrapped1 = left.slice(spillOver);
    return leftWrapped1.concat(right).concat(leftWrapped0);
  }

  const left = numbers.slice(currentPosition, currentPosition + length).reverse();
  const right0 = numbers.slice(currentPosition + length);
  const right1 = numbers.slice(0, currentPosition);
  return right1.concat(left).concat(right0);
}

function knotHash(listSize, input, passes = 64) {
  const lengths = getLengths(input);
  let numbers = [...Array(listSize).keys()];
  let currentPosition = 0;
  let skipSize = 0;

  for (let i = 0; i < passes; i++) {
    lengths.forEach(length => {
      if (length > 1) {
        const newNumbers = reverse(numbers, length, currentPosition);
        numbers = newNumbers;  
      }

      currentPosition = currentPosition + length + skipSize;
      while (currentPosition > numbers.length) {
        currentPosition = currentPosition - numbers.length;
      } 
  
      ++skipSize;
    });
  }
  
  const denseHash = calculateDenseHash(numbers);

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

module.exports = knotHash;
