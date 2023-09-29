import { attributesSchema, diceValue, staticsSchema } from './common-models.js';
import { SYSTEM } from '../consts.js';

const fields = foundry.data.fields;

export class NpcDataModel extends foundry.abstract.DataModel {
  static defineSchema() {
    return {
      description: new fields.HTMLField(),
      scale: diceValue(),
      potency: new fields.StringField({ choices: SYSTEM.POTENCY_LEVEL }),
      attributes: attributesSchema(),
      statics: staticsSchema(),
      state: new fields.SchemaField({
        woundLevel: new fields.NumberField({ min: 0, initial: 0, required: true, integer: true }),
      }),
    };
  }
}
