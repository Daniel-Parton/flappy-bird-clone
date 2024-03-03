
import { Types, Game as PhaserGame } from "phaser";
import { Boot } from "./Scenes/Boot";
import { Preload } from "./Scenes/Preload";
import { Gameplay } from "./Scenes/Gameplay";
import { Menu } from "./Scenes/Menu";
import { Score } from "./Scenes/Score";
import { Pause } from "./Scenes/Pause";
import { CharacterSelect } from "./Scenes/CharacterSelect";

const config: Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
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
    autoCenter: Phaser.Scale.CENTER_BOTH
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

new PhaserGame(config);