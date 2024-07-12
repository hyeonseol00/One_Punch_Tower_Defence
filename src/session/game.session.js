import { gameSessions } from './session.js';

export const addQue = (id) => {
  const user = { id };

  gameSessions.push(user);
};
