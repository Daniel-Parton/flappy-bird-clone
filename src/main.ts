import './style.css';

import { Types, Game as PhaserGame } from "phaser";
import { Boot } from "./Scenes/Boot";
import { Preload } from "./Scenes/Preload";
import { Gameplay } from "./Scenes/Gameplay";
import { Menu } from "./Scenes/Menu";
import { Score } from "./Scenes/Score";
import { Pause } from "./Scenes/Pause";
import { CharacterSelect } from "./Scenes/CharacterSelect";
import { DesktopSize, GetSizeByWindow, MobileSize, ShouldBeMobileSize } from './Utils/DeviceHelper';

type HeightWidth = { width: number, height: number };

const defaultSize = GetSizeByWindow();

const config: Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: defaultSize.width,
  height: defaultSize.height,
  
  parent: 'game-container',
  backgroundColor: '#000000',
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [
    Boot,
    Preload,
    Menu,
    CharacterSelect,
    Score,
    Gameplay,
    Pause,
  ]
};

const game = new PhaserGame(config);

window.addEventListener('resize', () => {

  let newSize: HeightWidth | undefined = undefined;
  const gameSizeIsMobile = game.canvas.width === MobileSize.width && game.canvas.height === MobileSize.height;
  if(ShouldBeMobileSize()) {
    if(!gameSizeIsMobile) {
      newSize = MobileSize;
    }
  } else if(gameSizeIsMobile) {
    newSize = DesktopSize;
  }

  if(newSize) {
    game.scale.setGameSize(newSize.width, newSize.height);
    game.scene.getScenes(true).forEach(s => {
      s.scene.stop();
    });

    setTimeout(() => {
      game.scene.start('Menu');
    }, 50);
  }
});