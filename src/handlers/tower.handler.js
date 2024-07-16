import { getGameAssets } from '../init/assets.js';
import { getUserData, updateUserData } from '../models/user-data.model.js';

export const placeTowerHandler = async (userId, payload, socket) => {
  const userData = await getUserData(userId);
  const { commonData } = getGameAssets();

  if (userData.gold < commonData.tower_cost)
    return { status: 'fail', message: '돈이 부족해 구매에 실패했습니다!' };

  userData.gold -= commonData.tower_cost;
  userData.tower_coordinates.push({
    x: payload.x,
    y: payload.y,
  });
  userData.tower_isUpgrades.push(false);
  await updateUserData(userData);

  // 다른 클라이언트에 데이터 전송
  socket.to('gameSession').emit('opponentTowerPlaced', {
    status: 'success',
    message: '상대가 타워 하나를 구매했습니다.',
    data: { x: payload.x, y: payload.y },
  });

  socket.emit('towerPlaced', {
    status: 'success',
    message: '구매한 타워가 성공적으로 배치되었습니다.',
    data: { gold: userData.gold },
  });
};

export const refundTowerHandler = async (userId, payload) => {
  const userData = await getUserData(userId);
  const { commonData } = getGameAssets();

  if (userData.tower_coordinates.length <= 0)
    return { status: 'fail', message: '환불할 수 있는 타워가 없습니다!' };

  if (userData.tower_isUpgrades.at(-1)) {
    userData.gold += commonData.tower_cost * 2;
  } else {
    userData.gold += commonData.tower_cost;
  }
  userData.tower_coordinates.pop();
  userData.tower_isUpgrades.pop();
  await updateUserData(userData);

  return {
    status: 'success',
    message: '마지막으로 설치한 타워가 성공적으로 환불되었습니다.',
    refundTower: userData,
  };
};

export const upgradeTowerHandler = async (userId, payload, socket) => {
  const userData = await getUserData(userId);
  const { commonData } = getGameAssets();

  if (userData.tower_isUpgrades.findIndex((bool) => bool == false) == -1) {
    socket.emit('response', {
      status: 'fail',
      message: '업그레이드 할 수 있는 타워가 없습니다!',
    });
    return;
  }

  if (userData.gold < commonData.tower_cost) {
    socket.emit('response', {
      status: 'fail',
      message: '업그레이드에 필요한 골드가 부족합니다!',
    });
    return;
  }

  let randIdx;
  do {
    randIdx = Math.floor(Math.random() * userData.tower_isUpgrades.length);
  } while (userData.tower_isUpgrades[randIdx] != false);

  userData.gold -= commonData.tower_cost;
  userData.tower_isUpgrades[randIdx] = true;
  await updateUserData(userData);

  socket.emit('upgradeTower', {
    status: 'success',
    message: '타워 하나가 성공적으로 업그레이드 되었습니다.',
    data: { gold: userData.gold, towerIdx: randIdx },
  });
  socket.to('gameSession').emit('opponentUpgradeTower', {
    status: 'success',
    message: '상대방의 타워 하나가 업그레이드 되었습니다.',
    data: { towerIdx: randIdx },
  });
};
