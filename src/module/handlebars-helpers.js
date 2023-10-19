import { formatDice } from './utils.js';

export function registerHandlebarsHelpers() {
  Handlebars.registerHelper('formatDice', function (diceValue) {
    return new Handlebars.SafeString(formatDice(diceValue));
  });

  Handlebars.registerHelper('diceForm', function (path, diceValue) {
    const form = `
<div class="dice-form">
  <input id="${path}.dice" type="number" data-dtype="Number" step="1" name="${path}.dice" value="${diceValue.dice}">
  <label for="${path}.dice"><i class="fas fa-dice-d6"></i></label>
  <label for="${path}.pips">+</label>
  <input id="${path}.pips" type="number" data-dtype="Number" step="1" min="-2" max="2" name="${path}.pips" value="${diceValue.pips}">
 </div>`;
    return new Handlebars.SafeString(form);
  });

  Handlebars.registerHelper('itemStatus', function (status) {
    const icon = CONFIG.SYSTEM.ALL_STATUSES[status]?.icon ?? '';
    return new Handlebars.SafeString(icon);
  });
}
