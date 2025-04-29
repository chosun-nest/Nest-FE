
# 04/28 공지사항 게시판 Notice: FastAPI + Selenium + BeautifulSoup + React 연동

## ✅ 허용 환경
- **Python FastAPI** 서버 사용
- **Selenium + BeautifulSoup4**로 공지사항 페이지 크롤링
- **React (axios)** 호출로 JSON 형태 데이터 가져오기
- **Spring Boot**로 데이터 저장 (POST 전송)

---

## ☑️ FastAPI + Selenium + BeautifulSoup 서버 작동 흐름

1. **가상환경(venv) 새로 생성하기**

터미널(cmd, PowerShell, Git Bash 등)에서 해당 폴더로 이동한 뒤:

```bash
cd .\Nest-FE
python -m venv venv
```

2. **venv 활성화**

```bash
.\venv\Scripts\activate
```

3. **필요한 패키지 설치 (최초 1회만 설치)**

```bash
pip install fastapi uvicorn selenium beautifulsoup4 webdriver-manager apscheduler requests
```

4. **FastAPI 서버 실행**

```bash
cd src/components/notice
uvicorn notice_crawler:app --host 0.0.0.0 --port 8000 --reload
```
- `notice_crawler`: Python 파일명 (`.py` 확장자 제외)
- `app`: FastAPI 인스턴스 객체명
- `--reload`: 코드 변경 시 서버 자동 재시작 (개발용 옵션)

5. **새로운 터미널에서 venv 해제하고 npm run dev 실행**

5-1) 추가로 새로운 터미널(cmd, PowerShell, Git Bash 등) 띄우기
   위치 :  .\Nest-FE

5-2) venv 정상 해제(Windows cmd)
```
.\venv\Scripts\deactivate.bat
```

5-3) npm run dev

---

## 🔵 크롤링 + Spring API 연결 흐름

| 경로 | 기능 |
|:---|:---|
| `/crawl` | 공지사항만 크롤링하여 JSON 데이터 반환 |
| `/crawl-and-post` | 크롤링 후 Spring 서버(`localhost:6030`)로 데이터 POST 전송 |

---

## 경로별 세부 설명

| 단계 | 설명 |
|:---|:---|
| 크롤링 수행 | Selenium 가상 브라우저로 페이지 로딩 및 HTML 수집 |
| HTML 파싱 | BeautifulSoup으로 공지사항 데이터 추출 |
| React 연동 | React 프론트엔드에서 axios로 FastAPI 서버 호출 |
| Spring 연동 | 크롤링된 공지사항을 Spring API로 POST 전송 |
| 자동화 | apscheduler를 통해 매일 새벽 3시에 자동 크롤링 및 전송 |

---

## 🔵 FastAPI 서버용 Dockerfile 작성 예시

**Dockerfile**

```Dockerfile
FROM python:3.10-slim

WORKDIR /app

COPY . .

RUN pip install --no-cache-dir -r requirements.txt

CMD ["uvicorn", "notice_crawler:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
```
**주의:**  
- Selenium용 Chrome 브라우저와 Chromedriver를 Docker 컨테이너에 설치해야 합니다.

---

## 🏁 최종 목표

- FastAPI + Selenium + BeautifulSoup 조합으로 **자동 크롤링** 구현
- React 프론트엔드에서 `/crawl` 호출 시 **실시간 공지사항 표시**
- `/crawl-and-post` 호출 시 **Spring 서버로 자동 전송**
- apscheduler를 이용해 **매일 새벽 3시** 자동 업데이트 가능

---

## ☑️ 실행 후 반드시 확인할 것!

- [x] `http://localhost:8000/crawl` (공지사항 크롤링 결과 확인)
- [x] `http://localhost:8000/crawl-and-post` (공지사항 크롤링 + Spring POST 전송 결과 확인)

---

**venv 정상 해제(Windows cmd)**
```
.\venv\Scripts\deactivate.bat
```

---

⭐️ **TIP**  
- Spring 서버(`localhost:6030`)가 실행 중이어야 `/crawl-and-post`가 정상 동작합니다.
- 크롤링만 할 경우 `/crawl`만 호출해도 됩니다.
