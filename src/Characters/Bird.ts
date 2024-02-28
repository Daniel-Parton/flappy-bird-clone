import { FlappyBirdCharacter } from "./FlappyBirdCharacter";

export const Bird = new FlappyBirdCharacter({
  imagePath: 'birdSprite.png',
  name: 'Bird',
  flyData: {
    type: 'sprite',
    flipX: true,
    scale: 3,
    bodyHeightFn: (h) => h -8,
    frameWidth: 16, 
    frameHeight: 16,  
    startFrame:9,
    endFrame: 15,
    frameRate: 8,
    repeat: -1
  }
});