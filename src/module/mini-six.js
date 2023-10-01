import { registerSettings } from './settings.js';
import { preloadTemplates } from './preloadTemplates.js';
import { log } from './utils.js';
import CharacterDataModel from './data-model/character-data-model.js';
import {
  ArmourDataModel,
  GearDataModel,
  PerkDataModel,
  SkillDataModel,
  SpellDataModel,
  WeaponDataModel,
} from './data-model/items-data-models.js';
import { NpcDataModel } from './data-model/npc-data-model.js';
import MinSixActor from './document/actor.js';
import { SYSTEM, SYSTEM_ID } from './consts.js';
import { MiniSixCharacterSheet } from './sheet/actor/character-sheet.js';
import { MiniSixNpcSheet } from './sheet/actor/npc-sheet.js';
import { MiniSixVehicleSheet } from './sheet/actor/vehicle-sheet.js';
import MiniSixItem from './document/item.js';
import MiniSixItemSheet from './sheet/item/item-sheet.js';
import { registerHandlebarsHelpers } from './handlebars-helpers.js';

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
    gear: GearDataModel,
  };
}

function registerDocuments() {
  CONFIG.Actor.documentClass = MinSixActor;
  CONFIG.Item.documentClass = MiniSixItem;
}

function registerSheets() {
  Actors.registerSheet(SYSTEM_ID, MiniSixCharacterSheet, {
    types: ['character'],
    makeDefault: true,
    label: 'MiniSix.Sheet.character',
  });
  Actors.registerSheet(SYSTEM_ID, MiniSixNpcSheet, {
    types: ['npc'],
    makeDefault: true,
    label: 'MiniSix.Sheet.npc',
  });
  Actors.registerSheet(SYSTEM_ID, MiniSixVehicleSheet, {
    types: ['vehicle'],
    makeDefault: true,
    label: 'MiniSix.Sheet.vehicle',
  });

  Items.registerSheet(SYSTEM_ID, MiniSixItemSheet, {
    types: ['skill', 'perk', 'spell', 'weapon', 'armour', 'gear'],
    makeDefault: true,
    label: 'MiniSix.Sheet.item',
  });
}

// Initialize system
Hooks.once('init', async () => {
  log('Initializing mini-six');

  CONFIG.SYSTEM = SYSTEM;

  // Assign custom classes and constants here
  registerDataModels();
  registerDocuments();
  registerSheets();

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
registerHandlebarsHelpers();
