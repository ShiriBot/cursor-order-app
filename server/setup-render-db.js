#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
require('dotenv').config();

// PostgreSQL 클라이언트 설정
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: {
    rejectUnauthorized: false // Render에서는 SSL이 필요하지만 인증서 검증을 비활성화
  }
});

// 색상 정의
const colors = {
  green: '\x1b[32m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function executeSQLFile(filePath) {
  try {
    const sql = fs.readFileSync(filePath, 'utf8');
    await pool.query(sql);
    return true;
  } catch (error) {
    log(`❌ SQL 파일 실행 실패: ${filePath}`, 'red');
    log(`오류: ${error.message}`, 'red');
    return false;
  }
}

async function checkTables() {
  try {
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    
    log('\n📋 현재 데이터베이스의 테이블:', 'blue');
    if (result.rows.length === 0) {
      log('   테이블이 없습니다.', 'red');
    } else {
      result.rows.forEach(row => {
        log(`   ✅ ${row.table_name}`, 'green');
      });
    }
    return result.rows;
  } catch (error) {
    log(`❌ 테이블 확인 실패: ${error.message}`, 'red');
    return [];
  }
}

async function main() {
  log('================================', 'blue');
  log('🚀 Render PostgreSQL 스키마 생성', 'blue');
  log('================================', 'blue');

  try {
    // 1. 데이터베이스 연결 테스트
    log('\n1️⃣ 데이터베이스 연결 테스트...', 'blue');
    await pool.query('SELECT NOW()');
    log('   ✅ 데이터베이스 연결 성공!', 'green');

    // 2. 현재 테이블 상태 확인
    log('\n2️⃣ 현재 테이블 상태 확인...', 'blue');
    await checkTables();

    // 3. 스키마 생성
    log('\n3️⃣ 스키마 생성 중...', 'blue');
    const migrationsPath = path.join(__dirname, 'database', 'migrations', '001_create_tables.sql');
    
    if (await executeSQLFile(migrationsPath)) {
      log('   ✅ 스키마 생성 완료!', 'green');
    } else {
      log('   ❌ 스키마 생성 실패', 'red');
      return;
    }

    // 4. 초기 데이터 삽입
    log('\n4️⃣ 초기 데이터 삽입 중...', 'blue');
    const seedsPath = path.join(__dirname, 'database', 'seeds', '001_initial_data.sql');
    
    if (await executeSQLFile(seedsPath)) {
      log('   ✅ 초기 데이터 삽입 완료!', 'green');
    } else {
      log('   ❌ 초기 데이터 삽입 실패', 'red');
      return;
    }

    // 5. 최종 테이블 확인
    log('\n5️⃣ 최종 테이블 확인...', 'blue');
    await checkTables();

    // 6. 데이터 개수 확인
    log('\n6️⃣ 데이터 개수 확인...', 'blue');
    const menuCount = await pool.query('SELECT COUNT(*) FROM menus');
    const optionCount = await pool.query('SELECT COUNT(*) FROM options');
    const orderCount = await pool.query('SELECT COUNT(*) FROM orders');
    
    log(`   📊 메뉴: ${menuCount.rows[0].count}개`, 'green');
    log(`   📊 옵션: ${optionCount.rows[0].count}개`, 'green');
    log(`   📊 주문: ${orderCount.rows[0].count}개`, 'green');

    log('\n================================', 'green');
    log('✅ Render PostgreSQL 설정 완료!', 'green');
    log('================================', 'green');
    log('\n🚀 이제 백엔드 서버를 배포할 수 있습니다!', 'blue');

  } catch (error) {
    log(`\n❌ 오류 발생: ${error.message}`, 'red');
    if (error.code === 'ENOTFOUND') {
      log('   네트워크 연결을 확인해주세요.', 'red');
    } else if (error.code === '28P01') {
      log('   데이터베이스 인증 정보를 확인해주세요.', 'red');
    }
  } finally {
    await pool.end();
  }
}

// 스크립트 실행
main().catch(console.error);
