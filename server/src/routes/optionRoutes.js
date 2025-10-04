const express = require('express');
const router = express.Router();
const optionController = require('../controllers/optionController');

// GET /api/options - 모든 옵션 조회
router.get('/', optionController.getAllOptions);

// GET /api/options/:id - 특정 옵션 조회
router.get('/:id', optionController.getOptionById);

module.exports = router;
