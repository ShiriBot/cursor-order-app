import { useState, useEffect } from 'react';
import Header from './components/Header';
import MenuCard from './components/MenuCard';
import Cart from './components/Cart';
import AdminDashboard from './components/AdminDashboard';
import InventoryManagement from './components/InventoryManagement';
import OrderManagement from './components/OrderManagement';
import { menuAPI, optionAPI, orderAPI } from './services/api';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('order');
  const [cartItems, setCartItems] = useState([]);
  
  // API 데이터 상태
  const [menus, setMenus] = useState([]);
  const [options, setOptions] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [showOrderHistory, setShowOrderHistory] = useState(false);

  // 데이터 로딩
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // 병렬로 데이터 로드
      const [menusResponse, optionsResponse, ordersResponse] = await Promise.all([
        menuAPI.getMenus(),
        optionAPI.getOptions(),
        orderAPI.getOrders()
      ]);

      setMenus(menusResponse.data);
      setOptions(optionsResponse.data);
      setOrders(ordersResponse.data.orders);
    } catch (err) {
      console.error('데이터 로딩 오류:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 재고 확인 함수
  const checkStock = (menuId, quantity) => {
    const menu = menus.find(m => m.id === menuId);
    return menu && menu.stock >= quantity;
  };

  // 장바구니에 추가
  const handleAddToCart = (menuItem) => {
    setCartItems((prevItems) => {
      // 동일한 메뉴와 옵션 조합이 있는지 확인
      const existingItemIndex = prevItems.findIndex(
        (item) =>
          item.id === menuItem.id &&
          item.options.extraShot === menuItem.options.extraShot &&
          item.options.extraSyrup === menuItem.options.extraSyrup
      );

      if (existingItemIndex !== -1) {
        // 기존 항목의 수량 증가
        const newItems = [...prevItems];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + 1
        };
        return newItems;
      } else {
        // 새 항목 추가
        return [...prevItems, { ...menuItem, quantity: 1 }];
      }
    });
  };

  // 장바구니 수량 업데이트
  const handleUpdateQuantity = (index, change) => {
    setCartItems((prevItems) => {
      const newItems = [...prevItems];
      const currentItem = newItems[index];
      
      if (!currentItem) return prevItems;
      
      const newQuantity = currentItem.quantity + change;
      
      if (newQuantity <= 0) {
        return newItems.filter((_, i) => i !== index);
      }
      
      // 재고 확인 (증가할 때만)
      if (change > 0) {
        const stock = menus.find(item => item.id === currentItem.id)?.stock || 0;
        if (newQuantity > stock) {
          alert(`재고가 부족합니다. (현재 재고: ${stock}개)`);
          return prevItems;
        }
      }
      
      return newItems.map((item, i) => 
        i === index ? { ...item, quantity: newQuantity } : item
      );
    });
  };

  // 장바구니에서 항목 제거
  const handleRemoveFromCart = (index) => {
    setCartItems((prevItems) => prevItems.filter((_, i) => i !== index));
  };

  // 주문 처리
  const handleOrder = async () => {
    if (cartItems.length === 0) {
      alert('장바구니가 비어있습니다.');
      return;
    }

    // 재고 확인
    for (const item of cartItems) {
      if (!checkStock(item.id, item.quantity)) {
        const menuItem = menus.find(m => m.id === item.id);
        alert(`${item.name}의 재고가 부족합니다. (현재 재고: ${menuItem?.stock || 0}개)`);
        return;
      }
    }

    try {
      // API 형식으로 변환
      const orderItems = cartItems.map(item => {
        const optionIds = [];
        if (item.options.extraShot) optionIds.push(1); // 샷 추가
        if (item.options.extraSyrup) optionIds.push(2); // 시럽 추가
        
        return {
          menuId: item.id,
          quantity: item.quantity,
          options: optionIds
        };
      });

      const response = await orderAPI.createOrder({ items: orderItems });
      
      // 주문 성공 시
      setCartItems([]);
      setOrders(prevOrders => [response.data, ...prevOrders]);
      
      // 메뉴 재고 업데이트
      await loadData();
      
      setTimeout(() => {
        alert('✅ 주문이 완료되었습니다!\n주문 상태는 화면 우측 상단에서 확인할 수 있습니다.');
      }, 100);
    } catch (error) {
      console.error('주문 오류:', error);
      alert(`주문 실패: ${error.message}`);
    }
  };

  // 재고 업데이트 (관리자)
  const handleUpdateInventory = async (menuId, change) => {
    try {
      setActionLoading(true);
      await menuAPI.updateStock(menuId, change);
      await loadData(); // 데이터 새로고침
    } catch (error) {
      console.error('재고 업데이트 오류:', error);
      alert(`재고 업데이트 실패: ${error.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  // 주문 상태 변경 (관리자)
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      setActionLoading(true);
      await orderAPI.updateStatus(orderId, newStatus);
      await loadData(); // 데이터 새로고침
    } catch (error) {
      console.error('주문 상태 변경 오류:', error);
      alert(`상태 변경 실패: ${error.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  // 주문 삭제 (관리자)
  const handleDeleteOrder = async (orderId) => {
    if (!confirm('이 주문을 삭제하시겠습니까?')) return;
    
    try {
      setActionLoading(true);
      await orderAPI.deleteOrder(orderId);
      await loadData(); // 데이터 새로고침
      alert('주문이 삭제되었습니다.');
    } catch (error) {
      console.error('주문 삭제 오류:', error);
      alert(`삭제 실패: ${error.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  // 대시보드 통계 계산
  const getOrderStats = () => {
    return {
      total: orders.length,
      pending: orders.filter(order => order.status === 'pending').length,
      preparing: orders.filter(order => order.status === 'preparing').length,
      completed: orders.filter(order => order.status === 'completed').length
    };
  };

  // 로딩 상태 표시
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>데이터를 불러오는 중...</p>
      </div>
    );
  }

  // 에러 상태 표시
  if (error) {
    return (
      <div className="error-container">
        <h2>오류가 발생했습니다</h2>
        <p>{error}</p>
        <button onClick={loadData}>다시 시도</button>
      </div>
    );
  }

  return (
    <div className="App">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* 액션 로딩 스피너 */}
      {actionLoading && (
        <div className="action-loading-overlay">
          <div className="action-loading-spinner"></div>
          <p>처리 중...</p>
        </div>
      )}
      
      <main className="main-content">
        {activeTab === 'order' ? (
          <div className="order-page">
            {/* 좌우 레이아웃 */}
            <div className="order-content">
              {/* 왼쪽: 메뉴 목록 */}
              <div className="order-left">
                <div className="menu-section">
                  <div className="menu-grid">
                    {menus.map(menu => (
                      <MenuCard
                        key={menu.id}
                        menu={menu}
                        stock={menu.stock}
                        onAddToCart={handleAddToCart}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              {/* 오른쪽: 사이드바 */}
              <div className="order-right">
                <div className="sidebar">
                  {/* 장바구니 */}
                  <div className="sidebar-section">
                    <Cart
                      items={cartItems}
                      inventory={menus}
                      onUpdateQuantity={handleUpdateQuantity}
                      onRemoveItem={handleRemoveFromCart}
                      onOrder={handleOrder}
                    />
                  </div>
                  
                  {/* 주문 내역 */}
                  <div className="sidebar-section">
                    <button 
                      className="order-history-toggle"
                      onClick={() => setShowOrderHistory(!showOrderHistory)}
                    >
                      <span className="toggle-icon">
                        {showOrderHistory ? '▼' : '▶'}
                      </span>
                      <span className="toggle-text">주문 내역</span>
                      <span className="toggle-count">({orders.length})</span>
                    </button>
                    
                    {showOrderHistory && (
                      <div className="order-history">
                        <h3>주문 내역</h3>
                        <div className="order-history-list">
                          {orders.slice(0, 5).map(order => (
                            <div key={order.id} className="order-history-item">
                              <div className="order-history-header">
                                <div className="order-history-time">
                                  {new Date(order.created_at).toLocaleDateString('ko-KR', {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </div>
                                <div className={`order-history-status ${order.status}`}>
                                  {order.status === 'pending' ? '주문 접수' :
                                   order.status === 'preparing' ? '제조 중' : '제조 완료'}
                                </div>
                              </div>
                              <div className="order-history-items">
                                {order.items.map((item, index) => (
                                  <div key={index} className="order-history-item-detail">
                                    <span className="item-name">{item.menu_name}</span>
                                    <span className="item-quantity">x{item.quantity}</span>
                                    <span className="item-price">{item.subtotal.toLocaleString()}원</span>
                                  </div>
                                ))}
                              </div>
                              <div className="order-history-total">
                                총 {order.total_amount.toLocaleString()}원
                              </div>
                            </div>
                          ))}
                          {orders.length === 0 && (
                            <div className="order-history-empty">
                              아직 주문 내역이 없습니다
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="admin-page">
            {/* 관리자 대시보드 */}
            <AdminDashboard stats={getOrderStats()} />
            
            {/* 재고 관리와 주문 관리를 좌우로 배치 */}
            <div className="admin-content">
              <div className="admin-left">
                <InventoryManagement
                  menus={menus}
                  onUpdateInventory={handleUpdateInventory}
                />
              </div>
              <div className="admin-right">
                <OrderManagement
                  orders={orders}
                  onUpdateOrderStatus={handleUpdateOrderStatus}
                  onDeleteOrder={handleDeleteOrder}
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;