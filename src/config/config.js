import { RESOLUTION_HEIGHT, RESOLUTION_WIDTH } from '../constants/canvas.js';
import { MONSTER_KILL_REWARD, MONSTER_LEVEL_UP_REWARD } from '../constants/reward.js';

export const config = {
  canvas: {
    width: RESOLUTION_WIDTH,
    height: RESOLUTION_HEIGHT,
  },
  reward: {
    killReward: MONSTER_KILL_REWARD,
    levelUpReward: MONSTER_LEVEL_UP_REWARD,
  },
};
