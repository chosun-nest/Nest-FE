# WantIT-NEST 🏠

대학생을 위한 통합 커뮤니티 플랫폼

[![React](https://img.shields.io/badge/React-19.1.0-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2.0-646CFF?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.17-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)

---

## 📋 목차

- [프로젝트 소개](#-프로젝트-소개)
- [주요 기능](#-주요-기능)
- [기술 스택](#-기술-스택)
- [프로젝트 구조](#-프로젝트-구조)
- [시작하기](#-시작하기)
- [백엔드 서버 실행](#-백엔드-서버-실행)
- [빌드 및 배포](#-빌드-및-배포)
- [개발 가이드](#-개발-가이드)

---

## 📖 프로젝트 소개

**WantIT-NEST**는 대학생들을 위한 통합 커뮤니티 플랫폼입니다. 학생들이 프로젝트 팀원을 모집하고, 관심사를 공유하며, 강의 정보를 교환하고, 실시간으로 소통할 수 있는 공간을 제공합니다.

### 🎯 프로젝트 목표

- 학생들 간의 원활한 소통과 협업 지원
- 프로젝트 팀 빌딩 및 관리 효율화
- AI 기반 학습 지원 시스템 제공
- 학교 공지사항 자동 수집 및 제공

---

## ✨ 주요 기능

### 1. 게시판 시스템 (4종류)

#### 📢 공지사항 게시판
- 학교/학과 공지사항 자동 크롤링 및 표시
- FastAPI + Selenium + BeautifulSoup 기반
- 매일 새벽 3시 자동 업데이트 (APScheduler)

#### 🚀 프로젝트 모집 게시판
- 팀 프로젝트 모집글 작성 및 관리
- 프로젝트 지원 시스템
- 참여자 관리 및 팀 빌딩
- 태그 기반 필터링

#### 💡 관심분야 게시판
- 자유 주제 토론 및 정보 공유
- 마크다운 기반 게시글 작성
- 댓글 및 대댓글 시스템

#### 📚 강의평가 게시판 (신규)
- 강의 후기 및 평가 공유
- 학습 정보 교환

### 2. AI 챗봇 🤖
- OpenAI API 연동
- FastAPI 백엔드 (Nest-AI/chatbot)
- 마크다운 형식 지원
- 학생 질의응답 및 학습 지원

### 3. 실시간 채팅 💬
- Socket.IO 기반 실시간 통신
- 1:1 채팅 및 그룹 채팅
- 팔로우 기반 채팅 목록
- 읽음 표시 및 알림

### 4. 회원 시스템 👤
- JWT 기반 인증 (Access/Refresh Token)
- 자동 토큰 갱신 (Axios Interceptor)
- Redux를 통한 로그인 상태 관리
- 프로필 편집 (이미지 크롭 지원)
- 팔로우/언팔로우 시스템
- 활동 이력 (내 핀) 관리

### 5. 반응형 디자인 📱
- 모바일/태블릿/데스크톱 대응
- 반응형 네비게이션 (사이드바)
- Tailwind CSS + Styled Components
- 다크 모드 지원 (예정)

---

## 🛠 기술 스택

### Frontend

#### 코어 프레임워크
- **React 19.1.0** - UI 프레임워크
- **TypeScript 5.7.2** - 타입 안정성
- **Vite 6.2.0** - 빌드 도구 (React SWC 플러그인)

#### 라우팅 & 상태관리
- **React Router DOM 7.3.0** - 클라이언트 사이드 라우팅
- **Redux Toolkit 2.8.2** - 전역 상태 관리
- **Redux Persist 6.0.0** - 상태 영속화

#### UI/UX
- **Tailwind CSS 3.4.17** - 유틸리티 우선 CSS 프레임워크
- **Styled Components 6.1.17** - CSS-in-JS
- **Framer Motion 12.9.4** - 애니메이션
- **Headless UI 2.2.4** - 접근성 높은 UI 컴포넌트
- **Heroicons 2.2.0** & **Lucide React 0.488.0** - 아이콘

#### 마크다운 에디터
- **@uiw/react-md-editor 4.0.6** - 마크다운 에디터
- **React Markdown 10.1.0** - 마크다운 렌더링
- **Remark GFM 4.0.1** - GitHub Flavored Markdown 지원

#### 통신
- **Axios 1.9.0** - HTTP 클라이언트
- **Socket.IO Client 4.8.1** - 실시간 양방향 통신

#### AI/챗봇
- **OpenAI 5.1.1** - OpenAI API 연동

#### 기타 유틸리티
- **jwt-decode 4.0.0** - JWT 디코딩
- **lodash 4.17.21** - 유틸리티 함수
- **react-easy-crop 5.4.1** - 이미지 크롭
- **react-spinners 0.17.0** - 로딩 스피너

### Backend (별도 레포지토리)
- **Spring Boot** - 메인 백엔드 서버
- **FastAPI** - AI 챗봇 및 크롤링 서버
- **Selenium + BeautifulSoup4** - 웹 크롤링
- **APScheduler** - 작업 스케줄링

---

## 📁 프로젝트 구조

```
D:\Nest-FE-EUN\
├── public/                    # 정적 자산 (이미지, 로고 등)
│   └── assets/
├── src/
│   ├── api/                   # API 통신 레이어
│   │   ├── ai/               # AI 챗봇 API
│   │   ├── auth/             # 인증 관련 API
│   │   ├── board-common/     # 게시판 공통 API
│   │   ├── interests/        # 관심분야 게시판 API
│   │   ├── project/          # 프로젝트 모집 API
│   │   ├── profile/          # 프로필 API
│   │   ├── following/        # 팔로우/채팅 API
│   │   └── index.ts          # Axios 인스턴스 및 인터셉터
│   ├── assets/               # 스타일 및 애니메이션
│   ├── components/           # 재사용 가능한 컴포넌트
│   │   ├── ai/              # AI 관련 컴포넌트
│   │   ├── auth/            # 인증 (회원가입, 로그인)
│   │   ├── board/           # 게시판 공통
│   │   ├── chat/            # 실시간 채팅
│   │   ├── chatbot/         # AI 챗봇 UI
│   │   ├── common/          # 공통 컴포넌트
│   │   ├── interests/       # 관심분야 게시판
│   │   ├── layout/          # 레이아웃 (navbar, sidebar, footer)
│   │   ├── lecture/         # 강의평가 게시판
│   │   ├── project/         # 프로젝트 모집 게시판
│   │   └── profile/         # 프로필 관련
│   ├── constants/           # 상수 및 Mock 데이터
│   ├── context/             # React Context
│   ├── hooks/               # 커스텀 훅
│   ├── routes/              # 페이지 라우트 (25개)
│   ├── store/               # Redux 상태 관리
│   │   └── slices/          # Redux 슬라이스
│   ├── types/               # TypeScript 타입 정의
│   ├── utils/               # 유틸리티 함수
│   └── App.tsx              # 메인 앱 컴포넌트
├── .env                     # 환경 변수
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

**파일 통계**: 총 208개의 TypeScript/TSX 파일

---

## 🚀 시작하기

### 사전 요구사항

- **Node.js** 18.x 이상
- **npm** 9.x 이상
- **Git**

### 설치 방법

1. **레포지토리 클론**

```bash
git clone https://github.com/chosun-nest/Nest-FE.git
cd Nest-FE
```

2. **의존성 설치**

```bash
npm install
```

3. **환경 변수 설정**

`.env` 파일을 생성하고 다음 내용을 추가하세요:

```env
# API 서버 주소
VITE_API_BASE_URL=http://localhost:6030

# AI 챗봇 서버 주소
VITE_AI_API_URL=http://localhost:8000

# Socket.IO 서버 주소
VITE_SOCKET_URL=http://localhost:6030

# OpenAI API 키
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

4. **개발 서버 실행**

```bash
npm run dev
```

서버가 실행되면 브라우저에서 `http://localhost:5173` (또는 콘솔에 표시된 주소)로 접속하세요.

---

## 🖥 백엔드 서버 실행

### 1. AI 챗봇 서버 (FastAPI)

**(업데이트: 2025.06.22)**

#### 주요 관련 파일
- `src/api/ai/ai.ts`
- `src/components/ai/Markdown.tsx`
- `src/components/chatbot/ChatBotUI.tsx`
- `src/components/chatbot/Markdown.tsx`
- `src/components/layout/ai.tsx`

#### 실행 방법

```bash
cd Nest-AI/chatbot

# 1. 가상환경 생성 (최초 1회)
python -m venv venv

# 2. 가상환경 활성화
venv\Scripts\activate  # (Windows)
source venv/bin/activate  # (macOS/Linux)

# 3. 라이브러리 설치 (최초 1회)
pip install -r requirements.txt

# 4. FastAPI 서버 실행
uvicorn main:app --reload
```

#### 두 번째 터미널에서 실행 시:
```bash
cd Nest-AI/chatbot
uvicorn main:app --reload
```

#### 확인
- API 문서: `http://localhost:8000/docs`

---

### 2. 공지사항 크롤러 서버 (FastAPI + Selenium)

**(업데이트: 2025.04.28)**

#### 기술 스택
- **FastAPI** - 웹 프레임워크
- **Selenium** - 브라우저 자동화
- **BeautifulSoup4** - HTML 파싱
- **APScheduler** - 작업 스케줄링

#### 설치 및 실행

1. **가상환경 생성 및 활성화**

```bash
cd Nest-FE
python -m venv venv
.\venv\Scripts\activate  # (Windows)
```

2. **필요한 패키지 설치 (최초 1회)**

```bash
pip install fastapi uvicorn selenium beautifulsoup4 webdriver-manager apscheduler requests
```

3. **크롤러 서버 실행**

```bash
cd src/components/notice
uvicorn notice_crawler:app --host 0.0.0.0 --port 8000 --reload
```

4. **새 터미널에서 venv 해제 후 프론트엔드 실행**

```bash
# 새 터미널 열기 (위치: .\Nest-FE)

# venv 해제 (Windows)
.\venv\Scripts\deactivate.bat

# 프론트엔드 개발 서버 실행
npm run dev
```

#### API 엔드포인트

| 경로 | 기능 |
|:---|:---|
| `/crawl` | 공지사항 크롤링 후 JSON 데이터 반환 |
| `/crawl-and-post` | 크롤링 후 Spring 서버(`localhost:6030`)로 POST 전송 |

#### 작동 흐름

| 단계 | 설명 |
|:---|:---|
| 크롤링 수행 | Selenium 가상 브라우저로 페이지 로딩 및 HTML 수집 |
| HTML 파싱 | BeautifulSoup으로 공지사항 데이터 추출 |
| React 연동 | React 프론트엔드에서 axios로 FastAPI 서버 호출 |
| Spring 연동 | 크롤링된 공지사항을 Spring API로 POST 전송 |
| 자동화 | APScheduler를 통해 매일 새벽 3시에 자동 크롤링 및 전송 |

#### 확인 사항

- [x] `http://localhost:8000/crawl` - 공지사항 크롤링 결과 확인
- [x] `http://localhost:8000/crawl-and-post` - 공지사항 크롤링 + Spring POST 전송

#### 주의사항

> Spring 서버(`localhost:6030`)가 실행 중이어야 `/crawl-and-post`가 정상 동작합니다.
> 크롤링만 할 경우 `/crawl`만 호출해도 됩니다.

#### Docker 배포 (선택)

**Dockerfile**

```dockerfile
FROM python:3.10-slim

WORKDIR /app

COPY . .

RUN pip install --no-cache-dir -r requirements.txt

CMD ["uvicorn", "notice_crawler:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
```

> **주의**: Selenium용 Chrome 브라우저와 Chromedriver를 Docker 컨테이너에 설치해야 합니다.

---

## 🏗 빌드 및 배포

### 프로덕션 빌드

```bash
# TypeScript 컴파일 및 Vite 빌드
npm run build
```

빌드된 파일은 `dist/` 디렉토리에 생성됩니다.

### 프리뷰

```bash
# 빌드된 파일 로컬 프리뷰
npm run preview
```

### 배포

빌드된 `dist/` 폴더를 다음 플랫폼에 배포할 수 있습니다:
- **Vercel**
- **Netlify**
- **AWS S3 + CloudFront**
- **GitHub Pages**

---

## 👨‍💻 개발 가이드

### 코드 스타일

- **ESLint** 설정을 따릅니다.
- **Prettier** (선택사항) 사용 권장

```bash
# ESLint 실행
npm run lint
```

### 브랜치 전략

- `main` - 프로덕션 브랜치
- `dev` - 개발 브랜치
- `feature/*` - 기능 개발 브랜치

### 커밋 컨벤션

```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅, 세미콜론 누락 등
refactor: 코드 리팩토링
test: 테스트 코드
chore: 빌드, 패키지 매니저 설정
```

### 주요 디렉토리별 역할

- **`src/api/`** - API 호출 함수 정의 (Axios)
- **`src/components/`** - 재사용 가능한 UI 컴포넌트
- **`src/routes/`** - 페이지 라우트 컴포넌트
- **`src/store/`** - Redux 상태 관리 (슬라이스)
- **`src/types/`** - TypeScript 타입 정의
- **`src/hooks/`** - 커스텀 훅

### 새로운 페이지 추가하기

1. `src/routes/` 에 페이지 컴포넌트 생성
2. `src/App.tsx`에 라우트 추가
3. 필요시 `src/components/layout/navbar.tsx`에 네비게이션 링크 추가

### 새로운 API 추가하기

1. `src/api/` 하위에 적절한 폴더 생성 또는 기존 폴더 선택
2. API 함수 작성 (axios 사용)
3. 필요시 `src/types/` 에 타입 정의 추가

---

## 🤝 기여하기

1. 이 레포지토리를 Fork 합니다.
2. 새로운 기능 브랜치를 생성합니다. (`git checkout -b feature/amazing-feature`)
3. 변경 사항을 커밋합니다. (`git commit -m 'feat: Add amazing feature'`)
4. 브랜치에 Push 합니다. (`git push origin feature/amazing-feature`)
5. Pull Request를 생성합니다.

---

## 📄 라이센스

이 프로젝트는 ISC 라이센스를 따릅니다.

---

## 🔗 링크

- **GitHub 레포지토리**: [https://github.com/chosun-nest/Nest-FE](https://github.com/chosun-nest/Nest-FE)
- **이슈 트래커**: [https://github.com/chosun-nest/Nest-FE/issues](https://github.com/chosun-nest/Nest-FE/issues)

---

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해주세요.

---

**Made with ❤️ by WantIT-NEST Team**
