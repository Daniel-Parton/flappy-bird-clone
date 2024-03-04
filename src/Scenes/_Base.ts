
import { Scene, Types } from "phaser";
import { LocalStorageHelper } from "../Utils/LocalStorageHelper";
import { CharacterLookup, Characters, FlappyBirdCharacter } from "../Characters";
import { MobileSize } from "../Utils/DeviceHelper";

export type Difficulties = 'easy' | 'normal' | 'hard';

export type MenuItem = { 
  label: string, 
  action: | 
  { type: 'startScene', scene: string} | 
  { type: 'startStopScene', startScene: string, stopScene: string } | 
  { type: 'continueScene', scene: string } };

type SceneOptions = {
  withBack?: boolean
}
const bestScoreKey = 'bestScore';
const characterKey = 'character';

export abstract class BaseScene extends Scene {
  sceneOptions: SceneOptions;

  get internalScale() {
    return this.isMobileSize ? 1.5 : 1;
  }

  get gameHeight() {
    return this.scale.height;
  }
  get gameWidth() {
    return this.scale.width;
  }

  get gameCenter(): Types.Math.Vector2Like {
    return { x: this.gameWidth / 2, y: this.gameHeight / 2};
  }

  get isMobileSize() {
    return this.gameWidth === MobileSize.width && this.gameHeight === MobileSize.height;
  }

  bestScore: number;
  character: FlappyBirdCharacter;
  background?: Phaser.GameObjects.Sprite

  characters: Record<Characters, FlappyBirdCharacter> = CharacterLookup;

  get menuItemFz() {
    return 32 * this.internalScale;
  };

  get menuItemLh() {
    return 50 * this.internalScale;
  };

  get menuItemGap() {
    return 10 * this.internalScale;
  };

  menuItemFw = 600;
  menuItemColor =  '#FFFFFF';
  menuItemHighlightColor =  '#FFFF00';

  backButton?: Phaser.GameObjects.Image;

  constructor(key: string, options?:SceneOptions) {
    super(key);
    this.sceneOptions = options || {};
  }

  create() {

    const characterName = LocalStorageHelper.getString(characterKey);
    this.character = this.characters[characterName as Characters] ?? this.characters.Bird;
    this.bestScore = LocalStorageHelper.getInt(bestScoreKey);
    
    // Create a TileSprite with the size of the game and set its image
    this.background = this.add.sprite(0, 0, 'sky')
      .setOrigin(0, 0).setScale(this.gameWidth / 800, this.gameHeight / 600);

    if(this.sceneOptions.withBack) {
      this.backButton = this.add.image(this.gameWidth - (10 * this.internalScale), this.gameHeight - (10 * this.internalScale), 'back')
      .setOrigin(1)
      .setScale(1.5 * this.internalScale)
      .setInteractive({ cursor: 'pointer'})
      .on('pointerdown', () => this.scene.start('Menu'), this);
    }
  }

  initMenu(menuItems: MenuItem[]) {
    let lastY = 0;
    menuItems.forEach(item => {
      const button = this.add
        .text(this.gameCenter.x, this.gameCenter.y + lastY, item.label, { 
          font: `${this.menuItemFw} ${this.menuItemFz}px Arial`, color: this.menuItemColor 
        })
        .setAlign('center')
        .setOrigin(0.5, 1)
        .setInteractive({ cursor: 'pointer'})
        .on('pointerover', () => {
          button.setColor(this.menuItemHighlightColor);
        } , this)
        .on('pointerout', () => button.setColor(this.menuItemColor), this)
        .on('pointerup', () => {
          switch(item.action.type) {
            case 'continueScene': {
              this.scene.stop();
              this.scene.resume(item.action.scene);
              break;
            }
            case 'startScene': {
              this.scene.start(item.action.scene);
              break;
            }
            case 'startStopScene':
              this.scene.stop(item.action.stopScene);
              this.scene.start(item.action.startScene);
          }
        }, this);
      lastY += this.menuItemLh;
    }, this);
  }

  setBestScore(value: number) {
    this.bestScore = value;
    LocalStorageHelper.set(bestScoreKey, value);
  }

  setCharacter(character: Characters) {
    this.character = this.characters[character];
    LocalStorageHelper.set(characterKey, character);
  }
}