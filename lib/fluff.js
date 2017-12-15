const chalk = require('chalk');

function fail(text) {
  const cross = chalk.red('x');
  console.log(`${cross} ${text}`);
}

function success(text) {
  const checkmark = chalk.green('v');
  console.log(`${checkmark} ${text}`);
}

function header(text) {
  console.log(chalk.bold.white(`\n[[ ${text} ]]`));
}

function test(solve, data, headerText) {
  header(headerText);
  data.forEach(d => {
    const answer = solve(d);
    const output = `${JSON.stringify(d.input)} => ${d.answer}?\n${d.answer} ${answer === d.answer ? '=' : '!'}== ${answer}`;
    if (answer === d.answer) success(output);
    else fail(output);
  });
}

module.exports = {
  test,
  success,
  header,
  fail,
};
