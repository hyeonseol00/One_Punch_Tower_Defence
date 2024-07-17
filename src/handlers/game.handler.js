import User from '../classes/models/user.class.js';
import { getHighScore, updateHighScore } from '../models/high-score.model.js';
import { getUserData, updateUserData } from '../models/user-data.model.js';
import { addQueue, getGameSession } from '../session/game.session.js';

export const gameMatch = async (userId, io, socket) => {
  const userData = await getUserData(userId);
  const { score, user_high_score: highScore } = userData;

  const user = new User(userId, score, highScore);

  userData.tower_coordinates = user.towerCoords;
  userData.tower_is_upgrades = user.towerIsUpgrades;
  updateUserData(userData);

  addQueue(user);
  socket.join('gameSession');

  const gameSession = getGameSession();
  if (gameSession.length > 1) {
    io.emit('matchFound', {
      status: 'success',
      message: '매칭이 성사되었습니다, 게임이 3초 뒤 시작됩니다!',
      data: { gameSession },
    });
  }
};

export const gameEnd = async (userId, payload, socket, io) => {
  const userData = await getUserData(userId);

  if (Math.abs(userData.score - payload.score) >= 200) {
    socket.emit('response', { status: 'fail', message: '점수 데이터가 잘못되었습니다!' });
    return;
  }

  if (userData.user_high_score < payload.score) {
    userData.user_high_score = payload.score;
  }

  await updateUserData(userData);

  const highScore = await getHighScore();

  if (highScore < payload.score) {
    await updateHighScore(payload.score);
    io.emit('response', {
      status: 'success',
      message: '게임 종료, 최고기록이 갱신되었습니다!',
      data: { userId, highscore: payload.score },
    });
    return;
  }

  socket.emit('response', { status: 'success', message: '게임 종료!', data: userData });
};
