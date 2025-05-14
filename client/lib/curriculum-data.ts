import type { EducationLevel, Grade } from "@/components/problem-solver"

// 교육과정 데이터 - 실제 제공된 데이터 기반
const CURRICULUM = {
  middle: {
    "1": ["수와 연산", "변화와 관계", "도형과 측정", "자료와 가능성"],
    "2": ["수와 연산", "변화와 관계", "도형과 측정", "자료와 가능성"],
    "3": ["수와 연산", "변화와 관계", "도형과 측정", "자료와 가능성"],
  },
  high: {
    "1": [
      "실수 체계",
      "다항식 연산",
      "인수분해",
      "방정식",
      "부등식",
      "일차함수",
      "이차함수",
      "통계 기초",
      "집합",
      "명제",
      "유리식·무리식",
      "순열과 조합",
      "확률 기본",
      "삼각함수 기초",
    ],
    "2": [
      "행렬 연산",
      "이차곡선",
      "복소수 연산",
      "함수의 극한",
      "연속성",
      "미분법",
      "적분법",
      "이산확률분포",
      "정규분포",
      "통계적 추정",
      "가설검정",
    ],
    "3": [
      "급수",
      "벡터 연산",
      "다변수 함수",
      "편미분",
      "공간도형",
      "좌표기하",
      "도형 변환",
      "기하학적 증명",
      "미분을 활용한 최적화",
      "경제 모델링",
      "게임이론 기초",
      "선형대수",
      "최적화 알고리즘",
      "머신러닝 기초 수학",
      "직업별 수학 응용",
    ],
  },
}

// 대주제와 소주제 구조 정의
const MAJOR_CONCEPTS = {
  middle: [
    {
      majorConceptId: 1,
      majorConceptType: "수와 연산",
      subConceptList: [
        { subConceptId: 101, subConceptType: "분수와 소수", lastLearningDate: "2024-05-05" },
        { subConceptId: 102, subConceptType: "정수와 유리수", lastLearningDate: "2024-05-03" },
        { subConceptId: 103, subConceptType: "소인수분해", lastLearningDate: "2024-04-28" },
        { subConceptId: 104, subConceptType: "제곱근", lastLearningDate: "2024-04-25" },
      ],
    },
    {
      majorConceptId: 2,
      majorConceptType: "변화와 관계",
      subConceptList: [
        { subConceptId: 201, subConceptType: "일차방정식", lastLearningDate: "2024-05-06" },
        { subConceptId: 202, subConceptType: "연립방정식", lastLearningDate: "2024-05-01" },
        { subConceptId: 203, subConceptType: "일차함수", lastLearningDate: "2024-04-29" },
        { subConceptId: 204, subConceptType: "이차방정식", lastLearningDate: "2024-04-27" },
      ],
    },
    {
      majorConceptId: 3,
      majorConceptType: "도형과 측정",
      subConceptList: [
        { subConceptId: 301, subConceptType: "삼각형의 넓이", lastLearningDate: "2024-05-04" },
        { subConceptId: 302, subConceptType: "피타고라스 정리", lastLearningDate: "2024-04-30" },
        { subConceptId: 303, subConceptType: "원의 넓이", lastLearningDate: "2024-04-26" },
        { subConceptId: 304, subConceptType: "입체도형", lastLearningDate: "2024-04-22" },
      ],
    },
    {
      majorConceptId: 4,
      majorConceptType: "자료와 가능성",
      subConceptList: [
        { subConceptId: 401, subConceptType: "확률", lastLearningDate: "2024-05-02" },
        { subConceptId: 402, subConceptType: "통계", lastLearningDate: "2024-04-28" },
        { subConceptId: 403, subConceptType: "경우의 수", lastLearningDate: "2024-04-24" },
        { subConceptId: 404, subConceptType: "자료 정리", lastLearningDate: "2024-04-20" },
      ],
    },
  ],
  high: [
    {
      majorConceptId: 5,
      majorConceptType: "대수와 방정식",
      subConceptList: [
        { subConceptId: 501, subConceptType: "실수 체계", lastLearningDate: "2024-05-06" },
        { subConceptId: 502, subConceptType: "다항식 연산", lastLearningDate: "2024-05-04" },
        { subConceptId: 503, subConceptType: "인수분해", lastLearningDate: "2024-05-01" },
        { subConceptId: 504, subConceptType: "방정식", lastLearningDate: "2024-04-28" },
        { subConceptId: 505, subConceptType: "부등식", lastLearningDate: "2024-04-25" },
      ],
    },
    {
      majorConceptId: 6,
      majorConceptType: "함수",
      subConceptList: [
        { subConceptId: 601, subConceptType: "일차함수", lastLearningDate: "2024-05-05" },
        { subConceptId: 602, subConceptType: "이차함수", lastLearningDate: "2024-05-02" },
        { subConceptId: 603, subConceptType: "삼각함수", lastLearningDate: "2024-04-29" },
        { subConceptId: 604, subConceptType: "지수함수", lastLearningDate: "2024-04-26" },
        { subConceptId: 605, subConceptType: "로그함수", lastLearningDate: "2024-04-23" },
      ],
    },
    {
      majorConceptId: 7,
      majorConceptType: "미적분",
      subConceptList: [
        { subConceptId: 701, subConceptType: "함수의 극한", lastLearningDate: "2024-05-03" },
        { subConceptId: 702, subConceptType: "연속성", lastLearningDate: "2024-04-30" },
        { subConceptId: 703, subConceptType: "미분법", lastLearningDate: "2024-04-27" },
        { subConceptId: 704, subConceptType: "적분법", lastLearningDate: "2024-04-24" },
      ],
    },
    {
      majorConceptId: 8,
      majorConceptType: "확률과 통계",
      subConceptList: [
        { subConceptId: 801, subConceptType: "순열과 조합", lastLearningDate: "2024-05-04" },
        { subConceptId: 802, subConceptType: "확률 기본", lastLearningDate: "2024-05-01" },
        { subConceptId: 803, subConceptType: "이산확률분포", lastLearningDate: "2024-04-28" },
        { subConceptId: 804, subConceptType: "정규분포", lastLearningDate: "2024-04-25" },
        { subConceptId: 805, subConceptType: "통계적 추정", lastLearningDate: "2024-04-22" },
      ],
    },
    {
      majorConceptId: 9,
      majorConceptType: "기하와 벡터",
      subConceptList: [
        { subConceptId: 901, subConceptType: "이차곡선", lastLearningDate: "2024-05-06" },
        { subConceptId: 902, subConceptType: "벡터 연산", lastLearningDate: "2024-05-03" },
        { subConceptId: 903, subConceptType: "공간도형", lastLearningDate: "2024-04-30" },
        { subConceptId: 904, subConceptType: "좌표기하", lastLearningDate: "2024-04-27" },
      ],
    },
  ],
}

// 교육과정 설명 데이터
const CURRICULUM_DESCRIPTIONS = {
  middle: {
    "수와 연산": "자연수, 정수, 유리수, 실수, 소수, 분수, 소인수분해, 제곱근, 사칙연산, 수 체계 확장, 연산의 성질",
    "변화와 관계":
      "규칙 찾기, 수열, 문자와 식, 방정식, 부등식, 함수, 좌표평면, 그래프 해석, 비례식, 비율, 다항식 연산, 인수분해",
    "도형과 측정":
      "평면도형, 입체도형, 합동, 대칭, 닮음, 피타고라스 정리, 삼각비 기초, 둘레·넓이·부피, 측정 단위, 공간 감각",
    "자료와 가능성":
      "자료 수집, 분류, 표와 그래프, 대푯값, 산포도, 상자그림, 경우의 수, 확률 기초, 통계적 문제 해결 과정",
  },
  high: {
    "실수 체계": "실수의 성질, 절댓값, 제곱근, 실수의 대소 관계",
    "다항식 연산": "다항식의 덧셈, 뺄셈, 곱셈, 나눗셈",
    인수분해: "인수분해 공식, 완전제곱식, 차의 공식",
    방정식: "일차방정식, 이차방정식, 연립방정식, 근과 계수의 관계",
    부등식: "일차부등식, 이차부등식, 연립부등식",
    일차함수: "일차함수의 그래프, 기울기, y절편, 직선의 방정식",
    이차함수: "이차함수의 그래프, 꼭짓점, 축, 최대·최소",
    "통계 기초": "자료 정리, 대푯값, 산포도, 상관관계",
    집합: "집합의 개념, 포함 관계, 연산, 벤 다이어그램",
    명제: "명제의 참·거짓, 필요충분조건, 대우, 역, 이",
    유리식·무리식: "유리식과 무리식의 계산, 분모의 유리화",
    "순열과 조합": "순열, 조합, 중복순열, 중복조합",
    "확률 기본": "확률의 기본 성질, 독립사건, 조건부확률",
    "삼각함수 기초": "삼각함수의 정의, 삼각함수의 그래프, 삼각함수의 성질",
    "행렬 연산": "행렬의 덧셈, 뺄셈, 곱셈, 역행렬",
    이차곡선: "포물선, 타원, 쌍곡선의 방정식과 그래프",
    "복소수 연산": "복소수의 정의, 복소수의 덧셈, 뺄셈, 곱셈, 나눗셈",
    "함수의 극한": "함수의 극한값, 극한의 성질, 연속함수",
    연속성: "함수의 연속성, 불연속점, 중간값 정리",
    미분법: "도함수, 미분계수, 접선의 방정식, 변화율",
    적분법: "부정적분, 정적분, 면적, 부피",
    이산확률분포: "이항분포, 기하분포, 초기하분포",
    정규분포: "정규분포의 성질, 표준정규분포, 확률계산",
    "통계적 추정": "모평균 추정, 모비율 추정, 신뢰구간",
    가설검정: "가설검정의 개념, 유의수준, p값",
    급수: "수열의 극한, 무한급수, 급수의 수렴과 발산",
    "벡터 연산": "벡터의 덧셈, 뺄셈, 내적, 외적",
    "다변수 함수": "다변수 함수의 정의, 그래프, 등고선",
    편미분: "편도함수, 전미분, 연쇄법칙",
    공간도형: "공간좌표, 구, 원기둥, 원뿔",
    좌표기하: "좌표평면에서의 도형, 거리 공식, 직선의 방정식",
    "도형 변환": "평행이동, 대칭, 회전, 확대·축소",
    "기하학적 증명": "기하학적 성질의 증명, 귀류법, 대우",
    "미분을 활용한 최적화": "최대·최소 문제, 라그랑주 승수법",
    "경제 모델링": "수요·공급 함수, 한계비용, 한계수익",
    "게임이론 기초": "전략적 의사결정, 내쉬 균형, 죄수의 딜레마",
    선형대수: "벡터공간, 선형변환, 고유값, 고유벡터",
    "최적화 알고리즘": "경사하강법, 뉴턴법, 라그랑주 승수법",
    "머신러닝 기초 수학": "확률과 통계, 선형대수, 미적분학",
    "직업별 수학 응용": "공학, 의료, 금융, IT 분야의 수학 응용",
  },
}

// 예시 오답 데이터
const MISTAKE_DATA = {
  middle: {
    "1": [
      { id: 1, topic: "수와 연산", problem: "다음 분수를 소수로 바꾸시오: 3/8", date: "2024-04-25", isCorrect: false },
      {
        id: 2,
        topic: "변화와 관계",
        problem: "일차방정식 2x + 5 = 11을 풀어라.",
        date: "2024-04-26",
        isCorrect: false,
      },
      {
        id: 3,
        topic: "도형과 측정",
        problem: "삼각형의 넓이를 구하는 공식을 이용하여 밑변이 6cm, 높이가 4cm인 삼각형의 넓이를 구하시오.",
        date: "2024-04-27",
        isCorrect: true,
      },
      {
        id: 4,
        topic: "자료와 가능성",
        problem: "주사위를 한 번 던질 때, 짝수가 나올 확률을 구하시오.",
        date: "2024-04-28",
        isCorrect: false,
      },
      {
        id: 5,
        topic: "수와 연산",
        problem: "다음 정수를 크기 순으로 나열하시오: -3, 0, -5, 2, -1",
        date: "2024-04-29",
        isCorrect: false,
      },
    ],
    "2": [
      {
        id: 6,
        topic: "수와 연산",
        problem: "유리수 -2/3와 -5/6의 합을 구하시오.",
        date: "2024-04-25",
        isCorrect: false,
      },
      {
        id: 7,
        topic: "변화와 관계",
        problem: "연립방정식 { 2x + y = 7, x - y = 1 }을 풀어라.",
        date: "2024-04-26",
        isCorrect: false,
      },
      {
        id: 8,
        topic: "도형과 측정",
        problem: "원의 넓이를 구하는 공식을 이용하여 반지름이 5cm인 원의 넓이를 구하시오.",
        date: "2024-04-27",
        isCorrect: true,
      },
      {
        id: 9,
        topic: "자료와 가능성",
        problem: "다음 자료의 평균과 중앙값을 구하시오: 3, 7, 8, 10, 12",
        date: "2024-04-28",
        isCorrect: false,
      },
    ],
    "3": [
      { id: 10, topic: "수와 연산", problem: "√18을 간단히 하시오.", date: "2024-04-25", isCorrect: false },
      {
        id: 11,
        topic: "변화와 관계",
        problem: "이차방정식 x² - 5x + 6 = 0을 풀어라.",
        date: "2024-04-26",
        isCorrect: false,
      },
      {
        id: 12,
        topic: "도형과 측정",
        problem: "피타고라스 정리를 이용하여 직각삼각형의 빗변의 길이를 구하시오. 두 변의 길이는 3cm와 4cm이다.",
        date: "2024-04-27",
        isCorrect: true,
      },
      {
        id: 13,
        topic: "자료와 가능성",
        problem:
          "주머니에 빨간 구슬 3개, 파란 구슬 2개가 있다. 임의로 2개를 동시에 꺼낼 때, 같은 색의 구슬이 나올 확률을 구하시오.",
        date: "2024-04-28",
        isCorrect: false,
      },
    ],
  },
  high: {
    "1": [
      {
        id: 14,
        topic: "실수 체계",
        problem: "무리수와 유리수의 차이점을 설명하시오.",
        date: "2024-04-25",
        isCorrect: false,
      },
      { id: 15, topic: "다항식 연산", problem: "(2x + 3)(x - 1)을 전개하시오.", date: "2024-04-26", isCorrect: true },
      { id: 16, topic: "인수분해", problem: "x² - 5x + 6을 인수분해하시오.", date: "2024-04-27", isCorrect: false },
      {
        id: 17,
        topic: "이차함수",
        problem: "이차함수 f(x) = x² - 4x + 3의 최솟값을 구하시오.",
        date: "2024-04-28",
        isCorrect: false,
      },
      {
        id: 18,
        topic: "집합",
        problem: "집합 A = {1, 2, 3, 4}, B = {3, 4, 5, 6}에 대하여 A ∩ B를 구하시오.",
        date: "2024-04-29",
        isCorrect: true,
      },
      { id: 19, topic: "명제", problem: "명제 'p이면 q이다'의 대우를 쓰시오.", date: "2024-04-30", isCorrect: false },
      {
        id: 20,
        topic: "순열과 조합",
        problem: "서로 다른 5개에서 3개를 선택하는 조합의 수를 구하시오.",
        date: "2024-05-01",
        isCorrect: true,
      },
      {
        id: 21,
        topic: "확률 기본",
        problem: "주사위 2개를 던질 때, 두 눈의 합이 7이 될 확률을 구하시오.",
        date: "2024-05-02",
        isCorrect: false,
      },
    ],
    "2": [
      {
        id: 22,
        topic: "행렬 연산",
        problem: "행렬 A = [[1, 2], [3, 4]]와 B = [[2, 0], [1, 3]]의 곱 AB를 구하시오.",
        date: "2024-04-25",
        isCorrect: false,
      },
      {
        id: 23,
        topic: "이차곡선",
        problem: "포물선 y = x² - 4x + 3의 꼭짓점을 구하시오.",
        date: "2024-04-26",
        isCorrect: false,
      },
      {
        id: 24,
        topic: "미분법",
        problem: "함수 f(x) = x³ - 3x²의 도함수를 구하시오.",
        date: "2024-04-27",
        isCorrect: true,
      },
      { id: 25, topic: "적분법", problem: "∫(2x + 3)dx를 계산하시오.", date: "2024-04-28", isCorrect: false },
      {
        id: 26,
        topic: "함수의 극한",
        problem: "lim(x→0) (sin x)/x의 값을 구하시오.",
        date: "2024-04-29",
        isCorrect: false,
      },
      {
        id: 27,
        topic: "연속성",
        problem: "함수 f(x) = |x|가 x = 0에서 연속인지 판별하시오.",
        date: "2024-04-30",
        isCorrect: true,
      },
      {
        id: 28,
        topic: "이산확률분포",
        problem: "이항분포 B(10, 0.3)에서 확률변수 X가 3 이하일 확률을 구하시오.",
        date: "2024-05-01",
        isCorrect: false,
      },
    ],
    "3": [
      {
        id: 29,
        topic: "급수",
        problem: "등비수열 1, 1/2, 1/4, ...의 무한합을 구하시오.",
        date: "2024-04-25",
        isCorrect: false,
      },
      {
        id: 30,
        topic: "벡터 연산",
        problem: "벡터 a = (1, 2, 3)와 b = (2, 0, -1)의 내적을 구하시오.",
        date: "2024-04-26",
        isCorrect: false,
      },
      {
        id: 31,
        topic: "공간도형",
        problem: "정육면체의 대각선의 길이를 구하시오. 정육면체의 한 변의 길이는 2이다.",
        date: "2024-04-27",
        isCorrect: true,
      },
      {
        id: 32,
        topic: "미분을 활용한 최적화",
        problem: "함수 f(x) = x³ - 3x² + 2의 극값을 모두 구하시오.",
        date: "2024-04-28",
        isCorrect: false,
      },
      {
        id: 33,
        topic: "편미분",
        problem: "함수 f(x,y) = x²y + xy²의 편도함수 fx(x,y)를 구하시오.",
        date: "2024-04-29",
        isCorrect: true,
      },
      {
        id: 34,
        topic: "선형대수",
        problem: "행렬 A = [[2, 1], [1, 3]]의 고유값을 구하시오.",
        date: "2024-04-30",
        isCorrect: false,
      },
      {
        id: 35,
        topic: "경제 모델링",
        problem: "수요함수 p = 100 - 2q와 공급함수 p = 20 + 3q에서 균형가격과 균형수량을 구하시오.",
        date: "2024-05-01",
        isCorrect: false,
      },
    ],
  },
}

// 예시 개념 데이터
const CONCEPT_DATA = {
  middle: {
    "1": [
      {
        id: 1,
        title: "분수와 소수",
        description: "분수를 소수로, 소수를 분수로 변환하는 방법을 배웁니다.",
        formula: "a/b = a ÷ b",
        examples: ["3/4 = 0.75", "0.25 = 1/4"],
      },
      {
        id: 2,
        title: "일차방정식",
        description: "미지수가 1제곱으로 표현된 방정식입니다.",
        formula: "ax + b = c",
        examples: ["2x + 3 = 7", "x - 5 = 10"],
      },
    ],
    "2": [
      {
        id: 3,
        title: "연립방정식",
        description: "두 개 이상의 방정식을 동시에 만족하는 해를 구하는 방정식입니다.",
        formula: "{ ax + by = c, dx + ey = f }",
        examples: ["{ 2x + y = 7, x - y = 1 }", "{ 3x + 2y = 12, x - y = 1 }"],
      },
    ],
    "3": [
      {
        id: 4,
        title: "이차방정식",
        description: "최고차항이 2차인 방정식입니다.",
        formula: "ax² + bx + c = 0",
        examples: ["x² - 5x + 6 = 0", "2x² - 3x - 5 = 0"],
      },
    ],
  },
  high: {
    "1": [
      {
        id: 5,
        title: "이차방정식",
        description: "미지수가 2제곱으로 표현된 방정식으로, ax² + bx + c = 0 형태를 가집니다.",
        formula: "x = (-b ± √(b² - 4ac)) / 2a",
        examples: ["x² - 5x + 6 = 0", "2x² - 3x - 5 = 0"],
      },
      {
        id: 6,
        title: "인수분해",
        description: "다항식을 인수들의 곱으로 나타내는 방법입니다.",
        formula: "x² - (a+b)x + ab = (x-a)(x-b)",
        examples: ["x² - 5x + 6 = (x-2)(x-3)", "x² - 9 = (x+3)(x-3)"],
      },
      {
        id: 7,
        title: "집합",
        description: "특정 조건을 만족하는 대상들의 모임입니다.",
        formula: "A ∩ B = {x | x ∈ A and x ∈ B}",
        examples: ["A = {1, 2, 3}, B = {2, 3, 4} → A ∩ B = {2, 3}", "A = {1, 2}, B = {3, 4} → A ∩ B = ∅"],
      },
      {
        id: 8,
        title: "순열과 조합",
        description: "순서를 고려하여 나열하는 방법(순열)과 순서 없이 선택하는 방법(조합)입니다.",
        formula: "₍ₙ₎P₍ᵣ₎ = n!/(n-r)!, ₍ₙ₎C₍ᵣ₎ = n!/r!(n-r)!",
        examples: ["₍₅₎P₍₃₎ = 5!/2! = 60", "₍₅₎C₍₃₎ = 5!/3!2! = 10"],
      },
    ],
    "2": [
      {
        id: 9,
        title: "미분법",
        description: "함수의 순간 변화율을 계산하는 방법입니다.",
        formula: "f'(x) = lim(h→0) [f(x+h) - f(x)] / h",
        examples: ["f(x) = x², f'(x) = 2x", "f(x) = sin(x), f'(x) = cos(x)"],
      },
      {
        id: 10,
        title: "적분법",
        description: "함수의 곡선 아래 면적을 계산하는 방법입니다.",
        formula: "∫f(x)dx = F(x) + C, where F'(x) = f(x)",
        examples: ["∫x dx = x²/2 + C", "∫sin(x) dx = -cos(x) + C"],
      },
      {
        id: 11,
        title: "이차곡선",
        description: "포물선, 타원, 쌍곡선과 같은 2차 방정식으로 표현되는 곡선입니다.",
        formula: "포물선: y = ax² + bx + c",
        examples: ["y = x² (포물선)", "x²/a² + y²/b² = 1 (타원)"],
      },
    ],
    "3": [
      {
        id: 12,
        title: "벡터 연산",
        description: "크기와 방향을 가진 양을 다루는 수학적 도구입니다.",
        formula: "a·b = |a||b|cosθ",
        examples: ["(1,2)·(3,4) = 1×3 + 2×4 = 11", "|(3,4)| = √(3² + 4²) = 5"],
      },
      {
        id: 13,
        title: "급수",
        description: "무한히 많은 항의 합을 다루는 수학적 개념입니다.",
        formula: "Σ(n=1 to ∞) ar^(n-1) = a/(1-r), |r| < 1",
        examples: ["1 + 1/2 + 1/4 + ... = 2", "1 + 1/3 + 1/9 + ... = 3/2"],
      },
      {
        id: 14,
        title: "선형대수",
        description: "벡터 공간, 선형 변환, 행렬 등을 연구하는 수학의 한 분야입니다.",
        formula: "det(A) = ad - bc, where A = [[a, b], [c, d]]",
        examples: ["det([[2, 1], [3, 4]]) = 2×4 - 1×3 = 5", "A⁻¹ = 1/det(A) × adj(A)"],
      },
    ],
  },
}

// 예시 복습 일정 데이터
const REVIEW_DATA = {
  middle: {
    "1": [
      {
        id: 1,
        topic: "수와 연산",
        firstLearned: "2024-04-29", // Updated to be 1 day ago from 2024-04-30
        reviewStage: 1, // 1: 1일차, 2: 4일차, 3: 6일차, 4: 13일차
        nextReview: "2024-04-30",
        problems: ["다음 분수를 소수로 바꾸시오: 3/8", "다음 정수를 크기 순으로 나열하시오: -3, 0, -5, 2, -1"],
      },
    ],
    "2": [
      {
        id: 2,
        topic: "변화와 관계",
        firstLearned: "2024-04-26", // Updated to be 4 days ago from 2024-04-30
        reviewStage: 2,
        nextReview: "2024-04-30",
        problems: ["연립방정식 { 2x + y = 7, x - y = 1 }을 풀어라.", "일차함수 y = 2x + 3의 그래프를 그리시오."],
      },
    ],
    "3": [
      {
        id: 3,
        topic: "도형과 측정",
        firstLearned: "2024-04-24", // Updated to be 6 days ago from 2024-04-30
        reviewStage: 3,
        nextReview: "2024-05-01",
        problems: ["피타고라스 정리를 이용하여 직각삼각형의 빗변의 길이를 구하시오. 두 변의 길이는 3cm와 4cm이다."],
      },
      {
        id: 4,
        topic: "자료와 가능성",
        firstLearned: "2024-04-17", // Updated to be 13 days ago from 2024-04-30
        reviewStage: 4,
        nextReview: "2024-04-30",
        problems: ["주사위를 한 번 던질 때, 짝수가 나올 확률을 구하시오."],
      },
    ],
  },
  high: {
    "1": [
      {
        id: 4,
        topic: "이차함수",
        firstLearned: "2024-04-25",
        reviewStage: 2,
        nextReview: "2024-04-30",
        problems: [
          "이차함수 f(x) = x² - 4x + 3의 최솟값을 구하시오.",
          "이차함수 y = -x² + 6x - 5의 그래프를 그리시오.",
        ],
      },
      {
        id: 5,
        topic: "인수분해",
        firstLearned: "2024-04-26",
        reviewStage: 1,
        nextReview: "2024-05-01",
        problems: ["x² - 5x + 6을 인수분해하시오.", "x² - 9를 인수분해하시오."],
      },
      {
        id: 6,
        topic: "집합",
        firstLearned: "2024-04-27",
        reviewStage: 1,
        nextReview: "2024-05-02",
        problems: ["집합 A = {1, 2, 3, 4}, B = {3, 4, 5, 6}에 대하여 A ∩ B와 A ∪ B를 구하시오."],
      },
    ],
    "2": [
      {
        id: 7,
        topic: "미분법",
        firstLearned: "2024-04-20",
        reviewStage: 3,
        nextReview: "2024-04-29",
        problems: ["함수 f(x) = x³ - 3x²의 도함수를 구하시오.", "함수 f(x) = sin(x)의 도함수를 구하시오."],
      },
      {
        id: 8,
        topic: "적분법",
        firstLearned: "2024-04-22",
        reviewStage: 2,
        nextReview: "2024-04-30",
        problems: ["∫(2x + 3)dx를 계산하시오.", "∫sin(x)dx를 계산하시오."],
      },
    ],
    "3": [
      {
        id: 9,
        topic: "벡터 연산",
        firstLearned: "2024-04-24",
        reviewStage: 1,
        nextReview: "2024-05-01",
        problems: [
          "벡터 a = (1, 2, 3)와 b = (2, 0, -1)의 내적을 구하시오.",
          "벡터 a = (1, 0, 0)와 b = (0, 1, 0)의 외적을 구하시오.",
        ],
      },
    ],
  },
}

// 교육과정에 맞는 주제 가져오기
export function getCurriculumTopics(educationLevel: EducationLevel, grade: Grade): string[] {
  return CURRICULUM[educationLevel][grade] || []
}

// 모든 교육과정 주제 가져오기 (학년 구분 없이)
export function getAllCurriculumTopics(educationLevel: EducationLevel): string[] {
  const allTopics: string[] = []

  for (const grade in CURRICULUM[educationLevel]) {
    allTopics.push(...CURRICULUM[educationLevel][grade as Grade])
  }

  // 중복 제거
  return [...new Set(allTopics)]
}

// 주제 설명 가져오기
export function getTopicDescription(topic: string, educationLevel: EducationLevel): string {
  if (educationLevel === "middle") {
    return CURRICULUM_DESCRIPTIONS.middle[topic] || "설명이 없습니다."
  } else {
    return CURRICULUM_DESCRIPTIONS.high[topic] || "설명이 없습니다."
  }
}

// 교육과정에 맞는 개념 데이터 가져오기
export function getCurriculumConcepts(educationLevel: EducationLevel, grade: Grade): any[] {
  return CONCEPT_DATA[educationLevel]?.[grade] || []
}

// 모든 학년의 개념 데이터 가져오기
export function getAllCurriculumConcepts(educationLevel: EducationLevel): any[] {
  const allConcepts: any[] = []

  for (const grade in CONCEPT_DATA[educationLevel]) {
    allConcepts.push(...CONCEPT_DATA[educationLevel][grade as Grade])
  }

  return allConcepts
}

// 최근 학습한 주제 가져오기 (최근 7일 이내)
export function getRecentlyStudiedTopics(educationLevel: EducationLevel, grade: Grade): string[] {
  const mistakes = MISTAKE_DATA[educationLevel]?.[grade] || []
  const today = new Date()

  // 최근 7일 이내에 학습한 주제만 필터링
  const recentTopics = mistakes
    .filter((mistake) => {
      const mistakeDate = new Date(mistake.date)
      const diffTime = Math.abs(today.getTime() - mistakeDate.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return diffDays <= 7
    })
    .map((mistake) => mistake.topic)

  // 중복 제거
  return [...new Set(recentTopics)]
}

// 모든 학년에서 최근 학습한 주제 가져오기
export function getAllRecentlyStudiedTopics(educationLevel: EducationLevel): string[] {
  const allRecentTopics: string[] = []

  for (const grade in MISTAKE_DATA[educationLevel]) {
    allRecentTopics.push(...getRecentlyStudiedTopics(educationLevel, grade as Grade))
  }

  // 중복 제거
  return [...new Set(allRecentTopics)]
}

// 주제별 오답 가져오기
export function getMistakesByTopic(topic: string | null, educationLevel: EducationLevel, grade: Grade): any[] {
  const mistakes = MISTAKE_DATA[educationLevel]?.[grade] || []

  if (!topic) {
    return mistakes.filter((mistake) => !mistake.isCorrect)
  }

  return mistakes.filter((mistake) => mistake.topic === topic && !mistake.isCorrect)
}

// 모든 학년에서 주제별 오답 가져오기
export function getAllMistakesByTopic(topic: string | null, educationLevel: EducationLevel): any[] {
  const allMistakes: any[] = []

  for (const grade in MISTAKE_DATA[educationLevel]) {
    if (topic) {
      allMistakes.push(
        ...MISTAKE_DATA[educationLevel][grade as Grade].filter(
          (mistake) => mistake.topic === topic && !mistake.isCorrect,
        ),
      )
    } else {
      allMistakes.push(...MISTAKE_DATA[educationLevel][grade as Grade].filter((mistake) => !mistake.isCorrect))
    }
  }

  return allMistakes
}

// 주제별 오답률 계산하기
export function getTopicErrorRate(topic: string, educationLevel: EducationLevel, grade: Grade): number {
  const mistakes = MISTAKE_DATA[educationLevel]?.[grade] || []
  const topicMistakes = mistakes.filter((mistake) => mistake.topic === topic)

  if (topicMistakes.length === 0) return 0

  const incorrectCount = topicMistakes.filter((mistake) => !mistake.isCorrect).length
  return Math.round((incorrectCount / topicMistakes.length) * 100)
}

// 모든 학년에서 주제별 오답률 계산하기
export function getAllTopicErrorRate(topic: string, educationLevel: EducationLevel): number {
  let totalProblems = 0
  let incorrectCount = 0

  for (const grade in MISTAKE_DATA[educationLevel]) {
    const mistakes = MISTAKE_DATA[educationLevel][grade as Grade]
    const topicMistakes = mistakes.filter((mistake) => mistake.topic === topic)

    totalProblems += topicMistakes.length
    incorrectCount += topicMistakes.filter((mistake) => !mistake.isCorrect).length
  }

  if (totalProblems === 0) return 0

  return Math.round((incorrectCount / totalProblems) * 100)
}

// 주제별 마지막 학습일 가져오기
export function getTopicLastStudyDate(topic: string, educationLevel: EducationLevel, grade: Grade): string | null {
  const mistakes = MISTAKE_DATA[educationLevel]?.[grade] || []
  const topicMistakes = mistakes.filter((mistake) => mistake.topic === topic)

  if (topicMistakes.length === 0) return null

  // 날짜 기준으로 정렬하여 가장 최근 날짜 반환
  return topicMistakes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].date
}

// 모든 학년에서 주제별 마지막 학습일 가져오기
export function getAllTopicLastStudyDate(topic: string, educationLevel: EducationLevel): string | null {
  const allDates: string[] = []

  for (const grade in MISTAKE_DATA[educationLevel]) {
    const lastDate = getTopicLastStudyDate(topic, educationLevel, grade as Grade)
    if (lastDate) {
      allDates.push(lastDate)
    }
  }

  if (allDates.length === 0) return null

  // 날짜 기준으로 정렬하여 가장 최근 날짜 반환
  return allDates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0]
}

// 주제별 학습 횟수 가져오기
export function getTopicStudyCount(topic: string, educationLevel: EducationLevel, grade: Grade): number {
  const mistakes = MISTAKE_DATA[educationLevel]?.[grade] || []
  return mistakes.filter((mistake) => mistake.topic === topic).length
}

// 모든 학년에서 주제별 학습 횟수 가져오기
export function getAllTopicStudyCount(topic: string, educationLevel: EducationLevel): number {
  let count = 0

  for (const grade in MISTAKE_DATA[educationLevel]) {
    count += getTopicStudyCount(topic, educationLevel, grade as Grade)
  }

  return count
}

// 대주제와 소주제 구조 가져오기
export function getMajorConcepts(educationLevel: EducationLevel): any[] {
  return MAJOR_CONCEPTS[educationLevel] || []
}

// 기존 코드는 유지하고 샘플 데이터만 추가/수정합니다

// 예시 복습 일정 데이터 - 오늘 날짜 기준으로 업데이트
export function getReviewSchedule(educationLevel: EducationLevel, grade: Grade): any[] {
  // 오늘 날짜 가져오기
  const today = new Date()
  const todayStr = today.toISOString().split("T")[0]

  // 내일 날짜 계산
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowStr = tomorrow.toISOString().split("T")[0]

  // 이틀 후 날짜 계산
  const dayAfterTomorrow = new Date(today)
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2)
  const dayAfterTomorrowStr = dayAfterTomorrow.toISOString().split("T")[0]

  // 일주일 전 날짜 계산
  const oneWeekAgo = new Date(today)
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
  const oneWeekAgoStr = oneWeekAgo.toISOString().split("T")[0]

  // 4일 전 날짜 계산
  const fourDaysAgo = new Date(today)
  fourDaysAgo.setDate(fourDaysAgo.getDate() - 4)
  const fourDaysAgoStr = fourDaysAgo.toISOString().split("T")[0]

  // 6일 전 날짜 계산
  const sixDaysAgo = new Date(today)
  sixDaysAgo.setDate(sixDaysAgo.getDate() - 6)
  const sixDaysAgoStr = sixDaysAgo.toISOString().split("T")[0]

  // 13일 전 날짜 계산
  const thirteenDaysAgo = new Date(today)
  thirteenDaysAgo.setDate(thirteenDaysAgo.getDate() - 13)
  const thirteenDaysAgoStr = thirteenDaysAgo.toISOString().split("T")[0]

  // 샘플 데이터 업데이트
  const sampleData = {
    middle: {
      "1": [
        {
          id: 1,
          topic: "수와 연산",
          firstLearned: oneWeekAgoStr,
          reviewStage: 2, // 4일차 복습
          nextReview: todayStr, // 오늘 복습
          problems: [
            "다음 분수를 소수로 바꾸시오: 3/8",
            "다음 정수를 크기 순으로 나열하시오: -3, 0, -5, 2, -1",
            "1/4 + 2/3의 값을 구하시오.",
          ],
          majorConceptId: 1,
          majorConceptType: "수와 연산",
          subConceptId: 101,
          subConceptType: "분수와 소수",
        },
        {
          id: 2,
          topic: "변화와 관계",
          firstLearned: fourDaysAgoStr,
          reviewStage: 1, // 1일차 복습
          nextReview: todayStr, // 오늘 복습
          problems: [
            "연립방정식 { 2x + y = 7, x - y = 1 }을 풀어라.",
            "일차함수 y = 2x + 3의 그래프를 그리시오.",
            "x + 3 = 7의 해를 구하시오.",
          ],
          majorConceptId: 2,
          majorConceptType: "변화와 관계",
          subConceptId: 201,
          subConceptType: "일차방정식",
        },
        {
          id: 3,
          topic: "도형과 측정",
          firstLearned: sixDaysAgoStr,
          reviewStage: 2, // 4일차 복습
          nextReview: tomorrowStr, // 내일 복습
          problems: [
            "피타고라스 정리를 이용하여 직각삼각형의 빗변의 길이를 구하시오. 두 변의 길이는 3cm와 4cm이다.",
            "원의 넓이를 구하는 공식을 이용하여 반지름이 5cm인 원의 넓이를 구하시오.",
          ],
          majorConceptId: 3,
          majorConceptType: "도형과 측정",
          subConceptId: 302,
          subConceptType: "피타고라스 정리",
        },
        {
          id: 4,
          topic: "자료와 가능성",
          firstLearned: thirteenDaysAgoStr,
          reviewStage: 3, // 6일차 복습
          nextReview: dayAfterTomorrowStr, // 이틀 후 복습
          problems: [
            "주사위를 한 번 던질 때, 짝수가 나올 확률을 구하시오.",
            "동전을 두 번 던질 때, 적어도 한 번 앞면이 나올 확률을 구하시오.",
          ],
          majorConceptId: 4,
          majorConceptType: "자료와 가능성",
          subConceptId: 401,
          subConceptType: "확률",
        },
      ],
      "2": [
        {
          id: 5,
          topic: "수와 연산",
          firstLearned: oneWeekAgoStr,
          reviewStage: 2, // 4일차 복습
          nextReview: todayStr, // 오늘 복습
          problems: ["유리수 -2/3와 -5/6의 합을 구하시오.", "√18을 간단히 하시오."],
          majorConceptId: 1,
          majorConceptType: "수와 연산",
          subConceptId: 102,
          subConceptType: "정수와 유리수",
        },
      ],
      "3": [
        {
          id: 6,
          topic: "이차방정식",
          firstLearned: fourDaysAgoStr,
          reviewStage: 1, // 1일차 복습
          nextReview: todayStr, // 오늘 복습
          problems: ["이차방정식 x² - 5x + 6 = 0을 풀어라.", "이차방정식 2x² - 7x + 3 = 0을 풀어라."],
          majorConceptId: 2,
          majorConceptType: "변화와 관계",
          subConceptId: 204,
          subConceptType: "이차방정식",
        },
      ],
    },
    high: {
      "1": [
        {
          id: 7,
          topic: "이차함수",
          firstLearned: fourDaysAgoStr,
          reviewStage: 1, // 1일차 복습
          nextReview: todayStr, // 오늘 복습
          problems: [
            "이차함수 f(x) = x² - 4x + 3의 최솟값을 구하시오.",
            "이차함수 y = -x² + 6x - 5의 그래프를 그리시오.",
          ],
          majorConceptId: 6,
          majorConceptType: "함수",
          subConceptId: 602,
          subConceptType: "이차함수",
        },
        {
          id: 8,
          topic: "인수분해",
          firstLearned: sixDaysAgoStr,
          reviewStage: 2, // 4일차 복습
          nextReview: tomorrowStr, // 내일 복습
          problems: ["x² - 5x + 6을 인수분해하시오.", "x² - 9를 인수분해하시오."],
          majorConceptId: 5,
          majorConceptType: "대수와 방정식",
          subConceptId: 503,
          subConceptType: "인수분해",
        },
      ],
      "2": [
        {
          id: 9,
          topic: "미분법",
          firstLearned: oneWeekAgoStr,
          reviewStage: 2, // 4일차 복습
          nextReview: todayStr, // 오늘 복습
          problems: ["함수 f(x) = x³ - 3x²의 도함수를 구하시오.", "함수 f(x) = sin(x)의 도함수를 구하시오."],
          majorConceptId: 7,
          majorConceptType: "미적분",
          subConceptId: 703,
          subConceptType: "미분법",
        },
      ],
      "3": [
        {
          id: 10,
          topic: "벡터 연산",
          firstLearned: thirteenDaysAgoStr,
          reviewStage: 4, // 13일차 복습
          nextReview: todayStr, // 오늘 복습
          problems: [
            "벡터 a = (1, 2, 3)와 b = (2, 0, -1)의 내적을 구하시오.",
            "벡터 a = (1, 0, 0)와 b = (0, 1, 0)의 외적을 구하시오.",
          ],
          majorConceptId: 9,
          majorConceptType: "기하와 벡터",
          subConceptId: 902,
          subConceptType: "벡터 연산",
        },
      ],
    },
  }

  return sampleData[educationLevel]?.[grade] || []
}

// 모든 학년의 복습 일정 가져오기 - 샘플 데이터 업데이트
export function getAllReviewSchedule(educationLevel: EducationLevel): any[] {
  const allSchedules: any[] = []

  // 모든 학년의 복습 일정 가져오기
  for (const grade in ["1", "2", "3"]) {
    allSchedules.push(...getReviewSchedule(educationLevel, grade as Grade))
  }

  return allSchedules
}

// 복습 일정 상세 정보 가져오기
export function getReviewDetail(reviewId: number, educationLevel: EducationLevel, grade: Grade): any | null {
  const reviews = getReviewSchedule(educationLevel, grade)
  return reviews.find((review) => review.id === reviewId) || null
}

// Add a function to check if a problem was correctly solved on retry
export function wasSolvedOnRetry(problemId: number, educationLevel: EducationLevel, grade: Grade): boolean {
  const mistakes = MISTAKE_DATA[educationLevel]?.[grade] || []
  const problem = mistakes.find((m) => m.id === problemId)
  return problem?.solvedOnRetry === true
}
