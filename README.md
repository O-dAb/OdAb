
# O! 답 - 수학 학습 AI 서비스 

## 1. 프로젝트 개요

### 📋 서비스 개요
- **단계별 사고 과정을 배우는 수학 학습 AI**
- 문제 풀이 과정의 논리적 추론을 통해 근본적인 수학 실력 향상
- 프로젝트 기간: 2025/04/29 ~ 2025/05/22 (총 n일간)
- **주요 타겟**: 태블릿을 이용한 수학 학습자

### 🎯 서비스 특징
1. **이미지 기반 수학 문제 인식 및 분석**
2. **단계별 사고 과정 해설 제공**
3. **유사 문제 추천 및 AI 생성 문제**
4. **개인 맞춤형 오답 노트 및 복습 관리**
<!-- 5. **망각 곡선 기반 반복 학습 시스템** -->
5. **태블릿 펜 기능 지원 (메모, 그리기)**

### 👥 팀원 정보 및 업무 분담 내역

| 이름           | 역할 및 구현 기능                    |
| -------------- | ------------------------------------ |
| 🟥이동영(팀장) | **풀스택 개발**<br>- 전체 서비스 설계 및 개발<br>- 팀 관리 및 프로젝트 총괄<br>- 문제 해결 및 최적화 |
| 🟧진종수(팀원) | **풀스택 개발**<br>- API 설계 및 구현<br>- 데이터베이스 설계<br>- 서버 로직 개발 |
| 🟩함동건(팀원) | **풀스택 개발**<br>- 카카오 OAuth 구현<br>- JWT 토큰 인증 방식 구현<br>- 유저 관리 |
| 🟦배한진(팀원) | **AI 개발**<br>- 수학 문제 해결 AI 구현<br>- 단계별 해설 생성 로직<br>- 문제 유형 분류 시스템 |
| 🟥유승호(팀원) | **AI 개발**<br>- AI 모델 학습 및 튜닝<br>- 유사 문제 추천 알고리즘<br>- RAG 시스템 구축 |
| 🟨이다영(팀원) | **Infra**<br>- CI/CD 파이프라인 구축<br>- Docker 컨테이너화<br>- AWS 배포 관리<br>- 프로필 설정 및 프론트 디자인 |

## 2. 기획 배경 및 필요성

### 🚫 기존 AI 수학 서비스의 한계점

#### 1️⃣ **정답 중심의 한계**
- 기존 AI는 정확한 답보다는 단순 해답 제시에 집중
- **수학에서 가장 중요한 '풀이 과정'과 '사고 과정' 부재**
- 학습자가 왜 그렇게 풀어야 하는지 이해할 수 없음

#### 2️⃣ **비효율적인 학습 경험**
- 새로운 문제마다 매번 새로운 프롬프팅 필요
- 일회성 서비스로 지속적인 학습 연계 부족
- 개인별 학습 진도와 약점 파악 불가

#### 3️⃣ **수학 학습의 특수성 미반영**
- 단순 지식 제공이 아닌 **논리적 추론과 단계적 사고** 필요
- 고난이도 문제에서 사고 과정 설명 부족
- 문제 분석부터 해결까지의 체계적 접근 방법 부재

### ✅ **O! 답**의 차별화된 해결책

#### 🧠 **사고 과정 중심의 학습**
- **기존**: "이 공식을 사용해서 이렇게 푼다" (방법만 제시)
- **O! 답**: "왜 이 공식을 사용하는지, 어떤 사고 과정을 거쳐야 하는지" (사고 과정 설명)

#### 📚 **언제 어디서나 접근 가능한 학습**
- 해설이 없거나 선생님께 질문할 수 없는 상황에서 즉시 해설 제공
- 고난이도 문제의 단계별 접근 방법 제시
- 개인별 맞춤 학습 환경 구축

## 3. 서비스 핵심 기술

### 🤖 **단계별 사고 체계 (Sequential Thinking 기반)**

우리만의 **단계별 사고 시스템**으로 수학 문제 해결:

#### **1단계: 문제 방향성 제시**
- 문제 유형 분석 및 접근 방향 제시
- 필요한 개념과 공식 식별

#### **2단계~N단계: 점진적 해결 과정**
- 각 단계별 논리적 사고 과정 설명
- 이전 단계 결과를 바탕으로 한 다음 단계 도출
- 학습자가 선택할 수 있는 2가지 옵션:
  - **"다음 단계만 보기"**: 단계별 학습
  - **"전체 풀이 보기"**: 한번에 전체 확인

### 🔍 **RAG (Retrieval-Augmented Generation) 시스템**
- 수학 개념 데이터베이스 구축
- 문제 유형별 해설 패턴 학습
- 유사 문제 검색 및 추천

### 🚀 **카나리 배포 (Canary Deployment)**
- 안정적인 서비스 운영
- 점진적 기능 업데이트
- 사용자 경험 최적화

## 4. 설계 및 구현

### 🛠 기술 스택

**Frontend** <br>
![React](https://img.shields.io/badge/react-61DAFB.svg?style=for-the-badge&logo=react&logoColor=white)
![NPM](https://img.shields.io/badge/NPM-FF415B.svg?style=for-the-badge&logo=NPM&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-3178C6.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/next.js-E2123.svg?style=for-the-badge&logo=next.js&logoColor=white)
![axios](https://img.shields.io/badge/axios-E1123.svg?style=for-the-badge&logo=axios&logoColor=white)
![tailwindcss](https://img.shields.io/badge/tailwindcss-01afca.svg?style=for-the-badge&logo=tailwindcss&logoColor=white)

**Backend** <br>
![Java](https://img.shields.io/badge/java-3670A0?style=for-the-badge&logo=Java&logoColor=ffdd54)
![Spring Boot](https://img.shields.io/badge/spring_boot-6DB33F.svg?style=for-the-badge&logo=springboot&logoColor=white)
![Spring Security](https://img.shields.io/badge/spring_security-6DB33F.svg?style=for-the-badge&logo=springsecurity&logoColor=white)
![Spring Data JPA](https://img.shields.io/badge/spring_data_jpa-6DB33F.svg?style=for-the-badge&logo=springdatajpa&logoColor=white)
![QueryDSL](https://img.shields.io/badge/QueryDSL-0089CF?style=for-the-badge&logo=querydsl&logoColor=white)
![MySQL](https://img.shields.io/badge/mysql-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Redis](https://img.shields.io/badge/redis-FF4438?style=for-the-badge&logo=redis&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000.svg?style=for-the-badge&logo=jwt&logoColor=white)
<img src="https://img.shields.io/badge/gradle-02303A?style=for-the-badge&logo=gradle&logoColor=white">

**DevOps** <br>
![NginX](https://img.shields.io/badge/NginX-009639.svg?style=for-the-badge&logo=nginx&logoColor=white)
![Docker](https://img.shields.io/badge/docker-2496ED.svg?style=for-the-badge&logo=docker&logoColor=white)
![Jenkins](https://img.shields.io/badge/jenkins-D24939.svg?style=for-the-badge&logo=jenkins&logoColor=white)
![Amazon EC2](https://img.shields.io/badge/amazon_ec2-FF9900.svg?style=for-the-badge&logo=amazonec2&logoColor=white)
![Amazon S3](https://img.shields.io/badge/Amazon%20S3-FF9900?style=for-the-badge&logo=amazons3&logoColor=white)

**Tools** <br>
![Visual Studio Code](https://img.shields.io/badge/Visual%20Studio%20Code-0078d7.svg?style=for-the-badge&logo=visual-studio-code&logoColor=white)
![Intellij IDEA](https://img.shields.io/badge/Intelij_IDEA-000000?style=for-the-badge&logo=intellijidea&logoColor=white)
![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white)
![Figma](https://img.shields.io/badge/figma-F24E1E.svg?style=for-the-badge&logo=figma&logoColor=white)
![Canva](https://img.shields.io/badge/Canva-%2300C4CC.svg?style=for-the-badge&logo=Canva&logoColor=white)
![Notion](https://img.shields.io/badge/Notion-%23000000.svg?style=for-the-badge&logo=notion&logoColor=white)
![jira](https://img.shields.io/badge/jira-2580f5.svg?style=for-the-badge&logo=jira&logoColor=white)

### 🖼️서비스 아키텍처

<img src="/docs/아키텍처.png" alt="아키텍처" width="700px" height="500px">

**📋 인프라 구성 및 배포 환경**
> 자세한 인프라 구성 및 CI/CD 파이프라인에 대한 내용은 [INFRA 문서](./docs/INFRA/README.md)를 참고해주세요.
<br>

### 💾데이터베이스 모델링(ERD)

<img src="/docs/ERD.png" alt="ERD" width="700px" height="500px">

### 📝요구사항 명세서

> 상세한 기능 요구사항 및 유저 스토리는 [요구사항 명세서](https://beneficial-cheese-641.notion.site/1e526951ec2780febd49f5dd299f3714?v=1e526951ec2781108a74000cd4620949&pvs=4)를 참고해주세요.

### 📄API명세서

> 전체 API 엔드포인트 및 요청/응답 스펙은 [API 명세서](https://beneficial-cheese-641.notion.site/API-1e526951ec2780adae1be21a16134169?pvs=4)를 참고해주세요.

## 5. 기능 상세 설명

### 📸 1. 문제 업로드 및 분석
#### 이미지 기반 문제 인식 시스템

<div align="center">
  <img src="/docs/문제업로드1.gif" alt="문제 업로드1" width="45%" style="margin-right: 20px;"/>
  <img src="/docs/문제업로드2.gif" alt="문제 업로드2" width="45%"/>
</div>

> **카메라 촬영 및 갤러리 업로드**: 태블릿 카메라로 직접 촬영하거나 갤러리에서 문제 이미지를 업로드할 수 있습니다.
> 
> **AI 문제 분석**: 업로드된 이미지를 OCR 기술로 텍스트 추출 후, AI가 자동으로 문제 유형을 분류하고 단계별 해설을 생성합니다.

**주요 기능:**
- 이미지 기반 수학 문제 인식 및 OCR 기술을 활용한 텍스트 추출
- AI 모델을 통한 문제 유형 분류 및 단계별 해설 자동 생성

---

### 🧠 2. 개념 학습 및 반복 학습
#### 체계적인 수학 개념 학습

<div align="center">
  <img src="/docs/개념학습.gif" alt="개념학습" width="45%" style="margin-right: 20px;"/>
  <img src="/docs/다시풀기.gif" alt="다시풀기" width="45%"/>
</div>

> **개념별 체계적 학습**: 문제와 연관된 수학 개념을 체계적으로 학습하고, 개념 이해도를 확인할 수 있습니다.
> 
> **반복 학습**: 틀린 문제나 어려웠던 문제를 다시 풀어보며 완전한 이해를 도모합니다.

**주요 기능:**
- 문제와 연계된 개념 설명 및 핵심 공식 제시
- 개인별 약점 파악을 통한 맞춤형 반복 학습

---

### 📝 3. 오답 노트 및 개인 설정
#### 개인화된 학습 관리 시스템

<div align="center">
  <img src="/docs/오답노트.gif" alt="오답노트" width="45%" style="margin-right: 20px;"/>
  <img src="/docs/설정페이지.gif" alt="설정페이지" width="45%"/>
</div>

> **스마트 오답 노트**: 틀린 문제들을 자동으로 분류하고, 약점 유형별로 정리하여 효율적인 복습이 가능합니다.
> 
> **개인화 설정**: 사용자 프로필, 학습 목표, 알림 설정 등을 개인의 학습 스타일에 맞게 조정할 수 있습니다.

**주요 기능:**
- 개인별 오답 패턴 분석 및 약점 유형별 문제 분류
- 복습 일정 자동 생성 및 학습 진도 시각화

---

### 🎨 4. 사용자 경험 최적화
#### 직관적이고 편리한 인터페이스

<div align="center">
  <img src="/docs/랜딩페이지.gif" alt="랜딩페이지" width="45%" style="margin-right: 20px;"/>
  <img src="/docs/메인페이지.gif" alt="메인페이지" width="45%"/>
</div>

<div align="center" style="margin-top: 20px;">
  <img src="/docs/로그인.gif" alt="로그인" width="45%" style="margin-right: 20px;"/>
  <img src="/docs/다크모드.gif" alt="다크모드" width="45%"/>
</div>

> **직관적인 인터페이스**: 서비스의 핵심 기능을 한눈에 파악할 수 있는 사용자 친화적인 랜딩 페이지와 개인화된 메인 대시보드를 제공합니다.
> 
> **편의 기능**: 카카오 OAuth를 통한 간편 로그인과 다크모드 지원으로 장시간 학습에도 눈의 피로를 줄입니다.

**주요 기능:**
- 간편한 소셜 로그인 및 통합 대시보드 (학습 현황, 최근 문제, 추천 문제)
- 다크/라이트 모드 지원 및 반응형 디자인

<br>

# 5. 팀원 소개

<div align="center">
  <!-- 첫 번째 줄 - 3명 -->
  <table style="width: 100%; table-layout: fixed;">
    <tr>
      <th align="center" width="33.33%">Backend</th>
      <th align="center" width="33.33%">Backend</th>
      <th align="center" width="33.33%">Backend</th>
    </tr>
    <tr>
      <td align="center">
        <img src="/docs/dongyoung.png" alt="동영 프로필 이미지" width="200px" height="150px">
        <br>
        <a href="https://github.com/dongschiken">이동영</a> 🦫
      </td>
      <td align="center">
        <img src="/docs/jongsu.png" alt="종수 프로필 이미지" width="200px" height="150px">
        <br>
        <a href="https://github.com/doros508">진종수</a> 🦊
      </td>
      <td align="center">
        <img src="/docs/donggun.png" alt="동건 프로필 이미지" width="200px" height="150px">
        <br>
        <a href="https://github.com/hamdonggeon">함동건</a> 🐯
      </td>
    </tr>
    <tr>
      <td align="center">
        <div>수달이처럼 열심히 일하는 풀스택 팀장</div>
      </td>
      <td align="center">
        <div>여우처럼 영리한 풀스택 개발자</div>
      </td>
      <td align="center">
        <div>호랑이처럼 용맹한 풀스택 개발자</div>
      </td>
    </tr>
    <tr>
      <td align="center">
        <ul>
          <li>🫀 책임감 있고 팀에 주인의식을 가지는 리더</li>
          <li>⭐️ 다양한 오류에 대한 문제해결 능력</li>
          <li>👩🏻‍💻 학습속도가 빠르고 기본기가 탄탄합니다.</li>
        </ul>
      </td>
      <td align="center">
        <ul>
          <li>👀 다양한 영역에 대한 통찰력과 이해력</li>
          <li>😎 맡은 일을 책임감 있게 해냅니다.</li>
          <li>🧑‍💻 기술 도입에 신중하며 합리적인 판단능력</li>
        </ul>
      </td>
      <td align="center">
        <ul>
          <li>🔧 문제해결 능력이 뛰어납니다</li>
          <li>💪 끈기있게 도전하는 자세</li>
          <li>👨‍💻 코드 최적화에 대한 열정</li>
        </ul>
      </td>
    </tr>
  </table>

  <!-- 두 번째 줄 - 3명 -->
  <table style="margin-top: 20px; width: 100%; table-layout: fixed;">
    <tr>
      <th align="center" width="33.33%">FullStack</th>
      <th align="center" width="33.33%">FullStack</th>
      <th align="center" width="33.33%">Infra</th>
    </tr>
    <tr>
      <td align="center">
        <img src="/docs/hanjin.png" alt="한진 프로필 이미지" width="200px" height="150px">
        <br>
        <a href="https://github.com/baebaebaeh">배한진</a> 🐼
      </td>
      <td align="center">
        <img src="/docs/seungho.png" alt="승호 프로필 이미지" width="200px" height="150px">
        <br>
        <a href="https://github.com/YooSeungHo0124">유승호</a> 🦁
      </td>
      <td align="center">
        <img src="/docs/dayoung.png" alt="다영 프로필 이미지" width="200px" height="150px">
        <br>
        <a href="https://github.com/solveDayLee">이다영</a> 🦄
      </td>
    </tr>
    <tr>
      <td align="center">
        <div>판다처럼 차분한 AI 개발자</div>
      </td>
      <td align="center">
        <div>사자처럼 당당한 AI 개발자</div>
      </td>
      <td align="center">
        <div>유니콘처럼 특별한 인프라 엔지니어 및 풀스택 개발자</div>
      </td>
    </tr>
    <tr>
      <td align="center">
        <ul>
          <li>👁️ 세심한 코드 리뷰 능력</li>
          <li>😎 맡은 일을 책임감 있게 해냅니다</li>
          <li>🧠 논리적인 사고와 체계적인 접근</li>
        </ul>
      </td>
      <td align="center">
        <ul>
          <li>🌱 지속적인 학습과 성장</li>
          <li>⚡ 빠른 적응력과 실행력</li>
          <li>🤝 원활한 소통과 협업 능력</li>
        </ul>
      </td>
      <td align="center">
        <ul>
          <li>🌱 지속적인 학습과 성장</li>
          <li>⚡ 빠른 적응력과 실행력</li>
          <li>🤝 원활한 소통과 협업 능력</li>
        </ul>
      </td>
    </tr>
  </table>
</div>


# 📋 Git 브랜치 전략

## 🌳 브랜치 구조
```
master
  └── develop
       ├── frontend-dev
       │    └── fe/[타입]/[작업명]
       └── backend-dev
            └── be/[타입]/[작업명]
```

## 📝 브랜치 명명 규칙
**형식**: `[팀]/[타입]/[작업명]`

### 🏷️ 타입
- `feature`: 새로운 기능 개발
- `style`: UI/UX 변경
- `bug`: 에러 해결  
- `refactoring`: 코드 수정

**예시**: `fe/feature/user-login`, `be/bug/api-fix`

## 💬 커밋 메시지 규칙
**형식**: `[타입]: 작업 내용`

### 🏷️ 타입
- `feat`: 새로운 기능
- `fix`: 버그 수정
- `style`: UI/UX 변경
- `refactor`: 코드 리팩토링
- `hotfix`: 긴급 수정
- `docs`: 문서 수정
- `chore`: 기타 작업

**예시**: `feat: 로그인 기능 구현`, `fix: 회원가입 오류 수정`

## 🔄 작업 흐름
1. `develop`에서 브랜치 생성
2. 작업 완료 후 PR 생성
3. 코드 리뷰 후 병합
4. 브랜치 삭제

## ⚠️ 주요 규칙
- `master`, `develop` 직접 push 금지 (긴급시 예외)
- PR을 통한 코드 리뷰 필수
- 하나의 브랜치에서 하나의 작업만
