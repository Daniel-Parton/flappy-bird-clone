import { FlappyBirdCharacter } from "./FlappyBirdCharacter";

export const Louis = new FlappyBirdCharacter({
  imagePath: 'louisSprite.png',
  name: 'Louis',
  flyData: {
    type: 'spriteJson',
    jsonPath: 'louisSprite.json',
    frameNames: ['fly_001.png', 'fly_002.png', 'fly_003.png', 'fly_004.png', 'fly_005.png'],
    scale: 0.2,
    bodyHeightFn: (h) => h -55,
    bodyWidthFn: (h) => h -70,
    frameRate: 10,
    repeat: -1
  }
});
