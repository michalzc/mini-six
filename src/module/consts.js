export const SYSTEM_ID = 'mini-six';
export const SYSTEM_NAME = 'Mini Six 🎲';

const POTENCY_LEVEL = ['notAThreat', 'minor', 'credible', 'watchOut', 'bold'];

const ATTRIBUTES = {
  might: {
    label: 'MiniSix.Attributes.might',
  },
  agility: {
    label: 'MiniSix.Attributes.agility',
  },
  wit: {
    label: 'MiniSix.Attributes.wit',
  },
  charm: {
    label: 'MiniSix.Attributes.charm',
  },
  none: {
    label: 'MiniSix.Attributes.none',
  },
};

const DIFFICULTY_LEVELS = {
  noDifficulty: {
    label: 'MiniSix.Difficulty.plainRoll',
  },
  veryEasy: {
    max: 5,
    default: 5,
    label: 'MiniSix.Difficulty.veryEasy',
  },
  easy: {
    max: 10,
    default: 10,
    label: 'MiniSix.Difficulty.easy',
  },
  moderate: {
    max: 15,
    default: 15,
    label: 'MiniSix.Difficulty.moderate',
  },
  difficult: {
    max: 20,
    default: 20,
    label: 'MiniSix.Difficulty.difficult',
  },
  veryDifficult: {
    max: 30,
    default: 30,
    label: 'MiniSix.Difficulty.veryDifficult',
  },
  heroic: {
    default: 40,
    label: 'MiniSix.Difficulty.heroic',
  },
};

export const SYSTEM = {
  SYSTEM_ID,
  SYSTEM_NAME,
  POTENCY_LEVEL,
  ATTRIBUTES,
  DIFFICULTY_LEVELS,
};
