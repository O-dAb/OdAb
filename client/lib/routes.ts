// 모든 페이지 이동 경로를 한 곳에서 관리합니다.
// 정적 경로와 동적 경로(함수)를 구분하여 작성하세요.

export const ROUTES = {
  // 메인 홈
  HOME: '/',
  // 로그인
  LOGIN: '/login',
  // 회원가입 (Link 등에서 사용)
  SIGNUP: '/signup',
  // 학습(스터디) 관련
  STUDY: {
    ROOT: '/study', // 스터디 메인
    RELATED: '/study/related', // 관련 문제 목록
    // 관련 문제 상세 (동적)
    RELATED_DETAIL: (id: string | number) => `/study/related/${id}`,
  },
  // 복습 관련
  REVIEW: {
    ROOT: '/review', // 복습 메인
    SCHEDULE: '/review/schedule', // 복습 일정
    // 복습 상세 (동적)
    DETAIL: (id: string | number) => `/review/${id}`,
  },
  // 문제 관련
  QUESTION: {
    ROOT: '/question', // 문제 메인
    // 문제 다시풀기 (동적)
    RETRY_DETAIL: (id: string | number) => `/question/retry/${id}`,
  },
  // 오답노트
  MISTAKES: '/mistakes',
} as const;

// 타입 자동화
export type RouteObject = typeof ROUTES;
export type RouteKey = keyof typeof ROUTES;

// 동적 경로 헬퍼 (반드시 함수로 사용)
export const getReviewDetailRoute = (id: string | number) => ROUTES.REVIEW.DETAIL(id); // 복습 상세
export const getQuestionRetryRoute = (id: string | number) => ROUTES.QUESTION.RETRY_DETAIL(id); // 문제 다시풀기
export const getStudyRelatedDetailRoute = (id: string | number) => ROUTES.STUDY.RELATED_DETAIL(id); // 관련 문제 상세

// 라우트 타입 정의
export type StudyRouteKey = keyof typeof ROUTES.STUDY;
export type ReviewRouteKey = keyof typeof ROUTES.REVIEW;
export type QuestionRouteKey = keyof typeof ROUTES.QUESTION;

// API 경로가 필요하다면 여기에 정의할 수도 있습니다.
// export const API_ROUTES = {
//   LOGIN: "/api/login",
//   USER_PROFILE: "/api/user/profile",
// };
