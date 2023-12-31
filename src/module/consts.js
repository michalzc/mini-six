export const SYSTEM_ID = 'mini-six';
export const SYSTEM_NAME = 'Mini Six 🎲';

const POTENCY_LEVEL = ['notAThreat', 'minor', 'credible', 'watchOut', 'bold'];

const ALL_STATUSES = {
  stored: {
    label: 'MiniSix.Items.ItemStatuses.stored',
    icon: '<i class="fas fa-archive"></i>',
  },
  carried: {
    label: 'MiniSix.Items.ItemStatuses.carried',
    icon: '<i class="fas fa-suitcase"></i>',
  },
  readied: {
    label: 'MiniSix.Items.ItemStatuses.readied',
    icon: '<i class="fas fa-hand-paper"></i>',
  },
  worn: {
    label: 'MiniSix.Items.ItemStatuses.worn',
    icon: '<i class="fas fa-t-shirt"></i>',
  },
};

const GEAR_STATUSES = {
  stored: ALL_STATUSES.stored,
  carried: ALL_STATUSES.carried,
};

const WEAPON_STATUSES = {
  ...GEAR_STATUSES,
  readied: ALL_STATUSES.readied,
};

const ARMOUR_STATUSES = {
  ...GEAR_STATUSES,
  worn: ALL_STATUSES.worn,
};

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
    max: 1,
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
    max: Number.MAX_SAFE_INTEGER,
  },
};

export const SYSTEM = {
  SYSTEM_ID,
  SYSTEM_NAME,
  POTENCY_LEVEL,
  ATTRIBUTES,
  DIFFICULTY_LEVELS,
  ALL_STATUSES,
  GEAR_STATUSES,
  WEAPON_STATUSES,
  ARMOUR_STATUSES,
};
