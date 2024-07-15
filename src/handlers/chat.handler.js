export const receiveMessage = (io, payload, socket) => {
  const { myId, message: post } = payload;

  const content = `${myId}: ${post}`;

  io.emit('messageReceived', {
    status: 'success',
    message: '메시지 전송 성공',
    data: { content },
  });
};
