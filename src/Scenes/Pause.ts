
import { BaseScene, MenuItem } from "./_Base";

export class Pause extends BaseScene {

  menu: MenuItem[];

  constructor() {
    super('Pause');
  }

  init() {
    super.init();

    this.menu = [
      { action: { type: 'continueScene', scene: 'Gameplay' }, label: 'Continue' },
      { action: { type: 'startScene', scene: 'Menu' } , label: 'Exit' },
    ];

    this.initMenu(this.menu);
  }
}