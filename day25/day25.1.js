const chalk = require('chalk');

//runSample();
runReal();

function runSample() {
  // Begin in state A.
  // Perform a diagnostic checksum after 6 steps.
  const checksumThreshold = 6;
  let position = 0;
  let steps = 0;
  const tape = Tape();

  A();

  function checkDone() {
    if (steps++ >= checksumThreshold) {
      tape.print();
      console.log('done', tape.checksum());
      process.exit(0);
    }
  }

  //In state A:
  function A() {
    checkDone();
    // If the current value is 0:
    // - Write the value 1.
    // - Move one slot to the right.
    // - Continue with state B.
    if (tape.read(position) === 0) {
      tape.write(position, 1);
      ++position;
      return B();
    }

    // If the current value is 1:
    // - Write the value 0.
    // - Move one slot to the left.
    // - Continue with state B.
    if (tape.read(position) === 1) {
      tape.write(position, 0);
      --position;

      return B();
    }

    throw new Error('slipped out of state A');
  }

  // In state B:
  function B() {
    checkDone();
    //   If the current value is 0:
    //   - Write the value 1.
    //   - Move one slot to the left.
    //   - Continue with state A.
    if (tape.read(position) === 0) {
      tape.write(position, 1);
      --position;
      return A();
    }

    // If the current value is 1:
    //   - Write the value 1.
    //   - Move one slot to the right.
    //   - Continue with state A.
    if (tape.read(position) === 1) {
      tape.write(position, 1);
      ++position;
      return A();
    }

    throw new Error('slipped out of state B');
  }
}

function runReal() {
  // Begin in state A.
  let state = 'A';
  // Perform a diagnostic checksum after 12861455 steps.
  const checksumThreshold = 12861455;
  let position = 0;
  let steps = 0;
  const tape = Tape();
  const funcs = {A, B, C, D, E, F};
  while (true) {
    if (steps++ >= checksumThreshold) {
      tape.print();
      console.log('done', tape.checksum());
      process.exit(0);
    }

    state = funcs[state]();
  }
  

  //In state A:
  function A() {
    // If the current value is 0:
    if (tape.read(position) === 0) {
      //   - Write the value 1.
      //   - Move one slot to the right.
      //   - Continue with state B.
      tape.write(position, 1);
      ++position;
      return 'B'
    }
    
    // If the current value is 1:
    if (tape.read(position) === 1) {
      //   - Write the value 0.
      //   - Move one slot to the left.
      //   - Continue with state B.
      tape.write(position, 0);
      --position;
      return 'B';
    }

    throw new Error('slipped out of state A');
  }

  // In state B:
  function B() {
    // If the current value is 0:
    if (tape.read(position) === 0) {
      // - Write the value 1.
      // - Move one slot to the left.
      // - Continue with state C.
      tape.write(position, 1);
      --position;
      return 'C';
    }
    
    // If the current value is 1:
    if (tape.read(position) === 1) {
      //     - Write the value 0.
      //     - Move one slot to the right.
      //     - Continue with state E.
      tape.write(position, 0);
      ++position;
      return 'E';
    }

    throw new Error('slipped out of state B');
  }

  // In state C:
  function C() {
    // If the current value is 0:
    if (tape.read(position) === 0) {
      //     - Write the value 1.
      //     - Move one slot to the right.
      //     - Continue with state E.
      tape.write(position, 1);
      ++position;
      return 'E';
    }
    
    // If the current value is 1:
    if (tape.read(position) === 1) {
      //     - Write the value 0.
      //     - Move one slot to the left.
      //     - Continue with state D.
      tape.write(position, 0);
      --position;
      return 'D';
    }

    throw new Error('slipped out of state C');
  }

  // In state D:
  function D() {
    //   If the current value is 0:
    if (tape.read(position) === 0) {
      //     - Write the value 1.
      //     - Move one slot to the left.
      //     - Continue with state A.
      tape.write(position, 1);
      --position;
      return 'A';
    }

    //   If the current value is 1:
    if (tape.read(position) === 1) {
      //     - Write the value 1.
      //     - Move one slot to the left.
      //     - Continue with state A.
      tape.write(position, 1);
      --position;
      return 'A';
    }

    throw new Error('slipped out of state D');
  }

  // In state E:
  function E() {
    //   If the current value is 0:
    if (tape.read(position) === 0) {
//     - Write the value 0.
//     - Move one slot to the right.
//     - Continue with state A.
      tape.write(position, 0);
      ++position;
      return 'A';
    }

//   If the current value is 1:
    if (tape.read(position) === 1) {
//     - Write the value 0.
//     - Move one slot to the right.
//     - Continue with state F.
      tape.write(position, 0);
      ++position;
      return 'F';
    }

    throw new Error('slipped out of state F');
  }

// In state F:
  function F() {
//   If the current value is 0:
    if (tape.read(position) === 0) {
//     - Write the value 1.
//     - Move one slot to the right.
//     - Continue with state E.
      tape.write(position, 1);
      ++position;
      return 'E';
    }

//   If the current value is 1:
    if (tape.read(position) === 1) {
//     - Write the value 1.
//     - Move one slot to the right.
//     - Continue with state A.
      tape.write(position, 1);
      ++position;
      return 'A';
    }

    throw new Error('slipped out of state F');
  }
}

function Tape() {
  const data = [0];
  let negativeOffset = 0;

  function grow(position) {
    if ((position + negativeOffset) >= data.length) {
      data.push(0);
      return;
    }

    if ((position + negativeOffset) < 0) {
      data.unshift(0);
      ++negativeOffset;
      return;
    }
  }

  function access(position, action) {
    grow(position);
    return action(data, position + negativeOffset);
  }

  function read(position) {
    const value = access(position, (data, pos) => data[pos])
    if (typeof value === 'undefined') {
      console.log('out of bounds read', position,  negativeOffset, position + negativeOffset);
      print();
      process.exit(0);
    };
    return value;
  }

  function write(position, value) {
    access(position, (data, pos) => data[pos] = value);
  }

  function print() {
    const left = data.slice(0, negativeOffset).map(x => chalk.blue(x)).join(' ');
    const zero = data.slice(negativeOffset, negativeOffset + 1).map(x => chalk.bold(x)).join(' ');
    const right = data.slice(negativeOffset + 1).map(x => chalk.green(x)).join(' ');

    console.log('tape: ', left, zero, right);
  }

  return {
    read,
    write,
    print,
    checksum: () => data.filter(x => x === 1).length,
  };
}