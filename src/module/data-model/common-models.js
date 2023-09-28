const fields = foundry.data.fields;

export function diceValue() {
  return new fields.SchemaField({
    dice: new fields.NumberField({ min: 0, integer: true, required: true, initial: 0 }),
    pips: new fields.NumberField({ min: 0, integer: true, required: true, initial: 0 }),
  });
}

export function attributesSchema() {
  return new fields.SchemaField({
    might: diceValue(),
    agility: diceValue(),
    wit: diceValue(),
    charm: diceValue(),
  });
}

export function staticsSchema() {
  return new fields.SchemaField({
    dodge: new fields.NumberField({ min: 0, integer: true }),
    block: new fields.NumberField({ min: 0, integer: true }),
    parry: new fields.NumberField({ min: 0, integer: true }),
    soak: new fields.NumberField({ min: 0, integer: true }),
  });
}

export function gearCharacteristicsSchema() {
  return new fields.SchemaField({
    price: new fields.NumberField({ min: 0, integer: true }),
    availablity: new fields.StringField({ trim: true }),
    wieght: new fields.NumberField({ min: 0, integer: true }),
  });
}
