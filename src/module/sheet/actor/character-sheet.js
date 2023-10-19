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
          initial: 'gear', //FIXME: update to attributes
        },
      ],
    });
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

  activateListeners(html) {
    super.activateListeners(html);

    if (!this.isEditable) return;

    this.skillContextMenu(html);
    this.weaponStatusMenu(html);
    this.armourStatusMenu(html);

    html.find('.skill-roll').click(this.onTestRoll.bind(this));
    html.find('.attribute-roll').click(this.onTestRoll.bind(this));
    // eslint-disable-next-line no-undef
    html.find('.gear-edit').on('click', (event) => this.onItemEdit($(event.currentTarget)));
    // eslint-disable-next-line no-undef
    html.find('.gear-delete').on('click', (event) => this.onItemDelete($(event.currentTarget)));
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

  weaponStatusMenu(html) {
    const elems = Object.entries(CONFIG.SYSTEM.WEAPON_STATUSES).map(([name, elem]) => {
      return {
        name: game.i18n.localize(elem.label),
        icon: elem.icon,
        callback: this.onItemUpdateStatus.bind(this, name),
      };
    });

    new ContextMenu(html, '.item-status-weapon', elems, { eventName: 'click' });
  }

  armourStatusMenu(html) {
    const elems = Object.entries(CONFIG.SYSTEM.ARMOUR_STATUSES).map(([name, elem]) => {
      return {
        name: game.i18n.localize(elem.label),
        icon: elem.icon,
        callback: this.onItemUpdateStatus.bind(this, name),
      };
    });

    new ContextMenu(html, '.item-status-armour', elems, { eventName: 'click' });
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

  async onItemUpdateStatus(status, elem) {
    log('Status change', status, elem.data());
    const itemIt = elem.data().itemId;
    const item = itemIt && this.actor.items.get(itemIt);
    if (item) {
      let newData = { system: { status: status } };
      await item.update(newData);
      this.render(true);
    }
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
    log('Delete element', elem);
    const id = elem.data()['itemId'];
    const item = id && this.actor.items.get(id);
    if (item) item.deleteDialog();
  }
}
