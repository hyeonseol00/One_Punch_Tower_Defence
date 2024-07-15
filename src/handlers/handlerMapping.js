import { baseUnderAttackHandler } from './base.handler.js';
import { receiveMessage } from './chat.handler.js';
import { gameEnd, gameStart } from './game.handler.js';
import {
  killMonsterHandler,
  killTreasureGoblinHandler,
  spawnMonsterHandler,
} from './monster.handler.js';
import { towerAttackHandler } from './tower-attack.handler.js';
import { placeTowerHandler, refundTowerHandler, upgradeTowerHandler } from './tower.handler.js';

const handlerMappings = {
  2: gameStart,
  3: gameEnd,
  22: placeTowerHandler,
  23: killMonsterHandler,
  24: baseUnderAttackHandler,
  25: refundTowerHandler,
  26: upgradeTowerHandler,
  27: killTreasureGoblinHandler,
  50: receiveMessage,
  101: spawnMonsterHandler,
  102: towerAttackHandler,
};

export default handlerMappings;
