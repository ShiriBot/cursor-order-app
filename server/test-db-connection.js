require('dotenv').config();
const { pool } = require('./src/config/database');

async function testConnection() {
  console.log('🔍 데이터베이스 연결 테스트 시작...\n');

  try {
    // 1. 연결 테스트
    console.log('1️⃣  연결 테스트 중...');
    const client = await pool.connect();
    console.log('   ✅ 데이터베이스 연결 성공!\n');

    // 2. 버전 확인
    console.log('2️⃣  PostgreSQL 버전 확인...');
    const versionResult = await client.query('SELECT version()');
    console.log('   📦 버전:', versionResult.rows[0].version.split(',')[0], '\n');

    // 3. 테이블 목록 확인
    console.log('3️⃣  테이블 목록 확인...');
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    if (tablesResult.rows.length === 0) {
      console.log('   ⚠️  테이블이 없습니다. 마이그레이션을 실행하세요.\n');
    } else {
      console.log('   📋 테이블 목록:');
      tablesResult.rows.forEach(row => {
        console.log(`      - ${row.table_name}`);
      });
      console.log('');
    }

    // 4. 메뉴 데이터 확인
    console.log('4️⃣  메뉴 데이터 확인...');
    const menusResult = await client.query('SELECT COUNT(*) as count FROM menus');
    console.log(`   📊 메뉴 개수: ${menusResult.rows[0].count}개\n`);

    // 5. 옵션 데이터 확인
    console.log('5️⃣  옵션 데이터 확인...');
    const optionsResult = await client.query('SELECT COUNT(*) as count FROM options');
    console.log(`   📊 옵션 개수: ${optionsResult.rows[0].count}개\n`);

    // 6. 주문 데이터 확인
    console.log('6️⃣  주문 데이터 확인...');
    const ordersResult = await client.query('SELECT COUNT(*) as count FROM orders');
    console.log(`   📊 주문 개수: ${ordersResult.rows[0].count}개\n`);

    // 7. 주문 상태별 확인
    console.log('7️⃣  주문 상태별 통계...');
    const statsResult = await client.query(`
      SELECT status, COUNT(*) as count 
      FROM orders 
      GROUP BY status 
      ORDER BY status
    `);
    
    if (statsResult.rows.length > 0) {
      statsResult.rows.forEach(row => {
        const statusKo = {
          pending: '주문 접수',
          preparing: '제조 중',
          completed: '제조 완료'
        };
        console.log(`      - ${statusKo[row.status] || row.status}: ${row.count}개`);
      });
    } else {
      console.log('      주문 데이터가 없습니다.');
    }
    console.log('');

    // 연결 해제
    client.release();

    console.log('✅ 모든 테스트 완료!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉 데이터베이스가 정상적으로 설정되었습니다!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ 오류 발생:', error.message);
    console.error('\n문제 해결:');
    console.error('1. PostgreSQL이 실행 중인지 확인하세요');
    console.error('2. .env 파일의 데이터베이스 설정을 확인하세요');
    console.error('3. coffee_order 데이터베이스가 생성되었는지 확인하세요');
    console.error('4. database/init-db.sh 스크립트를 실행하세요\n');
    process.exit(1);
  }
}

testConnection();

