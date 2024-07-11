import { prisma } from '../utils/prisma/index.js';

export const addAccount = async (account) => {
  await prisma.accounts.create({
    data: {
      id: account.id,
      password: account.password,
    },
  });
};

export const getAccounts = async () => {
  const accounts = prisma.accounts.findMany({});

  return accounts;
};
