# One Punch - One Punch Tower Defence

## ✨ AWS 배포 링크

### [AWS링크]

## 👋 소개

- **One Punch**는 애니메이션 원펀맨을 떠올리고 지은 팀명이며, 세계 코드 최강자가 될려고 노력하고자 이러한 팀 이름으로 지었습니다.
- 우리 팀은 **Socket.io를 이용한 서버주도 타워 디펜스 게임**을 제작했습니다.

## 👩‍💻 팀원

<table>
  <tbody>
    <tr>
      <td align="center"><a href="https://github.com/hyeonseol00"><img src="https://avatars.githubusercontent.com/u/159992036?v=4" width="100px;" alt=""/><br /><sub><b> 팀장 : 양재석 </b></sub></a><br /></td>
      <td align="center"><a href="https://github.com/KR-EGOIST"><img src="https://avatars.githubusercontent.com/u/54177070?v=4" width="100px;" alt=""/><br /><sub><b> 팀원 : 윤진호 </b></sub></a><br /></td>
      <td align="center"><a href="https://github.com/wodm15"><img src="https://avatars.githubusercontent.com/u/92417963?v=4" width="100px;" alt=""/><br /><sub><b> 팀원 : 선재영 </b></sub></a><br /></td>
      <td align="center"><a href="https://github.com/JollyDude16"><img src="https://avatars.githubusercontent.com/u/167201080?v=4" width="100px;" alt=""/><br /><sub><b> 팀원 : 민광규 </b></sub></a><br /></td>
    </tr>
  </tbody>
</table>

## ⚙️ Backend 기술 스택

<img src="https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white">
<img src="https://img.shields.io/badge/express-000000?style=for-the-badge&logo=express&logoColor=white">
<img src="https://img.shields.io/badge/socketdotio-010101?style=for-the-badge&logo=prisma&logoColor=white">
<img src="https://img.shields.io/badge/mysql-4479A1?style=for-the-badge&logo=mysql&logoColor=white">
<img src="https://img.shields.io/badge/prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white">
<img src="https://img.shields.io/badge/mongodb-47A248?style=for-the-badge&logo=mongodb&logoColor=white">

## 📄 API 명세서

### [API명세서]

## 📃 와이어 프레임

### ![와이어프레임](https://github.com/user-attachments/assets/4897688c-7170-4275-b299-db25c6bba1c1)

## 📃 ERD Diagram

### [ERD 사진]

## ⚽ 프로젝트 주요 기능

1. **회원가입**
    - 회원가입 시 MySQL에 유저의 ID 와 해시된 PW를 저장합니다.

2. **로그인**
    - 로그인 시 서버에서는 DB조회 후 검증한 뒤 쿠키를 생성합니다.
    - 클라이언트에서는 쿠키를 로컬스토리지에 저장하고, 유저의 ID를 로컬스토리지에 저장합니다.

3. **매칭 시스템**
    - 서버에서 서버를 열면 게임 세션이 생깁니다.
    - 클라이언트에서 서버에 접속하면 서버에서 User 객체가 생성됩니다.
    - 생성된 User 객체를 게임 세션에 추가합니다.
    - 게임 세션에 2명이 될 시 'matchFound' 메시지를 클라이언트에 전달해 게임이 3초 뒤 시작됩니다.

4. **길 배치**
    - x 좌표가 캔버스의 가로 길이보다 크거나 같을 때까지 일정 범위의 랜덤한 x, y 좌표를 생성합니다.
    - 생성한 좌표를 클라이언트에 전달해 클라이언트에서 해당 좌표값을 가지고 길을 배치합니다.

5. **초기 타워 생성**
    - 게임 시작 시 3개의 타워를 배치된 길 좌표의 일정 범위 내에 랜덤한 x, y 좌표를 생성합니다.
    - 생성한 좌표를 클라이언트에 전달해 클라이언트에서 해당 좌표값에 타워를 배치합니다.

6. **타워 구입**
    - 구현중
  
7. **적 타워 추가 배치**
    - 구현중

8. **몬스터 생성**
    - 클라이언트에서 몬스터를 일정 주기마다 생성합니다.
    - 생성된 몬스터의 number를 서버에 전달합니다.

9. **적 몬스터 생성**
    - 구현중

10. **타워가 몬스터 공격**
    - 타워는 생성된 몬스터 배열을 순회하면서 벡터 길이가 타워 공격 범위보다 작을 경우 해당 몬스터를 타겟팅하고 공격합니다.
    - 타워의 공격 범위를 넘어가면 다음 몬스터를 타겟팅합니다.
    - 공격한 타워의 인덱스와 공격당한 몬스터의 인덱스를 서버에 넘겨줍니다.

11. **적 타워가 적의 몬스터 공격**
    - 구현중

12. **몬스터가 기지 공격**
    - 몬스터가 기지 좌표에 도달할 경우 몬스터의 데미지를 서버에 전달합니다.

13. **기지 HP 업데이트**
    - 클라이언트로부터 전달받은 몬스터의 데이지를 뺀 기지 체력을 클라이언트에 전달합니다.
    - 클라이언트는 전달받은 체력 데이터를 가지고 기지의 체력을 변경합니다.

14. **게임 오버**
    - 구현중

15. **게임 종료**
    - 구현중

16. **몬스터 사망**
    - 몬스터가 기지에 도달하거나 hp가 0 이하가 될 시 서버에 몬스터 사망 이벤트를 보냅니다.
    - 서버에서는 유저의 점수를 100점 증가하고 2000점마다 몬스터의 레벨을 증가시켜 해당 데이터를 클라이언트에 전달합니다.
    - 클라이언트는 전달받은 데이터를 현재 점수와 몬스터 레벨, 몬스터 스폰주기를 변경합니다.

17. **적 몬스터 사망**
    - 구현중

18. **데이터 관리**
    - 유저의 ID, PW, 게임히스토리는 MySQL에서 관리합니다.
    - 게임 데이터는 MongoDB에서 관리합니다.
