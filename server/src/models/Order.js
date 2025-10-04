const { query, transaction } = require('../config/database');

class Order {
  // 주문 생성 (트랜잭션 처리)
  static async create(orderData) {
    return await transaction(async (client) => {
      // 1. 재고 확인
      for (const item of orderData.items) {
        const stockCheck = await client.query(
          'SELECT stock FROM menus WHERE id = $1',
          [item.menuId]
        );
        
        if (stockCheck.rows.length === 0) {
          throw new Error(`메뉴 ID ${item.menuId}를 찾을 수 없습니다.`);
        }
        
        const availableStock = stockCheck.rows[0].stock;
        if (availableStock < item.quantity) {
          throw new Error(`재고가 부족합니다. 메뉴 ID: ${item.menuId}, 요청: ${item.quantity}, 재고: ${availableStock}`);
        }
      }

      // 2. 총 금액 계산
      let totalAmount = 0;
      const processedItems = [];

      for (const item of orderData.items) {
        // 메뉴 정보 조회
        const menuResult = await client.query(
          'SELECT name, price FROM menus WHERE id = $1',
          [item.menuId]
        );
        
        if (menuResult.rows.length === 0) {
          throw new Error(`메뉴 ID ${item.menuId}를 찾을 수 없습니다.`);
        }
        
        const menu = menuResult.rows[0];
        
        // 옵션 정보 조회
        let options = [];
        if (item.options && item.options.length > 0) {
          const optionResult = await client.query(
            `SELECT id, name, price FROM options WHERE id = ANY($1)`,
            [item.options]
          );
          options = optionResult.rows;
        }
        
        // 단가 계산 (메뉴 가격 + 옵션 가격)
        const optionPrice = options.reduce((sum, option) => sum + option.price, 0);
        const unitPrice = menu.price + optionPrice;
        const subtotal = unitPrice * item.quantity;
        
        totalAmount += subtotal;
        
        processedItems.push({
          menuId: item.menuId,
          menuName: menu.name,
          quantity: item.quantity,
          unitPrice,
          subtotal,
          options
        });
      }

      // 3. 주문 생성
      const orderResult = await client.query(
        'INSERT INTO orders (total_amount, status) VALUES ($1, $2) RETURNING *',
        [totalAmount, 'pending']
      );
      
      const order = orderResult.rows[0];

      // 4. 주문 항목 생성
      const orderItems = [];
      for (const item of processedItems) {
        const itemResult = await client.query(
          'INSERT INTO order_items (order_id, menu_id, menu_name, quantity, unit_price, subtotal) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
          [order.id, item.menuId, item.menuName, item.quantity, item.unitPrice, item.subtotal]
        );
        
        const orderItem = itemResult.rows[0];
        
        // 5. 옵션 저장
        if (item.options.length > 0) {
          for (const option of item.options) {
            await client.query(
              'INSERT INTO order_item_options (order_item_id, option_id, option_name, option_price) VALUES ($1, $2, $3, $4)',
              [orderItem.id, option.id, option.name, option.price]
            );
          }
        }
        
        orderItems.push({
          ...orderItem,
          options: item.options.map(opt => ({
            option_name: opt.name,
            option_price: opt.price
          }))
        });
      }

      // 6. 재고 감소
      for (const item of orderData.items) {
        await client.query(
          'UPDATE menus SET stock = stock - $1 WHERE id = $2',
          [item.quantity, item.menuId]
        );
      }

      return {
        ...order,
        items: orderItems
      };
    });
  }

  // 모든 주문 조회
  static async getAll(filters = {}) {
    let queryText = `
      SELECT o.*, 
             json_agg(
               json_build_object(
                 'id', oi.id,
                 'menu_id', oi.menu_id,
                 'menu_name', oi.menu_name,
                 'quantity', oi.quantity,
                 'unit_price', oi.unit_price,
                 'subtotal', oi.subtotal,
                 'options', COALESCE(oi_options.options, '[]'::json)
               ) ORDER BY oi.id
             ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN (
        SELECT oio.order_item_id,
               json_agg(
                 json_build_object(
                   'option_name', oio.option_name,
                   'option_price', oio.option_price
                 )
               ) as options
        FROM order_item_options oio
        GROUP BY oio.order_item_id
      ) oi_options ON oi.id = oi_options.order_item_id
    `;
    
    const conditions = [];
    const params = [];
    let paramCount = 0;

    if (filters.status) {
      paramCount++;
      conditions.push(`o.status = $${paramCount}`);
      params.push(filters.status);
    }

    if (conditions.length > 0) {
      queryText += ` WHERE ${conditions.join(' AND ')}`;
    }

    queryText += ` GROUP BY o.id ORDER BY o.created_at DESC`;

    if (filters.limit) {
      paramCount++;
      queryText += ` LIMIT $${paramCount}`;
      params.push(filters.limit);
    }

    if (filters.offset) {
      paramCount++;
      queryText += ` OFFSET $${paramCount}`;
      params.push(filters.offset);
    }

    const result = await query(queryText, params);
    return result.rows;
  }

  // 특정 주문 조회
  static async getById(id) {
    const result = await query(`
      SELECT o.*, 
             json_agg(
               json_build_object(
                 'id', oi.id,
                 'menu_id', oi.menu_id,
                 'menu_name', oi.menu_name,
                 'quantity', oi.quantity,
                 'unit_price', oi.unit_price,
                 'subtotal', oi.subtotal,
                 'options', COALESCE(oi_options.options, '[]'::json)
               ) ORDER BY oi.id
             ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN (
        SELECT oio.order_item_id,
               json_agg(
                 json_build_object(
                   'option_name', oio.option_name,
                   'option_price', oio.option_price
                 )
               ) as options
        FROM order_item_options oio
        GROUP BY oio.order_item_id
      ) oi_options ON oi.id = oi_options.order_item_id
      WHERE o.id = $1
      GROUP BY o.id
    `, [id]);
    
    return result.rows[0];
  }

  // 주문 상태 업데이트
  static async updateStatus(id, status) {
    // 상태 전환 유효성 검사
    const validTransitions = {
      'pending': ['preparing'],
      'preparing': ['completed'],
      'completed': []
    };

    const currentOrder = await this.getById(id);
    if (!currentOrder) {
      throw new Error('주문을 찾을 수 없습니다.');
    }

    const currentStatus = currentOrder.status;
    if (!validTransitions[currentStatus]?.includes(status)) {
      throw new Error(`잘못된 상태 변경입니다. ${currentStatus}에서 ${status}로 변경할 수 없습니다.`);
    }

    const result = await query(
      'UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [status, id]
    );
    
    return result.rows[0];
  }

  // 주문 삭제 (완료된 주문만)
  static async delete(id) {
    const order = await this.getById(id);
    if (!order) {
      throw new Error('주문을 찾을 수 없습니다.');
    }

    if (order.status !== 'completed') {
      throw new Error('완료된 주문만 삭제할 수 있습니다.');
    }

    await query('DELETE FROM orders WHERE id = $1', [id]);
    return true;
  }

  // 주문 통계
  static async getStats() {
    const result = await query(`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
        COUNT(CASE WHEN status = 'preparing' THEN 1 END) as preparing,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed
      FROM orders
    `);
    
    return result.rows[0];
  }
}

module.exports = Order;
