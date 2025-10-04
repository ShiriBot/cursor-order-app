import { useState } from 'react';
import Header from './components/Header';
import MenuCard from './components/MenuCard';
import Cart from './components/Cart';
import './App.css';

// 임시 메뉴 데이터
const MENU_DATA = [
  { 
    id: 1, 
    name: '아메리카노(ICE)', 
    price: 4000,
    description: '시원하고 깔끔한 아이스 아메리카노',
    image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400&h=300&fit=crop'
  },
  { 
    id: 2, 
    name: '아메리카노(HOT)', 
    price: 4000,
    description: '따뜻하고 진한 핫 아메리카노',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&h=300&fit=crop'
  },
  { 
    id: 3, 
    name: '카페라떼', 
    price: 5000,
    description: '부드러운 우유와 에스프레소의 조화',
    image: 'https://images.unsplash.com/photo-1561882468-9110e03e0f78?w=400&h=300&fit=crop'
  },
  { 
    id: 4, 
    name: '카푸치노', 
    price: 5000,
    description: '풍부한 우유 거품이 올라간 카푸치노',
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=300&fit=crop'
  },
  { 
    id: 5, 
    name: '바닐라라떼', 
    price: 5500,
    description: '달콤한 바닐라 향이 가득한 라떼',
    image: 'https://images.unsplash.com/photo-1599639957043-e5c91c6d3e8d?w=400&h=300&fit=crop'
  },
  { 
    id: 6, 
    name: '카라멜마끼아또', 
    price: 5500,
    description: '달콤한 카라멜과 에스프레소의 만남',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300&fit=crop'
  },
];

function App() {
  const [activeTab, setActiveTab] = useState('order');
  const [cartItems, setCartItems] = useState([]);

  // 장바구니에 추가
  const handleAddToCart = (menuItem) => {
    console.log('🛒 담기 버튼 클릭:', menuItem.name);
    
    setCartItems((prevItems) => {
      console.log('📦 현재 장바구니:', prevItems.length, '개 항목');
      
      // 동일한 메뉴와 옵션 조합이 있는지 확인
      const existingItemIndex = prevItems.findIndex(
        (item) =>
          item.id === menuItem.id &&
          item.options.extraShot === menuItem.options.extraShot &&
          item.options.extraSyrup === menuItem.options.extraSyrup
      );

      if (existingItemIndex !== -1) {
        // 이미 존재하면 수량 증가
        console.log('✅ 기존 항목 수량 증가:', prevItems[existingItemIndex].quantity, '→', prevItems[existingItemIndex].quantity + 1);
        const newItems = [...prevItems];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + 1
        };
        return newItems;
      } else {
        // 새로운 항목 추가
        console.log('🆕 새 항목 추가');
        return [...prevItems, { ...menuItem, quantity: 1 }];
      }
    });
  };

  // 수량 업데이트
  const handleUpdateQuantity = (index, change) => {
    setCartItems((prevItems) => {
      const newItems = [...prevItems];
      const currentItem = newItems[index];
      
      if (!currentItem) return prevItems;
      
      const newQuantity = currentItem.quantity + change;
      
      if (newQuantity <= 0) {
        // 수량이 0 이하면 항목 제거
        return newItems.filter((_, i) => i !== index);
      }
      
      // 새로운 배열 생성하여 반환
      return newItems.map((item, i) => 
        i === index ? { ...item, quantity: newQuantity } : item
      );
    });
  };

  // 주문하기
  const handleOrder = () => {
    if (cartItems.length === 0) {
      alert('장바구니가 비어있습니다.');
      return;
    }

    // 주문 처리 (추후 백엔드 연동)
    alert('주문이 완료되었습니다!');
    setCartItems([]); // 장바구니 초기화
  };

  return (
    <div className="app">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'order' ? (
        <div className="order-page">
          <div className="menu-section">
            <div className="menu-grid">
              {MENU_DATA.map((menu) => (
                <MenuCard
                  key={menu.id}
                  menu={menu}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          </div>

          <Cart items={cartItems} onOrder={handleOrder} onUpdateQuantity={handleUpdateQuantity} />
        </div>
      ) : (
        <div className="admin-page">
          <p style={{ textAlign: 'center', fontSize: '1.5rem', color: '#999' }}>
            관리자 화면은 추후 구현 예정입니다.
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
