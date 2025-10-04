# EDB PostgreSQL 제거 가이드

## 🗑️ EDB PostgreSQL 완전 제거

### 1단계: 서비스 중지 (터미널에서 실행)
```bash
# 관리자 권한으로 EDB PostgreSQL 서비스 중지
sudo launchctl unload /Library/LaunchDaemons/postgresql-18.plist
```

### 2단계: 파일 제거
```bash
# PostgreSQL 설치 폴더 제거
sudo rm -rf /Library/PostgreSQL/18/

# 서비스 파일 제거
sudo rm /Library/LaunchDaemons/postgresql-18.plist
```

### 3단계: 환경 변수 정리 (선택사항)
```bash
# ~/.zshrc 또는 ~/.bash_profile에서 PostgreSQL 경로 제거
# 다음 라인들을 찾아서 삭제하거나 주석 처리:
# export PATH="/Library/PostgreSQL/18/bin:$PATH"
```

### 4단계: 확인
```bash
# PostgreSQL 프로세스 확인
ps aux | grep postgres | grep -v grep

# Postgres.app만 실행 중이어야 함
```

## ✅ 완료 후 상태

- **EDB PostgreSQL**: 제거됨
- **Postgres.app**: 실행 중 (포트 5433)
- **프로젝트**: Postgres.app만 사용

## 🔄 대안: 수동 제거

위 명령어들이 작동하지 않으면:

1. **Applications 폴더에서 EDB PostgreSQL 찾기**
2. **수동으로 휴지통에 이동**
3. **시스템 환경설정 > 사용자 및 그룹 > 로그인 항목에서 PostgreSQL 서비스 제거**

## 📋 제거 후 확인사항

```bash
# 1. PostgreSQL 프로세스 확인
ps aux | grep postgres | grep -v grep

# 2. Postgres.app 연결 테스트
/Applications/Postgres.app/Contents/Versions/latest/bin/psql -p 5433 postgres -c "SELECT version();"

# 3. 프로젝트 데이터베이스 테스트
cd /Users/jeongsilchae/app/order-app/server
npm run db:test
```

---

**주의**: 제거 전에 중요한 데이터가 있다면 백업하세요!
