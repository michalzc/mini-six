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
  return [dice + extraDice, remainingPips];
};
