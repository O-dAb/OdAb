FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# 메모리 최적화 및 텔레메트리 비활성화 설정
ENV NODE_OPTIONS="--max-old-space-size=8192"
ENV NEXT_TELEMETRY_DISABLED=1
# 빌드 시 --no-lint 옵션 추가
RUN NEXT_IGNORE_TS_ERRORS=1 npm run build -- --no-lint

FROM node:20-alpine AS runner
# 타임존 설정
RUN apk add --no-cache tzdata && \
    ln -sf /usr/share/zoneinfo/Asia/Seoul /etc/localtime && \
    echo "Asia/Seoul" > /etc/timezone

WORKDIR /app
ENV NODE_ENV production
# 런타임에도 텔레메트리 비활성화
ENV NEXT_TELEMETRY_DISABLED 1

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.* ./

EXPOSE 3000
CMD ["npm", "run", "start"]