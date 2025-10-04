-- ================================================
-- 커피 주문 앱 데이터베이스 스키마
-- ================================================

-- 기존 테이블 삭제 (순서 중요 - 외래키 역순)
DROP TABLE IF EXISTS order_item_options CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS options CASCADE;
DROP TABLE IF EXISTS menus CASCADE;

-- ================================================
-- 1. Menus 테이블 (메뉴 정보)
-- ================================================
CREATE TABLE menus (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  price INTEGER NOT NULL CHECK (price >= 0),
  image VARCHAR(500),
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 메뉴 이름 인덱스
CREATE UNIQUE INDEX idx_menus_name ON menus(name);

-- ================================================
-- 2. Options 테이블 (옵션 정보)
-- ================================================
CREATE TABLE options (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  price INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================================
-- 3. Orders 테이블 (주문 정보)
-- ================================================
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  total_amount INTEGER NOT NULL CHECK (total_amount >= 0),
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'preparing', 'completed')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 주문 상태 인덱스
CREATE INDEX idx_orders_status ON orders(status);

-- 주문 생성 시간 인덱스
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- ================================================
-- 4. OrderItems 테이블 (주문 항목)
-- ================================================
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  menu_id INTEGER NOT NULL REFERENCES menus(id),
  menu_name VARCHAR(100) NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price INTEGER NOT NULL,
  subtotal INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 주문 ID 인덱스
CREATE INDEX idx_order_items_order_id ON order_items(order_id);

-- ================================================
-- 5. OrderItemOptions 테이블 (주문 항목 옵션)
-- ================================================
CREATE TABLE order_item_options (
  id SERIAL PRIMARY KEY,
  order_item_id INTEGER NOT NULL REFERENCES order_items(id) ON DELETE CASCADE,
  option_id INTEGER NOT NULL REFERENCES options(id),
  option_name VARCHAR(50) NOT NULL,
  option_price INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 주문 항목 ID 인덱스
CREATE INDEX idx_order_item_options_order_item_id ON order_item_options(order_item_id);

-- ================================================
-- 트리거: updated_at 자동 업데이트
-- ================================================

-- 트리거 함수 생성
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Menus 테이블 트리거
CREATE TRIGGER update_menus_updated_at 
  BEFORE UPDATE ON menus 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Orders 테이블 트리거
CREATE TRIGGER update_orders_updated_at 
  BEFORE UPDATE ON orders 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- 완료 메시지
-- ================================================
DO $$
BEGIN
  RAISE NOTICE '✅ 모든 테이블이 성공적으로 생성되었습니다!';
END $$;

