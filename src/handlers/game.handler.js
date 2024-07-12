import { getGameAssets } from '../init/assets.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import { getHighScore, updateHighScore } from '../models/high-score.model.js';
import { getUserData, updateUserData } from '../models/user-data.model.js';
import { addQue } from '../session/game.session.js';
import { gameSessions } from '../session/sessions.js';

export const gameStart = (userId, payload) => {
  return { status: 'success', message: '게임이 정상적으로 실행되었습니다.' };
};
export const gameMatch = async (userId, payload)=>{
  addQue(socket, userId);
  let gameReady = false;
  if(gameSessions.length > 1){
    gameReady = true;
  }
}

export const gameEnd = async (userId, payload) => {
  const userData = await getUserData(userId);

  if (Math.abs(userData.score - payload.score) >= 200)
    return { status: 'fail', message: '점수 데이터가 잘못되었습니다!' };

  if (userData.user_high_score < payload.score)
    userData.user_high_score = payload.score;

  await updateUserData(userData); 

  const highScore = await getHighScore();

  if (highScore < payload.score) {
    await updateHighScore(payload.score);
    return {
      status: 'success',
      message: '게임 종료, 최고기록이 갱신되었습니다!',
      broadcast: {
        message: '서버 최고기록이 갱신되었습니다!',
        userId,
        highscore: payload.score,
      },
    };
  }

  return { status: 'success', message: '게임 종료!', data: userData };
};
