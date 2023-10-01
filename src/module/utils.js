import { SYSTEM_NAME } from './consts.js';

export const log = console.log.bind(undefined, `${SYSTEM_NAME} |`);

export const logObject = (message, object) => {
  log(message, object);
  return object;
};

export const identity = (id) => id;

export const normalizeDice = ([dice, pips]) => {
  const extraDice = Math.floor(pips / 3);
  const remainingPips = pips % 3;
  return [Math.max(dice + extraDice, 0), Math.max(remainingPips, 0)];
};

export function formatDice(diceValue) {
  const dice = (dv) => (dv?.dice && [`${dv.dice}&nbsp;<i class="fas fa-dice-d6"></i>`]) || [];
  const pips = (dv) => (dv?.pips && [dv.pips.toString()]) || [];

  return [dice(diceValue), pips(diceValue)].deepFlatten().join(' + ');
}

export function combineDice(...args) {
  return args.reduce(
    (acc, diceValue) => {
      const newDice = diceValue?.dice ?? 0;
      const newPips = diceValue?.pips ?? 0;

      const [dice, pips] = normalizeDice([newDice + acc.dice, newPips + acc.pips]);
      return { dice, pips };
    },
    { dice: 0, pips: 0 },
  );
}
