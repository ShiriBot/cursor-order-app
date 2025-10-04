const Menu = require('../models/Menu');

// 모든 메뉴 조회
const getAllMenus = async (req, res) => {
  try {
    const menus = await Menu.getAll();
    
    res.json({
      success: true,
      data: menus
    });
  } catch (error) {
    console.error('메뉴 조회 오류:', error);
    res.status(500).json({
      success: false,
      error: '메뉴 조회 중 오류가 발생했습니다.'
    });
  }
};

// 특정 메뉴 조회
const getMenuById = async (req, res) => {
  try {
    const { id } = req.params;
    const menu = await Menu.getById(id);
    
    if (!menu) {
      return res.status(404).json({
        success: false,
        error: '메뉴를 찾을 수 없습니다.'
      });
    }
    
    res.json({
      success: true,
      data: menu
    });
  } catch (error) {
    console.error('메뉴 조회 오류:', error);
    res.status(500).json({
      success: false,
      error: '메뉴 조회 중 오류가 발생했습니다.'
    });
  }
};

// 메뉴 재고 업데이트
const updateMenuStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { change } = req.body;
    
    // change는 양수(증가) 또는 음수(감소)
    if (typeof change !== 'number') {
      return res.status(400).json({
        success: false,
        error: 'change 값은 숫자여야 합니다.'
      });
    }
    
    // 재고 감소 시 음수가 되지 않도록 확인
    if (change < 0) {
      const currentMenu = await Menu.getById(id);
      if (!currentMenu) {
        return res.status(404).json({
          success: false,
          error: '메뉴를 찾을 수 없습니다.'
        });
      }
      
      if (currentMenu.stock + change < 0) {
        return res.status(400).json({
          success: false,
          error: '재고가 부족합니다.'
        });
      }
    }
    
    const updatedMenu = await Menu.updateStock(id, change);
    
    if (!updatedMenu) {
      return res.status(404).json({
        success: false,
        error: '메뉴를 찾을 수 없습니다.'
      });
    }
    
    res.json({
      success: true,
      data: {
        id: updatedMenu.id,
        name: updatedMenu.name,
        stock: updatedMenu.stock
      }
    });
  } catch (error) {
    console.error('재고 업데이트 오류:', error);
    res.status(500).json({
      success: false,
      error: '재고 업데이트 중 오류가 발생했습니다.'
    });
  }
};

module.exports = {
  getAllMenus,
  getMenuById,
  updateMenuStock
};
