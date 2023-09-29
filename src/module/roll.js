import { log } from './utils.js';

// eslint-disable-next-line no-unused-vars
export async function skillRoll(skill, attribute, actor) {
  log('Attribute', attribute);
  // const rollString = `${skill.rollValue.dice}d6x6 + ${skill.rollValue.pips}`;
  const dice = skill.rollValue.dice;
  const pips = skill.rollValue.pips;
  const rollString = ((dice - 1 > 0 && [`${dice - 1}d6`]) || [])
    .concat((dice > 0 && ['d6x6']) || [])
    .concat((pips > 0 && [pips.toString()]) || [])
    .join(' + ');

  const roll = new Roll(rollString).evaluate({ async: false });
  const rederedRoll = await roll.render();
  const content = (
    (attribute.name !== 'none' && [`${attribute.label}: ${attribute.value.dice}d6 + ${attribute.value.pips}`]) ||
    []
  )
    .concat(`${skill.name}: ${skill.value.dice}d6 + ${skill.value.pips}`)
    .concat(rederedRoll)
    .join('<br>');
  const messageData = {
    type: CONST.CHAT_MESSAGE_TYPES.ROLL,
    flavor: game.i18n.format('MiniSix.Rolls.skillRoll', { skill: skill.name, attribute: attribute.label }),
    content,
    rolls: [roll],
  };
  return ChatMessage.create(messageData);
}

// eslint-disable-next-line no-unused-vars
export function attributeRoll(attribute, actor) {}
