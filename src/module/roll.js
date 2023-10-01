import { combineDice, formatDice, log, logObject } from './utils.js';
import TestRollerApp from './application/test-roller-app.js';

// eslint-disable-next-line no-unused-vars
export async function testRoll(actor, attributeName, skillId = undefined, skipDialog = false) {
  if (skipDialog) {
    const attribute = actor.attributesWithSkills[attributeName];
    const skill = (attribute.skills ?? []).find((skill) => skill.id === skillId);
    await performRoll(actor, attribute, skill);
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

export async function performRoll(actor, attribute, skill = undefined, modifier = {}, target = {}) {
  const { dice, pips } = combineDice(attribute.value, skill.value, modifier.value);

  const rollString = [
    (dice > 1 && [`${dice - 1}d6`]) || [],
    (dice > 0 && ['d6x6']) || [],
    (pips > 0 && [`${pips}`]) || [],
    (dice === 0 && pips === 0 && '0') || [],
  ]
    .deepFlatten()
    .join(' + ');

  log('RollString', rollString);

  const roll = await new Roll(rollString).evaluate();
  //
  log('Roll', roll);
  const wildDieResult = roll.dice.slice(-1)[0]?.results[0].result;
  const criticalSuccess = wildDieResult === 6;
  const complication = wildDieResult === 1;

  const outcome = getRollOutcome({ criticalSuccess, complication, total: roll.total, target });

  log('Wild Die Result', wildDieResult);
  return sendRollMessage({ attribute, skill, modifier, roll, actor, outcome });
}

function getRollOutcome(rollOutcomeData) {
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

async function sendRollMessage(rollData) {
  log('SendRollMessage', rollData);
  const { attribute, skill, modifier, roll, actor, outcome } = rollData;

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

  const flavor =
    (skill && game.i18n.format('MiniSix.Rolls.skillRoll', { skill: skill.name, attribute: attribute.label })) ||
    game.i18n.format('MiniSix.Rolls.attributeRoll', { attribute: attribute.label });
  const messageData = {
    type: CONST.CHAT_MESSAGE_TYPES.ROLL,
    flavor,
    content,
    rolls: [roll],
    speaker: logObject('Speaker', ChatMessage.getSpeaker({ actor })),
  };
  return ChatMessage.create(messageData);
}

function makeRollPart(rollObj, makeLabel) {
  const rollString = formatDice(rollObj.value);
  return (rollString && [`${makeLabel(rollObj)}: ${rollString}`]) || [];
}
