-- ================================================
-- 커피 주문 앱 초기 데이터
-- ================================================

-- 기존 데이터 삭제 (테스트용)
DELETE FROM order_item_options;
DELETE FROM order_items;
DELETE FROM orders;
DELETE FROM options;
DELETE FROM menus;

-- 시퀀스 리셋
ALTER SEQUENCE menus_id_seq RESTART WITH 1;
ALTER SEQUENCE options_id_seq RESTART WITH 1;
ALTER SEQUENCE orders_id_seq RESTART WITH 1;
ALTER SEQUENCE order_items_id_seq RESTART WITH 1;
ALTER SEQUENCE order_item_options_id_seq RESTART WITH 1;

-- ================================================
-- 1. 메뉴 데이터 추가
-- ================================================
INSERT INTO menus (name, description, price, image, stock) VALUES
('아메리카노(ICE)', '시원하고 깔끔한 아이스 아메리카노', 4000, 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400', 15),
('아메리카노(HOT)', '따뜻하고 진한 핫 아메리카노', 4000, 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=400', 15),
('카페라떼', '부드러운 우유와 에스프레소의 조화', 5000, 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400', 12),
('카푸치노', '풍부한 거품과 진한 커피의 만남', 5000, 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400', 10),
('바닐라라떼', '달콤한 바닐라 향이 가득한 라떼', 5500, 'https://images.unsplash.com/photo-1568366173984-464e9aea5f06?w=400', 8),
('카라멜마끼아또', '달콤한 카라멜과 부드러운 우유', 5500, 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=400', 10);

-- ================================================
-- 2. 옵션 데이터 추가
-- ================================================
INSERT INTO options (name, price) VALUES
('샷 추가', 500),
('시럽 추가', 0),
('휘핑크림 추가', 500);

-- ================================================
-- 3. 샘플 주문 데이터 (테스트용)
-- ================================================

-- 주문 1: 아메리카노(ICE) 1개 + 샷 추가
INSERT INTO orders (total_amount, status) VALUES (4500, 'pending');
INSERT INTO order_items (order_id, menu_id, menu_name, quantity, unit_price, subtotal) 
VALUES (1, 1, '아메리카노(ICE)', 1, 4500, 4500);
INSERT INTO order_item_options (order_item_id, option_id, option_name, option_price)
VALUES (1, 1, '샷 추가', 500);

-- 주문 2: 카페라떼 2개
INSERT INTO orders (total_amount, status) VALUES (10000, 'preparing');
INSERT INTO order_items (order_id, menu_id, menu_name, quantity, unit_price, subtotal) 
VALUES (2, 3, '카페라떼', 2, 5000, 10000);

-- 주문 3: 카라멜마끼아또 1개 + 휘핑크림 추가
INSERT INTO orders (total_amount, status) VALUES (6000, 'completed');
INSERT INTO order_items (order_id, menu_id, menu_name, quantity, unit_price, subtotal) 
VALUES (3, 6, '카라멜마끼아또', 1, 6000, 6000);
INSERT INTO order_item_options (order_item_id, option_id, option_name, option_price)
VALUES (3, 3, '휘핑크림 추가', 500);

-- ================================================
-- 완료 메시지
-- ================================================
DO $$
BEGIN
  RAISE NOTICE '✅ 초기 데이터가 성공적으로 입력되었습니다!';
  RAISE NOTICE '   - 메뉴: 6개';
  RAISE NOTICE '   - 옵션: 3개';
  RAISE NOTICE '   - 샘플 주문: 3개';
END $$;

