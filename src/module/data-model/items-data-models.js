import { diceValue, gearCharacteristicsSchema } from './common-models.js';
import { SYSTEM } from '../consts.js';

const fields = foundry.data.fields;

export class SkillDataModel extends foundry.abstract.DataModel {
  static defineSchema() {
    return {
      description: new fields.HTMLField(),
      attributeRef: new fields.StringField({ trim: true, choices: SYSTEM.ATTRIBUTES, initial: 'none' }),
      genre: new fields.StringField({ trim: true }),
      value: diceValue(),
    };
  }
}

export class PerkDataModel extends foundry.abstract.DataModel {
  static defineSchema() {
    return {
      //FIXME: implement fully
      description: new fields.HTMLField(),
    };
  }
}

export class SpellDataModel extends foundry.abstract.DataModel {
  static defineSchema() {
    return {
      //FIXME: implement fully
      description: new fields.HTMLField(),
    };
  }
}

export class WeaponDataModel extends foundry.abstract.DataModel {
  static defineSchema() {
    return {
      description: new fields.HTMLField(),
      characteristics: gearCharacteristicsSchema(),
      ranged: new fields.BooleanField(),
      skillRef: new fields.StringField({ trim: true }),
      attributeRef: new fields.StringField({ trim: true }),
      range: new fields.ArrayField(new fields.NumberField({ min: 0, integer: true }), { initial: [0, 0, 0] }),
      damage: diceValue(),
    };
  }
}

export class ArmourDataModel extends foundry.abstract.DataModel {
  static defineSchema() {
    return {
      description: new fields.HTMLField(),
      characteristics: gearCharacteristicsSchema(),
      soak: diceValue(),
      isShield: new fields.BooleanField({ initial: false }),
      status: new fields.StringField({ choices: SYSTEM.WEAPON_STATUSES, initial: 'stowed' }),
    };
  }
}

export class GearDataModel extends foundry.abstract.DataModel {
  static defineSchema() {
    return {
      description: new fields.HTMLField(),
      characteristics: gearCharacteristicsSchema(),
      status: new fields.StringField({ choices: SYSTEM.ITEM_STATUSES, initial: 'stowed' }),
    };
  }
}
