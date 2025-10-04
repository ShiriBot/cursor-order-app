# 커피 주문 앱 - 프론트엔드

React와 Vite를 사용한 커피 주문 앱의 프론트엔드입니다.

## 🛠 기술 스택

- **React** 19.1.1
- **Vite** 7.1.7
- **JavaScript** (바닐라)
- **ESLint** - 코드 품질 관리

## 📦 설치

```bash
npm install
```

## 🚀 개발

### 개발 서버 실행

```bash
npm run dev
```

개발 서버는 `http://localhost:5173`에서 실행됩니다.

### 빌드

```bash
npm run build
```

빌드된 파일은 `dist` 폴더에 생성됩니다.

### 프로덕션 미리보기

```bash
npm run preview
```

### 린트 검사

```bash
npm run lint
```

## 📁 프로젝트 구조

```
ui/
├── public/           # 정적 파일
├── src/             # 소스 코드
│   ├── assets/      # 이미지, 아이콘 등
│   ├── App.jsx      # 메인 앱 컴포넌트
│   ├── App.css      # 앱 스타일
│   ├── main.jsx     # 앱 진입점
│   └── index.css    # 글로벌 스타일
├── index.html       # HTML 템플릿
├── vite.config.js   # Vite 설정
└── package.json     # 프로젝트 의존성
```

## 🎨 주요 화면

### 1. 주문하기 화면
- 메뉴 목록 표시
- 옵션 선택 (샷 추가, 시럽 추가)
- 장바구니 기능
- 주문 완료

### 2. 관리자 화면 (예정)
- 재고 관리
- 주문 상태 관리

## 🔌 API 엔드포인트 (예정)

- `GET /api/menus` - 메뉴 목록 조회
- `POST /api/orders` - 주문 생성
- `GET /api/orders` - 주문 목록 조회 (관리자)
- `PATCH /api/orders/:id` - 주문 상태 변경 (관리자)

## 📝 참고사항

- 이 프로젝트는 학습 목적으로 개발되었습니다.
- 사용자 인증 및 결제 기능은 포함되지 않습니다.
- 백엔드 API와 연동하여 동작합니다.
