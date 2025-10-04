#!/bin/bash

# ================================================
# 커피 주문 앱 데이터베이스 초기화 스크립트
# ================================================

# 색상 정의
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}커피 주문 앱 DB 초기화${NC}"
echo -e "${BLUE}================================${NC}"

# 환경 변수 로드
if [ -f ../.env ]; then
  export $(cat ../.env | grep -v '^#' | xargs)
fi

# 데이터베이스 설정
DB_NAME=${DB_NAME:-coffee_order}
DB_USER=${DB_USER:-postgres}
DB_HOST=${DB_HOST:-localhost}
DB_PORT=${DB_PORT:-5432}
PG_PATH=${PG_PATH:-/Library/PostgreSQL/18/bin}

# PostgreSQL 명령어 경로 설정
PSQL="$PG_PATH/psql"
CREATEDB="$PG_PATH/createdb"

echo -e "\n${BLUE}📋 데이터베이스 정보:${NC}"
echo "  - 이름: $DB_NAME"
echo "  - 사용자: $DB_USER"
echo "  - 호스트: $DB_HOST"
echo "  - 포트: $DB_PORT"

# 1. 데이터베이스 존재 여부 확인
echo -e "\n${BLUE}1️⃣  데이터베이스 확인 중...${NC}"
DB_EXISTS=$($PSQL -U $DB_USER -h $DB_HOST -p $DB_PORT -lqt | cut -d \| -f 1 | grep -w $DB_NAME | wc -l)

if [ $DB_EXISTS -eq 0 ]; then
  echo -e "${BLUE}   데이터베이스가 없습니다. 생성 중...${NC}"
  $CREATEDB -U $DB_USER -h $DB_HOST -p $DB_PORT $DB_NAME
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}   ✅ 데이터베이스 생성 완료!${NC}"
  else
    echo -e "${RED}   ❌ 데이터베이스 생성 실패${NC}"
    exit 1
  fi
else
  echo -e "${GREEN}   ✅ 데이터베이스가 이미 존재합니다.${NC}"
fi

# 2. 테이블 생성
echo -e "\n${BLUE}2️⃣  테이블 생성 중...${NC}"
$PSQL -U $DB_USER -h $DB_HOST -p $DB_PORT -d $DB_NAME -f migrations/001_create_tables.sql
if [ $? -eq 0 ]; then
  echo -e "${GREEN}   ✅ 테이블 생성 완료!${NC}"
else
  echo -e "${RED}   ❌ 테이블 생성 실패${NC}"
  exit 1
fi

# 3. 초기 데이터 입력
echo -e "\n${BLUE}3️⃣  초기 데이터 입력 중...${NC}"
$PSQL -U $DB_USER -h $DB_HOST -p $DB_PORT -d $DB_NAME -f seeds/001_initial_data.sql
if [ $? -eq 0 ]; then
  echo -e "${GREEN}   ✅ 초기 데이터 입력 완료!${NC}"
else
  echo -e "${RED}   ❌ 초기 데이터 입력 실패${NC}"
  exit 1
fi

# 4. 테이블 확인
echo -e "\n${BLUE}4️⃣  생성된 테이블 확인...${NC}"
$PSQL -U $DB_USER -h $DB_HOST -p $DB_PORT -d $DB_NAME -c "\dt"

echo -e "\n${GREEN}================================${NC}"
echo -e "${GREEN}✅ 데이터베이스 초기화 완료!${NC}"
echo -e "${GREEN}================================${NC}"
echo -e "\n${BLUE}다음 명령어로 서버를 시작하세요:${NC}"
echo -e "  cd .. && npm run dev"

