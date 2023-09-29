import { SYSTEM_ID } from '../consts.js';
import { log } from '../utils.js';

export default class MiniSixItem extends Item {
  async _preCreate(data, options, user) {
    log('Pre Create Item data', data);
    await super._preCreate(data, options, user);
    const icon = `systems/${SYSTEM_ID}/assets/icons/${data.type}.svg`;
    if (icon) {
      this.updateSource({ img: icon }, options);
    }
  }
}
