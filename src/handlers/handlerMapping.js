import { baseUnderAttackHandler } from './base.handler.js';
import { receiveMessage } from './chat.handler.js';
import { gameEnd } from './game.handler.js';
import { saveHistory } from './history.handler.js';
import { killMonsterHandler, spawnMonsterHandler } from './monster.handler.js';
import { towerAttackHandler } from './tower-attack.handler.js';
import { placeTowerHandler, refundTowerHandler, upgradeTowerHandler } from './tower.handler.js';

const handlerMappings = {
  3: gameEnd,
  4: saveHistory,
  22: placeTowerHandler,
  23: killMonsterHandler,
  24: baseUnderAttackHandler,
  25: refundTowerHandler,
  26: upgradeTowerHandler,
  50: receiveMessage,
  101: spawnMonsterHandler,
  102: towerAttackHandler,
};

export default handlerMappings;
