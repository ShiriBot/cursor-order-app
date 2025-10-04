# EDB PostgreSQL 설정 가이드

## 🔐 비밀번호 설정

EDB PostgreSQL을 설치할 때 설정한 비밀번호가 필요합니다. 

### 방법 1: 기존 비밀번호 사용
설치 시 설정한 비밀번호를 `.env` 파일에 입력하세요:

```bash
# server/.env 파일에서
DB_PASSWORD=your_actual_password
```

### 방법 2: 비밀번호 재설정 (비밀번호를 모르는 경우)

```bash
# 1. PostgreSQL 서비스 중지
sudo pkill -f postgres

# 2. PostgreSQL을 신뢰 모드로 시작
/Library/PostgreSQL/18/bin/postgres -D /Library/PostgreSQL/18/data --trust

# 3. 새 터미널에서 접속
/Library/PostgreSQL/18/bin/psql -U postgres

# 4. 비밀번호 설정
ALTER USER postgres PASSWORD 'newpassword';

# 5. 종료
\q
```

## 🚀 데이터베이스 초기화

비밀번호를 설정한 후 다음 명령어를 실행하세요:

```bash
# server 폴더로 이동
cd server

# 데이터베이스 초기화
npm run db:init
```

## 🔍 문제 해결

### "password authentication failed" 오류
- `.env` 파일의 `DB_PASSWORD`를 올바른 비밀번호로 설정하세요
- 비밀번호를 모르면 위의 "비밀번호 재설정" 방법을 사용하세요

### "database does not exist" 오류
- `npm run db:init` 명령어를 실행하면 자동으로 데이터베이스가 생성됩니다

### PostgreSQL 서비스가 실행되지 않는 경우
```bash
# 서비스 시작
/Library/PostgreSQL/18/bin/pg_ctl -D /Library/PostgreSQL/18/data start
```

## ✅ 완료 확인

```bash
# 데이터베이스 연결 테스트
npm run db:test
```

성공하면 다음과 같은 메시지가 표시됩니다:
```
✅ 모든 테스트 완료!
🎉 데이터베이스가 정상적으로 설정되었습니다!
```
