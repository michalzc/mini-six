import { SYSTEM_ID } from '../../consts.js';

export class MiniSixBaseActorSheet extends ActorSheet {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: [SYSTEM_ID, 'sheet', 'actor'],
      width: 800,
      height: 800,
    });
  }

  get template() {
    return `systems/${SYSTEM_ID}/templates/actor/${this.object.type}-sheet.hbs`;
  }
}
