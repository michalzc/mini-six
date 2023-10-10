import { combineDice, formatDice, log, logObject, normalizeDice } from './utils.js';
import TestRollerApp from './application/test-roller-app.js';

/**
 * @typedef {Object} WithDiceValue
 * @property {DiceValue} value
 */

/**
 * @typedef {Object} RollTarget
 * @property {number} value
 * @property {string} label
 */

/**
 * @typedef {WithDiceValue} AttributeStub
 * @property {string} label
 */

/**
 * @typedef {WithDiceValue} SkillStub
 * @property {string} name
 */

/**
 *
 * @param actor
 * @param {string} attributeName
 * @param {string} skillId
 * @param {boolean} skipDialog
 * @returns {Promise<void>}
 */
// eslint-disable-next-line no-unused-vars
export async function testRoll(actor, attributeName, skillId = undefined, skipDialog = false) {
  if (skipDialog) {
    const attribute = actor.attributesWithSkills[attributeName];
    const skill = (attribute.skills ?? []).find((skill) => skill.id === skillId);
    await performRoll(actor, attribute, skill, undefined, undefined);
  } else {
    const rollData = {
      attributeName,
      skillId,
      type: 'test-roll',
      callBack: performRoll,
    };

    const testRollerApp = new TestRollerApp(actor, rollData);
    testRollerApp.render(true);
  }
}

/**
 * @param {DiceValue} diceValue
 * @returns {string}
 */
function makeRollString(diceValue) {
  const { dice, pips, flat } = diceValue;
  const mod = (pips ?? 0) + (flat ?? 0);
  return [
    (dice > 1 && [`${dice - 1}d6`]) || [],
    (dice > 0 && ['d6x6']) || [],
    (mod !== 0 && [`${mod}`]) || [],
    (dice === 0 && mod === 0 && '0') || [],
  ]
    .deepFlatten()
    .join(' + ');
}

/**
 *
 * @param {Actor} actor
 * @param {WithDiceValue} attribute
 * @param {WithDiceValue} skill
 * @param {WithDiceValue} modifier
 * @param {RollTarget} target
 * @returns {Promise<abstract.Document>}
 */
export async function performRoll(actor, attribute, skill, modifier, target) {
  const diceValue = normalizeDice(combineDice(attribute.value, skill?.value, modifier?.value));

  const rollString = makeRollString(diceValue);

  log('RollString', rollString);

  const roll = await new Roll(rollString).evaluate();

  log('Roll', roll);
  const wildDieResult = roll.dice.slice(-1)[0]?.results[0].result;
  const criticalSuccess = wildDieResult === 6;
  const complication = wildDieResult === 1;

  const outcome = getRollOutcome({ criticalSuccess, complication, total: roll.total, target });

  log('Wild Die Result', wildDieResult);
  return sendRollMessage({ attribute, skill, modifier, roll, actor, outcome, target });
}

/**
 * @typedef RollOutComeData
 * @property {boolean} criticalSuccess
 * @property {boolean} complication
 * @property {number} total
 * @property {RollTarget} target
 */

/**
 * Calculates outcome of the roll
 * @param rollOutcomeData
 * @returns {""|string}
 */
function getRollOutcome(rollOutcomeData) {
  //FIXME: refactor
  log('RollOutcomeData', rollOutcomeData);
  const { criticalSuccess, complication, total, target } = rollOutcomeData;
  const baseOutcome = (target?.value && ((total >= target.value && ['success']) || ['failure'])) || [];
  const localizedBaseOutcome = baseOutcome.map((s) => game.i18n.localize(`MiniSix.Rolls.${s}`));
  const addon =
    (criticalSuccess && [game.i18n.localize('MiniSix.Rolls.raise')]) ||
    (complication && [game.i18n.localize('MiniSix.Rolls.complication')]) ||
    [];
  const outcomeMsg = [localizedBaseOutcome, addon].deepFlatten().join(game.i18n.localize('MiniSix.Rolls.with'));
  return outcomeMsg && `<span class="roll-result ${baseOutcome[0] ?? ''}">${outcomeMsg}</span>`;
}

/**
 * @typedef {Object} RollMessageData
 * @property {WithDiceValue} attribute
 * @property {WithDiceValue} skill
 * @property {WithDiceValue} modifier
 * @property {(Roll | Promise<Roll>)} roll
 * @property {RollTarget} target
 * @property {Actor} actor
 * @property {string} outcome
 */

/**
 * Creates and sends chat message with roll result
 * @param {RollMessageData} rollMessageData
 * @returns {Promise<abstract.Document>}
 */
async function sendRollMessage(rollMessageData) {
  log('SendRollMessage', rollMessageData);
  const { attribute, skill, modifier, roll, actor, outcome, target } = rollMessageData;

  const renderedRoll = await roll.render();
  //FIXME: Roll Message Template
  const content = [
    makeRollPart(attribute, (attr) => attr.label),
    makeRollPart(skill, (skill) => skill.name),
    makeRollPart(modifier, () => game.i18n.localize('MiniSix.Rolls.modifier')),
    (outcome && [outcome]) || [],
    [renderedRoll],
  ]
    .deepFlatten()
    .join('<br>');

  const flavor = makeFlavour(skill, attribute, target);
  const messageData = {
    type: CONST.CHAT_MESSAGE_TYPES.ROLL,
    flavor,
    content,
    rolls: [roll],
    speaker: logObject('Speaker', ChatMessage.getSpeaker({ actor })),
  };
  return ChatMessage.create(messageData);
}

/**
 * @param {SkillStub} skill
 * @param {AttributeStub} attribute
 * @param {RollTarget} target
 * @returns {string}
 */
function makeFlavour(skill, attribute, target) {
  //FIXME: refactor
  const rollTitle =
    (skill && game.i18n.format('MiniSix.Rolls.skillRoll', { skill: skill.name, attribute: attribute.label })) ||
    game.i18n.format('MiniSix.Rolls.attributeRoll', { attribute: attribute.label });
  log('Target', target);
  const targetTitle =
    (target?.value && ` vs <strong>${game.i18n.localize(target.label)}(${target.value})</strong>`) || '';
  return rollTitle + targetTitle;
}

/**
 *
 * @param {WithDiceValue} withDiceValue
 * @param makeLabel function producing label
 * @returns {string[]|*[]}
 */
function makeRollPart(withDiceValue, makeLabel) {
  const rollString = formatDice(withDiceValue?.value);
  return (rollString && [`${makeLabel(withDiceValue)}: ${rollString}`]) || [];
}
