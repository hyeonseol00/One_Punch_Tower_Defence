import { createHistory } from '../models/history.model.js';
import { getUserData } from '../models/user-data.model.js';

export const saveHistory = async (userId, payload, socket, io) => {
  const { myId, opponentId } = payload;

  const myData = await getUserData(myId);
  const opponentData = await getUserData(opponentId);

  await createHistory(myData.account_id, myData.score, opponentData.account_id, opponentData.score);
};
