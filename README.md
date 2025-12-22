# nescafe-ledger ☕️

**nescafe-ledger**는 실제 가족 운영 카페에서 사용하는  
**예치금 · 미수금 · 주문 · 예약 내역**을 관리하기 위한  
**내부 전용 장부 관리 PWA 웹앱**입니다.

실사용자인 어머니가 **스마트폰에서 앱처럼 간편하게 기록·조회**할 수 있도록  
**모바일 우선 UX + 단순한 흐름**을 최우선 목표로 설계되었습니다.

현재는 **localStorage 기반 단일 기기 MVP(v1.x)** 단계이며,  
이후 **백엔드 연동(v2)** → **AI 도우미 도입(v3)** 순으로 점진 확장을 목표로 합니다.

---

## ✨ Features

### v1.x — LocalStorage 기반 MVP (현재)

> “실제 매장에서 바로 사용할 수 있는 장부 앱”을 목표로 한 프론트엔드 중심 MVP

---

### 📅 캘린더 기반 예약 / 매출 관리

- 월간 캘린더에서 날짜 선택
- 선택 날짜의 예약 · 주문 · 매출 내역 조회
- 예약 기본 입력 필드
  - 부서
  - 메뉴
  - 금액
  - 메모
- 예약 상태 관리
  - 진행 중(pending)
  - 완료(completed)

#### 캘린더 UI 개선 (v1.6+)

- 주말(토/일) 시각적 강조 표시
- **대한민국 공휴일 자동 표시**
  - 공휴일명 캘린더에 함께 노출
  - 휴일 라벨 정규화 처리
- 예약이 없는 날짜의 불필요한 UI 라벨 자동 숨김

---

### 🏢 Department 기반 장부 관리

#### 부서(Department) 관리

- 부서 생성 / 조회 / 삭제
- 부서 삭제 시 관련 데이터 일괄 제거
  - 예치금
  - 미수금
  - 장부 히스토리
- 삭제 전 `confirm alert` 제공

#### 예치금 / 미수금 관리

- 부서별 상태 값 관리
  - 예치금 (Deposit)
  - 미수금 (Debt)
- 장부 입력 타입
  - 예치금 입금
  - 주문 (자동 미수금 계산)
  - 미수금 상환
  - 미수금 추가

#### 금액 표시 규칙

- 예치금 입금 / 미수금 상환 → **+ 금액**
- 주문 / 미수금 추가 → **- 금액**
- 내부 저장 값과 UI 표현 분리
  - 저장: `50000`
  - UI: `-50,000원`

---

### 🧾 Department History (장부 히스토리)

- 모든 거래는 히스토리로 누적 기록
- 타입별 라벨 자동 매핑
- 날짜/시간 자동 포맷
- 금액 부호(+ / -) 시각적 구분

---

### 🧭 Bottom Navigation

- 앱 하단 고정 탭 내비게이션
  - **캘린더** → `/main`
  - **장부 관리** → `/departments`
  - **오늘의 예약** → `/day/[date]`
- 모바일 PWA 환경 기준 한 손 조작 최적화
- 메인 페이지 중복 버튼 제거로 UX 단순화

---

### 🔒 단일 기기 전용 데이터 보관

- 모든 데이터는 브라우저 **`localStorage`** 에 저장
- v1.x 단계에서는:
  - 계정 로그인 없음
  - 멀티 디바이스 동기화 없음
- PIN 기반 간단 잠금 제공

---

### 📱 PWA 지원

- 홈 화면 설치 가능
- 앱처럼 독립 실행
- 오프라인 상태에서도 조회/입력 가능

---

## 📌 Changelog

### **v1.6 (2025-12)** — Calendar & UI 개선

- 대한민국 공휴일 표시 지원
- 공휴일명 캘린더 UI에 함께 표시
- 주말 강조 스타일 적용
- 예약 없는 날짜의 불필요한 UI 제거
- Calendar / UI 컴포넌트 및 Hook 정리

---

### **v1.5 (2025-12)** — Department 장부 기능 확장

- Department 생성 / 삭제
- 부서 삭제 시 관련 데이터 일괄 제거
- 장부 입력 타입에 **미수금 추가**
- 금액 표시 로직 개선
- DepartmentHistory 구조 정비

---

### **v1.1 (2025-12-13)** — 예약 수정 기능

- Day Page 예약 수정 모드 도입
- UI / View 구조 분리 리팩토링
- 마이너 UI 및 버그 수정

---

### **v1.0 (2025-12-10)** — MVP 초기 구축

- 캘린더 기반 예약 관리
- 예치금 / 미수금 장부 관리
- LocalStorage 기반 데이터 저장
- PWA 기본 세팅
- PIN 기반 간단 잠금

---

## 🎯 Roadmap

### v2 — Backend 연동

- Supabase 연동
  - Auth
  - Database
  - RLS 기반 계정 분리
- LocalStorage → DB 마이그레이션
- 멀티 디바이스 데이터 동기화
- 데이터 백업 / 복구

---

### v3 — AI Helper 도입

- 자연어 기반 장부 / 예약 입력
- 예시:
  - “오늘 A부서 아메리카노 2잔 8천원”
- 실행 전 미리보기 & 사용자 확인
- AI 처리 로그 기록

---

## 🧱 Tech Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State**: React Hooks
- **PWA**: next-pwa
- **Storage (v1.x)**: localStorage
- **Backend (v2)**: Supabase
- **AI (v3)**: OpenAI API

---

## 📂 Project Structure

```bash
src/
├─ app/
│  ├─ layout.tsx
│  ├─ page.tsx                   # 로그인 진입
│  └─ (authed)/
│     ├─ layout.tsx              # BottomNav 적용 영역
│     ├─ main/                   # 캘린더 메인
│     ├─ day/                    # 날짜별 예약
│     └─ departments/            # 장부 관리
├─ components/
│  ├─ navigation/                # Bottom Navigation
│  ├─ pages/                     # Page 단위 컴포넌트
│  └─ ui/                        # View(UI) 레이어
├─ hooks/                        # 도메인별 Custom Hooks
├─ lib/
│  ├─ calendar.ts
│  ├─ departmentStorage.ts
│  └─ holidays/                  # 공휴일 캐시/매핑 로직
├─ constants/                    # 화면/도메인 상수
└─ scripts/
   └─ generate-kr-holidays.mjs   # 공휴일 데이터 생성 스크립트
```
