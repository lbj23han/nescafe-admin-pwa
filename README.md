# nescafe-ledger

**nescafe-ledger**는 실제 카페(엄마 카페)의 예치금·미수금·예약 내역 등을 관리하기 위한 **내부 전용 장부(PWA) 웹앱**입니다.  
실사용자인 엄마가 **스마트폰에서 앱처럼 간편하게 기록/조회**하는 것을 목표로 합니다.

현재는 **localStorage 기반 단일 기기용 v1**으로 시작하고,  
추후 **구조 리팩토링(v2)** → **백엔드 연동 및 멀티 디바이스 지원(v3)** 을 단계적으로 진행합니다.

---

## ✨ Features

### v1 (현재 목표) – localStorage 기반 단일 기기 장부

- 📅 **날짜 기반 예약/매출 기록**

  - 상단 캘린더에서 날짜 선택
  - 해당 날짜의 예약·주문·매출 내역 조회
  - 기본 필드: 부서 / 메뉴 / 금액 / 메모 등
  - **v1.1: 예약 수정 모드 추가 (예약 편집 기능 지원)**
    - 수정 버튼 활성화 시 예약 입력 폼 자동 숨김
    - 예약 카드 클릭 → 기존 데이터 수정 가능

- 💰 **예치금/미수금 관리**

  - 부서별 예치금, 미수금, 메모 관리
  - 단순하고 빠른 입력/수정 UX

- 🔒 **단일 기기 전용 데이터 보관**

  - 모든 데이터는 브라우저 **`localStorage`** 에 저장
  - 초기 MVP 단계에서는 멀티 디바이스 동기화 없음

- 📱 **PWA 지원**
  - 스마트폰 홈화면 설치
  - 앱처럼 독립 실행
  - 네트워크 연결 없어도 조회/입력 가능

---

## 📌 Changelog

### **v1.1 (2025-12-13) — 예약 수정 기능 추가**

- Day Page에 **예약 수정 모드** 도입
- 예약 카드 클릭 → 기존 데이터 편집 가능
- 수정 모드 진입 시 **예약 입력 버튼 자동 숨김 처리**
- DayPage UI 일부 리팩토링
- 기타 마이너 UI 정리 및 버그 수정

### **v1.0 (2025-12-10) — MVP 초기 구축**

- 캘린더 기반 날짜별 예약/매출 관리
- 예치금/미수금 리스트 + 입력 기능
- LocalStorage 기반 데이터 저장 구조
- PWA 기본 지원
- PIN 입력 기반 간단 로그인

---

## 🎯 Roadmap

### v1 – MVP (현재 단계)

- [x] 날짜별 예약/매출 리스트 및 입력 폼
- [x] 예약 수정 모드 (v1.1)
- [x] `localStorage` 기반 저장
- [x] 모바일 최적화 + PWA
- [ ] 실제 사용 후 개선 피드백 반영

---

### v2 – 구조 개선 & 리팩토링

- 도메인 단위 폴더 구조 정리
- `localStorage` 접근 레이어 추상화
- 상태 관리 개선 (React Context/Zustand 등 고려)
- (옵션) PIN 잠금 강화

---

### v3 – Backend & 멀티 디바이스 지원

- Supabase/Firebase 등 백엔드 도입
- 계정 로그인 + 권한 관리
- 여러 기기 간 데이터 동기화
- 월별 매출/통계/차트 대시보드

---

## 🧱 Tech Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State**: React hooks 중심
- **PWA**: Next.js + next-pwa
- **Storage (v1)**: `window.localStorage`

---

## 📂 Project Structure (예정 예시)

```bash
nescafe-ledger/
├─ app/
│  ├─ page.tsx                # 진입/로그인 or 메인 화면
│  ├─ layout.tsx
│  ├─ day/                    # 날짜별 예약/매출 페이지
│  ├─ deposit/                # 예치금 관련 페이지
├─ features/
│  ├─ deposit/                # 예치금 도메인 UI + 로직
│  └─ reservations/           # 예약/매출 도메인 UI + 로직
├─ shared/
│  └─ ui/                     # 공통 UI 컴포넌트
├─ lib/
│  └─ storage/
│     ├─ depositStorage.ts
│     └─ reservationStorage.ts
├─ public/
│  ├─ icons/
│  └─ manifest.json
└─ package.json
```
