import { getGameAssets } from '../session/assets.session.js';
import { getUserData, updateUserData } from '../models/user-data.model.js';
import { config } from '../config/config.js';
import { createData } from '../utils/response/createData.js';

async function monsterLevelUp(userData) {
  const { monster, commonData } = getGameAssets();

  userData.monster_level++;
  userData.monster_spawn_interval = monster[userData.monster_level - 1].spawn_interval;
  userData.gold += config.reward.levelUpReward;

  await updateUserData(userData);

  return {
    status: 'success',
    message: '몬스터를 처치했습니다, 몬스터가 강해집니다!',
    data: {
      score: userData.score,
      monsterLevel: userData.monster_level,
      gold: userData.gold,
    },
  };
}

export const spawnMonsterHandler = async (userId, payload, socket) => {
  const data = { monsterNumber: payload.monsterNumber, pathIdx: payload.pathIdx };

  socket.to('gameSession').emit('opponentMonsterSpawn', {
    status: 'success',
    message: '상대 몬스터가 스폰되었습니다.',
    data: createData(data),
  });
};

export const killMonsterHandler = async (userId, payload, socket) => {
  const { monster } = getGameAssets();
  const userData = await getUserData(userId);

  if (Math.abs(userData.score - payload.score) >= 200) {
    socket.emit('response', { status: 'fail', message: '점수 데이터가 잘못되었습니다!' });
    return;
  }

  userData.score += 100;
  userData.gold += config.reward.killReward;

  const sendToOpponent = () => {
    socket.to('gameSession').emit('opponentMonsterKill', {
      status: 'success',
      message: '상대가 몬스터를 죽였습니다.',
      data: { opponentMonsterIdx: payload.monsterIndex },
    });
  };

  if (userData.monster_level < monster.length && userData.monster_level <= userData.score / 2000) {
    const response = await monsterLevelUp(userData);

    sendToOpponent();
    socket.emit('monsterLevelUp', response);
    return;
  }

  await updateUserData(userData);

  sendToOpponent();
  socket.emit('monsterKill', {
    status: 'success',
    message: '몬스터를 죽였습니다.',
    data: { score: userData.score, gold: userData.gold },
  });
};
