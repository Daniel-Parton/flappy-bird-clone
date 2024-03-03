
import { Scene } from "phaser";

export class Boot extends Scene {
  constructor() {
    super('Boot');
  }

  preload () {
    this.load.setPath('./assets');
    this.load.image('sky', 'sky.png');
  }

  create () {
    this.scene.start("Preload");
  }
}