import { CLIENT_VERSION } from '../constants.js';
import { getGameAssets } from '../init/assets.js';
import { getUsers, removeUser } from '../models/user.model.js';
import handlerMappings from './handlerMapping.js';

export const handleDisconnect = (socket, uuid) => {
  removeUser(socket.id);
  console.log(`사용자 접속 해제: ${socket.id}`);
  console.log('현재 접속 중인 사용자:', getUsers());
};

export const handleConnection = (socket, userUUID) => {
  console.log(
    `새로운 사용자가 접속했습니다: \"${socket.id}\"소켓으로 \"${userUUID}\"사용자가 접속했습니다.`,
  );
  console.log('현재 접속 중인 사용자:', getUsers());

  const { monster, commonData } = getGameAssets();

  socket.emit('connection', {
    uuid: userUUID,
    monster: monster.data[0],
    commonData,
  });
};

export const handleEvent = (io, socket, data) => {
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

  const response = handler(data.userId, data.payload);
  if (response.broadcast) {
    io.emit('response', 'broadcast');
    return;
  }

  if (response.data) socket.emit('dataSync', response);
  socket.emit('response', response);
};

export const wrap = (middleware) => (socket, next) =>
  middleware(socket.request, socket.request.res || {}, next);
