import { CLIENT_VERSION } from '../constants.js';
import { getGameAssets } from '../session/assets.session.js';
import { createHistory } from '../models/history.model.js';
import { getUsers, removeUser } from '../models/user.model.js';
import { gameSessions } from '../session/session.js';
import handlerMappings from './handlerMapping.js';

export const handleDisconnect = async (socket, userID, io) => {
  const myUser = gameSessions.findIndex((user) => user.id === userID);
  const opponentUser = gameSessions.findIndex((user) => user.id !== userID);

  gameSessions.splice(myUser, 1);

  if (gameSessions.length > 0) {
    io.to('gameSession').emit('gameOver', {
      status: 'success',
      message: '당신이 이겼습니다!',
      data: { isWin: true },
    });
  }

  await removeUser(socket.id);

  console.log(`사용자 접속 해제: ${socket.id}`);
  console.log('현재 접속 중인 사용자:', await getUsers());
};

export const handleConnection = async (socket, userUUID) => {
  console.log(
    `새로운 사용자가 접속했습니다: \"${socket.id}\"소켓으로 \"${userUUID}\"사용자가 접속했습니다.`,
  );
  console.log('현재 접속 중인 사용자:', await getUsers());

  const gameAssets = getGameAssets();

  socket.emit('connection', {
    status: 'success',
    message: '서버에 성공적으로 연결되었습니다.',
    data: { gameAssets },
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
