import { RESOLUTION_HEIGHT, RESOLUTION_WIDTH } from '../constants/canvas.js';
import { PACKET_TYPE_LENGTH, TOTAL_LENGTH } from '../constants/header.js';
import { MONSTER_KILL_REWARD, MONSTER_LEVEL_UP_REWARD } from '../constants/reward.js';

export const config = {
  packet: {
    totalLength: TOTAL_LENGTH,
    typeLength: PACKET_TYPE_LENGTH,
  },
  canvas: {
    width: RESOLUTION_WIDTH,
    height: RESOLUTION_HEIGHT,
  },
  reward: {
    killReward: MONSTER_KILL_REWARD,
    levelUpReward: MONSTER_LEVEL_UP_REWARD,
  },
};
