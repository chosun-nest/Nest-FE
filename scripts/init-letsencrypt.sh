#!/bin/bash

# Let's Encrypt 초기 설정 스크립트
# SSL 인증서를 처음 발급받을 때 사용

# 사용법: ./scripts/init-letsencrypt.sh your-domain.com your-email@example.com

if [ -z "$1" ] || [ -z "$2" ]; then
    echo "사용법: $0 <도메인> <이메일>"
    echo "예시: $0 nest.example.com admin@example.com"
    exit 1
fi

DOMAIN=$1
EMAIL=$2
STAGING=0  # 테스트 시에는 1로 설정 (Let's Encrypt rate limit 방지)

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Let's Encrypt SSL 인증서 초기 설정 ===${NC}"
echo "도메인: $DOMAIN"
echo "이메일: $EMAIL"
echo ""

# 1. 필요한 디렉토리 생성
echo -e "${YELLOW}1. 디렉토리 생성 중...${NC}"
mkdir -p certbot/conf
mkdir -p certbot/www
mkdir -p logs/nginx

# 2. Nginx 설정 파일에서 도메인 변경
echo -e "${YELLOW}2. Nginx 설정 파일 업데이트 중...${NC}"
sed -i.bak "s/your-domain.com/$DOMAIN/g" nginx/nginx.conf
echo "✓ Nginx 설정 파일 업데이트 완료"

# 3. 임시 인증서 생성 (초기 Nginx 구동용)
echo -e "${YELLOW}3. 임시 SSL 인증서 생성 중...${NC}"
if [ ! -d "certbot/conf/live/$DOMAIN" ]; then
    mkdir -p "certbot/conf/live/$DOMAIN"
    openssl req -x509 -nodes -newkey rsa:2048 -days 1 \
        -keyout "certbot/conf/live/$DOMAIN/privkey.pem" \
        -out "certbot/conf/live/$DOMAIN/fullchain.pem" \
        -subj "/CN=$DOMAIN"
    echo "✓ 임시 인증서 생성 완료"
else
    echo "✓ 기존 인증서 발견"
fi

# 4. Nginx 컨테이너 시작 (certbot은 아직 시작하지 않음)
echo -e "${YELLOW}4. Nginx 시작 중...${NC}"
docker compose -f docker-compose.prod.yml up -d frontend
sleep 5
echo "✓ Nginx 시작 완료"

# 5. 기존 임시 인증서 삭제
echo -e "${YELLOW}5. 임시 인증서 삭제 중...${NC}"
docker compose -f docker-compose.prod.yml exec frontend rm -rf /etc/letsencrypt/live/$DOMAIN
docker compose -f docker-compose.prod.yml exec frontend rm -rf /etc/letsencrypt/archive/$DOMAIN
docker compose -f docker-compose.prod.yml exec frontend rm -rf /etc/letsencrypt/renewal/$DOMAIN.conf

# 6. Let's Encrypt 인증서 발급
echo -e "${YELLOW}6. Let's Encrypt 인증서 발급 중...${NC}"

if [ $STAGING != "0" ]; then
    STAGING_ARG="--staging"
    echo -e "${RED}주의: 테스트 모드로 실행 중입니다${NC}"
else
    STAGING_ARG=""
fi

# certbot 서비스의 entrypoint를 override하여 certonly 명령 실행
docker compose -f docker-compose.prod.yml run --rm --entrypoint certbot certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email $EMAIL \
    --agree-tos \
    --no-eff-email \
    $STAGING_ARG \
    -d $DOMAIN

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ SSL 인증서 발급 성공!${NC}"
else
    echo -e "${RED}✗ SSL 인증서 발급 실패${NC}"
    exit 1
fi

# 7. certbot 서비스 시작 (자동 갱신용)
echo -e "${YELLOW}7. certbot 자동 갱신 서비스 시작 중...${NC}"
docker compose -f docker-compose.prod.yml up -d certbot
echo "✓ certbot 서비스 시작 완료"

# 8. Nginx 재시작
echo -e "${YELLOW}8. Nginx 재시작 중...${NC}"
docker compose -f docker-compose.prod.yml restart frontend
echo -e "${GREEN}✓ Nginx 재시작 완료${NC}"

echo ""
echo -e "${GREEN}=== 설정 완료! ===${NC}"
echo "프론트엔드 서버: https://$DOMAIN"
echo ""
echo "인증서는 certbot에 의해 자동으로 갱신됩니다."
echo ""
echo -e "${YELLOW}다음 명령어로 상태를 확인하세요:${NC}"
echo "  docker compose -f docker-compose.prod.yml logs -f frontend"
