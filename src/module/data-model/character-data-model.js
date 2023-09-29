import { attributesSchema, diceValue, staticsSchema } from './common-models.js';

export default class CharacterDataModel extends foundry.abstract.DataModel {
  static defineSchema() {
    const fields = foundry.data.fields;
    return {
      characteristics: new fields.SchemaField({
        quote: new fields.StringField({ trim: true }),
        appearance: new fields.StringField({ trim: true }),
        personality: new fields.StringField({ trim: true }),
        age: new fields.NumberField({ integer: true, positive: true }),
        biography: new fields.HTMLField(),
        complications: new fields.SetField(new fields.StringField({ trim: true })),
        weight: new fields.NumberField({ integer: true, positive: true }),
        height: new fields.NumberField({ integer: true, positive: true }),
      }),
      scale: diceValue(),
      attributes: attributesSchema(),
      statics: staticsSchema(),
      state: new fields.SchemaField({
        charPoints: new fields.NumberField({ min: 0, initial: 0, required: true, integer: true }),
        heroPoints: new fields.NumberField({ min: 0, initial: 0, required: true, integer: true }),
        woundLevel: new fields.NumberField({ min: 0, initial: 0, required: true, integer: true }),
      }),
    };
  }
}
