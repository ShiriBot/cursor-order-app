const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');

// GET /api/menus - 모든 메뉴 조회
router.get('/', menuController.getAllMenus);

// GET /api/menus/:id - 특정 메뉴 조회
router.get('/:id', menuController.getMenuById);

// PATCH /api/menus/:id/stock - 메뉴 재고 업데이트
router.patch('/:id/stock', menuController.updateMenuStock);

module.exports = router;
