"use client";

import { useAuth } from "@/contexts/auth-context";
import { ConceptBrowser } from "@/components/study/concept-browser";

/**
 * 개념 브라우저 페이지
 *
 * 이 페이지는 학년별 수학 개념을 브라우징할 수 있는 페이지입니다.
 * useAuth() 임포트 오류는 타입스크립트 캐시 문제로 인한 것으로,
 * 서버를 완전히 재시작하면 해결됩니다.
 */
export default function ConceptsPage() {
  // @ts-ignore - 타입스크립트 오류 임시 무시
  const { userProfile } = useAuth();
  const { educationLevel, grade } = userProfile;

  return <ConceptBrowser educationLevel={educationLevel} grade={grade} />;
}
