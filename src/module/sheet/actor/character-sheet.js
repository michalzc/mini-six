import { MiniSixBaseActorSheet } from './base-actor-sheet.js';
import { log, logObject } from '../../utils.js';
import { SYSTEM_ID } from '../../consts.js';
import { testRoll } from '../../roll.js';

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

  activateListeners(html) {
    super.activateListeners(html);

    if (!this.isEditable) return;

    this.skillContextMenu(html);

    html.find('.skill-roll').click(this.onTestRoll.bind(this));
    html.find('.attribute-roll').click(this.onTestRoll.bind(this));
  }

  async onTestRoll(event) {
    event.preventDefault();
    log('Event', event);
    const skipDialog = event.ctrlKey;
    const element = event.currentTarget;
    const data = element.dataset;
    const skillId = data.itemId;
    const attributeName = data.attribute;

    await testRoll(this.actor, attributeName, skillId, skipDialog);
  }

  skillContextMenu(html) {
    const elems = [
      {
        name: game.i18n.localize('MiniSix.Labels.edit'),
        icon: '<i class="fas fa-edit"></i>',
        callback: this.onItemEdit.bind(this),
      },
      {
        name: game.i18n.localize('MiniSix.Labels.delete'),
        icon: '<i class="fas fa-trash"></i>',
        callback: this.onItemDelete.bind(this),
      },
    ];

    new ContextMenu(html, '.skill-roll', elems);
  }

  onItemEdit(elem) {
    log('Edit item', elem.data());
    const id = elem.data()['itemId'];
    if (id) {
      const item = this.actor.items.get(id);
      if (item) item.sheet.render(true);
    }
  }

  onItemDelete(elem) {
    const id = elem.data()['itemId'];
    if (id) {
      const confirmation = new Dialog({
        title: game.i18n.localize('MiniSix.Labels.deleteConfirmationTitle'),
        content: game.i18n.localize('MiniSix.Labels.deleteConfirmation'),
        buttons: {
          yes: {
            icon: '<i class="fas fa-check"></i>',
            label: game.i18n.localize('MiniSix.Labels.yes'),
            callback: this.deleteItem.bind(this, id),
          },
          no: {
            icon: '<i class="fas fa-ban"></i>',
            label: game.i18n.localize('MiniSix.Labels.no'),
          },
        },
        default: 'no',
      });
      confirmation.render(true);
    }
  }

  deleteItem(itemId) {
    const item = this.actor.items.get(itemId);
    if (item) item.delete();
  }

  getData(options = {}) {
    const context = super.getData(options);
    const system = this.actor.system;
    log('Character Data', context);
    const attributesWithSkills = Object.keys(CONFIG.SYSTEM.ATTRIBUTES).map(
      (attr) => this.actor.attributesWithSkills[attr],
    );

    return logObject('Sheet context', foundry.utils.mergeObject(context, { system, attributesWithSkills }));
  }
}
