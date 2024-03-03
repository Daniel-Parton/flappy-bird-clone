
import { BaseScene, MenuItem } from "./_Base";

export class Menu extends BaseScene {

  menu: MenuItem[];

  constructor() {
    super('Menu');
  }

  create() {
    super.create();

    this.menu = [
      { action: { type: 'startScene', scene: 'Gameplay' }, label: 'Play' },
      { action: { type: 'startScene', scene: 'CharacterSelect' }, label: 'Character' },
      { action: { type: 'startScene', scene: 'Score' }, label: 'Score' }
    ];

    this.initMenu(this.menu);
  }
}