#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const obfuscationMethods = [
  (num) => num.replace(/\d/g, (d) => String.fromCodePoint(0x1D7F6 + parseInt(d))), // 1. Mathematical Bold Digits
  (num) => num.replace(/\d/g, (d) => String.fromCodePoint(0xFF10 + parseInt(d))),  // 2. Fullwidth Digits
  (num) => num.replace(/\d/g, (d) => ['⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹'][d]), // 3. Superscript Digits
  (num) => num.replace(/\d/g, (d) => ['₀', '₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈', '₉'][d]), // 4. Subscript Digits
  (num) => num.replace(/\d/g, (d) => String.fromCodePoint(0x2460 + parseInt(d) - 1)), // 5. Circled Digits
  (num) => num.replace(/\d/g, (d) => String.fromCodePoint(0x2474 + parseInt(d) - 1)), // 6. Parenthesized Digits
  (num) => num.replace(/\d/g, (d) => String.fromCodePoint(0x24EA + parseInt(d))), // 7. Double Circled Digits
  (num) => num.replace(/\d/g, (d) => String.fromCodePoint(0x2776 + parseInt(d) - 1)), // 8. Dingbat Digits
  (num) => num.replace(/\d/g, (d) => String.fromCodePoint(0x0660 + parseInt(d))), // 9. Arabic-Indic Digits
  (num) => num.replace(/\d/g, (d) => String.fromCodePoint(0x0BE6 + parseInt(d))), // 10. Tamil Digits
  (num) => num.replace(/\d/g, (d) => String.fromCodePoint(0x1369 + parseInt(d) - 1)), // 11. Ethiopic Digits
  (num) => num.replace(/\d/g, (d) => String.fromCodePoint(0x0AE6 + parseInt(d))), // 12. Gujarati Digits
];

async function main() {
  const argv = yargs(hideBin(process.argv))
    .usage('Usage: $0 <number> [--method <1-12|random>]')
    .command('$0 <number>', 'Obfuscate a number using Unicode transformations', (yargs) => {
      yargs.positional('number', {
        describe: 'The number to obfuscate',
        type: 'string',
      });
    })
    .option('method', {
      alias: 'm',
      type: 'string',
      choices: [...Array(12).keys()].map((i) => (i + 1).toString()).concat(['random']),
      default: 'random',
      describe: 'Obfuscation method (1-12) or "random"',
    })
    .help()
    .argv;

  let { number, method } = argv;
  if (!number.match(/^\d+$/)) {
    console.error('Error: The first argument must be a number.');
    process.exit(1);
  }

  if (method === 'random') {
    method = Math.floor(Math.random() * 12) + 1; // Pick a random method (1-12)
  } else {
    method = parseInt(method);
  }

  const obfuscated = obfuscationMethods[method - 1](number);
  console.log(`Obfuscation Method: ${method}`);
  console.log(`Original: ${number}`);
  console.log(`Obfuscated: ${obfuscated}`);
}

main();