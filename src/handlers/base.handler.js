import { getUserData, updateUserData } from '../models/user-data.model.js';

export const baseUnderAttackHandler = async (userId, payload, socket) => {
  const userData = await getUserData(userId);

  if (userData.hp < payload.hp)
    return { status: 'fail', message: '기지 체력 데이터가 잘못되었습니다!' };

  userData.hp -= payload.damage;

  await updateUserData(userData);

  socket.emit('baseHitted', {
    status: 'success',
    message: '기지가 피격당했습니다!',
    data: { hp: userData.hp },
  });
  socket.to('gameSesseion').emit('opponentBaseHitted', {
    status: 'success',
    message: '상대 기지가 피격당했습니다!',
    data: { opponentHp: userData.hp },
  });
};
