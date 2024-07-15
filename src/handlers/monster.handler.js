import { plugin } from 'mongoose';
import { getGameAssets } from '../init/assets.js';
import { getUserData, updateUserData } from '../models/user-data.model.js';

async function monsterLevelUp(userData) {
  const { monster, commonData } = getGameAssets();

  userData.monster_level++;
  userData.monster_spawn_interval = monster[userData.monster_level - 1].spawn_interval;
  userData.gold += commonData.tower_cost;

  await updateUserData(userData);

  return {
    status: 'success',
    message: '몬스터를 처치했습니다, 몬스터가 강해집니다!',
    data: {
      score: userData.score,
      monster: monster[userData.monster_level - 1],
      gold: userData.gold,
    },
  };
}

export const spawnMonsterHandler = async (userId, payload, socket) => {
  socket.to('gameSession').emit('opponentMonsterSpawn', {
    status: 'success',
    message: '상대 몬스터가 스폰되었습니다.',
    data: { monsterNumber: payload.monsterNumber },
  });
};

export const killMonsterHandler = async (userId, payload, socket) => {
  const { monster } = getGameAssets();
  const userData = await getUserData(userId);

  if (Math.abs(userData.score - payload.score) >= 200)
    return { status: 'fail', message: '점수 데이터가 잘못되었습니다!' };

  userData.score += 100;

  const sendToOppo = socket.to('gameSession').emit('opponentMonsterKill', {
    status: 'success',
    message: '상대가 몬스터를 죽였습니다.',
    data: { opponentMonsterIdx: payload.monsterIndex },
  });

  if (userData.monster_level < monster.length && userData.monster_level <= userData.score / 2000) {
    const response = await monsterLevelUp(userData);

    sendToOppo;
    socket.emit('monsterKill', response);
    return;
  }

  await updateUserData(userData);

  sendToOppo;
  socket.emit('monsterKill', {
    status: 'success',
    message: '몬스터를 죽였습니다.',
    data: { score: userData.score },
  });
};

export const killTreasureGoblinHandler = async (userId, payload) => {
  const { monster, commonData } = getGameAssets();
  const userData = await getUserData(userId);
  let response;

  if (Math.abs(userData.score - payload.score) >= 200)
    return { status: 'fail', message: '점수 데이터가 잘못되었습니다!' };

  userData.score += 300;
  userData.gold += commonData.tower_cost * 2;

  if (userData.monster_level < monster.length && userData.monster_level <= userData.score / 2000) {
    response = await monsterLevelUp(userData);
  }

  if (response) {
    response.message = '보물 고블린을 처치했습니다! 특별 보상을 받으며 몬스터가 강해집니다!';
  } else {
    response = {
      status: 'success',
      message: '보물 고블린을 처치했습니다! 특별 보상을 받습니다.',
      data: userData,
    };
  }

  await updateUserData(userData);

  return response;
};
