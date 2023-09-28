import { registerSettings } from './settings.js';
import { preloadTemplates } from './preloadTemplates.js';
import { log } from './utils.js';
import CharacterDataModel from './data-model/character-data-model.js';
import {
  ArmourDataModel,
  GearDataModel,
  PerkDataModel,
  ShieldDataModel,
  SkillDataModel,
  SpellDataModel,
  WeaponDataModel,
} from './data-model/items-data-models.js';
import { NpcDataModel } from './data-model/npc-data-model.js';

function registerDataModels() {
  CONFIG.Actor.dataModels = {
    ...CONFIG.Actor.dataModels,
    character: CharacterDataModel,
    npc: NpcDataModel,
  };
  CONFIG.Item.dataModels = {
    ...CONFIG.Item.dataModels,
    skill: SkillDataModel,
    perk: PerkDataModel,
    spell: SpellDataModel,
    weapon: WeaponDataModel,
    armour: ArmourDataModel,
    shield: ShieldDataModel,
    gear: GearDataModel,
  };
}

// Initialize system
Hooks.once('init', async () => {
  log('Initializing mini-six');

  // Assign custom classes and constants here
  registerDataModels();

  // Register custom system settings
  registerSettings();

  // Preload Handlebars templates
  await preloadTemplates();

  // Register custom sheets (if any)
  log('Initialized');
});

// Setup system
Hooks.once('setup', async () => {
  // Do anything after initialization but before
  // ready
});

// When ready
Hooks.once('ready', async () => {
  // Do anything once the system is ready
});

// Add any additional hooks if necessary
