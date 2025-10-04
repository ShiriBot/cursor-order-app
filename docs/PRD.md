# 커피 주문 앱

## 1 .프로젝트 개요

### 1.1. 프로젝트명
커피 주문 앱

### 1.2. 프로젝트 목적
사용자가 커피 메뉴를 주문하고, 관리자가 주문을 관리할 수 있는 간단한 풀스택 웹 앱

### 1.3. 개발 범위
- 주문하기 화면(메뉴 선택 및 장바구니 기능)
- 관리자 화면(재고 관리 및 주문 상태 관리)
- 데이터를 생성/조회/수정/삭제할 수 있는 기능

## 2. 기술 스택
- 프론트엔드 : HTML, CSS, 리액트, 자바스크립트
- 백엔드 : Node.js, Express
- 데이터베이스 : PostreSQL

## 3. 기본 사항
- 프론트엔트와 백엔드를 따로 개발
- 기본적인 웹 기술만 사용
- 학습 목적이므로 사용자 인증이나 결제 기능은 제외
- 메뉴는 커피 메뉴만 있음.

---

## 4. 프런트엔드 UI 요구사항

### 4.1. 주문하기 화면

#### 4.1.1. 화면 개요
- 사용자가 커피 메뉴를 선택하고 옵션을 추가하여 장바구니에 담은 후 주문할 수 있는 화면
- 메뉴 목록과 장바구니를 동시에 볼 수 있는 구조

#### 4.1.2. 화면 구성요소

##### (1) 헤더 영역
- **브랜드 로고**: "COZY" 텍스트 로고 좌측 상단 배치
- **네비게이션 메뉴**:
  - "주문하기" 탭: 현재 화면
  - "관리자" 탭: 관리자 화면으로 이동

##### (2) 메뉴 목록 영역
- **레이아웃**: 그리드 형태로 메뉴 카드 배치 (1행에 3개)
- **메뉴 카드 구성**:
  - 메뉴 이미지 영역 (placeholder)
  - 메뉴명: 예) "아메리카노(ICE)", "아메리카노(HOT)", "카페라떼"
  - 가격: 예) "4,000원", "5,000원"
  - 간단한 설명: "간단한 설명..."
  - **옵션 선택**:
    - 샷 추가 체크박스 (+500원)
    - 시럽 추가 체크박스 (가격 변동 없음 또는 별도 금액)
  - "담기" 버튼: 선택한 메뉴와 옵션을 장바구니에 추가

##### (3) 장바구니 영역
- **제목**: "장바구니"
- **주문 내역 목록**:
  - 각 항목에 다음 정보 표시:
    - 메뉴명 (선택한 옵션 표시) 예) "아메리카노(ICE) (샷 추가)"
    - 수량 표시: "X 1", "X 2" 등
    - 항목별 가격: 예) "4,500원", "8,000원"
- **총 금액 표시**:
  - "총 금액" 레이블과 합계 금액 강조 표시
  - 예) "총 금액 12,500원"
- **주문하기 버튼**:
  - 장바구니 하단에 배치
  - 클릭 시 주문 완료 처리

#### 4.1.3. 기능 요구사항

##### (1) 메뉴 선택 기능
- 메뉴 목록을 백엔드 API에서 조회하여 표시
- 각 메뉴의 이름, 가격, 설명을 표시
- 메뉴 이미지는 placeholder 사용

##### (2) 옵션 선택 기능
- 각 메뉴마다 추가 옵션 선택 가능
- 샷 추가: +500원
- 시럽 추가: 가격 변동 표시 (+0원 또는 별도 금액)
- 체크박스로 옵션 선택/해제

##### (3) 장바구니 담기 기능
- "담기" 버튼 클릭 시 선택한 메뉴와 옵션을 장바구니에 추가
- 동일한 메뉴+옵션 조합이 있을 경우 수량 증가
- 장바구니 상태는 클라이언트 측에서 관리 (React state)

##### (4) 장바구니 표시 기능
- 장바구니에 담긴 항목 목록 실시간 표시
- 각 항목의 메뉴명, 옵션, 수량, 가격 표시
- 총 금액 자동 계산 및 표시

##### (5) 주문 완료 기능
- "주문하기" 버튼 클릭 시 장바구니 내역을 백엔드로 전송
- 주문 완료 후 장바구니 초기화
- 주문 완료 알림 표시 (alert 또는 toast 메시지)

#### 4.1.4. UI/UX 요구사항
- **반응형 디자인**: 다양한 화면 크기 지원 (선택사항)
- **직관적인 인터페이스**: 간단한 클릭과 체크로 주문 완료
- **실시간 피드백**: 장바구니에 담기면 즉시 반영
- **가격 계산**: 옵션 선택 시 최종 가격이 자동으로 계산되어 표시
- **버튼 상태**: 장바구니가 비어있을 때 "주문하기" 버튼 비활성화 고려

#### 4.1.5. 데이터 흐름
1. 페이지 로드 시 백엔드에서 메뉴 목록 조회 (GET /api/menus)
2. 사용자가 메뉴와 옵션 선택 후 "담기" 클릭
3. 선택한 항목이 프런트엔드 상태(장바구니)에 추가
4. 장바구니 UI가 실시간으로 업데이트
5. "주문하기" 클릭 시 장바구니 데이터를 백엔드로 전송 (POST /api/orders)
6. 주문 완료 응답 받으면 장바구니 초기화 및 완료 메시지 표시

---

### 4.2. 관리자 화면

#### 4.2.1. 화면 개요
- 관리자가 메뉴 재고를 관리하고 주문을 처리할 수 있는 화면
- 대시보드, 재고 관리, 주문 관리를 한 화면에서 통합 관리

#### 4.2.2. 화면 구성요소

##### (1) 헤더 영역
- **브랜드 로고**: "COZY" 텍스트 로고 좌측 상단 배치
- **네비게이션 메뉴**:
  - "주문하기" 탭: 주문하기 화면으로 이동
  - "관리자" 탭: 현재 화면

##### (2) 관리자 대시보드
- **제목**: "관리자 대시보드"
- **통계 정보**:
  - 총 주문 수: 전체 주문 개수
  - 주문 접수: 접수 대기 중인 주문 개수
  - 제조 중: 현재 제조 중인 주문 개수
  - 제조 완료: 완료된 주문 개수
- **표시 형식**: "총 주문 1 / 주문 접수 1 / 제조 중 0 / 제조 완료 0"

##### (3) 재고 현황 영역
- **제목**: "재고 현황"
- **재고 카드 레이아웃**: 그리드 형태로 메뉴별 재고 카드 배치 (1행에 3개)
- **재고 카드 구성**:
  - 메뉴명: 예) "아메리카노 (ICE)", "아메리카노 (HOT)", "카페라떼"
  - 현재 재고 수량: 예) "10개"
  - **재고 조정 버튼**:
    - "+" 버튼: 재고 1개 증가
    - "-" 버튼: 재고 1개 감소

##### (4) 주문 현황 영역
- **제목**: "주문 현황"
- **주문 목록**:
  - 각 주문 항목에 다음 정보 표시:
    - 주문 시간: 예) "7월 31일 13:00"
    - 주문 내역: 예) "아메리카노(ICE) x 1"
    - 주문 금액: 예) "4,000원"
    - **주문 처리 버튼**: 현재 주문 상태에 따라 다른 버튼 표시
      - "주문 접수" 버튼: 신규 주문을 접수 처리
      - 제조 중 상태로 변경 가능
      - 제조 완료 상태로 변경 가능

#### 4.2.3. 기능 요구사항

##### (1) 대시보드 통계 표시
- 페이지 로드 시 백엔드에서 주문 통계 조회
- 실시간으로 주문 상태별 개수 표시
- 새로운 주문이 들어오거나 상태가 변경되면 자동 업데이트 (폴링 또는 WebSocket)

##### (2) 재고 관리 기능
- 백엔드에서 메뉴별 재고 정보 조회 (GET /api/inventory)
- "+" 버튼 클릭 시:
  - 해당 메뉴의 재고 1개 증가
  - 백엔드로 재고 증가 요청 (PATCH /api/inventory/:menuId)
  - UI 즉시 업데이트
- "-" 버튼 클릭 시:
  - 해당 메뉴의 재고 1개 감소
  - 재고가 0개일 경우 감소 불가 (버튼 비활성화 또는 알림)
  - 백엔드로 재고 감소 요청 (PATCH /api/inventory/:menuId)
  - UI 즉시 업데이트

##### (3) 주문 목록 조회 기능
- 백엔드에서 전체 주문 목록 조회 (GET /api/orders)
- 주문 시간 기준 최신순으로 정렬 표시
- 주문 상태별 필터링 옵션 (선택사항)

##### (4) 주문 상태 관리 기능
- 주문 상태 변경 버튼 클릭 시:
  - 현재 상태: "접수 대기" → "주문 접수" 버튼 클릭 → "제조 중" 상태로 변경
  - 현재 상태: "제조 중" → 다음 단계 버튼 클릭 → "제조 완료" 상태로 변경
  - 백엔드로 상태 변경 요청 (PATCH /api/orders/:orderId)
  - 성공 시 UI 업데이트 및 대시보드 통계 갱신

##### (5) 실시간 업데이트 (선택사항)
- 새로운 주문이 들어올 때 자동으로 주문 목록 갱신
- 폴링 방식 (주기적으로 서버에 요청) 또는 WebSocket 활용
- 대시보드 통계도 실시간 갱신

#### 4.2.4. UI/UX 요구사항
- **한눈에 파악 가능한 대시보드**: 주요 지표를 상단에 명확하게 표시
- **직관적인 재고 관리**: +/- 버튼으로 간편한 재고 조정
- **명확한 주문 상태**: 현재 주문 상태를 쉽게 확인 가능
- **실시간 피드백**: 재고 및 주문 상태 변경 시 즉시 UI 반영
- **에러 처리**: 재고 부족, 네트워크 오류 등에 대한 사용자 알림
- **버튼 상태**: 재고가 0일 때 "-" 버튼 비활성화

#### 4.2.5. 데이터 흐름

##### 재고 관리 흐름
1. 페이지 로드 시 백엔드에서 재고 정보 조회 (GET /api/inventory)
2. 관리자가 "+/-" 버튼 클릭
3. 프런트엔드에서 낙관적 업데이트로 UI 즉시 변경
4. 백엔드로 재고 변경 요청 (PATCH /api/inventory/:menuId)
5. 성공 시 변경 사항 확정, 실패 시 이전 상태로 롤백

##### 주문 관리 흐름
1. 페이지 로드 시 백엔드에서 주문 목록 및 통계 조회 (GET /api/orders)
2. 관리자가 주문 상태 변경 버튼 클릭
3. 백엔드로 상태 변경 요청 (PATCH /api/orders/:orderId)
4. 성공 시 주문 목록 및 대시보드 통계 갱신
5. 실패 시 에러 메시지 표시

##### 실시간 업데이트 흐름 (선택사항)
1. 일정 주기(예: 5초)마다 주문 목록 및 통계 폴링
2. 새로운 주문이 감지되면 UI 자동 갱신
3. 알림 또는 시각적 표시로 관리자에게 알림

---

## 5. 백엔드 요구사항

### 5.1. 데이터 모델

#### 5.1.1. Menus (메뉴 테이블)
메뉴 정보를 저장하는 테이블

| 필드명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT | 메뉴 고유 ID |
| name | VARCHAR(100) | NOT NULL, UNIQUE | 커피 이름 (예: 아메리카노(ICE)) |
| description | TEXT | NULL | 메뉴 설명 |
| price | INTEGER | NOT NULL, CHECK (price >= 0) | 가격 (원) |
| image | VARCHAR(500) | NULL | 이미지 URL |
| stock | INTEGER | NOT NULL, DEFAULT 0, CHECK (stock >= 0) | 재고 수량 |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 생성 시간 |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 수정 시간 |

**예시 데이터:**
```json
{
  "id": 1,
  "name": "아메리카노(ICE)",
  "description": "시원하고 깔끔한 아이스 아메리카노",
  "price": 4000,
  "image": "https://example.com/americano-ice.jpg",
  "stock": 10,
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

#### 5.1.2. Options (옵션 테이블)
메뉴에 추가할 수 있는 옵션 정보

| 필드명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT | 옵션 고유 ID |
| name | VARCHAR(50) | NOT NULL | 옵션 이름 (예: 샷 추가, 시럽 추가) |
| price | INTEGER | NOT NULL, DEFAULT 0 | 옵션 추가 가격 (원) |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 생성 시간 |

**예시 데이터:**
```json
{
  "id": 1,
  "name": "샷 추가",
  "price": 500,
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

#### 5.1.3. Orders (주문 테이블)
주문 정보를 저장하는 테이블

| 필드명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT | 주문 고유 ID |
| total_amount | INTEGER | NOT NULL, CHECK (total_amount >= 0) | 총 주문 금액 (원) |
| status | VARCHAR(20) | NOT NULL, DEFAULT 'pending' | 주문 상태 (pending, preparing, completed) |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 주문 일시 |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 수정 시간 |

**주문 상태 (status):**
- `pending`: 주문 접수
- `preparing`: 제조 중
- `completed`: 제조 완료

**예시 데이터:**
```json
{
  "id": 1,
  "total_amount": 12500,
  "status": "pending",
  "created_at": "2024-07-31T13:00:00.000Z",
  "updated_at": "2024-07-31T13:00:00.000Z"
}
```

#### 5.1.4. OrderItems (주문 항목 테이블)
주문에 포함된 메뉴 항목 정보

| 필드명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT | 주문 항목 고유 ID |
| order_id | INTEGER | NOT NULL, FOREIGN KEY (Orders.id) | 주문 ID |
| menu_id | INTEGER | NOT NULL, FOREIGN KEY (Menus.id) | 메뉴 ID |
| menu_name | VARCHAR(100) | NOT NULL | 주문 당시 메뉴명 (변경 방지) |
| quantity | INTEGER | NOT NULL, CHECK (quantity > 0) | 수량 |
| unit_price | INTEGER | NOT NULL | 단가 (원) |
| subtotal | INTEGER | NOT NULL | 소계 (단가 × 수량) |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 생성 시간 |

**예시 데이터:**
```json
{
  "id": 1,
  "order_id": 1,
  "menu_id": 1,
  "menu_name": "아메리카노(ICE)",
  "quantity": 1,
  "unit_price": 4500,
  "subtotal": 4500,
  "created_at": "2024-07-31T13:00:00.000Z"
}
```

#### 5.1.5. OrderItemOptions (주문 항목 옵션 테이블)
주문 항목에 선택된 옵션 정보

| 필드명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT | 고유 ID |
| order_item_id | INTEGER | NOT NULL, FOREIGN KEY (OrderItems.id) | 주문 항목 ID |
| option_id | INTEGER | NOT NULL, FOREIGN KEY (Options.id) | 옵션 ID |
| option_name | VARCHAR(50) | NOT NULL | 옵션명 (변경 방지) |
| option_price | INTEGER | NOT NULL | 옵션 가격 (변경 방지) |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 생성 시간 |

**예시 데이터:**
```json
{
  "id": 1,
  "order_item_id": 1,
  "option_id": 1,
  "option_name": "샷 추가",
  "option_price": 500,
  "created_at": "2024-07-31T13:00:00.000Z"
}
```

### 5.2. 데이터베이스 관계도 (ERD)

```
Menus (1) ----< (N) OrderItems
  |                     |
  |                     |
  |                 OrderItemOptions (N) >---- (1) Options
  |
Orders (1) ----< (N) OrderItems
```

### 5.3. 사용자 흐름 (User Flow)

#### 5.3.1. 주문하기 흐름
```
1. 사용자가 주문하기 화면 접속
   ↓
2. GET /api/menus → Menus 테이블에서 메뉴 목록 조회
   ↓
3. 프론트엔드에 메뉴 목록 표시 (이름, 가격, 설명, 이미지)
   ↓
4. 사용자가 메뉴 선택 + 옵션 선택
   ↓
5. 장바구니에 담기 (클라이언트 상태 관리)
   ↓
6. "주문하기" 버튼 클릭
   ↓
7. POST /api/orders → 주문 정보 Orders 테이블에 저장
   - Orders 레코드 생성 (status: 'pending')
   - OrderItems 레코드 생성 (각 메뉴별)
   - OrderItemOptions 레코드 생성 (선택된 옵션별)
   ↓
8. PATCH /api/menus/:id/stock → 재고 감소
   ↓
9. 주문 완료 응답
   ↓
10. 장바구니 초기화
```

#### 5.3.2. 관리자 재고 관리 흐름
```
1. 관리자 화면 접속
   ↓
2. GET /api/menus → Menus 테이블에서 메뉴 + 재고 정보 조회
   ↓
3. 재고 현황 표시 (메뉴명, 재고 수량, 상태)
   ↓
4. 관리자가 +/- 버튼 클릭
   ↓
5. PATCH /api/menus/:id/stock → 재고 수량 증감
   ↓
6. 재고 업데이트 완료
   ↓
7. UI에 새 재고 수량 반영
```

#### 5.3.3. 관리자 주문 관리 흐름
```
1. 관리자 화면 접속
   ↓
2. GET /api/orders → Orders, OrderItems 조인하여 주문 목록 조회
   ↓
3. 주문 현황 표시 (주문 시간, 메뉴, 금액, 상태)
   ↓
4. 관리자가 상태 변경 버튼 클릭
   ↓
5. PATCH /api/orders/:id/status → 주문 상태 변경
   - pending → preparing
   - preparing → completed
   ↓
6. 상태 업데이트 완료
   ↓
7. UI에 새 상태 반영
   ↓
8. 대시보드 통계 자동 갱신
```

### 5.4. API 설계

#### 5.4.1. 메뉴 관련 API

##### GET /api/menus
메뉴 목록 조회

**Request**
```http
GET /api/menus
```

**Response (200 OK)**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "아메리카노(ICE)",
      "description": "시원하고 깔끔한 아이스 아메리카노",
      "price": 4000,
      "image": "https://example.com/americano-ice.jpg",
      "stock": 10
    },
    {
      "id": 2,
      "name": "카페라떼",
      "description": "부드러운 우유와 에스프레소의 조화",
      "price": 5000,
      "image": "https://example.com/latte.jpg",
      "stock": 5
    }
  ]
}
```

##### GET /api/menus/:id
특정 메뉴 조회

**Request**
```http
GET /api/menus/1
```

**Response (200 OK)**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "아메리카노(ICE)",
    "description": "시원하고 깔끔한 아이스 아메리카노",
    "price": 4000,
    "image": "https://example.com/americano-ice.jpg",
    "stock": 10,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

**Response (404 Not Found)**
```json
{
  "success": false,
  "error": "메뉴를 찾을 수 없습니다."
}
```

##### PATCH /api/menus/:id/stock
재고 수량 업데이트

**Request**
```http
PATCH /api/menus/1/stock
Content-Type: application/json

{
  "change": 1  // 양수: 증가, 음수: 감소
}
```

**Response (200 OK)**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "아메리카노(ICE)",
    "stock": 11
  }
}
```

**Response (400 Bad Request)**
```json
{
  "success": false,
  "error": "재고가 부족합니다."
}
```

#### 5.4.2. 옵션 관련 API

##### GET /api/options
옵션 목록 조회

**Request**
```http
GET /api/options
```

**Response (200 OK)**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "샷 추가",
      "price": 500
    },
    {
      "id": 2,
      "name": "시럽 추가",
      "price": 0
    }
  ]
}
```

#### 5.4.3. 주문 관련 API

##### POST /api/orders
주문 생성

**Request**
```http
POST /api/orders
Content-Type: application/json

{
  "items": [
    {
      "menuId": 1,
      "quantity": 1,
      "options": [1]  // 옵션 ID 배열
    },
    {
      "menuId": 2,
      "quantity": 2,
      "options": []
    }
  ]
}
```

**Response (201 Created)**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "total_amount": 14500,
    "status": "pending",
    "created_at": "2024-07-31T13:00:00.000Z",
    "items": [
      {
        "id": 1,
        "menu_name": "아메리카노(ICE)",
        "quantity": 1,
        "unit_price": 4500,
        "subtotal": 4500,
        "options": [
          {
            "option_name": "샷 추가",
            "option_price": 500
          }
        ]
      },
      {
        "id": 2,
        "menu_name": "카페라떼",
        "quantity": 2,
        "unit_price": 5000,
        "subtotal": 10000,
        "options": []
      }
    ]
  }
}
```

**Response (400 Bad Request)**
```json
{
  "success": false,
  "error": "재고가 부족합니다.",
  "details": {
    "menuId": 1,
    "menuName": "아메리카노(ICE)",
    "requestedQuantity": 5,
    "availableStock": 3
  }
}
```

##### GET /api/orders
주문 목록 조회

**Request**
```http
GET /api/orders?status=pending&limit=10&offset=0
```

**Query Parameters:**
- `status` (선택): 주문 상태 필터 (pending, preparing, completed)
- `limit` (선택): 조회 개수 (기본값: 50)
- `offset` (선택): 시작 위치 (기본값: 0)

**Response (200 OK)**
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": 1,
        "total_amount": 14500,
        "status": "pending",
        "created_at": "2024-07-31T13:00:00.000Z",
        "items": [
          {
            "menu_name": "아메리카노(ICE)",
            "quantity": 1,
            "unit_price": 4500,
            "options": [
              {
                "option_name": "샷 추가",
                "option_price": 500
              }
            ]
          }
        ]
      }
    ],
    "total": 1,
    "limit": 10,
    "offset": 0
  }
}
```

##### GET /api/orders/:id
특정 주문 조회

**Request**
```http
GET /api/orders/1
```

**Response (200 OK)**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "total_amount": 14500,
    "status": "pending",
    "created_at": "2024-07-31T13:00:00.000Z",
    "updated_at": "2024-07-31T13:00:00.000Z",
    "items": [
      {
        "id": 1,
        "menu_id": 1,
        "menu_name": "아메리카노(ICE)",
        "quantity": 1,
        "unit_price": 4500,
        "subtotal": 4500,
        "options": [
          {
            "option_name": "샷 추가",
            "option_price": 500
          }
        ]
      }
    ]
  }
}
```

**Response (404 Not Found)**
```json
{
  "success": false,
  "error": "주문을 찾을 수 없습니다."
}
```

##### PATCH /api/orders/:id/status
주문 상태 변경

**Request**
```http
PATCH /api/orders/1/status
Content-Type: application/json

{
  "status": "preparing"  // pending, preparing, completed
}
```

**Response (200 OK)**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "status": "preparing",
    "updated_at": "2024-07-31T13:05:00.000Z"
  }
}
```

**Response (400 Bad Request)**
```json
{
  "success": false,
  "error": "잘못된 상태 변경입니다.",
  "details": "pending 상태에서는 preparing으로만 변경 가능합니다."
}
```

##### DELETE /api/orders/:id
주문 삭제 (완료된 주문만)

**Request**
```http
DELETE /api/orders/1
```

**Response (200 OK)**
```json
{
  "success": true,
  "message": "주문이 삭제되었습니다."
}
```

**Response (400 Bad Request)**
```json
{
  "success": false,
  "error": "완료된 주문만 삭제할 수 있습니다."
}
```

#### 5.4.4. 통계 API

##### GET /api/orders/stats
주문 통계 조회

**Request**
```http
GET /api/orders/stats
```

**Response (200 OK)**
```json
{
  "success": true,
  "data": {
    "total": 10,
    "pending": 3,
    "preparing": 2,
    "completed": 5
  }
}
```

### 5.5. 에러 처리

#### 5.5.1. HTTP 상태 코드
- `200 OK`: 요청 성공
- `201 Created`: 리소스 생성 성공
- `400 Bad Request`: 잘못된 요청 (유효성 검증 실패, 재고 부족 등)
- `404 Not Found`: 리소스를 찾을 수 없음
- `500 Internal Server Error`: 서버 오류

#### 5.5.2. 에러 응답 형식
```json
{
  "success": false,
  "error": "에러 메시지",
  "details": {}  // 선택사항: 추가 정보
}
```

### 5.6. 비즈니스 로직

#### 5.6.1. 주문 생성 로직
1. 주문 항목 유효성 검증
   - 메뉴 ID 존재 여부 확인
   - 수량 > 0 확인
   - 옵션 ID 존재 여부 확인

2. 재고 확인
   - 각 메뉴의 재고가 주문 수량 이상인지 확인
   - 재고 부족 시 400 에러 반환

3. 가격 계산
   - 메뉴 가격 + 옵션 가격 합산
   - 총 금액 계산

4. 트랜잭션 처리
   ```
   BEGIN TRANSACTION;
   
   1. Orders 레코드 생성
   2. OrderItems 레코드 생성
   3. OrderItemOptions 레코드 생성
   4. Menus 재고 감소
   
   COMMIT;
   ```

5. 실패 시 롤백
   - 모든 변경사항 취소
   - 에러 메시지 반환

#### 5.6.2. 재고 관리 로직
1. 재고 증가
   - 제한 없음 (양수 값으로 증가)

2. 재고 감소
   - 재고가 0 미만이 되지 않도록 검증
   - 재고 부족 시 에러 반환

3. 주문 시 자동 감소
   - 주문 생성 트랜잭션 내에서 처리
   - 원자성 보장

#### 5.6.3. 주문 상태 변경 로직
허용되는 상태 전환:
```
pending → preparing → completed
```

불가능한 전환:
- `preparing` → `pending` (X)
- `completed` → `preparing` (X)
- `completed` → `pending` (X)

### 5.7. 보안 및 성능

#### 5.7.1. 보안
- SQL Injection 방지: Prepared Statement 사용
- CORS 설정: 프론트엔드 도메인만 허용
- 입력 유효성 검증: 모든 요청 데이터 검증

#### 5.7.2. 성능
- 데이터베이스 인덱스
  - `Menus.name`: UNIQUE INDEX
  - `Orders.status`: INDEX
  - `Orders.created_at`: INDEX
  - `OrderItems.order_id`: FOREIGN KEY INDEX
  
- 쿼리 최적화
  - JOIN을 최소화하고 필요한 컬럼만 SELECT
  - 주문 목록 조회 시 LIMIT/OFFSET 사용

### 5.8. 개발 우선순위

#### Phase 1: 기본 기능
1. ✅ 메뉴 조회 API (GET /api/menus)
2. ✅ 주문 생성 API (POST /api/orders)
3. ✅ 주문 조회 API (GET /api/orders)
4. ✅ 재고 업데이트 API (PATCH /api/menus/:id/stock)

#### Phase 2: 관리 기능
5. ✅ 주문 상태 변경 API (PATCH /api/orders/:id/status)
6. ✅ 통계 API (GET /api/orders/stats)
7. ✅ 특정 주문 조회 API (GET /api/orders/:id)

#### Phase 3: 추가 기능
8. ⏳ 주문 삭제 API (DELETE /api/orders/:id)
9. ⏳ 옵션 관리 API
10. ⏳ 실시간 업데이트 (WebSocket)

---

## 6. 개발 가이드라인

### 6.1. 코딩 컨벤션
- JavaScript ES6+ 사용
- async/await 사용 (Promise 체이닝 지양)
- 명확한 변수명 사용 (camelCase)
- 함수는 단일 책임 원칙 준수

### 6.2. 디렉토리 구조
```
backend/
├── src/
│   ├── config/          # 설정 파일
│   │   └── database.js  # DB 연결 설정
│   ├── models/          # 데이터 모델
│   │   ├── Menu.js
│   │   ├── Order.js
│   │   └── Option.js
│   ├── controllers/     # 컨트롤러
│   │   ├── menuController.js
│   │   ├── orderController.js
│   │   └── optionController.js
│   ├── routes/          # 라우트
│   │   ├── menuRoutes.js
│   │   ├── orderRoutes.js
│   │   └── optionRoutes.js
│   ├── middleware/      # 미들웨어
│   │   ├── errorHandler.js
│   │   └── validator.js
│   └── app.js           # Express 앱
├── database/
│   ├── migrations/      # 마이그레이션
│   └── seeds/           # 시드 데이터
├── tests/               # 테스트
├── .env                 # 환경 변수
├── package.json
└── server.js            # 서버 진입점
```

### 6.3. 환경 변수
```env
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/coffee_order
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```