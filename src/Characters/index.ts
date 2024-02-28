import { Bird } from './Bird';
import { AnimationData, Characters, FlappyBirdCharacter, SharedAnimationData} from './FlappyBirdCharacter'
import { Griffin } from './Griffin';
import { Louis } from './Louis';

export {
  type AnimationData,
  type Characters,
  FlappyBirdCharacter,
  type SharedAnimationData
}

export const AllCharacters = [Bird, Louis, Griffin];
export const CharacterLookup = AllCharacters
  .reduce((pv, c) => ({ ...pv, [c.name]: c }), {} as Record<Characters, FlappyBirdCharacter>);