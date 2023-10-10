import { SYSTEM_ID } from '../consts.js';
import { combineDice, log, normalizeDice } from '../utils.js';

export default class TestRollerApp extends Application {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ['mini-six', 'test-roller'],
      template: `systems/${SYSTEM_ID}/templates/apps/test-roller-app.hbs`,
      width: 500,
      height: 'auto',
      submitOnChange: false,
      resizable: true,
    });
  }

  constructor(actor, rollData, options = {}) {
    super(options);

    const { attributeName, skillId } = rollData;
    const attributes = actor.attributesWithSkills;
    const attribute = actor.attributesWithSkills[attributeName];
    const skill = attribute.skills.find((skill) => skill.id === skillId);
    const modifier = { dice: 0, pips: 0 };
    const total = combineDice(attribute.value, skill?.value, modifier.value);

    this.rollData = {
      ...rollData,
      actor,
      difficultyKey: 'moderate',
      difficultyLevels: CONFIG.SYSTEM.DIFFICULTY_LEVELS,
      difficultyLevel: 15,
      skill,
      attributes,
      attribute,
      modifier,
      total,
    };
  }

  get title() {
    return game.i18n.localize('MiniSix.Labels.rollDialogTitle');
  }

  getData(options) {
    const context = super.getData(options);

    log('RollData', this.rollData);

    const rollData = this.rollData;

    return foundry.utils.mergeObject(context, {
      ...rollData,
      title: this.headerTitle,
    });
  }

  get headerTitle() {
    const attributeTitle =
      this.rollData.attributeName && this.rollData.attributeName !== 'none' && this.rollData.attribute.label;
    const skillTitle = this.rollData.skill?.name;
    return (skillTitle && attributeTitle && `${skillTitle} (${attributeTitle})`) || skillTitle || attributeTitle;
  }

  activateListeners(html) {
    super.activateListeners(html);

    html.find('.roll-button').on('click', this.onRoll.bind(this));
    html.find('#roll-difficulty').on('change', this.onRollDifficultyChange.bind(this));
    html.find('#roll-difficulty-level').on('change', this.onRollDifficultyLevelChange.bind(this));
    html.find('#roll-attribute').on('change', this.onRollAttributeChange.bind(this));
    html.find('#modifier-form-dice').on('change', this.onRollModifierChanged.bind(this, html));
    html.find('#modifier-form-pips').on('change', this.onRollModifierChanged.bind(this, html));
    html.find('#modifier-form-flat').on('change', this.onRollModifierChanged.bind(this, html));
  }

  async onRoll(event) {
    event.preventDefault();

    const { attribute, skill, modifier, difficultyKey, difficultyLevel, difficultyLevels, callBack } = this.rollData;
    const target = { value: difficultyLevel, label: difficultyLevels[difficultyKey].label };

    await this.close();
    await callBack(this.actor, attribute, skill, { value: modifier }, target);
  }

  onRollDifficultyChange(event) {
    event.preventDefault();

    // eslint-disable-next-line no-undef
    const difficultyKey = $(event.target).val();
    const rollData = this.rollData;
    const difficultyLevel = rollData.difficultyLevels[difficultyKey].default;
    this.rollData = {
      ...rollData,
      difficultyKey,
      difficultyLevel,
    };
    this.render(true);
  }

  onRollDifficultyLevelChange(event) {
    event.preventDefault();

    // eslint-disable-next-line no-undef
    const val = $(event.target).val();
    const difficultyLevel = val && parseInt(val);
    const rollData = this.rollData;
    const difficultyLevels = rollData.difficultyLevels;
    const difficultyKey = TestRollerApp.findDifficultyKey(difficultyLevel, difficultyLevels);

    this.rollData = {
      ...rollData,
      difficultyKey,
      difficultyLevel,
    };

    this.render(true);
  }

  onRollAttributeChange(event) {
    event.preventDefault();

    // eslint-disable-next-line no-undef
    const attributeName = $(event.target).val();
    const rollData = this.rollData;
    const attribute = rollData.attributes[attributeName];
    const total = combineDice(attribute.value, rollData.skill?.value, rollData.modifier?.value);

    this.rollData = {
      ...rollData,
      attributeName,
      attribute,
      total,
    };

    this.render(true);
  }

  onRollModifierChanged(html) {
    const modifierDice = parseInt(html.find('#modifier-form-dice').val()) || 0;
    const modifierPips = parseInt(html.find('#modifier-form-pips').val()) || 0;
    const modifierFlat = parseInt(html.find('#modifier-form-flat').val()) || 0;
    const modifier = { dice: modifierDice, pips: modifierPips, flat: modifierFlat };
    const rollData = this.rollData;
    const total = normalizeDice(combineDice(rollData.attribute.value, rollData.skill?.value, modifier));

    this.rollData = {
      ...rollData,
      modifier,
      total,
    };

    this.render(true);
  }

  static findDifficultyKey(difficultyLevel, difficultyLevels) {
    if (difficultyLevel) {
      const [difficultyKey] = Object.entries(difficultyLevels).find(([, entry]) => difficultyLevel <= entry.max);
      return difficultyKey;
    } else {
      return 'noDifficulty';
    }
  }
}
