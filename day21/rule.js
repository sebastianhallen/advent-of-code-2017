module.exports = rule;

function rule(input, output) {
  if (input.length < 5) {
    console.log(input)
    throw new Error('invalid rule input');
  } 

  if (output.length < 5) {
    console.log(output)
    throw new Error('invalid rule output');
  } 
  const matches = [input];
  let rotate;
  let flip;

  if (input.length === 5) {
    rotate = start => {
      const chars = start.split('').filter(c => c !== '/');
      return `${chars[2]}${chars[0]}/${chars[3]}${chars[1]}`;
    };

    flip = start => {
      const chars = start.split('').filter(c => c !== '/');
      return `${chars[1]}${chars[0]}/${chars[3]}${chars[2]}`;
    };
  } else {
    rotate = start => {
      const chars = start.split('').filter(c => c !== '/');
      
      return [
        `${chars[6]}${chars[3]}${chars[0]}`,
        `${chars[7]}${chars[4]}${chars[1]}`,
        `${chars[8]}${chars[5]}${chars[2]}`
      ].join('/');
    };

    flip = start => {
      const chars = start.split('').filter(c => c !== '/');
      
      return [
        `${chars[2]}${chars[1]}${chars[0]}`,
        `${chars[5]}${chars[4]}${chars[3]}`,
        `${chars[8]}${chars[7]}${chars[6]}`
      ].join('/');
    };
  }


  let rotation = input;
  let flipped = flip(input);

  for (let i = 0; i < 4; i++) {
    flipped = flip(rotation);
    rotation = rotate(rotation);

    if (!matches.includes(rotation)) {
      matches.push(rotation);
    }

    if (!matches.includes(flipped)) {
      matches.push(flipped);
    }
  }

  function isMatch(sqr) {
    return matches.some(r => r === sqr);
  }

  return {
    isMatch,
    matches,
    input,
    output,
  }
}

