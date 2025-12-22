# nescafe-ledger ☕️

**nescafe-ledger**는 실제 가족 운영 카페에서 사용하는  
**예치금 · 미수금 · 주문 · 예약 내역**을 관리하기 위한  
**내부 전용 장부 관리 PWA 웹앱**입니다.

실사용자인 어머니가 **스마트폰에서 앱처럼 간편하게 기록·조회**할 수 있도록  
**모바일 우선 UX + 단순한 흐름**을 최우선 목표로 설계되었습니다.

- v1.x: LocalStorage 기반 단일 기기 MVP
- v2: Supabase 백엔드 연동 + 계정 기반 데이터 분리 (현재)
- v2.1: 직원 초대/권한 관리 확장
- v3: AI Helper 도입

---

## ✨ Features

### v2 — Supabase 기반 (현재 / 배포 완료)

#### 🔐 인증 (Auth)

- Supabase Email Auth 기반 로그인/회원가입
- Server Component 기반 Auth Guard 적용
- 쿠키 기반 세션 동기화로 SSR 환경 안정화

#### 🏢 Department 장부 관리

- `departments`, `department_history` 도메인 Supabase 연동
- Repository + Adapter 패턴 적용
- 예치금 / 미수금 / 히스토리 CRUD
- RLS(Row Level Security) 기반 계정별 데이터 분리

#### 📅 예약 / 매출 관리

- 월간 캘린더 기반 예약 조회
- 날짜 범위(range) 쿼리로 예약 데이터 로딩
- 일자별 예약/매출 요약 정보 계산
- Day flow 도메인 + repo 구조로 정리

#### 👤 마이페이지 (/mypage)

- 내 정보 조회
  - 가게명 (`shop_name` – auth user_metadata)
  - 직책 (`display_name`)
  - 권한 (`role`)
- 로그아웃 지원
- 직원 초대/권한 관리 기능 확장을 위한 UI 구조 확보

#### 🧭 Bottom Navigation

- 모바일 PWA 환경에 최적화된 하단 고정 탭
- 아이템 개수 증가(4개)에도 깨지지 않도록  
  **동적 grid 컬럼 레이아웃 적용**

---

### v1.x — LocalStorage 기반 MVP (이전)

#### 📅 캘린더 기반 예약 관리

- 월간 캘린더에서 날짜 선택
- 선택 날짜의 예약 / 주문 / 매출 조회
- 예약 상태 관리
  - 진행 중 (pending)
  - 완료 (completed)

#### 🏢 Department 기반 장부 관리

- 부서 생성 / 조회 / 삭제
- 예치금 / 미수금 관리
- 장부 입력 타입
  - 예치금 입금
  - 주문 (자동 미수금 계산)
  - 미수금 상환
  - 미수금 추가

#### 🧾 장부 히스토리

- 모든 거래 내역 히스토리 누적
- 타입별 라벨 자동 매핑
- 날짜/금액 포맷 통일

#### 📱 PWA 지원

- 홈 화면 설치 가능
- 오프라인 환경에서도 조회/입력 가능
- PIN 기반 간단 잠금

---

## 📌 Changelog

### v2.0 (2025-12)

- Supabase 연동
  - Auth / Database / RLS
- Department / History Repository 구조 전환
- 예약 도메인 Supabase 마이그레이션
- 마이페이지(/mypage) 추가
- Bottom Navigation 구조 개선

### v1.6 (2025-12)

- 대한민국 공휴일 자동 표시
- 공휴일명 캘린더 UI 노출
- 주말 강조 스타일 적용
- 캘린더/훅 리팩토링

### v1.5 (2025-12)

- Department 장부 기능 확장
- 미수금 추가 타입 도입
- 장부 히스토리 구조 개선

### v1.1 (2025-12)

- 예약 수정 기능 추가
- UI/View 구조 분리

### v1.0 (2025-12)

- MVP 초기 구축
- LocalStorage 기반 장부 관리
- PWA 기본 세팅

---

## 🎯 Roadmap

### v2.1 — 직원 초대 & 권한 관리

- 직원 초대(이메일 기반)
- 권한 레벨
  - 관리자
  - 직원
  - 조회 전용(read-only)
- 초대 상태 관리 (대기/수락/만료)
- RLS 정책 확장

### v3 — AI Helper

- 자연어 기반 장부/예약 입력
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
│  └─ (authed)/
│     ├─ layout.tsx             # BottomNav 적용
│     ├─ main/                  # 캘린더 메인
│     ├─ day/                   # 날짜별 예약
│     ├─ departments/           # 장부 관리
│     └─ mypage/                # 마이페이지
├─ components/
│  ├─ navigation/
│  ├─ pages/
│  └─ ui/
├─ hooks/
├─ lib/
│  ├─ repositories/
│  ├─ supabaseClient.ts
│  └─ supabaseServer.ts
├─ constants/
└─ scripts/
```
