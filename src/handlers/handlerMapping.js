import { baseUnderAttackHandler } from './base.handler.js';
import { receiveMessage } from './chat.handler.js';
import { gameEnd } from './game.handler.js';
import { killMonsterHandler, spawnMonsterHandler } from './monster.handler.js';
import { towerAttackHandler } from './tower-attack.handler.js';
import { placeTowerHandler, refundTowerHandler, upgradeTowerHandler } from './tower.handler.js';

const handlerMappings = {
  3: gameEnd,

  21: placeTowerHandler,
  22: refundTowerHandler,
  23: upgradeTowerHandler,
  24: towerAttackHandler,

  31: spawnMonsterHandler,
  32: killMonsterHandler,
  33: baseUnderAttackHandler,

  101: receiveMessage,
};

export default handlerMappings;
