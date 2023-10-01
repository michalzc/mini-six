import { combineDice, log, logObject, normalizeDice } from '../utils.js';
import { SYSTEM_ID } from '../consts.js';

export default class MinSixActor extends Actor {
  async _preCreate(data, options, user) {
    log('Pre Create Item data', data);
    await super._preCreate(data, options, user);
    const icon = `systems/${SYSTEM_ID}/assets/icons/${data.type}.svg`;

    const setIcon = (source) =>
      foundry.utils.mergeObject(source, { img: icon, prototypeToken: { texture: { src: icon } } });
    const setActorLing = (source) =>
      (data.type === 'character' && foundry.utils.mergeObject(source, { prototypeToken: { actorLink: true } })) ||
      source;

    this.updateSource(setIcon(setActorLing({})), options);
  }

  prepareDerivedData() {
    log('Preparing actor data');

    switch (this.type) {
      case 'character':
        return this.prepareCharacterData();
      case 'npc':
        return this.prepareNpcData();
      case 'vehicle':
        return this.prepareVehicleData();
    }
  }

  prepareCharacterData() {
    log('Preparing character data');
    this.prepareAttributes();
  }

  prepareNpcData() {
    log('Preparing npc data');
    this.prepareAttributes();
  }

  prepareVehicleData() {
    log('Preparing vehicle data');
  }

  prepareAttributes() {
    const skillsByAttr = this.items
      .filter((item) => item.type === 'skill')
      .reduce((acc, elem) => {
        const attr = elem.system.attributeRef ?? 'unassigned';
        const skills = acc[attr] ?? [];

        return { ...acc, [attr]: skills.concat(elem) };
      }, {});

    log('System attributes', this.system.attributes);

    const attributesWithSkills = Object.fromEntries(
      Object.entries(CONFIG.SYSTEM.ATTRIBUTES).map(([name, def]) => {
        const attribute = this.system?.attributes[name];
        const label = game.i18n.localize(def.label);
        const dice = attribute?.dice ?? 0;
        const pips = attribute?.pips ?? 0;
        const skills = (skillsByAttr[name] ?? []).map((skill) => {
          // const skillDice = skill.system.value?.dice ?? 0;
          // const skillPips = skill.system.value?.pips ?? 0;
          // const [rollDice, rollPips] = normalizeDice([dice + skillDice, pips + skillPips]);
          const value = skill.system.value;
          const rollValue = normalizeDice(combineDice(attribute, value));
          return {
            id: skill._id,
            name: skill.name,
            description: skill.system.description,
            img: skill.img,
            value,
            rollValue,
          };
        });
        return [
          name,
          {
            name,
            label,
            value: {
              dice,
              pips,
            },
            skills,
            isNone: name === 'none',
          },
        ];
      }),
    );

    this.attributesWithSkills = logObject('Attributes with skills', attributesWithSkills);
  }
}
