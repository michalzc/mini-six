import { formatDice } from './utils.js';

export function registerHandlebarsHelpers() {
  Handlebars.registerHelper('formatDice', function (diceValue) {
    return new Handlebars.SafeString(formatDice(diceValue));
  });
}
