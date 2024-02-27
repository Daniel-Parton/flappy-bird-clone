
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
      { action: { type: 'startStopScene', stopScene: 'Gameplay', startScene: 'Menu' } , label: 'Exit' },
    ];

    this.initMenu(this.menu);
  }
}