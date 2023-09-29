import { MiniSixBaseActorSheet } from './base-actor-sheet.js';
import { log } from '../../utils.js';
import { SYSTEM_ID } from '../../consts.js';

export class MiniSixCharacterSheet extends MiniSixBaseActorSheet {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: [SYSTEM_ID, 'sheet', 'actor', 'character'],
      tabs: [
        {
          navSelector: '.sheet-tabs',
          contentSelector: '.sheet-body',
          initial: 'attributes',
        },
      ],
    });
  }

  getData(options = {}) {
    const context = super.getData(options);
    const system = this.actor.system;
    log('Character Data', context);

    return foundry.utils.mergeObject(context, { system });
  }
}
