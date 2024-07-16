import { CLIENT_VERSION } from '../constants.js';
import { getGameAssets } from '../session/assets.session.js';
import { createHistory } from '../models/history.model.js';
import { getUsers, removeUser } from '../models/user.model.js';
import { gameSessions } from '../session/session.js';
import handlerMappings from './handlerMapping.js';

export const handleDisconnect = async (socket, userID) => {
  const myUser = gameSessions.findIndex((user) => user.id === userID);
  const opponentUser = gameSessions.findIndex((user) => user.id !== userID);

  if (myUser !== -1 && opponentUser !== -1) {
    createHistory(gameSessions[myUser].id, gameSessions[opponentUser].id);
  }

  gameSessions.splice(myUser, 1);

  await removeUser(socket.id);

  console.log(`사용자 접속 해제: ${socket.id}`);
  console.log('현재 접속 중인 사용자:', await getUsers());
};

export const handleConnection = async (socket, userUUID) => {
  console.log(
    `새로운 사용자가 접속했습니다: \"${socket.id}\"소켓으로 \"${userUUID}\"사용자가 접속했습니다.`,
  );
  console.log('현재 접속 중인 사용자:', await getUsers());

  const { monster, commonData } = getGameAssets();

  socket.emit('connection', {
    towerCost: commonData.tower_cost,
    monsterSpawnInterval: monster[0].spawn_interval,
  });
};

export const handleEvent = async (io, socket, data) => {
  if (!CLIENT_VERSION.includes(data.clientVersion)) {
    socket.emit('response', {
      status: 'fail',
      message: '클라이언트 버전이 매치되지 않습니다.',
    });
    return;
  }

  const handler = handlerMappings[data.handlerId];
  if (!handler) {
    socket.emit('response', {
      status: 'fail',
      message: '핸들러를 찾지 못했습니다.',
    });
    return;
  }

  await handler(data.userId, data.payload, socket, io);
};
