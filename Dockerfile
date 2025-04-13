# 🛠️ Node 환경 설정
FROM node:18

# 📁 작업 디렉토리 설정
WORKDIR /app

# 📦 의존성 설치
COPY package*.json ./
RUN npm install

# 📂 전체 프로젝트 복사
COPY . .

# 🚪 포트 오픈 (Vite 기본 포트)
EXPOSE 5173

# 🚀 개발 서버 실행 (외부 접속 허용)
CMD ["npm", "run", "dev", "--", "--host", "--port", "5173"]