#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const obfuscationMethods = [
  (number_) => number_.replaceAll(/\d/g, (d) => String.fromCodePoint(0x1_D7_F6 + Number.parseInt(d))), // 1. Mathematical Bold Digits
  (number_) => number_.replaceAll(/\d/g, (d) => String.fromCodePoint(0xFF_10 + Number.parseInt(d))),  // 2. Fullwidth Digits
  (number_) => number_.replaceAll(/\d/g, (d) => ['⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹'][d]), // 3. Superscript Digits
  (number_) => number_.replaceAll(/\d/g, (d) => ['₀', '₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈', '₉'][d]), // 4. Subscript Digits
  (number_) => number_.replaceAll(/\d/g, (d) => String.fromCodePoint(0x24_60 + Number.parseInt(d) - 1)), // 5. Circled Digits
  (number_) => number_.replaceAll(/\d/g, (d) => String.fromCodePoint(0x24_74 + Number.parseInt(d) - 1)), // 6. Parenthesized Digits
  (number_) => number_.replaceAll(/\d/g, (d) => String.fromCodePoint(0x24_EA + Number.parseInt(d))), // 7. Double Circled Digits
  (number_) => number_.replaceAll(/\d/g, (d) => String.fromCodePoint(0x27_76 + Number.parseInt(d) - 1)), // 8. Dingbat Digits
  (number_) => number_.replaceAll(/\d/g, (d) => String.fromCodePoint(0x06_60 + Number.parseInt(d))), // 9. Arabic-Indic Digits
  (number_) => number_.replaceAll(/\d/g, (d) => String.fromCodePoint(0x0B_E6 + Number.parseInt(d))), // 10. Tamil Digits
  (number_) => number_.replaceAll(/\d/g, (d) => String.fromCodePoint(0x13_69 + Number.parseInt(d) - 1)), // 11. Ethiopic Digits
  (number_) => number_.replaceAll(/\d/g, (d) => String.fromCodePoint(0x0A_E6 + Number.parseInt(d))), // 12. Gujarati Digits
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
      choices: [...[...Array.from({length: 12}).keys()].map((index) => (index + 1).toString()), 'random'],
      default: 'random',
      describe: 'Obfuscation method (1-12) or "random"',
      type: 'string',
    })
    .help()
    .argv;

  let { method, number } = argv;
  if (!/^\d+$/.test(number)) {
    console.error('Error: The first argument must be a number.');
    process.exit(1);
  }

  method = method === 'random' ? Math.floor(Math.random() * 12) + 1 : Number.parseInt(method);

  const obfuscated = obfuscationMethods[method - 1](number);
  console.log(`${obfuscated}`);
}

main();