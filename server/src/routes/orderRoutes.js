const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// POST /api/orders - 주문 생성
router.post('/', orderController.createOrder);

// GET /api/orders - 주문 목록 조회
router.get('/', orderController.getAllOrders);

// GET /api/orders/stats - 주문 통계 조회
router.get('/stats', orderController.getOrderStats);

// GET /api/orders/:id - 특정 주문 조회
router.get('/:id', orderController.getOrderById);

// PATCH /api/orders/:id/status - 주문 상태 변경
router.patch('/:id/status', orderController.updateOrderStatus);

// DELETE /api/orders/:id - 주문 삭제
router.delete('/:id', orderController.deleteOrder);

module.exports = router;
