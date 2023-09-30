import { SYSTEM_ID } from '../consts.js';
import { log } from '../utils.js';

export default class TestRollerApp extends Application {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ['mini-six', 'test-roller'],
      template: `systems/${SYSTEM_ID}/templates/apps/test-roller.hbs`,
      width: 400,
      height: 'auto',
      submitOnChange: false,
    });
  }

  constructor(actor, rollData, options = {}) {
    super(options);

    this.rollData = {
      ...rollData,
      attributesWithSkills: actor.attributesWithSkills,
    };
    log('RollData', rollData);
  }

  get title() {
    return game.i18n.localize('MiniSix.Labels.rollDialogTitle');
  }

  getData(options) {
    const context = super.getData(options);
    console.log('TestRollApp getData options', options);
    console.log('TestRollApp getData context', context);

    return foundry.utils.mergeObject(context, {});
  }

  activateListeners(html) {
    super.activateListeners(html);
  }
}
