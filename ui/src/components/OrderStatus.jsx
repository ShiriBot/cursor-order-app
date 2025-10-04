import './OrderStatus.css';

function OrderStatus({ orders }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${month}월 ${day}일 ${hours}:${minutes}`;
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return { text: '주문 접수', className: 'status-pending' };
      case 'preparing':
        return { text: '제조 중', className: 'status-preparing' };
      case 'completed':
        return { text: '제조 완료', className: 'status-completed' };
      default:
        return { text: '알 수 없음', className: '' };
    }
  };

  // 완료되지 않은 주문만 표시
  const activeOrders = orders.filter(order => order.status !== 'completed');

  if (activeOrders.length === 0) {
    return null;
  }

  return (
    <div className="order-status-widget">
      <h3 className="order-status-title">내 주문 상태</h3>
      <div className="order-status-list">
        {activeOrders.map((order) => {
          const status = getStatusText(order.status);
          return (
            <div key={order.id} className="order-status-item">
              <div className="order-status-info">
                <div className="order-status-time">{formatDate(order.date)}</div>
                <div className="order-status-items">
                  {order.items.map((item, index) => (
                    <span key={index}>
                      {item.name} x {item.quantity}
                    </span>
                  ))}
                </div>
              </div>
              <div className={`order-status-badge ${status.className}`}>
                {status.text}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default OrderStatus;

