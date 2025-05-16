"use client";
import { Suspense } from "react";

// ... components/problem-solver.tsx 전체 코드, props 제거 및 educationLevel/grade를 useState로 관리 ...

const ProblemSolverContent = () => {
  return (
    <div>
      <h1>문제 해결 페이지</h1>
      {/* 임시 내용 */}
    </div>
  );
};

export default function ProblemSolverPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProblemSolverContent />
    </Suspense>
  );
}
