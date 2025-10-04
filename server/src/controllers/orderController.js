const Order = require('../models/Order');

// 주문 생성
const createOrder = async (req, res) => {
  try {
    const { items } = req.body;

    // 입력 유효성 검증
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: '주문 항목이 필요합니다.'
      });
    }

    for (const item of items) {
      if (!item.menuId || !item.quantity || item.quantity <= 0) {
        return res.status(400).json({
          success: false,
          error: '메뉴 ID와 수량이 필요합니다.'
        });
      }
    }

    const order = await Order.create({ items });
    
    res.status(201).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('주문 생성 오류:', error);
    
    if (error.message.includes('재고가 부족')) {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      error: '주문 생성 중 오류가 발생했습니다.'
    });
  }
};

// 주문 목록 조회
const getAllOrders = async (req, res) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;
    
    const filters = {};
    if (status) filters.status = status;
    if (limit) filters.limit = parseInt(limit);
    if (offset) filters.offset = parseInt(offset);

    const orders = await Order.getAll(filters);
    
    res.json({
      success: true,
      data: {
        orders,
        total: orders.length,
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error) {
    console.error('주문 조회 오류:', error);
    res.status(500).json({
      success: false,
      error: '주문 조회 중 오류가 발생했습니다.'
    });
  }
};

// 특정 주문 조회
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.getById(id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        error: '주문을 찾을 수 없습니다.'
      });
    }
    
    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('주문 조회 오류:', error);
    res.status(500).json({
      success: false,
      error: '주문 조회 중 오류가 발생했습니다.'
    });
  }
};

// 주문 상태 변경
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status || !['pending', 'preparing', 'completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: '유효한 상태를 입력해주세요. (pending, preparing, completed)'
      });
    }
    
    const order = await Order.updateStatus(id, status);
    
    res.json({
      success: true,
      data: {
        id: order.id,
        status: order.status,
        updated_at: order.updated_at
      }
    });
  } catch (error) {
    console.error('주문 상태 변경 오류:', error);
    
    if (error.message.includes('잘못된 상태 변경') || error.message.includes('주문을 찾을 수 없습니다')) {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      error: '주문 상태 변경 중 오류가 발생했습니다.'
    });
  }
};

// 주문 삭제
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    await Order.delete(id);
    
    res.json({
      success: true,
      message: '주문이 삭제되었습니다.'
    });
  } catch (error) {
    console.error('주문 삭제 오류:', error);
    
    if (error.message.includes('완료된 주문만') || error.message.includes('주문을 찾을 수 없습니다')) {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      error: '주문 삭제 중 오류가 발생했습니다.'
    });
  }
};

// 주문 통계
const getOrderStats = async (req, res) => {
  try {
    const stats = await Order.getStats();
    
    res.json({
      success: true,
      data: {
        total: parseInt(stats.total),
        pending: parseInt(stats.pending),
        preparing: parseInt(stats.preparing),
        completed: parseInt(stats.completed)
      }
    });
  } catch (error) {
    console.error('통계 조회 오류:', error);
    res.status(500).json({
      success: false,
      error: '통계 조회 중 오류가 발생했습니다.'
    });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  getOrderStats
};
