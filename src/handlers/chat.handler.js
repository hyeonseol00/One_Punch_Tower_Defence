export const receiveMessage = (userId, payload, socket, io) => {
  const { myId, message: post } = payload;

  const content = `${myId}: ${post}`;
  //보내는 동시에 자기자신에게도 메시지 보내야함
  io.to('gameSession').emit('messageReceived', {
    status: 'success',
    message: '메시지 전송 성공',
    data: { content },
  });
};
