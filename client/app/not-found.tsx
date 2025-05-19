"use client";

import { Suspense } from "react";
import Link from "next/link";

// 실제 404 컨텐츠
function NotFoundContent() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-5 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="text-center space-y-6 max-w-md">
        <h1 className="text-6xl font-bold text-blue-500">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700">
          페이지를 찾을 수 없습니다
        </h2>
        <p className="text-gray-500">
          요청하신 페이지가 존재하지 않거나, 이동되었거나, 일시적으로 사용할 수
          없습니다.
        </p>
        <Link href="/">
          <button className="px-6 py-2 mt-4 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors">
            홈으로 돌아가기
          </button>
        </Link>
      </div>
    </div>
  );
}

// 로딩 컴포넌트
function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
}

export default function NotFound() {
  return (
    <Suspense fallback={<Loading />}>
      <NotFoundContent />
    </Suspense>
  );
}
