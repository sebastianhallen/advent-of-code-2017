function reverse(numbers, length, currentPosition) {
  const spillOver = numbers.length - currentPosition - length;
  console.log(`current position: ${currentPosition}`);
  console.log(`length: ${length}`);
  console.log(`spillover: ${spillOver}`)
  if (spillOver < 0) {
    const left = numbers.slice(currentPosition).concat(numbers.slice(0, Math.abs(spillOver))).reverse();
    const right = numbers.slice(Math.abs(spillOver), currentPosition);
    const leftWrapped0 = left.slice(0, left.length + spillOver);
    const leftWrapped1 = left.slice(spillOver);
    console.log(`${leftWrapped1.join(' ')}) ${right.join(' ')} (${leftWrapped0.join(' ')}`);
    return leftWrapped1.concat(right).concat(leftWrapped0);
  }

  const left = numbers.slice(currentPosition, currentPosition + length).reverse();
  const right0 = numbers.slice(currentPosition + length);
  const right1 = numbers.slice(0, currentPosition);
  console.log(`${right1.join(' ')} (${left.join(' ')}) ${right0.join(' ')}`)
  return right1.concat(left).concat(right0);
}

function solve(listSize, lengths) {
  let numbers = [...Array(listSize).keys()];
  let currentPosition = 0;
  let skipSize = 0;
  lengths.forEach(length => {
    if (length >= numbers.length) {
      return;
    }

    if (length > 1) {
      const newNumbers = reverse(numbers, length, currentPosition);
      console.log(`${numbers} -> ${newNumbers}`);
      numbers = newNumbers;  
    }
    

    currentPosition = currentPosition + length + skipSize;
    if (currentPosition > numbers.length) {
      currentPosition = currentPosition - numbers.length;
    } 

    ++skipSize;
    console.log(`current position: ${currentPosition}`);
    console.log(`skipSize: ${skipSize}`);
    console.log(numbers.map((n, i) => i === currentPosition ? `[${n}]` : n).join(' '));
    console.log();
  });

  
  console.log(numbers[0], numbers[1], '=>', numbers[0] * numbers[1]);
}

solve(5, [3, 4, 1, 5]);
solve(10, [3, 8, 7, 2, 9, 5]);
solve(256, [70,66,255,2,48,0,54,48,80,141,244,254,160,108,1,41]);
