// API 기본 설정
const API_BASE_URL = import.meta.env.PROD 
  ? 'https://cursor-order-app-backend.onrender.com/api'  // 프로덕션 URL
  : 'http://localhost:3000/api';  // 개발 환경 URL

// API 요청 헬퍼 함수
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'API 요청 실패');
    }

    return data;
  } catch (error) {
    console.error('API 요청 오류:', error);
    throw error;
  }
};

// 메뉴 관련 API
export const menuAPI = {
  // 모든 메뉴 조회
  getMenus: () => apiRequest('/menus'),
  
  // 특정 메뉴 조회
  getMenu: (id) => apiRequest(`/menus/${id}`),
  
  // 메뉴 재고 업데이트
  updateStock: (id, change) => apiRequest(`/menus/${id}/stock`, {
    method: 'PATCH',
    body: JSON.stringify({ change }),
  }),
};

// 옵션 관련 API
export const optionAPI = {
  // 모든 옵션 조회
  getOptions: () => apiRequest('/options'),
  
  // 특정 옵션 조회
  getOption: (id) => apiRequest(`/options/${id}`),
};

// 주문 관련 API
export const orderAPI = {
  // 주문 생성
  createOrder: (orderData) => apiRequest('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  }),
  
  // 주문 목록 조회
  getOrders: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/orders?${queryString}` : '/orders';
    return apiRequest(endpoint);
  },
  
  // 특정 주문 조회
  getOrder: (id) => apiRequest(`/orders/${id}`),
  
  // 주문 상태 변경
  updateStatus: (id, status) => apiRequest(`/orders/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  }),
  
  // 주문 삭제
  deleteOrder: (id) => apiRequest(`/orders/${id}`, {
    method: 'DELETE',
  }),
  
  // 주문 통계 조회
  getStats: () => apiRequest('/orders/stats'),
};

export default {
  menuAPI,
  optionAPI,
  orderAPI,
};
