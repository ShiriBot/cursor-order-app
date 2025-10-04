import { useState, useRef } from 'react';
import './Cart.css';

function Cart({ items, inventory, onOrder, onUpdateQuantity, onRemoveItem }) {
  const [updatingIndex, setUpdatingIndex] = useState(null);
  const updateTimeoutRef = useRef(null);
  
  // 총 금액 계산
  const totalAmount = items.reduce((sum, item) => {
    let itemPrice = item.price;
    if (item.options.extraShot) itemPrice += 500;
    return sum + itemPrice * item.quantity;
  }, 0);

  // 옵션 텍스트 생성
  const getOptionsText = (options) => {
    const opts = [];
    if (options.extraShot) opts.push('샷 추가');
    if (options.extraSyrup) opts.push('시럽 추가');
    return opts.length > 0 ? ` (${opts.join(', ')})` : '';
  };

  // 수량 업데이트 핸들러 (디바운스 적용)
  const handleQuantityChange = (index, change) => {
    if (updatingIndex === index) return; // 이미 처리 중이면 무시
    
    setUpdatingIndex(index);
    onUpdateQuantity(index, change);
    
    // 300ms 후 다시 활성화
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }
    updateTimeoutRef.current = setTimeout(() => {
      setUpdatingIndex(null);
    }, 300);
  };

  return (
    <div className="cart">
      <div className="cart-content">
        <h2 className="cart-title">장바구니</h2>
        
        {items.length === 0 ? (
          <p className="cart-empty">장바구니가 비어있습니다</p>
        ) : (
          <div className="cart-items">
            {items.map((item, index) => {
              let itemPrice = item.price;
              if (item.options.extraShot) itemPrice += 500;
              const stock = inventory?.find(inv => inv.id === item.id)?.stock || 0;
              const canIncrease = item.quantity < stock;
              
              return (
                <div key={index} className="cart-item">
                  <div className="cart-item-info">
                    <div className="cart-item-name">
                      {item.name}{getOptionsText(item.options)}
                    </div>
                    {/* 재고 표기 */}
                    {!canIncrease && stock > 0 && (
                      <div className="cart-stock-indicator">재고 {stock}개</div>
                    )}
                  </div>
                  <div className="cart-item-controls">
                    <button 
                      className="quantity-btn"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleQuantityChange(index, -1);
                      }}
                      disabled={item.quantity <= 1 || updatingIndex === index}
                    >
                      -
                    </button>
                    <span className="cart-item-quantity">{item.quantity}</span>
                    <button 
                      className="quantity-btn"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleQuantityChange(index, 1);
                      }}
                      disabled={updatingIndex === index || !canIncrease}
                      title={!canIncrease ? `재고: ${stock}개` : ''}
                    >
                      +
                    </button>
                  </div>
                  <div className="cart-item-price">
                    {(itemPrice * item.quantity).toLocaleString()}원
                  </div>
                  <button 
                    className="remove-btn"
                    onClick={() => onRemoveItem(index)}
                    title="삭제"
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
        )}
        
        {items.length > 0 && (
          <>
            <div className="cart-total">
              <span className="total-label">총 금액</span>
              <span className="total-amount">{totalAmount.toLocaleString()}원</span>
            </div>
            <button className="order-button" onClick={onOrder}>
              주문하기
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Cart;