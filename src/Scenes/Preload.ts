
import { BaseScene } from "./_Base";

export class Preload extends BaseScene {
  constructor() {
    super('Preload');
  }

  init() {
   super.init();
  }

  preload () {
    this.load.setPath('assets');
    this.load.spritesheet('bird', 'birdSprite.png', {
        
        frameWidth: 16, frameHeight: 16
    });
    this.load.image('pipe', 'pipe.png');
    this.load.image('pause', 'pause.png');
    this.load.image('back', 'back.png');
  }

  create () {
    this.scene.start("Menu")
  }
}