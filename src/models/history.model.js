import { prisma } from '../utils/prisma/index.js';

export const createHistory = async (userIdA, userIdB) => {
  await prisma.match_history.create({
    data: {
      userIdA: userIdA,
      userIdB: userIdB,
      userIdWinner: userIdB,
    },
  });
};
