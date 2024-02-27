
import { BaseScene, Characters, MenuItem } from "./_Base";

export class CharacterSelect extends BaseScene {

  menu: MenuItem[];

  constructor() {
    super('CharacterSelect', { withBack: true });
  }

  init() {
    super.init();
      
    const { width, height } = this.scale;
    const x = width * 0.5;
    const y = height * 0.5;

    // Display characters in the center
    const characters: Phaser.GameObjects.Sprite[] = [];
    const gapX = 200;

    Object.keys(this.allCharacters).forEach((key: Characters, index) => {
      const data = this.allCharacters[key];
      const initialScale = data.scale * 2;
      const choice = this
        .buildCharacter(this.add, data, {x: x + ((index - 1) * gapX), y })
        .setScale(data.scale * 1.5)
        .setInteractive({ cursor: 'pointer'})
      const zoomScale = 1.2;

        choice
          .on('pointerover', () => {
            this.add.tween({
              targets: choice,
              scale: initialScale * zoomScale,
              duration: 150,
              ease: Phaser.Math.Easing.Linear
            });
          } , this)
          .on('pointerout', () => {
            this.add.tween({
              targets: choice,
              scale: initialScale,
              duration: 150,
              ease: Phaser.Math.Easing.Linear
            });
          } , this)
          choice.on('pointerdown', () => {
            characters
              .filter(c => c.name !== choice.name)
              .forEach(c => {
                c.destroy(true);
              }, this);

            choice.input.enabled = false;
            this.add.tween({
              targets: choice,
              x,
              y,
              scale: initialScale * 20,
              duration: 1500,
              ease: Phaser.Math.Easing.Linear
            });
            this.setCharacter(key);
            setTimeout(() => {
              this.scene.start('Menu');
            }, 1500);
          }, this);

          characters.push(choice);
    }, this);
  }
}