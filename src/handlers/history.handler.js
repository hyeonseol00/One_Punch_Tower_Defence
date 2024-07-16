import { createHistory } from '../models/history.model.js';

export const saveHistory = async (userId, payload, socket, io) => {
  const { myId, opponentId } = payload;

  await createHistory(myId, opponentId);
};
