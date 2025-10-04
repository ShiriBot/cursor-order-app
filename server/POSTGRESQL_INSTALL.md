# PostgreSQL 설치 가이드 (macOS)

## 📦 설치 방법

PostgreSQL을 설치하는 방법은 여러 가지가 있습니다.

### 방법 1: Homebrew 사용 (권장)

```bash
# 1. Homebrew가 설치되어 있는지 확인
brew --version

# 2. PostgreSQL 설치
brew install postgresql@15

# 3. PostgreSQL 서비스 시작
brew services start postgresql@15

# 4. 버전 확인
postgres --version
```

### 방법 2: Postgres.app 사용 (GUI)

1. https://postgresapp.com/ 에서 다운로드
2. Applications 폴더로 이동
3. Postgres.app 실행
4. "Initialize" 클릭

### 방법 3: 공식 인스톨러

1. https://www.postgresql.org/download/macos/ 에서 다운로드
2. 설치 프로그램 실행
3. 설치 완료 후 환경 변수 설정

## 🔍 설치 확인

### PostgreSQL이 실행 중인지 확인

```bash
# Homebrew로 설치한 경우
brew services list | grep postgresql

# 프로세스 확인
ps aux | grep postgres

# 포트 확인 (기본: 5432)
lsof -i :5432
```

### PostgreSQL 버전 확인

```bash
# 버전 확인
postgres --version
psql --version

# PostgreSQL 접속 테스트
psql postgres
```

## 🚀 PostgreSQL 시작/중지/재시작

### Homebrew로 설치한 경우

```bash
# 시작
brew services start postgresql@15

# 중지
brew services stop postgresql@15

# 재시작
brew services restart postgresql@15

# 상태 확인
brew services info postgresql@15
```

### 수동 실행

```bash
# 시작 (Homebrew)
pg_ctl -D /opt/homebrew/var/postgresql@15 start

# 중지
pg_ctl -D /opt/homebrew/var/postgresql@15 stop

# 재시작
pg_ctl -D /opt/homebrew/var/postgresql@15 restart
```

## 🔧 환경 변수 설정 (선택사항)

Homebrew로 설치한 경우, PATH에 PostgreSQL을 추가할 수 있습니다:

### zsh (기본)

```bash
# ~/.zshrc 파일에 추가
echo 'export PATH="/opt/homebrew/opt/postgresql@15/bin:$PATH"' >> ~/.zshrc

# 설정 적용
source ~/.zshrc
```

### bash

```bash
# ~/.bash_profile 파일에 추가
echo 'export PATH="/opt/homebrew/opt/postgresql@15/bin:$PATH"' >> ~/.bash_profile

# 설정 적용
source ~/.bash_profile
```

## 📚 PostgreSQL 기본 사용법

### PostgreSQL 접속

```bash
# 기본 데이터베이스 접속
psql postgres

# 특정 사용자로 접속
psql -U username

# 특정 데이터베이스 접속
psql -d database_name
```

### 기본 명령어

```sql
-- 데이터베이스 목록
\l

-- 데이터베이스 생성
CREATE DATABASE my_database;

-- 데이터베이스 선택
\c my_database

-- 테이블 목록
\dt

-- 테이블 구조 확인
\d table_name

-- 종료
\q
```

## 🛠️ 프로젝트 데이터베이스 설정

PostgreSQL이 정상적으로 설치되고 실행되면, 다음 단계를 진행하세요:

### 1단계: 데이터베이스 생성 및 초기화

```bash
# server 폴더로 이동
cd server

# 자동 초기화 실행
npm run db:init
```

### 2단계: 연결 테스트

```bash
# 데이터베이스 연결 테스트
npm run db:test
```

### 3단계: 서버 시작

```bash
# 개발 서버 시작
npm run dev
```

## ❓ 문제 해결

### "command not found: psql" 오류

PostgreSQL이 PATH에 없습니다. 위의 "환경 변수 설정" 섹션을 참고하세요.

### "connection refused" 오류

PostgreSQL이 실행 중이 아닙니다:
```bash
brew services start postgresql@15
```

### "role does not exist" 오류

기본 사용자를 생성해야 합니다:
```bash
createuser -s postgres
```

### 포트가 이미 사용 중인 경우

다른 프로세스가 5432 포트를 사용하고 있습니다:
```bash
# 포트 사용 중인 프로세스 확인
lsof -i :5432

# 프로세스 종료 (PID 확인 후)
kill -9 <PID>
```

## 📖 참고 자료

- PostgreSQL 공식 문서: https://www.postgresql.org/docs/
- Homebrew PostgreSQL: https://formulae.brew.sh/formula/postgresql@15
- Postgres.app: https://postgresapp.com/documentation/

---

문제가 계속되면 [DATABASE_SETUP.md](./DATABASE_SETUP.md)를 참고하세요.

