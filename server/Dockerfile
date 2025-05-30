# 1. OpenJDK 이미지 사용
FROM openjdk:17-jdk-alpine AS build

# 2. 작업 디렉토리 설정
WORKDIR /app

# 3. 필요한 파일 복사 (전체가 아닌 필요한 부분만)
COPY ./src ./src
COPY ./build.gradle ./build.gradle
COPY ./settings.gradle ./settings.gradle
COPY ./gradlew ./gradlew
COPY ./gradle ./gradle

# 4. Gradle 파일 실행 권한 부여 (Linux 환경에서 필요)
RUN chmod +x ./gradlew

# 5. Gradle 빌드 실행 (테스트 제외)
RUN ./gradlew build -x test --no-daemon

# 6. 런타임 이미지 생성
FROM openjdk:17-jdk-alpine

# 타임존 설정 추가
RUN apk add --no-cache tzdata && \
    ln -sf /usr/share/zoneinfo/Asia/Seoul /etc/localtime && \
    echo "Asia/Seoul" > /etc/timezone

# Java 애플리케이션 타임존 설정
ENV JAVA_OPTS="-Duser.timezone=Asia/Seoul"

WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar

# 7. 실행 명령어 설정
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
