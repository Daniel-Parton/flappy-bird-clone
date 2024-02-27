
import { GameObjects, Scene, Types } from "phaser";

export type Difficulties = 'easy' | 'normal' | 'hard';
export type Characters = 'Bird' | 'Louis' | 'Griffin';

export type SharedCharacterData = {
  name: string;
  flipX?: boolean;
  scale: number;
  bodyHeightFn?: (height: number) => number;
}

export type CharacterData = |
  (SharedCharacterData & { type: 'image' }) |
  (SharedCharacterData & { type: 'sprite', startFrame: number, endFrame: number, frameRate: number, repeat: number });

const CharacterDataLookup: Record<Characters, CharacterData> = {
  'Bird': {
    type: 'sprite',
    name: 'bird',
    bodyHeightFn: (h) => h -8,
    scale: 3,
    flipX: true,
    startFrame:9,
    endFrame: 15,
    frameRate: 8,
    repeat: -1
  },
  'Griffin': {
    type: 'image',
    name: 'griff',
    scale: 0.1,
    bodyHeightFn: (h) => h -20,

  },
  'Louis': {
    type: 'image',
    name: 'louis',
    scale: 0.3,
    bodyHeightFn: (h) => h -30
  }
};

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
  gameHeight: number;
  gameWidth: number;
  gameCenter: Types.Math.Vector2Like;

  bestScore: number;
  character: Characters;

  allCharacters: Record<Characters, CharacterData> = CharacterDataLookup;
  menuItemFz = 32;
  menuItemLh = 42;
  menuItemFw = 600;
  menuItemColor =  '#FFFFFF';
  menuItemHighlightColor =  '#FFFF00';

  backButton?: Phaser.GameObjects.Image;

  constructor(key: string, options?:SceneOptions) {
    super(key);
    this.sceneOptions = options || {};
  }

  init() {
    this.add.image(0, 0, 'sky').setOrigin(0, 0);

    this.bestScore = 0;
    try {
      this.bestScore = parseInt(localStorage.getItem(bestScoreKey));
      if(isNaN(this.bestScore)) {
        this.bestScore = 0;
      }
    } catch (e) {
      // ignore
    }

    try {
      this.character = localStorage.getItem(characterKey) as Characters;
      if(!this.character || Object.keys(this.allCharacters).indexOf(this.character) === -1) {
        this.character = 'Griffin';
      }
    } catch (e) {
      // ignore
    }

    this.gameHeight = this.game.config.height as number;
    this.gameWidth = this.game.config.width as number;
    this.gameCenter = { x: this.gameWidth / 2, y: this.gameHeight / 2};

    if(this.sceneOptions.withBack) {
      this.backButton = this.add.image(this.gameWidth - 10, this.gameHeight - 10, 'back')
      .setOrigin(1)
      .setScale(1.5)
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
      localStorage.setItem(bestScoreKey, this.bestScore.toString());
  }

  setCharacter(character: Characters) {
    this.character = character;
    localStorage.setItem(characterKey, character);
  }

  buildCharacter<T = (GameObjects.GameObjectFactory | Phaser.Physics.Arcade.Factory)>(factory: T, characterData: CharacterData, position: Types.Math.Vector2Like) {
    const shared: SharedCharacterData = characterData;

    const character = (factory as Phaser.Physics.Arcade.Factory)
      .sprite(position.x, position.y, shared.name)
      .setName('ch_' + shared.name)

    if(shared.scale) {
      character.setScale(shared.scale);
    }

    if(shared.flipX) {
      character.setFlipX(true);
    }

    if(shared.bodyHeightFn && character instanceof Phaser.Physics.Arcade.Sprite) {
      character.setBodySize(character.width, shared.bodyHeightFn(character.height), true);
    }

    if(characterData.type === 'sprite') {
      this.anims.create({
       key: `${characterData}_fly`,
       frames: this.anims.generateFrameNumbers(characterData.name, { start: characterData.startFrame, end: characterData.endFrame }),
       frameRate: characterData.frameRate,
       repeat: characterData.repeat
     });
     character.play(`${characterData}_fly`);
    }

    return character;
  }
}