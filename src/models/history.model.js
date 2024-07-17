import { prisma } from '../utils/prisma/index.js';

export const createHistory = async (userIdA, scoreA, userIdB, scoreB) => {
  await prisma.match_history.create({
    data: {
      userIdA: userIdA,
      scoreA: scoreA,
      userIdB: userIdB,
      scoreB: scoreB,
      userIdWinner: userIdB,
    },
  });
};
