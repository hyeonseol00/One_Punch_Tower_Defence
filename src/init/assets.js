import commonDataSchema from '../mongodb/schemas/common-data.schema.js';
import monsterSchema from '../mongodb/schemas/monster.schema.js';
import { gameAssets } from '../session/session.js';

export const loadGameAssets = async () => {
  try {
    const [monster, commonData] = await Promise.all([
      monsterSchema.find().exec(),
      commonDataSchema.findOne().exec(),
    ]);
    gameAssets.monster = monster;
    gameAssets.commonData = commonData;
    return gameAssets;
  } catch (error) {
    throw new Error('에셋 데이터 로드에 실패했습니다: ' + error.message);
  }
};
