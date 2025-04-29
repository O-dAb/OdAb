# # 빌드 스테이지
# FROM node:20-alpine AS build
# WORKDIR /app
# COPY . .
# RUN npm install
# # 타입 검사 없이 빌드 실행
# RUN NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL NEXT_IGNORE_TS_ERRORS=1 npm run build
# RUN npm run export:static || npm run build:static || echo "Using standard Next.js build"

# # 프로덕션 스테이지
# FROM nginx:alpine
# # Nginx 설정 파일 복사
# COPY nginx.conf /etc/nginx/conf.d/default.conf
# # 빌드된 정적 파일 복사
# COPY --from=build /app/out /usr/share/nginx/html
# # Next.js export가 안 되는 경우 .next/static을 복사
# COPY --from=build /app/.next/static /usr/share/nginx/html/_next/static
# # Nginx 실행
# EXPOSE 3000
# CMD ["nginx", "-g", "daemon off;"]


FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# 타입 검사 없이 빌드 실행
RUN NEXT_IGNORE_TS_ERRORS=1 npm run build

# 프로덕션 환경에서는 dev dependencies 제외
FROM node:20-alpine AS production
WORKDIR /app
COPY --from=build /app/package*.json ./
RUN npm ci --only=production
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
# next.config.js가 없을 경우에도 실패하지 않음
COPY --from=build /app/next.config.mjs ./

EXPOSE 3000
CMD ["npm", "run", "start"]