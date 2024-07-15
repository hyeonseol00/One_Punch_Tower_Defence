import { config } from '../../config/config.js';
import { getGameAssets } from '../../init/assets.js';

class User {
  constructor(userId, score, highScore) {
    const gameAssets = getGameAssets();

    this.id = userId;
    this.gold = gameAssets.commonData.user_gold;
    this.hp = gameAssets.commonData.base_hp;
    this.numOfInitialTowers = 0;
    this.monsterLevel = 1;
    this.score = score;
    this.highScore = highScore;
    this.towerCoords = [];

    this.makePath();
    this.placeInitialTowers();
  }

  makePath() {
    const path = [];
    let currentX = 0;
    let currentY = Math.floor(Math.random() * 21) + 330; // 500 ~ 520 범위의 y 시작 (캔버스 y축 중간쯤에서 시작할 수 있도록 유도)

    path.push({ x: currentX, y: currentY });

    while (currentX < config.canvas.width) {
      currentX += Math.floor(Math.random() * 100) + 50; // 50 ~ 150 범위의 x 증가
      // x 좌표에 대한 clamp 처리
      if (currentX > config.canvas.width) {
        currentX = config.canvas.width;
      }

      currentY += Math.floor(Math.random() * 100) - 50; // -100 ~ 100 범위의 y 변경
      // y 좌표에 대한 clamp 처리
      if (currentY < 0) {
        currentY = 0;
      }
      if (currentY > config.canvas.height) {
        currentY = config.canvas.height;
      }

      path.push({ x: currentX, y: currentY });
    }

    this.monsterPath = path;
    this.basePosition = path.at(-1);
  }

  placeInitialTowers() {
    for (let i = 0; i < this.numOfInitialTowers; i++) {
      const segmentIndex = Math.floor(Math.random() * (this.monsterPath.length - 1));
      const startX = this.monsterPath[segmentIndex].x;
      const startY = this.monsterPath[segmentIndex].y;
      const endX = this.monsterPath[segmentIndex + 1].x;
      const endY = this.monsterPath[segmentIndex + 1].y;
      const maxDistance = 100;

      const t = Math.random();
      const posX = startX + t * (endX - startX);
      const posY = startY + t * (endY - startY);

      const offsetX = (Math.random() - 0.5) * 2 * maxDistance;
      const offsetY = (Math.random() - 0.5) * 2 * maxDistance;

      const x = posX + offsetX;
      const y = posY + offsetY;

      this.towerCoords.push({ x, y });
    }
  }
}

export default User;
