# 커피 주문 앱 - 백엔드 서버

Express.js와 PostgreSQL을 사용한 커피 주문 앱의 백엔드 API 서버입니다.

## 📋 기술 스택

- **Node.js** - 런타임 환경
- **Express.js** - 웹 프레임워크
- **PostgreSQL** - 데이터베이스
- **pg** - PostgreSQL 클라이언트
- **dotenv** - 환경변수 관리
- **cors** - CORS 설정
- **nodemon** - 개발 서버 (개발 환경)

## 🚀 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env` 파일을 생성하고 다음 내용을 설정하세요:

```env
# 서버 설정
PORT=3000
NODE_ENV=development

# 데이터베이스 설정
DATABASE_URL=postgresql://localhost:5432/coffee_order
DB_HOST=localhost
DB_PORT=5432
DB_NAME=coffee_order
DB_USER=postgres
DB_PASSWORD=your_password

# CORS 설정
CORS_ORIGIN=http://localhost:5173
```

### 3. 데이터베이스 설정

**자세한 설정 가이드는 [DATABASE_SETUP.md](./DATABASE_SETUP.md)를 참고하세요.**

#### 빠른 설정 (자동)

```bash
# 데이터베이스 초기화 (테이블 생성 + 초기 데이터)
npm run db:init
```

#### 수동 설정

```bash
# PostgreSQL 접속
psql -U postgres

# 데이터베이스 생성
CREATE DATABASE coffee_order;

# 종료
\q
```

그 다음 마이그레이션과 시드 데이터를 실행하세요:
```bash
psql -U postgres -d coffee_order -f database/migrations/001_create_tables.sql
psql -U postgres -d coffee_order -f database/seeds/001_initial_data.sql
```

### 4. 데이터베이스 연결 테스트

```bash
# 데이터베이스 연결 및 데이터 확인
npm run db:test
```

### 5. 서버 실행

**개발 모드 (nodemon 사용)**
```bash
npm run dev
```

**프로덕션 모드**
```bash
npm start
```

서버가 실행되면 다음 주소로 접속할 수 있습니다:
- http://localhost:3000
- 헬스 체크: http://localhost:3000/health

## 📁 프로젝트 구조

```
server/
├── src/
│   ├── config/          # 설정 파일
│   │   └── database.js  # DB 연결 설정
│   ├── models/          # 데이터 모델
│   ├── controllers/     # 컨트롤러
│   ├── routes/          # 라우트
│   ├── middleware/      # 미들웨어
│   └── app.js           # Express 앱
├── database/
│   ├── migrations/      # 마이그레이션
│   └── seeds/           # 시드 데이터
├── tests/               # 테스트
├── .env                 # 환경 변수
├── .gitignore          
├── package.json
├── server.js            # 서버 진입점
└── README.md
```

## 🔌 API 엔드포인트

### 헬스 체크
- `GET /health` - 서버 상태 확인

### 메뉴 관련 (예정)
- `GET /api/menus` - 메뉴 목록 조회
- `GET /api/menus/:id` - 특정 메뉴 조회
- `PATCH /api/menus/:id/stock` - 재고 수량 업데이트

### 주문 관련 (예정)
- `POST /api/orders` - 주문 생성
- `GET /api/orders` - 주문 목록 조회
- `GET /api/orders/:id` - 특정 주문 조회
- `PATCH /api/orders/:id/status` - 주문 상태 변경
- `DELETE /api/orders/:id` - 주문 삭제
- `GET /api/orders/stats` - 주문 통계 조회

### 옵션 관련 (예정)
- `GET /api/options` - 옵션 목록 조회

## 🛠️ 개발 가이드

### 코딩 컨벤션
- JavaScript ES6+ 사용
- async/await 사용
- camelCase 변수명 사용
- 단일 책임 원칙 준수

### 응답 형식

**성공 응답**
```json
{
  "success": true,
  "data": { ... }
}
```

**에러 응답**
```json
{
  "success": false,
  "error": "에러 메시지",
  "details": { ... }
}
```

## 📝 다음 단계

1. [ ] 데이터베이스 마이그레이션 작성
2. [ ] 데이터 모델 작성
3. [ ] 컨트롤러 작성
4. [ ] 라우트 설정
5. [ ] API 테스트

---

**작성자**: COZY 팀  
**버전**: 1.0.0

