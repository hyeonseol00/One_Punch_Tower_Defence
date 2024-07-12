import { gameSessions } from './session.js';

export const addQueue = (user) => {
  gameSessions.push(user);
};

export function getGameSession() {
  return [...gameSessions];
}
