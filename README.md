# pnmp

<p align='center'>
  <img src='https://user-images.githubusercontent.com/74581396/212355160-b05994f1-4c1d-4812-8b86-e8ddd33876bc.png'>
</p>

![스크린샷 2023-01-13 오후 11 56 12](https://user-images.githubusercontent.com/74581396/212356255-17232d2f-b8db-4a6e-9743-1fc94562f5a7.png)

## 🏓 프로젝트 소개

### 프로젝트 기능 및 시연

실시간 Pong 대회를 위한 웹사이트를 만드는 팀 프로젝트입니다.
- **42 OAuth와 github OAuth를 통해 로그인을 할 수 있으며, 자신의 프로필을 수정할 수 있습니다. 또한 Google OTP 를 활용한 이중 인증도 가능합니다.**

https://user-images.githubusercontent.com/74581396/216984008-2393f34c-9e67-47ea-be4c-88d8154fa44c.mov

- **게임은 매칭 메이킹 시스템을 통한 자동 매칭, 혹은 게임 초대를 통해 다른 유저와 Pong 게임을 진행할 수 있습니다.**

https://user-images.githubusercontent.com/74581396/216984056-75c23302-bb9c-4000-9601-e280c3f65834.mp4

- **일대일 채팅과 다대다 채팅이 가능합니다. 다대다 채팅을 할 수 있는 채널은 공개 여부와 비밀번호를 설정할 수 있습니다.**

https://user-images.githubusercontent.com/74581396/216985382-bd5367e3-af94-4e99-b025-9000ab7e5557.mp4

- **다른 유저를 차단할 수 있습니다. 차단하면 상대의 채팅을 받지 않을 수 있습니다.**

https://user-images.githubusercontent.com/74581396/216987378-989af011-3b0f-4128-8e33-35b7b639261d.mp4

- **다른 유저에게 친구요청을 보낼 수 있습니다. 상대가 요청을 수락해 친구가 된다면 친구가 온라인인지 오프라인인지 게임중인지 확인할 수 있습니다.**

https://user-images.githubusercontent.com/74581396/216987903-dea4d281-614c-4afd-958c-27c351f139c9.mov

### 프로젝트 기간
2022.10 ~ 2022.12 (3개월)

### 프로젝트 멤버

[hyeonsok](https://github.com/kimhxsong), [minsikim](https://github.com/minsikim-42), [jihkwon](https://github.com/kjh6b6a68), [jwoo](https://github.com/Jiwon-Woo)

### 기술 스택 및 개발 도구

- docker, Nginx, PostgreSQL, NestJS, Next.js, Node.js, TypeScript, Socket.IO 
- GitHub, Swagger, pgAdmin, MUI
- Notion, Slack, Figma

<br><br>

## 🛠 프로젝트 설계

### 도커 컨테이너 구조도

![ts](https://user-images.githubusercontent.com/74581396/212341683-a1db8638-e6fc-4f79-bc86-1291e6675143.png)

### DB 스키마
![transcendence-ERD](https://user-images.githubusercontent.com/74581396/212341558-0a33c04e-a893-4cb0-a0e9-59d33b6292ba.png)

### API 설계
[API 엔드 포인트 설계](https://dev-jwoo.notion.site/API-df34f1366f6c48ebae9f513b9d9fae92)

<br><br>

## ⚙️ 프로젝트 구동방법
#### 1. 프로젝트 레포를 클론합니다.
```sh
git clone https://github.com/ping-neo-meo-pong/pnmp.git
```
#### 2. 프로젝트 루트폴더에 `.env` 파일을 설정합니다.
```
POSTGRES_HOST=
POSTGRES_DATABASE=
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_CONTAINER_PORT=
NGINX_HOST_PORT=
NGINX_CONTAINER_PORT=
BACKEND_PORT=
FRONTEND_PORT=
PGADMIN_HOST_PORT=
PGADMIN_CONTAINER_PORT=
PGADMIN_DEFAULT_EMAIL=
PGADMIN_DEFAULT_PASSWORD=
FORTY_TWO_CLIENT_ID=
FORTY_TWO_CLIENT_SECRET=
GITHUB_ID=
GITHUB_SECRET=
JWT_SECRET=
JWT_EXPIRED=
TZ=
NEXTAUTH_URL=
NEXTAUTH_SECRET=
```
#### 3. docker를 구동하고 Makefile 혹은 docker-compose 명령어를 실행합니다.
`make` or `docker-compose up -d --build`

