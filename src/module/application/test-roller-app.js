import { SYSTEM_ID } from '../consts.js';
import { formatDice, log } from '../utils.js';

export default class TestRollerApp extends Application {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ['mini-six', 'test-roller'],
      template: `systems/${SYSTEM_ID}/templates/apps/test-roller-app.hbs`,
      width: 450,
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

    this.rollData = {
      ...rollData,
      actor,
      difficultyKey: 'moderate',
      difficultyLevels: CONFIG.SYSTEM.DIFFICULTY_LEVELS,
      difficultyLevel: 15,
      skill,
      attributes,
      attribute,
    };
  }

  get title() {
    return game.i18n.localize('MiniSix.Labels.rollDialogTitle');
  }

  getData(options) {
    const context = super.getData(options);

    log('RollData', this.rollData);

    const rollData = this.rollData;

    log('FomratDiceTest', formatDice({}));

    return foundry.utils.mergeObject(context, {
      ...rollData,
      title: this.headerTitle,
    });
  }

  get headerTitle() {
    const attributeTitle =
      this.rollData.attributeName && this.rollData.attributeName != 'none' && this.rollData.attribute.label;
    const skillTitle = this.rollData.skill?.name;
    return (skillTitle && attributeTitle && `${skillTitle} (${attributeTitle})`) || skillTitle || attributeTitle;
  }

  activateListeners(html) {
    super.activateListeners(html);

    html.find('.roll-button').on('click', this.onRoll.bind(this));
    html.find('#roll-difficulty').on('change', this.onRollDifficultyChange.bind(this));
    html.find('#roll-difficulty-level').on('change', this.onRollDifficultyLevelChange.bind(this));
    html.find('#roll-attribute').on('change', this.onRollAttributeChange.bind(this));
  }

  async onRoll(event) {
    event.preventDefault();
  }

  async onRollDifficultyChange(event) {
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

  async onRollDifficultyLevelChange(event) {
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

  async onRollAttributeChange(event) {
    event.preventDefault();

    // eslint-disable-next-line no-undef
    const attributeName = $(event.target).val();
    const rollData = this.rollData;
    const attribute = rollData.attributes[attributeName];

    this.rollData = {
      ...rollData,
      attributeName,
      attribute,
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
