
import { GameObjects } from "phaser";
import { BaseScene } from "./_Base";

const White = 0xFFFFFF;
export class Preload extends BaseScene {

  progressBar: GameObjects.Graphics;
  progressBox: GameObjects.Graphics;
  loadingText: GameObjects.Text;

  constructor() {
    super('Preload');
    
  }

  init() {
   super.init();
    this.initLoader();
   this.load.on("complete", () => {
    setTimeout(() => {
      this.scene.start("Menu")
    }, 1000);
  }, this);
  }

  initLoader() {
   const { width, height } = this.scale;
   const x = width * 0.5;
   const y = height * 0.5;
   const barWidth = 32.5;
   const barHeight = 75;
   const left = this.add.rectangle(x -barWidth - 10, y, barWidth, barHeight, White, 1);
   const middle = this.add.rectangle(x, y, barWidth, barHeight, White, 1);
   const right = this.add.rectangle(x + barWidth + 10, y, barWidth, barHeight, White, 1);
    
   const speed = 150;
   const scaleY = 1.75;

   const shared = {
    scaleY,
    duration: speed,
    repeat: -1,
    repeatDelay: speed * 3,
    yoyo: true,
    ease: Phaser.Math.Easing.Linear
   };

   this.add.tween({
    ...shared,
    targets: left,
   });

   this.add.tween({
    ...shared,
    targets: middle,
    delay: speed,
   });

   this.add.tween({
    ...shared,
    targets: right,
    delay: speed * 3,
   });
  }

  preload () {
    this.load.setPath('assets');
    this.load.spritesheet('bird', 'birdSprite.png', {
        
        frameWidth: 16, frameHeight: 16
    });
    this.load.image('griff', 'griff.png');
    this.load.image('louis', 'louis.png');
    this.load.image('pipe', 'pipe.png');
    this.load.image('pause', 'pause.png');
    this.load.image('back', 'back.png');
  }
}