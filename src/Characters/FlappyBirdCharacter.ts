
export type Characters = 'Bird' | 'Kid' | 'Louis' | 'Griffin';

export type SharedAnimationData = {
  flipX?: boolean;
  scale: number;
  bodyHeightFn?: (height: number) => number;
  bodyWidthFn?: (width: number) => number;
}

export type AnimationData = |
  (SharedAnimationData & { type: 'image' }) |
  (SharedAnimationData & { type: 'sprite', frameHeight: number, frameWidth: number, startFrame: number, endFrame: number, frameRate: number, repeat: number }) |
  (SharedAnimationData & { type: 'spriteJson', jsonPath: string, frameNames: string[], frameRate: number, repeat: number });


interface IFlappyBirdCharacter {
  imagePath: string;
  name: Characters;
  flyData: AnimationData;
}

export class FlappyBirdCharacter implements IFlappyBirdCharacter {
  imagePath: string;
  name: Characters;
  flyData: AnimationData;

  constructor(data: IFlappyBirdCharacter) {
    this.imagePath = data.imagePath;
    this.name = data.name;
    this.flyData = data.flyData;
  }

  preload(load: Phaser.Loader.LoaderPlugin) {
    this.preloadData(load, this.flyData);
  }

  buildForFly(scene: Phaser.Scene, variant: 'default' | 'physics', position: Phaser.Types.Math.Vector2Like, internalScale: number) {
    const factory = variant === 'default' ? scene.add : scene.physics.add;
    const character = (factory as Phaser.Physics.Arcade.Factory)
      .sprite(position.x, position.y, this.name)
      .setName('f_' + this.name)

    const { scale, bodyHeightFn, flipX } = this.flyData;

    if(scale) {
      character.setScale(scale * internalScale);
    }

    if(flipX) {
      character.setFlipX(true);
    }

    if(bodyHeightFn && character instanceof Phaser.Physics.Arcade.Sprite) {
      character.setBodySize(character.width, bodyHeightFn(character.height), true);
    }

    const flyAnimationName = `${this.name}_fly`;
    const hasFlyAnimation = scene.anims.exists(flyAnimationName);

    if(this.flyData.type === 'sprite') {
      if(!hasFlyAnimation) {
        scene.anims.create({
          key: flyAnimationName,
          frames: scene.anims.generateFrameNumbers(this.name, { start: this.flyData.startFrame, end: this.flyData.endFrame }),
          frameRate: this.flyData.frameRate,
          repeat: this.flyData.repeat
        });
      }
      
      character.play(flyAnimationName);
    }

    if(this.flyData.type === 'spriteJson') {
      if(!hasFlyAnimation) {
        scene.anims.create({
          key: flyAnimationName,
          frames: this.flyData.frameNames.map(name => ({ key: this.name, frame: name })),
          frameRate: this.flyData.frameRate,
          repeat: this.flyData.repeat
        });
      }
        
      character.play(flyAnimationName);
    }

    return character;
  }

  private preloadData(load: Phaser.Loader.LoaderPlugin, data: AnimationData) {
    switch (data.type) {
      case 'image':
        load.image(this.name, this.imagePath);
        break;
      case 'sprite':
        load.spritesheet(this.name, this.imagePath, {
          frameWidth: data.frameWidth,
          frameHeight: data.frameHeight,
        });
        break;
      case 'spriteJson':
        load.atlas(this.name, this.imagePath, data.jsonPath);
        break;
    }
  }
}