import './InventoryManagement.css';

function InventoryManagement({ inventory, onUpdateInventory }) {
  const getStockStatus = (stock) => {
    if (stock === 0) return { text: '품절', className: 'stock-out' };
    if (stock < 5) return { text: '주의', className: 'stock-warning' };
    return { text: '정상', className: 'stock-normal' };
  };

  return (
    <div className="inventory-management">
      <h2 className="inventory-title">재고 현황</h2>
      <div className="inventory-grid">
        {inventory.map((item) => {
          const status = getStockStatus(item.stock);
          return (
            <div key={item.id} className="inventory-card">
              <div className="inventory-info">
                <h3 className="inventory-name">{item.name}</h3>
                <div className="inventory-stock">
                  <span className="stock-count">{item.stock}개</span>
                  <span className={`stock-status ${status.className}`}>
                    {status.text}
                  </span>
                </div>
              </div>
              <div className="inventory-controls">
                <button
                  className="inventory-btn"
                  onClick={() => onUpdateInventory(item.id, -1)}
                  disabled={item.stock === 0}
                >
                  -
                </button>
                <button
                  className="inventory-btn"
                  onClick={() => onUpdateInventory(item.id, 1)}
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default InventoryManagement;

