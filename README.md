# nescafe-ledger ☕️

**nescafe-ledger**는 실제 가족 운영 카페에서 사용하는  
**예치금 · 미수금 · 주문 · 예약 내역**을 관리하기 위한  
**내부 전용 장부 관리 PWA 웹앱**입니다.

실사용자인 어머니가 **스마트폰에서 앱처럼 간편하게 기록·조회**할 수 있도록  
**모바일 우선 UX + 단순한 입력 흐름**을 최우선 목표로 설계되었습니다.

---

## 🗂 Version History

- **v1.x**: LocalStorage 기반 단일 기기 MVP
- **v2.0**: Supabase 백엔드 연동 + 계정 기반 데이터 분리
- **v2.1**: 직원 초대 & 권한 관리 확장 (**현재 / 배포 완료**)
- **v3**: AI Helper 도입 (계획)

---

## ✨ Features

## v2.1 — 직원 초대 & 권한 관리 (현재)

### 🔐 인증 (Auth)

- Supabase Email Auth 기반 로그인/회원가입
- Next.js App Router + Server Components 인증 흐름
- 쿠키 기반 세션 유지로 SSR 안정성 확보
- `/auth/callback` 이메일 인증 처리

## v2.2 — Day 예약 입력 UX 개선

### ⏰ 시간 입력 UX 개선 (Quick Chips)

- 예약 시간 입력 시 **키보드 입력 부담을 줄이기 위해** 빠른 선택 Chips UI 도입
- TextInput은 그대로 유지하며, **시간 필드 클릭/포커스 시에만** Chips가 아래에 표시됨
- 기본 포맷은 기존과 동일하게 **HH:mm** 유지 (예: `14:00`)
- Add / Edit 폼 모두 동일 UX로 적용
- 예약 UI 토큰(`reservation.ui.ts`)에 레이아웃/칩 스타일을 분리하여 **View 컴포넌트의 Tailwind 직접 사용 최소화**

---

### 👤 계정 & 권한 모델

- **Shop 단위 데이터 분리**
- `profiles` 테이블 기반 권한 관리
- 권한 레벨
  - **Owner**: 전체 관리
  - **Admin**: 관리
  - **Staff / Viewer**: 조회·입력
- RLS(Row Level Security) 기반 접근 제어

---

### 📨 직원 초대 (Invite)

- 이메일 기반 직원 초대
- 초대 상태 관리 (`pending / accepted / expired`)
- 초대 수락 시 자동 처리
  - `profiles.shop_id` 연결
  - `profiles.role` 부여
- Owner/Admin만 초대 관리 가능
- 마이페이지 초대 관리 UI (모바일 최적화)

---

### 👤 마이페이지 (`/mypage`)

- 내 계정 정보 조회
  - 가게명
  - 직책 / 권한 레벨
- 로그아웃
- 직원 초대 관리 (Owner/Admin 전용)
- Viewer 계정은 초대 UI 비노출

---

### 🏢 Department 장부 관리

- `departments`, `department_history` Supabase 연동
- Repository 패턴 기반 데이터 접근
- 예치금 / 미수금 / 히스토리 관리
- 히스토리 타입
  - 예치금 입금
  - 주문 (자동 미수금 계산)
  - 미수금 상환 / 추가
- Shop 단위 RLS 분리

---

### 📅 예약 / 매출 관리

- 월간 캘린더 기반 예약 조회
- 날짜 범위 쿼리 로딩
- 일자별 예약/매출 요약
- Day 도메인 단위 로직 분리

#### 예약 완료 시 장부 자동 반영

- **부서 연동 예약만** 완료 시 장부 반영
- 정산 방식
  - 주문(debt) 고정
  - 예치금 우선 차감 → 부족분 미수금 전환
- reservation당 history 최대 1건
  - `source_type = 'reservation'`
  - `source_id = reservation.id`
  - DB unique index로 중복 방지
- 완료 전 **정산 안내 Sheet UX** 제공

---

### 🧭 Bottom Navigation

- 모바일 PWA 환경 최적화
- 터치 영역 확장
- 반응형 grid
- 명확한 active 상태 표시

---

## 🧱 Tech Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State**: React Hooks
- **PWA**: next-pwa
- **Backend**: Supabase
- **Auth**: Supabase Auth
- **Database**: PostgreSQL (Supabase)
- **AI (v3)**: OpenAI API (계획)

---

## 📂 Project Structure

```bash
src/
├─ app/
│  ├─ page.tsx
│  ├─ auth/callback/
│  ├─ invite/[token]/
│  └─ (authed)/
│     ├─ layout.tsx
│     ├─ main/
│     ├─ day/
│     ├─ departments/
│     └─ mypage/
├─ components/
│  ├─ pages/
│  ├─ ui/
│  └─ navigation/
├─ hooks/
├─ lib/
├─ constants/
└─ scripts/

```

---

## 🚧 Roadmap

### v3 - AI Helper

- 자연어 기반 예약 / 장부 입력
- 예시 : "오늘 A부서 아메리카노 2잔 8천원"
- 실행 전 미리보기 & 사용자 확인
- AI 처리 로그 기록

---
