
import { BaseScene, MenuItem } from "./_Base";

export class Score extends BaseScene {

  menu: MenuItem[];

  constructor() {
    super('Score', { withBack: true });
  }

  create() {
    super.create();

    this.add
      .text(this.gameCenter.x, this.gameCenter.y, `Best Score: ${this.bestScore}`, { font: '600 32px Arial', color: '#fff' })
      .setOrigin(0.5, 1)
  }
}