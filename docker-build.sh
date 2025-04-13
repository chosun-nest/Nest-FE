#!/bin/bash

# 하나라도 실패하면 스크립트 바로 종료

cd "$(dirname "$0")"

IMAGE_NAME="nest-fe-react-dev-5173-image"
CONTAINER_NAME="nest-fe-react-dev-5173-container"
PORT=5173

echo "🧹 기존 컨테이너 정리 중..."
docker stop $CONTAINER_NAME || echo "⛔ 컨테이너 없음 - skip"
docker rm $CONTAINER_NAME || echo "⛔ 컨테이너 없음 - skip"

echo "🗑 기존 이미지 삭제 중..."
docker rmi $IMAGE_NAME || true

echo "🐳 Docker 이미지 빌드 시작!"
docker build -t $IMAGE_NAME .

echo "🚀 컨테이너 실행 중!"
docker run -d \
  --name $CONTAINER_NAME \
  -p $PORT:5173 \
  $IMAGE_NAME

echo "✅ 완료! http://119.219.30.209:$PORT 에서 확인 가능해요!"
