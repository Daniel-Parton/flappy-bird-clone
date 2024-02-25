
import { BaseScene, MenuItem } from "./_Base";

export class Menu extends BaseScene {

  menu: MenuItem[];

  constructor() {
    super('Menu');
  }

  init() {
    super.init();

    this.menu = [
      { action: { type: 'startScene', scene: 'Gameplay' }, label: 'Play' },
      { action: { type: 'startScene', scene: 'Score' }, label: 'Score' },
      { action: { type: 'startScene', scene: 'Exit' }, label: 'Exit' }
    ];

    this.initMenu(this.menu);
  }
}