const { query } = require('../config/database');

class Menu {
  // 모든 메뉴 조회
  static async getAll() {
    const result = await query('SELECT * FROM menus ORDER BY id');
    return result.rows;
  }

  // ID로 메뉴 조회
  static async getById(id) {
    const result = await query('SELECT * FROM menus WHERE id = $1', [id]);
    return result.rows[0];
  }

  // 메뉴 재고 업데이트
  static async updateStock(id, change) {
    const result = await query(
      'UPDATE menus SET stock = stock + $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [change, id]
    );
    return result.rows[0];
  }

  // 재고 확인
  static async checkStock(id, quantity) {
    const result = await query('SELECT stock FROM menus WHERE id = $1', [id]);
    const menu = result.rows[0];
    return menu && menu.stock >= quantity;
  }
}

module.exports = Menu;
