import CharacterDataModel from './character-data-model.js';
import { NpcDataModel } from './npc-data-model.js';
import {
  ArmourDataModel,
  GearDataModel,
  PerkDataModel,
  SkillDataModel,
  SpellDataModel,
  WeaponDataModel,
} from './items-data-models.js';

export function registerDataModels() {
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
