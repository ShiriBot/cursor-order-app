const { query } = require('../config/database');

class Option {
  // 모든 옵션 조회
  static async getAll() {
    const result = await query('SELECT * FROM options ORDER BY id');
    return result.rows;
  }

  // ID로 옵션 조회
  static async getById(id) {
    const result = await query('SELECT * FROM options WHERE id = $1', [id]);
    return result.rows[0];
  }

  // 여러 ID로 옵션 조회
  static async getByIds(ids) {
    if (!ids || ids.length === 0) return [];
    
    const placeholders = ids.map((_, index) => `$${index + 1}`).join(',');
    const result = await query(
      `SELECT * FROM options WHERE id IN (${placeholders}) ORDER BY id`,
      ids
    );
    return result.rows;
  }
}

module.exports = Option;
