import { FlappyBirdCharacter } from "./FlappyBirdCharacter";

export const Griffin = new FlappyBirdCharacter({
  imagePath: 'griff.png',
  name: 'Griffin',
  flyData: {
    type: 'image',
    scale: 0.1,
    bodyHeightFn: (h) => h -30,
  }
});