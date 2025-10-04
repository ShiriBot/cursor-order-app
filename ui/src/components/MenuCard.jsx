import { useState, useRef, useEffect } from 'react';
import './MenuCard.css';

function MenuCard({ menu, stock, onAddToCart }) {
  const [extraShot, setExtraShot] = useState(false);
  const [extraSyrup, setExtraSyrup] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const addTimeoutRef = useRef(null);
  
  const isOutOfStock = stock === 0;

  // cleanup 함수
  useEffect(() => {
    return () => {
      if (addTimeoutRef.current) {
        clearTimeout(addTimeoutRef.current);
      }
    };
  }, []);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // 이미 처리 중이면 무시
    if (isAdding) return;
    
    setIsAdding(true);
    
    onAddToCart({
      ...menu,
      options: {
        extraShot,
        extraSyrup,
      },
    });
    
    // 옵션 초기화
    setExtraShot(false);
    setExtraSyrup(false);
    
    // 500ms 후 다시 활성화
    if (addTimeoutRef.current) {
      clearTimeout(addTimeoutRef.current);
    }
    addTimeoutRef.current = setTimeout(() => {
      setIsAdding(false);
    }, 500);
  };

  return (
    <div className="menu-card">
      <div className="menu-image-placeholder">
        {menu.image ? (
          <img src={menu.image} alt={menu.name} className="menu-image" />
        ) : (
          <div className="image-cross">✕</div>
        )}
      </div>
      <div className="menu-header">
        <h3 className="menu-name">{menu.name}</h3>
        {isOutOfStock && <span className="stock-badge out">품절</span>}
        {!isOutOfStock && stock < 5 && <span className="stock-badge low">재고 {stock}개</span>}
      </div>
      <p className="menu-price">{menu.price.toLocaleString()}원</p>
      <p className="menu-description">{menu.description || '간단한 설명...'}</p>
      
      <div className="menu-options">
        <label className="option-label">
          <input
            type="checkbox"
            checked={extraShot}
            onChange={(e) => setExtraShot(e.target.checked)}
          />
          <span>샷 추가 (+500원)</span>
        </label>
        <label className="option-label">
          <input
            type="checkbox"
            checked={extraSyrup}
            onChange={(e) => setExtraSyrup(e.target.checked)}
          />
          <span>시럽 추가 (+0원)</span>
        </label>
      </div>

      <button 
        className="add-button" 
        onClick={handleAddToCart}
        disabled={isAdding || isOutOfStock}
      >
        {isOutOfStock ? '품절' : isAdding ? '담는 중...' : '담기'}
      </button>
    </div>
  );
}

export default MenuCard;

