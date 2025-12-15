# nescafe-ledger

**nescafe-ledger**는 실제 카페(엄마 카페)의  
**예치금 · 미수금 · 주문 · 예약 내역**을 관리하기 위한  
**내부 전용 장부(PWA) 웹앱**입니다.

실사용자인 엄마가 **스마트폰에서 앱처럼 간편하게 기록하고 조회**하는 것을 목표로 합니다.

현재는 **localStorage 기반 단일 기기용 v1.x** 단계이며,  
추후 **구조 리팩토링(v2)** → **백엔드 연동 및 멀티 디바이스 지원(v3)** 을 순차적으로 진행합니다.

---

## ✨ Features

### v1.x – localStorage 기반 단일 기기 장부

---

### 📅 날짜 기반 예약 / 매출 관리

- 상단 캘린더에서 날짜 선택
- 선택한 날짜의 예약 · 주문 · 매출 내역 조회
- 기본 입력 필드
  - 부서
  - 메뉴
  - 금액
  - 메모

#### v1.1 업데이트

- **예약 수정 모드 추가**
  - 예약 카드 클릭 → 기존 데이터 편집
  - 수정 모드 활성화 시 예약 입력 폼 자동 숨김
- Day Page UI 일부 리팩토링

---

### 🏢 Department 기반 장부 관리 (v1.5 핵심 기능)

#### 부서(Department) 관리

- 부서 생성 / 조회 / 삭제
- 부서 삭제 시:
  - 예치금
  - 미수금
  - 장부 히스토리  
    **모두 함께 삭제**
  - 삭제 전 `confirm alert` 제공

#### 예치금 / 미수금 관리

- 부서별 상태 값
  - 예치금 (Deposit)
  - 미수금 (Debt)
- 장부 입력 타입
  - 예치금 입금
  - 주문 (자동 미수금 계산)
  - 미수금 상환
  - **미수금 추가 (v1.5)**

#### 장부 표시 규칙

- 예치금 입금 / 미수금 상환 → **+ 금액**
- 주문 / 미수금 추가 → **- 금액**
- 미수금 추가 시:
  - 내부 저장 값은 `+50000`
  - 장부 UI에는 `-50,000원`으로 표시

---

### 🧾 Department History (장부 히스토리)

- 모든 거래는 히스토리로 누적 기록
- 타입별 라벨 자동 표시
- 날짜/시간 자동 포맷
- 금액 부호(+ / -) 시각적 구분

---

### 🔒 단일 기기 전용 데이터 보관

- 모든 데이터는 브라우저 **`localStorage`** 에 저장
- 초기 MVP 단계에서는:
  - 로그인 계정 없음
  - 멀티 디바이스 동기화 없음

---

### 📱 PWA 지원

- 스마트폰 홈 화면 설치 가능
- 앱처럼 독립 실행
- 네트워크 연결 없이도 조회/입력 가능

---

## 📌 Changelog

### **v1.5 (2025-12)** — Department 장부 기능 확장

- Department 생성 / 삭제 기능 추가
- 부서 삭제 시 관련 장부 데이터 일괄 제거
- 장부 입력 옵션에 **미수금 추가** 항목 도입
- 미수금 장부 금액 음수 표시 처리
- DepartmentHistory 구조 정비
- 장부 UI 가독성 개선

---

### **v1.1 (2025-12-13)** — 예약 수정 기능 추가

- Day Page에 예약 수정 모드 도입
- 예약 카드 클릭 → 기존 데이터 편집 가능
- 수정 모드 진입 시 예약 입력 버튼 자동 숨김
- DayPage UI 일부 리팩토링
- 마이너 UI/버그 수정

---

### **v1.0 (2025-12-10)** — MVP 초기 구축

- 캘린더 기반 날짜별 예약/매출 관리
- 예치금/미수금 리스트 + 입력 기능
- LocalStorage 기반 데이터 저장
- PWA 기본 지원
- PIN 기반 간단 로그인

---

## 🎯 Roadmap

### v1.x – MVP 안정화 (현재 단계)

- [x] 날짜별 예약/매출 관리
- [x] 예약 수정 기능
- [x] Department 기반 장부 관리
- [x] 예치금 / 미수금 히스토리
- [x] localStorage 저장
- [x] PWA 지원
- [ ] 실사용 피드백 반영 및 UX 개선

---

### v2 – 구조 개선 & 리팩토링

- 도메인 단위 폴더 구조 정리
- storage 접근 레이어 추상화
- 상태 관리 구조 개선 (Context / Zustand 검토)
- PIN 잠금 강화

---

### v3 – Backend & 멀티 디바이스

- Supabase / Firebase 연동
- 계정 로그인
- 여러 기기 간 데이터 동기화
- 월별 매출 / 통계 / 차트 대시보드

---

## 🧱 Tech Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State**: React Hooks 중심
- **PWA**: Next.js + next-pwa
- **Storage (v1.x)**: `window.localStorage`

---

## 📂 Project Structure (예시)

```bash
nescafe-ledger/
├─ app/
│  ├─ page.tsx
│  ├─ layout.tsx
│  ├─ day/                    # 날짜별 예약/매출
│  ├─ department/             # 부서 & 장부
├─ components/
│  ├─ ui/                     # 공통 UI
├─ lib/
│  ├─ departmentStorage.ts
│  └─ reservationStorage.ts
├─ constants/
├─ public/
│  ├─ icons/
│  └─ manifest.json
└─ package.json
```
