import { SYSTEM_NAME } from './consts.js';

export const log = console.log.bind(undefined, `${SYSTEM_NAME} |`);

export const logObject = (message, object) => {
  log(message, object);
  return object;
};

export const identity = (id) => id;

/* dice utils */

/**
 * @typedef {object} DiceValue
 * @property {number} [dice]  Number of dice in roll
 * @property {number} [pips]  Number of pips in roll
 * @property {number} [flat]  The flat modifier, not converted to dice
 */

/**
 * Normalize DiceValue, converts pips to dice
 * @param {DiceValue} diceValue
 * @param {boolean} roundToZero round lower than zero values to zero
 * @returns {DiceValue}
 */
export function normalizeDice(diceValue, roundToZero = true) {
  const dice = diceValue.dice ?? 0;
  const pips = diceValue.pips ?? 0;
  const flat = diceValue.flat ?? 0;
  const extraDice = Math.floor(pips / 3);
  const remainingPips = (pips % 3) + flat;
  let newDice = dice + extraDice;
  return {
    dice: (roundToZero && Math.max(newDice, 0)) || dice,
    pips: (roundToZero && Math.max(remainingPips, 0)) || remainingPips,
  };
}

/**
 * Return string representation of DiceValue
 * @param diceValue
 * @returns {string}
 */
export function formatDice(diceValue) {
  const dice = (dv) => (dv?.dice && [`${dv.dice}&nbsp;<i class="fas fa-dice-d6"></i>`]) || [];
  const pips = (dv) => (dv?.pips && [dv.pips.toString()]) || [];
  const flat = (dv) => (dv?.flat && [dv.flat.toString()]) || [];

  return [dice(diceValue), pips(diceValue), flat(diceValue)].deepFlatten().join(' + ');
}

/**
 * Combines and normalize number of dice
 * @param {...DiceValue} args
 * @returns {DiceValue}
 */
export function combineDice(...args) {
  return args.reduce(
    (acc, diceValue) => {
      const newDice = diceValue?.dice ?? 0;
      const newPips = diceValue?.pips ?? 0;
      const newFlat = diceValue?.flat ?? 0;

      return { dice: newDice + acc.dice, pips: newPips + acc.pips, flat: newFlat + acc.flat };
    },
    { dice: 0, pips: 0, flat: 0 },
  );
}
