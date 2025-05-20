"use client";

import { useEffect, useState } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    
    // 초기 상태 설정
    setMatches(media.matches);

    // 이벤트 리스너 정의
    const listener = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    // 이벤트 리스너 등록
    media.addEventListener("change", listener);

    // 클린업 함수
    return () => {
      media.removeEventListener("change", listener);
    };
  }, [query]);

  return matches;
} 