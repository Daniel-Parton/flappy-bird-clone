
import { BaseScene } from "./_Base";

export class Exit extends BaseScene {

  constructor() {
    super('Exit');
  }

  create() {
    this.game.destroy(true);
  }
}