import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ROUTES } from "@/lib/routes";

export const useNavigation = () => {
  const router = useRouter();

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      // 뒤로가기 이벤트가 발생했을 때
      if (event.state?.back) {
        router.back();
      } else {
        // 뒤로갈 페이지가 없는 경우 홈으로 이동
        router.push(ROUTES.HOME);
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [router]);

  const goBack = () => {
    // 현재 페이지를 history에 추가
    window.history.pushState({ back: true }, '');
    router.back();
  };

  return { goBack };
}; 