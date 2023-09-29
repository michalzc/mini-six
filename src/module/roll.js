import { identity, logObject } from './utils.js';

// eslint-disable-next-line no-unused-vars
export async function skillRoll(skill, attribute, actor) {
  const dice = skill.rollValue.dice;
  const pips = skill.rollValue.pips;

  const rollString = [
    (dice > 1 && [`${dice - 1}d6`]) || [],
    (dice > 0 && ['d6x6']) || [],
    (pips > 0 && [`${pips}`]) || [],
  ]
    .flatMap(identity)
    .join(' + ');

  const roll = await new Roll(rollString).evaluate();
  const renderedRoll = await roll.render();

  const content = [attributeLabel(attribute), skillLabel(skill), [renderedRoll]].flatMap(identity).join('<br>');

  const messageData = {
    type: CONST.CHAT_MESSAGE_TYPES.ROLL,
    flavor: game.i18n.format('MiniSix.Rolls.skillRoll', { skill: skill.name, attribute: attribute.label }),
    content,
    rolls: [roll],
    speaker: logObject('Speaker', ChatMessage.getSpeaker({ actor })),
  };
  return ChatMessage.create(messageData);
}

// eslint-disable-next-line no-unused-vars
export function attributeRoll(attribute, actor) {}

// export async function roll(rollType, )

function attributeLabel(attribute) {
  const dice = attribute.value.dice ?? 0;
  const pips = attribute.value.pips ?? 0;
  if (attribute.name !== 'none' && (dice > 0 || pips > 0)) {
    const rollString = [(dice > 0 && [`${dice}d6`]) || [], (pips > 0 && [`${pips}`]) || []]
      .flatMap(identity)
      .join(' + ');
    return [`${attribute.label}: ${rollString}`];
  } else {
    return [];
  }
}

function skillLabel(skill) {
  const dice = skill.value.dice ?? 0;
  const pips = skill.value.pips ?? 0;
  if (dice > 0 || pips > 0) {
    const rollString = [(dice > 0 && `${dice}d6`) || [], (pips > 0 && `${pips}`) || []].flatMap(identity).join(' + ');
    return [`${skill.name}: ${rollString}`];
  } else {
    return [];
  }
}
