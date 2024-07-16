import { Base } from './base.js';
import { Monster } from './monster.js';
import { Tower } from './tower.js';

const CLIENT_VERSION = '1.0.0';

if (!localStorage.getItem('token1')) {
  alert('로그인이 필요합니다.');
  location.href = '/login.html';
}

let serverSocket;
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const opponentCanvas = document.getElementById('opponentCanvas');
const opponentCtx = opponentCanvas.getContext('2d');

const progressBarContainer = document.getElementById('progressBarContainer');
const progressBarMessage = document.getElementById('progressBarMessage');
const progressBar = document.getElementById('progressBar');
const loader = document.getElementsByClassName('loader')[0];

const NUM_OF_MONSTERS = 5; // 몬스터 개수
// 게임 데이터
let towerCost = 0; // 타워 구입 비용
let monsterSpawnInterval = 0; // 몬스터 생성 주기

// 유저 데이터
let userGold = 0; // 유저 골드
let base; // 기지 객체
let baseHp = 0; // 기지 체력
let monsterLevel = 0; // 몬스터 레벨
let monsterPaths; // 몬스터 경로
let initialTowerCoords; // 초기 타워 좌표
let basePosition; // 기지 좌표
const monsters = []; // 유저 몬스터 목록
const towers = []; // 유저 타워 목록
let score = 0; // 게임 점수
let highScore = 0; // 기존 최고 점수
let myId; // 내 아이디
let spawnMonsterPathCount = 0;

// 상대 데이터
let opponentBase; // 상대방 기지 객체
let opponentMonsterPaths; // 상대방 몬스터 경로
let opponentInitialTowerCoords; // 상대방 초기 타워 좌표
let opponentBasePosition; // 상대방 기지 좌표
const opponentMonsters = []; // 상대방 몬스터 목록
const opponentTowers = []; // 상대방 타워 목록
let opponentId; // 상대방 아이디

let isInitGame = false;
let isBuyMode = false; // 타워 구입 모드(기본off)
let isRefundMode = false;
let isUpgradeMode = false;

// 이미지 로딩 파트
const backgroundImage = new Image();
backgroundImage.src = 'images/bg.webp';

const towerImage = new Image();
towerImage.src = 'images/tower.png';

const upgradedtowerImage = new Image();
upgradedtowerImage.src = 'images/tower_upgraded.png';

const baseImage = new Image();
baseImage.src = 'images/base.png';

const pathImage = new Image();
pathImage.src = 'images/path.png';

const monsterImages = [];
for (let i = 1; i <= NUM_OF_MONSTERS; i++) {
  const img = new Image();
  img.src = `images/monster${i}.png`;
  monsterImages.push(img);
}

const chatBox = document.getElementById('chatBox');
const chatInput = document.getElementById('chatInput');

chatInput.addEventListener('keydown', function (event) {
  if (event.key == 'Enter') {
    const message = chatInput.value;
    chatInput.value = '';
    sendEvent(101, { myId, message });
  }
});

function initMap() {
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height); // 배경 이미지 그리기
  for (let i = 0; i < monsterPaths.length; i++) {
    drawPath(monsterPaths[i], ctx);
    drawPath(opponentMonsterPaths[i], opponentCtx);
  }
  placeInitialTowers(initialTowerCoords, towers, ctx); // 초기 타워 배치
  placeInitialTowers(opponentInitialTowerCoords, opponentTowers, opponentCtx); // 상대방 초기 타워 배치
  placeBase(basePosition, true);
  placeBase(opponentBasePosition, false);
}

function drawPath(path, context) {
  const segmentLength = 10; // 몬스터 경로 세그먼트 길이
  const imageWidth = 30; // 몬스터 경로 이미지 너비
  const imageHeight = 30; // 몬스터 경로 이미지 높이
  const gap = 3; // 몬스터 경로 이미지 겹침 방지를 위한 간격

  for (let i = 0; i < path.length - 1; i++) {
    const startX = path[i].x;
    const startY = path[i].y;
    const endX = path[i + 1].x;
    const endY = path[i + 1].y;

    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY); // 피타고라스 정리로 두 점 사이의 거리를 구함 (유클리드 거리)
    const angle = Math.atan2(deltaY, deltaX); // 두 점 사이의 각도를 tan-1(y/x)로 구해야 함 (자세한 것은 역삼각함수 참고): 삼각함수는 변의 비율! 역삼각함수는 각도를 구하는 것!

    for (let j = gap; j < distance - gap; j += segmentLength) {
      const x = startX + Math.cos(angle) * j; // 다음 이미지 x좌표 계산(각도의 코사인 값은 x축 방향의 단위 벡터 * j를 곱하여 경로를 따라 이동한 x축 좌표를 구함)
      const y = startY + Math.sin(angle) * j; // 다음 이미지 y좌표 계산(각도의 사인 값은 y축 방향의 단위 벡터 * j를 곱하여 경로를 따라 이동한 y축 좌표를 구함)
      drawRotatedImage(pathImage, x, y, imageWidth, imageHeight, angle, context);
    }
  }
}

function drawRotatedImage(image, x, y, width, height, angle, context) {
  context.save();
  context.translate(x + width / 2, y + height / 2);
  context.rotate(angle);
  context.drawImage(image, -width / 2, -height / 2, width, height);
  context.restore();
}

function placeInitialTowers(initialTowerCoords, initialTowers, context) {
  initialTowerCoords.forEach((towerCoords) => {
    const tower = new Tower(towerCoords.x, towerCoords.y);
    initialTowers.push(tower);
    tower.draw(context, towerImage);
  });
}

function placeNewTower() {
  const tempIsBuyMode = !isBuyMode;

  initControlModes();
  isBuyMode = tempIsBuyMode;

  if (isBuyMode) buyTowerButton.style.background = 'green';
  else buyTowerButton.style.background = 'buttonface';
}

function refundTower() {
  const tempIsRefundMode = !isRefundMode;

  initControlModes();
  isRefundMode = tempIsRefundMode;

  if (isRefundMode) refundTowerButton.style.background = 'green';
  else refundTowerButton.style.background = 'buttonface';
}

function upgradeTower() {
  const tempIsUpgradeMode = !isUpgradeMode;

  initControlModes();
  isUpgradeMode = tempIsUpgradeMode;

  if (isUpgradeMode) upgradeTowerButton.style.background = 'green';
  else upgradeTowerButton.style.background = 'buttonface';
}

function initControlModes() {
  isBuyMode = false;
  isRefundMode = false;
  isUpgradeMode = false;
  buyTowerButton.style.background = 'buttonface';
  refundTowerButton.style.background = 'buttonface';
  upgradeTowerButton.style.background = 'buttonface';
}

canvas.addEventListener('click', (event) => {
  const rect = canvas.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  const clickY = event.clientY - rect.top;
  const refundRangeX = 18;
  const refundRangeY = 37;
  const targetIdx = towers.findIndex((tower) => {
    if (
      tower.x < clickX &&
      clickX < tower.x + tower.width &&
      tower.y < clickY &&
      clickY < tower.y + tower.height
    )
      return true;
  });

  if (isBuyMode) {
    if (userGold >= towerCost) {
      const x = clickX - refundRangeX;
      const y = clickY - refundRangeY;

      const tower = new Tower(x, y);
      towers.push(tower);
      sendEvent(21, { x, y, userGold }); // 타워 생성 후 좌표 보내기
      tower.draw(ctx, towerImage);
    } else {
      console.log('골드가 부족합니다.');
      return;
    }
    initControlModes();
  } else if (isRefundMode) {
    if (targetIdx != -1) {
      sendEvent(22, { towerIdx: targetIdx });
      initControlModes();
    }
  } else if (isUpgradeMode) {
    if (targetIdx != -1) {
      sendEvent(23, { towerIdx: targetIdx });
      initControlModes();
    }
  }
});

function placeBase(position, isPlayer) {
  if (isPlayer) {
    base = new Base(position.x, position.y, baseHp);
    base.draw(ctx, baseImage);
  } else {
    opponentBase = new Base(position.x, position.y, baseHp);
    opponentBase.draw(opponentCtx, baseImage, true);
  }
}

function spawnMonster() {
  const newMonster = new Monster(monsterPaths[spawnMonsterPathCount], monsterImages, monsterLevel);
  monsters.push(newMonster);

  // TODO. 서버로 몬스터 생성 이벤트 전송
  sendEvent(31, { monsterNumber: newMonster.monsterNumber, pathIdx: spawnMonsterPathCount });

  if (++spawnMonsterPathCount >= monsterPaths.length) {
    spawnMonsterPathCount = 0;
  }
}

function gameLoop() {
  // 렌더링 시에는 항상 배경 이미지부터 그려야 합니다! 그래야 다른 이미지들이 배경 이미지 위에 그려져요!
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height); // 배경 이미지 다시 그리기
  for (let i = 0; i < monsterPaths.length; i++) {
    drawPath(monsterPaths[i], ctx); // 경로 다시 그리기
  }

  ctx.font = '25px Times New Roman';
  ctx.fillStyle = 'skyblue';
  ctx.fillText(`최고 기록: ${highScore}`, 100, 50); // 최고 기록 표시
  ctx.fillStyle = 'white';
  ctx.fillText(`점수: ${score}`, 100, 100); // 현재 스코어 표시
  ctx.fillStyle = 'yellow';
  ctx.fillText(`골드: ${userGold}`, 100, 150); // 골드 표시
  ctx.fillStyle = 'black';
  ctx.fillText(`현재 레벨: ${monsterLevel}`, 100, 200); // 최고 기록 표시

  // 타워 그리기 및 몬스터 공격 처리
  towers.forEach((tower, towerIdx) => {
    const targetTowerImage = tower.isUpgraded ? upgradedtowerImage : towerImage;
    tower.draw(ctx, targetTowerImage);
    tower.updateCooldown();
    monsters.forEach((monster, monsterIdx) => {
      const distance = Math.sqrt(
        Math.pow(tower.x - monster.x, 2) + Math.pow(tower.y - monster.y, 2),
      );
      if (distance < tower.range) {
        tower.attack(monster);
        sendEvent(24, { towerIdx, monsterIdx });
      }
    });
  });

  // 몬스터가 공격을 했을 수 있으므로 기지 다시 그리기
  base.draw(ctx, baseImage);

  for (let i = monsters.length - 1; i >= 0; i--) {
    const monster = monsters[i];
    if (monster.hp > 0) {
      const Attacked = monster.move();
      monster.draw(ctx);
      if (Attacked) {
        const attackedSound = new Audio('sounds/attacked.wav');
        attackedSound.volume = 0.3;
        attackedSound.play();
        // TODO. 몬스터가 기지를 공격했을 때 서버로 이벤트 전송
        sendEvent(32, { monsterIndex: i, score });
        sendEvent(33, { hp: base.hp, damage: monster.attackPower });
        monsters.splice(i, 1);
      }
    } else {
      // TODO. 몬스터 사망 이벤트 전송
      sendEvent(32, { monsterIndex: i, score });
      monsters.splice(i, 1);
    }
  }

  // 상대방 게임 화면 업데이트
  opponentCtx.drawImage(backgroundImage, 0, 0, opponentCanvas.width, opponentCanvas.height);
  for (let i = 0; i < opponentMonsterPaths.length; i++) {
    drawPath(opponentMonsterPaths[i], opponentCtx); // 상대방 경로 다시 그리기
  }
  opponentTowers.forEach((tower) => {
    const targetTowerImage = tower.isUpgraded ? upgradedtowerImage : towerImage;
    tower.draw(opponentCtx, targetTowerImage);
    tower.updateCooldown(); // 적 타워의 쿨다운 업데이트
  });

  opponentMonsters.forEach((monster) => {
    monster.move();
    monster.draw(opponentCtx, true);
  });

  opponentBase.draw(opponentCtx, baseImage, true);

  requestAnimationFrame(gameLoop); // 지속적으로 다음 프레임에 gameLoop 함수 호출할 수 있도록 함
}

const songs = ['game-bgm1.mp3', 'game-bgm2.mp3', 'game-bgm3.mp3'];
const song = new Audio();
let currentMusic = Math.floor(Math.random() * songs.length);
const songLen = songs.length;

const songContainer = document.getElementById('song');
songContainer.appendChild(song);

function initGame() {
  if (isInitGame) {
    return;
  }

  playSong(currentMusic);

  initMap(); // 맵 초기화 (배경, 몬스터 경로 그리기)

  setInterval(spawnMonster, monsterSpawnInterval); // 설정된 몬스터 생성 주기마다 몬스터 생성
  gameLoop(); // 게임 루프 최초 실행
  isInitGame = true;
  document.getElementById('chatBox').style.display = 'block';
}

function playSong(index) {
  song.src = './sounds/' + songs[index];
  song.controls = true;
  song.autoplay = true;
  song.volume = 0.3;
  song.play();
}

song.addEventListener('ended', function playNext() {
  currentMusic++;
  if (currentMusic == songLen) {
    currentMusic = 0;
    playSong(currentMusic);
  } else {
    playSong(currentMusic);
  }
});

// 이미지 로딩 완료 후 서버와 연결하고 게임 초기화
Promise.all([
  new Promise((resolve) => (backgroundImage.onload = resolve)),
  new Promise((resolve) => (towerImage.onload = resolve)),
  new Promise((resolve) => (baseImage.onload = resolve)),
  new Promise((resolve) => (pathImage.onload = resolve)),
  ...monsterImages.map((img) => new Promise((resolve) => (img.onload = resolve))),
]).then(() => {
  serverSocket = io('http://localhost:3000', {
    auth: {
      token: localStorage.getItem('token1'),
    },
  });

  serverSocket.on('connect_error', (err) => {
    if (err.message === 'Authentication error') {
      alert('잘못된 토큰입니다.');
      location.href = '/login';
    }
  });

  serverSocket.on('connection', (data) => {
    // TODO. 서버와 연결되면 대결 대기열 큐 진입
    towerCost = data.towerCost;
    monsterSpawnInterval = data.monsterSpawnInterval;
  });

  serverSocket.on('matchFound', (data) => {
    // 상대가 매치되면 3초 뒤 게임 시작
    progressBarMessage.textContent = '게임이 3초 뒤에 시작됩니다.';

    let progressValue = 0;
    const progressInterval = setInterval(() => {
      progressValue += 10;
      progressBar.value = progressValue;
      progressBar.style.display = 'block';
      loader.style.display = 'none';

      if (progressValue >= 100) {
        clearInterval(progressInterval);
        progressBarContainer.style.display = 'none';
        progressBar.style.display = 'none';
        buyTowerButton.style.display = 'block';
        upgradeTowerButton.style.display = 'block';
        refundTowerButton.style.display = 'block';
        canvas.style.display = 'block';
        opponentCanvas.style.display = 'block';

        // TODO. 유저 및 상대방 유저 데이터 초기화
        if (!isInitGame) {
          const userId = localStorage.getItem('userId');
          const userData = data.find((ele) => ele.id == userId);
          const opponentUserData = data.find((ele) => ele.id != userId);

          console.log(userData, opponentUserData);

          userGold = userData.gold;
          baseHp = userData.hp;
          monsterLevel = userData.monsterLevel;
          monsterPaths = userData.monsterPaths;
          basePosition = userData.basePosition;
          score = userData.score;
          highScore = userData.highScore;
          initialTowerCoords = userData.towerCoords;
          myId = userData.id;

          opponentMonsterPaths = opponentUserData.monsterPaths;
          opponentBasePosition = opponentUserData.basePosition;
          opponentInitialTowerCoords = opponentUserData.towerCoords;
          opponentId = opponentUserData.id;

          initGame();
        }
      }
    }, 300);
  });

  serverSocket.on('messageReceived', (response) => {
    const { content } = response.data;
    if (content !== '') {
      const chatLog = document.getElementById('chatLog');
      const newMessage = document.createElement('p');
      newMessage.textContent = content;

      chatLog.appendChild(newMessage);
    }
  });

  serverSocket.on('baseHitted', (response) => {
    const { data } = response;
    base.changeHp(data.hp);
    console.log(response);
  });

  serverSocket.on('opponentMonsterSpawn', (response) => {
    const { data } = response;
    const newOpponentMonster = new Monster(
      opponentMonsterPaths[data.pathIdx],
      monsterImages,
      monsterLevel,
      data.monsterNumber,
    );
    opponentMonsters.push(newOpponentMonster);
    console.log(response);
  });

  serverSocket.on('opponentTowerAttack', (response) => {
    const { data } = response;
    opponentTowers[data.towerIdx].attack(opponentMonsters[data.monsterIdx]);
    // console.log(response);
  });

  serverSocket.on('opponentBaseHitted', (response) => {
    const { data } = response;
    opponentBase.hp = data.opponentHp;
    console.log(response);
  });

  serverSocket.on('towerPlaced', (response) => {
    const { data } = response;
    userGold = data.gold;
    console.log(response);
  });

  serverSocket.on('opponentTowerPlaced', (response) => {
    const { data } = response;
    const { x, y } = data;
    placeTowerFromOpponent(x, y);
    console.log(response);
  });

  serverSocket.on('monsterKill', (response) => {
    const { data } = response;
    score = data.score;

    if (data.monster) {
      monsterLevel = data.monster.level;
      monsterSpawnInterval = data.monster.spawn_interval;
      userGold = data.gold;
    }

    console.log(response);
  });

  serverSocket.on('opponentMonsterKill', (response) => {
    const { data } = response;

    opponentMonsters.splice(data.opponentMonsterIdx, 1);

    console.log(response);
  });

  serverSocket.on('upgradeTower', (response) => {
    const { data } = response;

    towers[data.towerIdx].isUpgraded = true;
    userGold = data.gold;
    towers[data.towerIdx].draw(ctx, upgradedtowerImage);

    console.log(response);
  });

  serverSocket.on('opponentUpgradeTower', (response) => {
    const { data } = response;

    opponentTowers[data.towerIdx].isUpgraded = true;
    opponentTowers[data.towerIdx].draw(ctx, upgradedtowerImage);

    console.log(response);
  });

  serverSocket.on('refundTower', (response) => {
    const { data } = response;

    towers.splice(data.towerIdx, 1);
    userGold = data.gold;

    console.log(response);
  });

  serverSocket.on('opponentRefundTower', (response) => {
    const { data } = response;

    opponentTowers.splice(data.towerIdx, 1);

    console.log(response);
  });

  serverSocket.on('gameOver', (response) => {
    song.pause();
    const { isWin } = response.data;
    const winSound = new Audio('sounds/win.wav');
    const loseSound = new Audio('sounds/lose.wav');
    winSound.volume = 0.3;
    loseSound.volume = 0.3;

    if (isWin) {
      winSound.play().then(() => {
        // TODO. 게임 종료 이벤트 전송
        sendEvent(3, { score });
        setTimeout(() => {
          alert('당신이 게임에서 승리했습니다!');
          location.reload();
        }, 100);
      });
    } else {
      loseSound.play().then(() => {
        // TODO. 게임 종료 이벤트 전송
        sendEvent(3, { score });
        sendEvent(4, { myId, opponentId });
        setTimeout(() => {
          alert('아쉽지만 대결에서 패배하셨습니다! 다음 대결에서는 꼭 이기세요!');
          location.reload();
        }, 100);
      });
    }
  });

  serverSocket.on('response', (response) => {
    console.log(response);
  });
});

const sendEvent = (handlerId, payload) => {
  serverSocket.emit('event', {
    userId: localStorage.getItem('userId'),
    clientVersion: CLIENT_VERSION,
    handlerId,
    payload,
  });
};

// 상대 타워 좌표 넣고 그리는 함수
const placeTowerFromOpponent = (x, y) => {
  const tower = new Tower(x, y);
  opponentTowers.push(tower);
  tower.draw(opponentCtx, towerImage);
};

const buyTowerButton = document.createElement('button');
buyTowerButton.textContent = '타워 구입';
buyTowerButton.style.position = 'absolute';
buyTowerButton.style.top = '10px';
buyTowerButton.style.right = '10px';
buyTowerButton.style.padding = '10px 20px';
buyTowerButton.style.fontSize = '16px';
buyTowerButton.style.cursor = 'pointer';
buyTowerButton.style.display = 'none';

buyTowerButton.addEventListener('click', placeNewTower);

document.body.appendChild(buyTowerButton);

const refundTowerButton = document.createElement('button');
refundTowerButton.textContent = '타워 환불';
refundTowerButton.style.position = 'absolute';
refundTowerButton.style.top = '10px';
refundTowerButton.style.right = '160px';
refundTowerButton.style.padding = '10px 20px';
refundTowerButton.style.fontSize = '16px';
refundTowerButton.style.cursor = 'pointer';
refundTowerButton.style.display = 'none';

refundTowerButton.addEventListener('click', refundTower);

document.body.appendChild(refundTowerButton);

const upgradeTowerButton = document.createElement('button');
upgradeTowerButton.textContent = '타워 업그레이드';
upgradeTowerButton.style.position = 'absolute';
upgradeTowerButton.style.top = '10px';
upgradeTowerButton.style.right = '310px';
upgradeTowerButton.style.padding = '10px 20px';
upgradeTowerButton.style.fontSize = '16px';
upgradeTowerButton.style.cursor = 'pointer';
upgradeTowerButton.style.display = 'none';

upgradeTowerButton.addEventListener('click', upgradeTower);

document.body.appendChild(upgradeTowerButton);
