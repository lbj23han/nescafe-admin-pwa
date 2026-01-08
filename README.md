# nescafe-ledger ☕️

**nescafe-ledger**는 실제 가족 운영 카페에서 사용하는  
**예치금 · 미수금 · 주문 · 예약 내역**을 관리하기 위한  
**내부 전용 장부 관리 PWA 웹앱**입니다.

실사용자인 어머니가 **스마트폰에서 앱처럼 간편하게 기록·조회**할 수 있도록  
**모바일 우선 UX + 단순한 흐름**을 최우선 목표로 설계되었습니다.

- **v1.x**: LocalStorage 기반 단일 기기 MVP
- **v2.0**: Supabase 백엔드 연동 + 계정 기반 데이터 분리
- **v2.1**: 직원 초대 & 권한 관리 확장 (**현재**)
- **v3**: AI Helper 도입 (계획)

---

## ✨ Features

## v2.1 — 직원 초대 & 권한 관리 (현재 / 배포 완료)

### 🔐 인증 (Auth)

- Supabase Email Auth 기반 로그인/회원가입
- Next.js App Router + Server Components 기반 인증 흐름
- 쿠키 기반 세션 유지로 SSR 환경 안정화
- `/auth/callback`을 통한 이메일 인증 처리

---

### 👤 계정 & 권한 모델

- **Shop 단위 데이터 분리**
- `profiles` 테이블 기반 권한 관리
- 권한 레벨
  - **Owner**: 전체 관리 권한
  - **Admin**: 관리 권한
  - **Staff / Viewer**: 실무 접근 (조회/입력)
- RLS(Row Level Security) 기반 접근 제어

---

### 📨 직원 초대 (Invite)

- 이메일 기반 직원 초대
- 초대 상태 관리
  - `pending` / `accepted` / `expired`
- 초대 수락 시 자동 처리
  - `profiles.shop_id` 연결
  - `profiles.role` 부여
- Owner/Admin 계정만 초대 관리 가능
- 마이페이지 초대 관리 UI
  - 기본 접힘 구조
  - 모바일 UX 최적화

---

### 👤 마이페이지 (`/mypage`)

- 내 계정 정보 조회
  - 가게명 (`shop_id → shops.name`)
  - 직책 (`role` 기반 표시)
  - 권한 레벨 표시
- 로그아웃
- 직원 초대 관리 (Owner/Admin 전용)
- Viewer 계정은 초대 UI 비노출

> 직책 / 권한 / 가게명은 모두  
> **백엔드 단일 소스(Supabase) 기준으로 표시**  
> (`user_metadata` 의존 제거)

---

### 🏢 Department 장부 관리

- `departments`, `department_history` 도메인 Supabase 연동
- Repository 패턴 기반 데이터 접근
- 예치금 / 미수금 / 장부 히스토리 관리
- 히스토리 타입
  - 예치금 입금
  - 주문 (자동 미수금 계산)
  - 미수금 상환
  - 미수금 추가
- RLS 기반 Shop 단위 데이터 분리

---

### 📅 예약 / 매출 관리

- 월간 캘린더 기반 예약 조회
- 날짜 범위(range) 쿼리 기반 데이터 로딩
- 일자별 예약/매출 요약 정보 계산
- Day 도메인 단위 로직 분리
- 캘린더 UX 최적화
  - 주말 강조
  - 공휴일 자동 표시

---

### 🧭 Bottom Navigation

- 모바일 PWA 환경에 최적화된 하단 고정 네비게이션
- 동적 item 개수 대응 grid 레이아웃
- 터치 영역 확장 (vh 기준 높이)
- 가독성 개선
  - 반응형 텍스트 크기
  - 명확한 border / shadow 분리

---

## v1.x — LocalStorage 기반 MVP (이전)

### 📅 예약 관리

- 월간 캘린더에서 날짜 선택
- 선택 날짜의 예약 / 주문 / 매출 조회
- 예약 상태 관리
  - 진행 중 (`pending`)
  - 완료 (`completed`)

### 🏢 장부 관리

- 부서 생성 / 조회 / 삭제
- 예치금 / 미수금 관리
- 장부 입력 타입별 자동 계산

### 🧾 장부 히스토리

- 모든 거래 내역 히스토리 누적
- 타입별 라벨 자동 매핑
- 날짜 / 금액 포맷 통일

### 📱 PWA 지원

- 홈 화면 설치 가능
- 오프라인 환경에서도 조회/입력 가능
- PIN 기반 간단 잠금

---

## 📌 Changelog

### v2.1 (2025-12)

- 직원 초대(Invite) 기능 구현
- 권한 모델 정리 (Owner/Admin/Staff/Viewer)
- 초대 수락 시 profile ↔ shop 자동 연결
- MyPage 정보 표시 로직 개선
- 초대 관리 UI 접힘 구조 도입
- Bottom Navigation UX 개선
- PWA(sw.js / workbox) 업데이트

### v2.0 (2025-12)

- Supabase 연동
  - Auth / Database / RLS
- Department / History Repository 구조 전환
- 예약 도메인 Supabase 마이그레이션
- 마이페이지(`/mypage`) 추가

### v1.6 (2025-12)

- 대한민국 공휴일 자동 표시
- 공휴일명 캘린더 UI 노출
- 주말 강조 스타일 적용

### v1.5 (2025-12)

- Department 장부 기능 확장
- 미수금 추가 타입 도입

### v1.1 (2025-12)

- 예약 수정 기능 추가
- UI / View 구조 분리

### v1.0 (2025-12)

- MVP 초기 구축
- LocalStorage 기반 장부 관리
- PWA 기본 세팅

---

## 🎯 Roadmap

### v3 — AI Helper

- 자연어 기반 장부 / 예약 입력
- 예시
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
- **Backend**: Supabase
- **Auth**: Supabase Auth
- **Database**: PostgreSQL (Supabase)
- **AI (v3)**: OpenAI API

---

## 📂 Project Structure

```bash
src/
├─ app/
│  ├─ page.tsx                  # 로그인 진입
│  ├─ auth/callback/            # 이메일 인증 콜백
│  ├─ invite/[token]/           # 직원 초대 수락
│  └─ (authed)/
│     ├─ layout.tsx             # Bottom Navigation 적용
│     ├─ main/                  # 캘린더 메인
│     ├─ day/                   # 날짜별 예약
│     ├─ departments/           # 장부 관리
│     └─ mypage/                # 마이페이지
├─ components/
│  ├─ pages/                    # Container 레이어
│  ├─ ui/                       # View/UI 레이어
│  └─ navigation/               # BottomNav
├─ hooks/
├─ lib/
│  ├─ repositories/             # Supabase 접근 레이어
│  ├─ contracts/                # 도메인 계약 타입
│  ├─ supabaseClient.ts
│  └─ supabaseServer.ts
├─ constants/
└─ scripts/
```
