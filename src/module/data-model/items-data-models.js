import { diceValue, gearCharacteristicsSchema } from './common-models.js';

const fields = foundry.data.fields;

export class SkillDataModel extends foundry.abstract.DataModel {
  static defineSchema() {
    return {
      description: new fields.HTMLField(),
      attributeRef: new fields.StringField({ trim: true }),
      genre: new fields.SetField(new fields.StringField({ trim: true })),
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
    };
  }
}

export class ShieldDataModel extends foundry.abstract.DataModel {
  static defineSchema() {
    return {
      description: new fields.HTMLField(),
      characteristics: gearCharacteristicsSchema(),
      soak: diceValue(),
    };
  }
}

export class GearDataModel extends foundry.abstract.DataModel {
  static defineSchema() {
    return {
      description: new fields.HTMLField(),
      characteristics: gearCharacteristicsSchema(),
    };
  }
}
