FROM node:20-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
# 타입 검사 없이 빌드 실행
RUN NEXT_IGNORE_TS_ERRORS=1 npm run build

# 프로덕션 환경에서는 dev dependencies 제외
FROM node:20-alpine AS production

# 타임존 설정
RUN apk add --no-cache tzdata && \
    ln -sf /usr/share/zoneinfo/Asia/Seoul /etc/localtime && \
    echo "Asia/Seoul" > /etc/timezone

WORKDIR /app
COPY --from=build /app/package*.json ./
RUN npm ci --only=production --legacy-peer-deps
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public

COPY --from=build /app/next.config.* ./

EXPOSE 3000
CMD ["npm", "run", "start"]
