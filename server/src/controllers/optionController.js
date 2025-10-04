const Option = require('../models/Option');

// 모든 옵션 조회
const getAllOptions = async (req, res) => {
  try {
    const options = await Option.getAll();
    
    res.json({
      success: true,
      data: options
    });
  } catch (error) {
    console.error('옵션 조회 오류:', error);
    res.status(500).json({
      success: false,
      error: '옵션 조회 중 오류가 발생했습니다.'
    });
  }
};

// 특정 옵션 조회
const getOptionById = async (req, res) => {
  try {
    const { id } = req.params;
    const option = await Option.getById(id);
    
    if (!option) {
      return res.status(404).json({
        success: false,
        error: '옵션을 찾을 수 없습니다.'
      });
    }
    
    res.json({
      success: true,
      data: option
    });
  } catch (error) {
    console.error('옵션 조회 오류:', error);
    res.status(500).json({
      success: false,
      error: '옵션 조회 중 오류가 발생했습니다.'
    });
  }
};

module.exports = {
  getAllOptions,
  getOptionById
};
