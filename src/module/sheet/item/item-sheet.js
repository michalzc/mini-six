import { SYSTEM_ID } from '../../consts.js';
import { log, logObject } from '../../utils.js';

export default class MiniSixItemSheet extends ItemSheet {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: [SYSTEM_ID, 'sheet', 'item'],
      width: 500,
      height: 'auto',
    });
  }

  static prepareAttributes() {
    return Object.fromEntries(
      Object.entries(CONFIG.SYSTEM.ATTRIBUTES).map(([name, def]) => {
        return [name, def.label];
      }),
    );
  }

  async getData(options = {}) {
    log('Item type', this.item.type);
    const context = super.getData(options);
    const system = this.item.system;
    const sheetDetails = `systems/mini-six/templates/item/parts/${this.item.type}-details.hbs`;
    const itemDescription = await TextEditor.enrichHTML(system.description);
    const attributes = MiniSixItemSheet.prepareAttributes();
    const newData = {
      system,
      sheetDetails,
      itemDescription,
      attributes,
      skillList: this.skillList,
    };
    return logObject('Item Sheet Prepared object', foundry.utils.mergeObject(context, newData));
  }

  get title() {
    const itemTypeName = game.i18n.localize(`TYPES.Item.${this.item.type}`);
    return `${itemTypeName}: ${this.item.name}`;
  }

  get template() {
    return `systems/${SYSTEM_ID}/templates/item/item-sheet.hbs`;
  }

  get skillList() {
    const onlyUnique = (value, index, array) => array.indexOf(value) === index;

    const gameSkills = [...game.items.filter((item) => item.type === 'skill')].map((item) => item.name);
    const parentItems = this.item.parent?.items ?? [];
    const parentSkills = [...parentItems.filter((item) => item.type === 'skill').map((item) => item.name)];

    return gameSkills.concat(parentSkills).filter(onlyUnique).sort();
  }
}
