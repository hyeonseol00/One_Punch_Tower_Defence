import { config } from '../../config/config.js';
import { getGameAssets } from '../../session/assets.session.js';

class User {
  constructor(userId, score, highScore) {
    const gameAssets = getGameAssets();

    this.id = userId;
    this.gold = gameAssets.commonData.user_gold;
    this.hp = gameAssets.commonData.base_hp;
    this.numOfInitialTowers = gameAssets.commonData.num_of_initial_towers;
    this.monsterLevel = 1;
    this.score = score;
    this.highScore = highScore;
    this.towerCoords = [];
    this.towerIsUpgrades = [];

    this.initPaths();
    this.placeInitialTowers();
  }

  initPaths() {
    const newPaths = [];

    newPaths.push(this.getNewPath(230));
    newPaths.push(this.getNewPath(430));
    for (let i = 1; i < newPaths.length; i++) {
      for (let j = 1; j <= 3; j++) {
        newPaths[i][newPaths[i].length - j] = newPaths[0].at(-j);
      }
    }

    this.monsterPaths = newPaths;
    this.basePosition = newPaths[0].at(-1);
  }

  getNewPath(inductionY) {
    const path = [];
    let currentX = 0;
    let currentY = Math.floor(Math.random() * 21) + inductionY; // 500 ~ 520 범위의 y 시작 (캔버스 y축 중간쯤에서 시작할 수 있도록 유도)

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

    return path;
  }

  placeInitialTowers() {
    for (let i = 0; i < this.numOfInitialTowers; i++) {
      const pathIdx = i % this.monsterPaths.length;
      const segmentIndex = Math.floor(Math.random() * (this.monsterPaths[pathIdx].length - 4));
      const startX = this.monsterPaths[pathIdx][segmentIndex].x;
      const startY = this.monsterPaths[pathIdx][segmentIndex].y;
      const endX = this.monsterPaths[pathIdx][segmentIndex + 1].x;
      const endY = this.monsterPaths[pathIdx][segmentIndex + 1].y;
      const maxDistance = 100;

      const t = Math.random();
      const posX = startX + t * (endX - startX);
      const posY = startY + t * (endY - startY);

      const offsetX = (Math.random() - 0.5) * 2 * maxDistance;
      const offsetY = (Math.random() - 0.5) * 2 * maxDistance;

      const x = posX + offsetX;
      const y = posY + offsetY;

      this.towerCoords.push({ x, y });
      this.towerIsUpgrades.push(false);
    }
  }
}

export default User;
