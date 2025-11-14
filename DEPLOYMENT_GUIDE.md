# 프론트엔드 배포 가이드 (Public VM + Nginx + SSL)

## 📋 시스템 구성

```
┌─────────────────────────────────────────┐
│         Public VM (프론트엔드)           │
│                                         │
│  ┌───────────────────────────────┐     │
│  │   Nginx (Port 80, 443)        │     │
│  │   - SSL/TLS (Let's Encrypt)   │     │
│  │   - 정적 파일 서빙             │     │
│  │   - 리버스 프록시              │     │
│  └────────────┬──────────────────┘     │
└───────────────┼────────────────────────┘
                │
                │ Reverse Proxy
                ▼
┌─────────────────────────────────────────┐
│        Private VM (백엔드)              │
│                                         │
│  ┌───────────────────────────────┐     │
│  │  Spring Boot (Port 6030)      │     │
│  │  - REST API                   │     │
│  │  - Swagger UI                 │     │
│  └───────────────────────────────┘     │
│                                         │
│  ┌───────────────────────────────┐     │
│  │  MySQL (Port 3306)            │     │
│  └───────────────────────────────┘     │
└─────────────────────────────────────────┘
```

---

## 🚀 1. 사전 준비

### Public VM 요구사항
- **OS**: Ubuntu 20.04 LTS 이상
- **메모리**: 최소 2GB RAM
- **디스크**: 최소 20GB
- **도메인**: 등록된 도메인 필요 (예: nest.example.com)
- **포트**: 80, 443 오픈

### 필수 설치
```bash
# Docker 설치
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Docker Compose 설치
mkdir -p ~/.docker/cli-plugins/
curl -SL https://github.com/docker/compose/releases/latest/download/docker-compose-linux-x86_64 \
    -o ~/.docker/cli-plugins/docker-compose
chmod +x ~/.docker/cli-plugins/docker-compose
docker compose version  # (띄어쓰기!)


# 로그아웃 후 재로그인
```

### 도메인 DNS 설정
Public VM의 IP 주소를 도메인 A 레코드에 등록:
```
Type: A
Name: @ (또는 nest)
Value: YOUR_PUBLIC_VM_IP
TTL: 300
```

---

## 📦 2. 프로젝트 배포

### 2.1 코드 배포

```bash
# Public VM에 접속
ssh user@your-public-vm-ip

# 프로젝트 디렉토리 생성
mkdir -p ~/nest
cd ~/nest

# Git 저장소 클론
git clone https://github.com/chosun-nest/Nest-FE.git
cd Nest-FE
```

### 2.2 환경 변수 설정

**`.env` 파일 생성:**
```bash
# API 엔드포인트 (Nginx가 프록시하므로 /api로 시작)
# VITE_API_BASE_URL="http://localhost:6030"
VITE_API_BASE_URL="http://wantitnest.co.kr:6030"
OPENAI_API_KEY=""


```

### 2.3 Nginx 설정 수정

**`nginx/nginx.conf` 파일에서 수정:**
```bash
# 1. 도메인 변경
sed -i 's/wantitnest.co.kr/YOUR_ACTUAL_DOMAIN/g' nginx/nginx.conf

# 2. Private VM IP 변경
sed -i 's/34.158.215.187/YOUR_PRIVATE_VM_IP/g' nginx/nginx.conf
```

또는 직접 편집:
```bash
vi nginx/nginx.conf
```

**변경할 내용:**
- `your-domain.com` → 실제 도메인
- `PRIVATE_VM_IP` → Private VM의 실제 IP

---

## 🔐 3. SSL 인증서 발급

### 3.1 자동 스크립트 사용 (권장)

```bash
# 스크립트에 실행 권한 부여
chmod +x scripts/init-letsencrypt.sh

# SSL 인증서 발급
./scripts/init-letsencrypt.sh your-domain.com your-email@example.com
```

스크립트가 자동으로:
1. 필요한 디렉토리 생성
2. Nginx 설정 파일 업데이트
3. 임시 인증서 생성
4. Let's Encrypt 인증서 발급
5. Nginx 재시작

### 3.2 수동 설정

```bash
# 1. 디렉토리 생성
mkdir -p certbot/conf certbot/www logs/nginx

# 2. 임시 인증서 생성
mkdir -p certbot/conf/live/your-domain.com
openssl req -x509 -nodes -newkey rsa:2048 -days 1 \
    -keyout certbot/conf/live/your-domain.com/privkey.pem \
    -out certbot/conf/live/your-domain.com/fullchain.pem \
    -subj "/CN=your-domain.com"

# 3. Nginx 시작
docker-compose -f docker-compose.prod.yml up -d frontend

# 4. 실제 인증서 발급
docker-compose -f docker-compose.prod.yml run --rm certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email your-email@example.com \
    --agree-tos \
    --no-eff-email \
    -d your-domain.com

# 5. Nginx 재시작
docker-compose -f docker-compose.prod.yml restart frontend
```

---

## 🏗 4. 프론트엔드 빌드 및 실행

### 4.1 프로덕션 빌드

```bash
# 로컬에서 빌드 (optional)
npm install
npm run build

# 또는 Docker에서 빌드
docker-compose -f docker-compose.prod.yml build
```

### 4.2 서비스 시작

```bash
# 백그라운드 실행
docker-compose -f docker-compose.prod.yml up -d

# 로그 확인
docker-compose -f docker-compose.prod.yml logs -f
```

### 4.3 서비스 확인

```bash
# 컨테이너 상태 확인
docker-compose -f docker-compose.prod.yml ps

# Nginx 설정 테스트
docker-compose -f docker-compose.prod.yml exec frontend nginx -t

# 서비스 접속 테스트
curl -I https://your-domain.com
```

---

## 🔧 5. 주요 명령어

### 서비스 관리

```bash
# 시작
docker-compose -f docker-compose.prod.yml up -d

# 중지
docker-compose -f docker-compose.prod.yml stop

# 재시작
docker-compose -f docker-compose.prod.yml restart

# 중지 및 삭제
docker-compose -f docker-compose.prod.yml down

# 로그 확인
docker-compose -f docker-compose.prod.yml logs -f frontend
docker-compose -f docker-compose.prod.yml logs -f certbot
```

### 인증서 관리

```bash
# 인증서 수동 갱신
docker-compose -f docker-compose.prod.yml run --rm certbot renew

# 인증서 상태 확인
docker-compose -f docker-compose.prod.yml exec frontend \
    ls -la /etc/letsencrypt/live/your-domain.com/

# 인증서 만료일 확인
docker-compose -f docker-compose.prod.yml exec frontend \
    openssl x509 -in /etc/letsencrypt/live/your-domain.com/fullchain.pem -noout -dates
```

### 코드 업데이트

```bash
# 1. 최신 코드 가져오기
git pull origin main

# 2. 재빌드 및 재시작
docker-compose -f docker-compose.prod.yml up -d --build
```

---

## 📊 6. 모니터링 및 디버깅

### 로그 확인

```bash
# Nginx 액세스 로그
tail -f logs/nginx/access.log

# Nginx 에러 로그
tail -f logs/nginx/error.log

# Docker 로그
docker-compose -f docker-compose.prod.yml logs --tail=100 -f
```

### 상태 확인

```bash
# 컨테이너 리소스 사용량
docker stats

# 디스크 사용량
df -h

# Nginx 프로세스 확인
docker-compose -f docker-compose.prod.yml exec frontend ps aux
```

### 일반적인 문제 해결

**1. SSL 인증서 발급 실패**
```bash
# 도메인 DNS 확인
nslookup your-domain.com

# 80 포트 접근 확인
curl -I http://your-domain.com/.well-known/acme-challenge/test

# Certbot 로그 확인
docker-compose -f docker-compose.prod.yml logs certbot
```

**2. 백엔드 연결 실패**
```bash
# Private VM 연결 테스트
curl http://PRIVATE_VM_IP:6030/api/v1/

# Nginx 프록시 설정 확인
docker-compose -f docker-compose.prod.yml exec frontend cat /etc/nginx/nginx.conf
```

**3. 정적 파일 404 에러**
```bash
# 빌드된 파일 확인
docker-compose -f docker-compose.prod.yml exec frontend ls -la /usr/share/nginx/html/

# Nginx 재시작
docker-compose -f docker-compose.prod.yml restart frontend
```

---

## 🔒 7. 보안 설정

### 방화벽 설정 (UFW)

```bash
# UFW 설치 및 활성화
sudo apt install ufw
sudo ufw default deny incoming
sudo ufw default allow outgoing

# 필요한 포트만 오픈
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS

# 방화벽 활성화
sudo ufw enable

# 상태 확인
sudo ufw status verbose
```

### Fail2Ban 설정 (선택사항)

```bash
# Fail2Ban 설치
sudo apt install fail2ban

# Nginx jail 설정
sudo vi /etc/fail2ban/jail.local
```

---

## 📈 8. 성능 최적화

### Nginx 캐싱 설정

이미 `nginx.conf`에 포함되어 있습니다:
- 정적 파일: 1년 캐싱
- 이미지: 1일 캐싱
- Gzip 압축: 활성화

### Docker 리소스 제한

`docker-compose.prod.yml`에 추가:
```yaml
services:
  frontend:
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
```

---

## 🔄 9. 백업 및 복구

### 백업

```bash
# SSL 인증서 백업
tar -czf certbot-backup-$(date +%Y%m%d).tar.gz certbot/

# Nginx 로그 백업
tar -czf logs-backup-$(date +%Y%m%d).tar.gz logs/
```

### 복구

```bash
# 인증서 복구
tar -xzf certbot-backup-YYYYMMDD.tar.gz
docker-compose -f docker-compose.prod.yml restart frontend
```

---

## 📞 10. 트러블슈팅

### Private VM 백엔드 연결 확인

```bash
# Public VM에서 Private VM 연결 테스트
curl http://PRIVATE_VM_IP:6030/api/v1/

# 네트워크 연결 확인
ping PRIVATE_VM_IP
telnet PRIVATE_VM_IP 6030
```

### CORS 문제 해결

백엔드(`Nest-BE`)의 `SecurityConfig.java`에서 CORS 설정:
```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.addAllowedOrigin("https://your-domain.com");
    configuration.addAllowedMethod("*");
    configuration.addAllowedHeader("*");
    configuration.setAllowCredentials(true);
    // ...
}
```

---

## 📝 체크리스트

배포 전 확인사항:

- [ ] 도메인 DNS A 레코드 설정 완료
- [ ] Public VM에 Docker 및 Docker Compose 설치
- [ ] nginx/nginx.conf에서 도메인 변경
- [ ] nginx/nginx.conf에서 Private VM IP 변경
- [ ] .env 파일 생성 및 API URL 설정
- [ ] SSL 인증서 발급 완료
- [ ] 방화벽 설정 (80, 443 포트 오픈)
- [ ] Private VM 백엔드 서버 실행 중
- [ ] 백엔드 CORS 설정 확인

---

## 🎉 완료!

모든 설정이 완료되면:
- **프론트엔드**: https://your-domain.com
- **백엔드 API**: https://your-domain.com/api
- **Swagger UI**: https://your-domain.com/swagger-ui/

인증서는 Certbot에 의해 자동으로 갱신됩니다. (90일마다)
