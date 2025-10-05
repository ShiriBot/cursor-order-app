const express = require('express');
const cors = require('cors');

const app = express();

// 미들웨어 설정
const allowedOrigins = [
  'http://localhost:5173', // 개발 환경
  'http://localhost:3000',  // 개발 환경 (백업)
  'https://order-app-ui.onrender.com', // 예상 프론트엔드 URL
  'https://cursor-order-app-frontend.onrender.com' // 실제 프론트엔드 URL
];

app.use(cors({
  origin: function (origin, callback) {
    // origin이 없는 경우 (모바일 앱, Postman 등)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('CORS 정책에 의해 차단되었습니다.'));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 로깅 미들웨어
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// 헬스 체크 엔드포인트
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: '서버가 정상적으로 실행 중입니다.',
    timestamp: new Date().toISOString()
  });
});

// 라우트 설정
const menuRoutes = require('./routes/menuRoutes');
const orderRoutes = require('./routes/orderRoutes');
const optionRoutes = require('./routes/optionRoutes');

app.use('/api/menus', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/options', optionRoutes);

// 404 에러 처리
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: '요청하신 리소스를 찾을 수 없습니다.'
  });
});

// 에러 핸들러
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  res.status(err.status || 500).json({
    success: false,
    error: err.message || '서버 오류가 발생했습니다.',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

module.exports = app;

