# PostgreSQL 설치 및 설정 가이드

## 📦 PostgreSQL 설치

### macOS (Homebrew)

```bash
# PostgreSQL 설치
brew install postgresql@15

# PostgreSQL 서비스 시작
brew services start postgresql@15

# 또는 백그라운드로 실행
pg_ctl -D /opt/homebrew/var/postgresql@15 start
```

### PostgreSQL 설치 확인

```bash
# 버전 확인
postgres --version

# 또는
psql --version
```

## 🗄️ 데이터베이스 초기화

### 방법 1: 자동 초기화 스크립트 사용 (권장)

```bash
# database 폴더로 이동
cd server/database

# 초기화 스크립트 실행
./init-db.sh
```

이 스크립트는 다음 작업을 자동으로 수행합니다:
1. `coffee_order` 데이터베이스 생성
2. 테이블 스키마 생성
3. 초기 데이터 입력

### 방법 2: 수동 초기화

#### 1단계: PostgreSQL 접속

```bash
# PostgreSQL 접속 (기본 사용자)
psql postgres

# 또는 특정 사용자로 접속
psql -U postgres
```

#### 2단계: 데이터베이스 생성

```sql
-- 데이터베이스 생성
CREATE DATABASE coffee_order;

-- 데이터베이스 목록 확인
\l

-- coffee_order 데이터베이스로 연결
\c coffee_order
```

#### 3단계: 테이블 생성

```bash
# PostgreSQL 종료 후 터미널에서 실행
\q

# 테이블 생성 스크립트 실행
psql -U postgres -d coffee_order -f server/database/migrations/001_create_tables.sql
```

#### 4단계: 초기 데이터 입력

```bash
# 초기 데이터 입력
psql -U postgres -d coffee_order -f server/database/seeds/001_initial_data.sql
```

## 🔍 데이터베이스 확인

### PostgreSQL 접속하여 확인

```bash
# coffee_order 데이터베이스 접속
psql -U postgres -d coffee_order
```

### 유용한 PostgreSQL 명령어

```sql
-- 테이블 목록 확인
\dt

-- 특정 테이블 구조 확인
\d menus
\d orders

-- 데이터 확인
SELECT * FROM menus;
SELECT * FROM options;
SELECT * FROM orders;

-- 주문 상태별 개수 확인
SELECT status, COUNT(*) FROM orders GROUP BY status;

-- PostgreSQL 종료
\q
```

## 🔧 환경 변수 설정

`server/.env` 파일을 확인하고 필요시 수정하세요:

```env
# 데이터베이스 설정
DB_HOST=localhost
DB_PORT=5432
DB_NAME=coffee_order
DB_USER=postgres
DB_PASSWORD=
```

비밀번호가 설정되어 있다면 `DB_PASSWORD`에 입력하세요.

## 🚀 서버 시작

데이터베이스 설정이 완료되면 서버를 시작할 수 있습니다:

```bash
# server 폴더로 이동
cd server

# 개발 모드로 서버 시작
npm run dev
```

## 🧪 연결 테스트

```bash
# server 폴더에서 실행
node test-db-connection.js
```

## ❓ 문제 해결

### PostgreSQL이 실행되지 않는 경우

```bash
# PostgreSQL 상태 확인
brew services list

# PostgreSQL 재시작
brew services restart postgresql@15
```

### 연결이 안 되는 경우

1. PostgreSQL이 실행 중인지 확인
2. `.env` 파일의 데이터베이스 설정 확인
3. 데이터베이스가 생성되었는지 확인
4. 포트가 충돌하지 않는지 확인 (기본: 5432)

### 권한 오류가 발생하는 경우

```bash
# postgres 사용자 권한 확인
psql postgres -c "SELECT usename, usecreatedb, usesuper FROM pg_user;"
```

## 📊 생성되는 테이블

1. **menus** - 메뉴 정보
2. **options** - 옵션 정보 (샷 추가, 시럽 추가 등)
3. **orders** - 주문 기본 정보
4. **order_items** - 주문 상세 항목
5. **order_item_options** - 주문 항목별 옵션

## 🎯 초기 데이터

- **메뉴**: 6개 (아메리카노, 카페라떼, 카푸치노 등)
- **옵션**: 3개 (샷 추가, 시럽 추가, 휘핑크림 추가)
- **샘플 주문**: 3개 (테스트용)

---

**참고**: 이 설정은 개발 환경용입니다. 프로덕션 환경에서는 추가적인 보안 설정이 필요합니다.

