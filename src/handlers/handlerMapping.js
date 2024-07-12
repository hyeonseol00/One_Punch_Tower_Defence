import { baseUnderAttackHandler } from './base.handler.js';
import { gameEnd, gameStart } from './game.handler.js';
import {
  killMonsterHandler,
  killTreasureGoblinHandler,
  spawnMonsterHandler,
} from './monster.handler.js';
import { towerAttackHandler } from './tower-attack.handler.js';
import {
  placeInitialTowerHandler,
  placeTowerHandler,
  refundTowerHandler,
  upgradeTowerHandler,
} from './tower.handler.js';

const handlerMappings = {
  2: gameStart,
  3: gameEnd,
  21: placeInitialTowerHandler,
  22: placeTowerHandler,
  23: killMonsterHandler,
  24: baseUnderAttackHandler,
  25: refundTowerHandler,
  26: upgradeTowerHandler,
  27: killTreasureGoblinHandler,
  101: spawnMonsterHandler,
  102: towerAttackHandler,
};

export default handlerMappings;
