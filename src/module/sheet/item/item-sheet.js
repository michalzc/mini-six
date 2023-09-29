import { SYSTEM_ID } from '../../consts.js';
import { log, logObject } from '../../utils.js';

export default class MiniSixItemSheet extends ItemSheet {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: [SYSTEM_ID, 'sheet', 'item'],
      tabs: [
        {
          navSelector: '.sheet-tabs',
          contentSelector: '.sheet-body',
          initial: 'details',
        },
      ],
      width: 600,
      height: 400,
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
    const attributes = (this.item.type === 'skill' && MiniSixItemSheet.prepareAttributes()) || undefined;
    const newData = {
      system,
      sheetDetails,
      itemDescription,
      attributes,
    };
    return logObject('Item Sheet Prepared object', foundry.utils.mergeObject(context, newData));
  }

  get template() {
    return `systems/${SYSTEM_ID}/templates/item/item-sheet.hbs`;
  }
}
