import './OrderManagement.css';

function OrderManagement({ orders, onUpdateOrderStatus, onDeleteOrder }) {
  const getStatusButton = (order) => {
    switch (order.status) {
      case 'pending':
        return (
          <button
            className="order-btn pending"
            onClick={() => onUpdateOrderStatus(order.id, 'preparing')}
          >
            제조 시작
          </button>
        );
      case 'preparing':
        return (
          <button
            className="order-btn preparing"
            onClick={() => onUpdateOrderStatus(order.id, 'completed')}
          >
            제조 완료
          </button>
        );
      case 'completed':
        return (
          <div className="completed-actions">
            <span className="order-status-badge completed">완료</span>
            {onDeleteOrder && (
              <button
                className="delete-btn"
                onClick={() => onDeleteOrder(order.id)}
                title="삭제"
              >
                🗑️ 삭제
              </button>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${month}월 ${day}일 ${hours}:${minutes}`;
  };

  return (
    <div className="order-management">
      <h2 className="order-title">주문 현황</h2>
      {orders.length === 0 ? (
        <div className="order-empty">주문이 없습니다</div>
      ) : (
        <div className="order-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-info">
                <div className="order-date">{formatDate(order.created_at)}</div>
                <div className="order-items">
                  {order.items.map((item, index) => (
                    <span key={index}>
                      {item.menu_name}
                      {item.options && item.options.length > 0 && 
                        ` (${item.options.map(opt => opt.option_name).join(', ')})`
                      } x {item.quantity}
                    </span>
                  ))}
                </div>
                <div className="order-price">{order.total_amount.toLocaleString()}원</div>
              </div>
              <div className="order-action">{getStatusButton(order)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrderManagement;

