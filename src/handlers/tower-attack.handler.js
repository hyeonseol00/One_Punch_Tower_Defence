export const towerAttackHandler = async (userId, payload, socket) => {
  socket.to('gameSession').emit('opponentMonsterSpawn', {
    status: 'success',
    message: '상대 타워가 몬스터를 공격했습니다.',
    data: { towerIdx: payload.towerIdx, monsterIdx: payload.monsterIdx },
  });
};
