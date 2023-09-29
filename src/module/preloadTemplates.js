import { SYSTEM_ID } from './consts.js';

export async function preloadTemplates() {
  const templatePaths = [
    // Add paths to "systems/mini-six/templates"
    `systems/${SYSTEM_ID}/templates/actor/parts/attributes.hbs`,
    `systems/${SYSTEM_ID}/templates/item/parts/skill-details.hbs`,
    `systems/${SYSTEM_ID}/templates/item/parts/weapon-details.hbs`,
  ];

  return loadTemplates(templatePaths);
}
