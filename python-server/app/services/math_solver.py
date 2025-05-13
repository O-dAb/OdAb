import logging
import json
import os
import time
from typing import List, Dict, Any, Optional, Tuple
from anthropic import AsyncAnthropic
from .vector_service import VectorService
import re
from .claude_service import ClaudeService
import uuid

logger = logging.getLogger(__name__)

# Levenshtein 거리 계산 함수 추가
def calculate_edit_distance(s1, s2):
    """두 문자열 간의 Levenshtein 거리를 계산합니다."""
    if len(s1) < len(s2):
        return calculate_edit_distance(s2, s1)

    if len(s2) == 0:
        return len(s1)

    previous_row = range(len(s2) + 1)
    for i, c1 in enumerate(s1):
        current_row = [i + 1]
        for j, c2 in enumerate(s2):
            insertions = previous_row[j + 1] + 1
            deletions = current_row[j] + 1
            substitutions = previous_row[j] + (c1 != c2)
            current_row.append(min(insertions, deletions, substitutions))
        previous_row = current_row
    
    return previous_row[-1]

class MathSolver:
    def __init__(self):
        """수학 문제 해결 서비스 초기화"""
        api_key = os.getenv("CLAUDE_API_KEY")
        if not api_key:
            raise ValueError("CLAUDE_API_KEY environment variable is not set")
        self.client = AsyncAnthropic(api_key=api_key)
        self.vector_service = VectorService()
        self.claude_service = ClaudeService()
        logger.info("MathSolver 서비스 초기화 완료")
    
    async def solve_problem(self, problem_text: str, problem_type: Optional[str] = None) -> Dict[str, Any]:
        """
        수학 문제 해결 파이프라인 (Qanda 스타일 RAG)
        1. 문제 분석 및 개념 추출
        2. 유사한 문제 검색
        3. 발견된 패턴과 Claude API로 문제 해결
        4. 해결책 저장 및 반환
        """
        try:
            start_time = time.time()
            logger.info(f"수학 문제 풀이 시작: {problem_text[:100]}...")
            
            # 1. 문제 분석 및 개념 추출
            detected_concepts = self.vector_service.detect_problem_concepts(problem_text)
            logger.info(f"감지된 개념: {detected_concepts}")
            
            # 2. 유사한 문제 검색 (다중 전략 RAG)
            similar_problems = self.vector_service.multi_strategy_search(
                problem_text=problem_text,
                top_k=5,
                problem_type=problem_type
            )
            logger.info(f"유사 문제 {len(similar_problems)}개 찾음")
            
            # 3. 패턴 및 개념/공식 추출
            solution_patterns = self.vector_service.extract_solution_patterns(similar_problems) if similar_problems else ""
            concept_formulas = self.vector_service.extract_relevant_concepts_formulas(detected_concepts) if detected_concepts else ""
            
            # 4. Sequential Thinking 기반 문제 해결 (하드코딩된 3단계 대신 동적 접근 사용)
            solution = await self._solve_with_sequential_thinking(
                problem_text, 
                solution_patterns, 
                concept_formulas,
                problem_type,
                detected_concepts
            )
            
            # 5. 해결책 저장
            problem_id = str(uuid.uuid4())
            # 6. 추가 정보 첨부
            solution["problem_id"] = problem_id
            solution["elapsed_time"] = time.time() - start_time
            solution["similar_problems_found"] = len(similar_problems)
            solution["detected_concepts"] = detected_concepts
            
            return solution
            
        except Exception as e:
            logger.error(f"문제 해결 오류: {str(e)}")
            return {
                "error": str(e),
                "problem_text": problem_text,
                "solution_steps": ["오류가 발생했습니다."],
                "final_answer": "해결 실패",
                "confidence": 0.0
            }
    
    async def _solve_with_sequential_thinking(
        self, 
        problem_text: str, 
        solution_patterns: str, 
        concept_formulas: str,
        problem_type: Optional[str] = None,
        detected_concepts: List[str] = None
    ) -> Dict[str, Any]:
        """Sequential Thinking 기반 문제 해결 (claude_service.py 기반)"""
        
        logger.info("=== Sequential Thinking 기반 문제 해결 시작 ===")
        
        # 1. 초기 분석: 문제 이해 및 접근 방법
        initial_analysis = await self._perform_initial_analysis(
            problem_text, 
            problem_type, 
            solution_patterns, 
            concept_formulas,
            detected_concepts
        )
        logger.info("초기 분석 완료")
        
        # 2. 단계별 사고 과정 진행
        thoughts = []
        current_thought_text = initial_analysis  # 초기 분석을 첫 번째 사고의 컨텍스트로 사용
        thought_number = 1
        dynamic_max_thoughts = 10  # 초기 최대 사고 단계 수
        current_branch_id = "main"
        is_complete = False
        
        while thought_number <= dynamic_max_thoughts:
            logger.info(f"=== 사고 단계 {thought_number}/{dynamic_max_thoughts} (분기: {current_branch_id}) 처리 중 ===")
            
            # 이전 사고 단계 형식화
            previous_thoughts_formatted = ""
            if thoughts:
                previous_thoughts_formatted = "\n".join([
                    f"사고 {t['thoughtNumber']} (분기: {t.get('branchId', 'main')}): {t['thought']}" 
                    for t in thoughts
                ])
            
            # 현재 사고 단계 프롬프트 생성
            prompt = self._create_sequential_thinking_prompt(
                problem_text,
                initial_analysis,
                previous_thoughts_formatted,
                thought_number,
                current_thought_text,
                dynamic_max_thoughts,
                current_branch_id,
                problem_type,
                detected_concepts,
                solution_patterns,
                concept_formulas
            )
            
            # API 호출 및 응답 처리
            try:
                raw_response = await self._call_claude_api(prompt, max_tokens=800)
                logger.info(f"사고 단계 {thought_number} 응답 수신")
                
                # 응답 파싱 및 메타 신호 처리
                final_thought_text = raw_response
                is_revision = False
                revises_thought = None
                branch_from = None
                needs_more_thoughts = False
                new_branch_id = current_branch_id
                
                # 완료 신호 (THOUGHT_COMPLETE) 감지 - 퍼지 매칭 사용
                target_keyword = "THOUGHT_COMPLETE"
                max_allowed_distance = 2  # 최대 허용 편집 거리
                
                lines = final_thought_text.strip().split('\n')
                last_non_empty_line = ""
                last_non_empty_line_index = -1
                
                # 마지막 비어있지 않은 줄 찾기
                for i in range(len(lines) - 1, -1, -1):
                    stripped_line = lines[i].strip()
                    if stripped_line:
                        last_non_empty_line = stripped_line
                        last_non_empty_line_index = i
                        break
                
                # 마지막 줄과 완료 키워드의 유사성 확인 (대소문자 무시)
                if last_non_empty_line:
                    distance = calculate_edit_distance(last_non_empty_line.upper(), target_keyword)
                    if distance <= max_allowed_distance:
                        is_complete = True
                        # 완료 키워드가 포함된 줄 제거
                        if last_non_empty_line_index != -1:
                            final_thought_text = '\n'.join(lines[:last_non_empty_line_index]).strip()
                        logger.info(f"완료 키워드 '{last_non_empty_line}' 발견 (편집 거리: {distance})")
                
                # 완료 상태가 아닌 경우에만 다른 키워드 확인
                if not is_complete:
                    # NEED_MORE_THOUGHTS 키워드 확인
                    if "NEED_MORE_THOUGHTS" in final_thought_text:
                        needs_more_thoughts = True
                        final_thought_text = final_thought_text.replace("NEED_MORE_THOUGHTS", "").strip()
                        logger.info("'NEED_MORE_THOUGHTS' 키워드 발견")
                        # 사고 단계 동적 증가
                        dynamic_max_thoughts += 3
                        logger.info(f"최대 사고 단계 수를 {dynamic_max_thoughts}로 증가")
                    
                    # REVISE_THOUGHT_N 키워드 확인
                    revision_match = re.search(r"REVISE_THOUGHT_(\d+)", final_thought_text)
                    if revision_match:
                        is_revision = True
                        revises_thought = int(revision_match.group(1))
                        final_thought_text = final_thought_text.replace(revision_match.group(0), "").strip()
                        logger.info(f"'REVISE_THOUGHT_{revises_thought}' 키워드 발견")
                    
                    # BRANCH_FROM_N 키워드 확인
                    branch_match = re.search(r"BRANCH_FROM_(\d+)", final_thought_text)
                    if branch_match:
                        branch_from = int(branch_match.group(1))
                        final_thought_text = final_thought_text.replace(branch_match.group(0), "").strip()
                        new_branch_id = f"b{thought_number}"
                        logger.info(f"'BRANCH_FROM_{branch_from}' 키워드 발견. 새 분기: {new_branch_id}")
                
                # 완료 상태 처리
                if is_complete:
                    logger.info("완료 신호 감지, 사고 단계 루프 종료")
                    if thoughts and final_thought_text:
                        # 최종 사고에 내용 추가
                        thoughts[-1]['thought'] += f"\n최종 단계 (완료 신호 이전): {final_thought_text}"
                        thoughts[-1]['isComplete'] = True
                    elif final_thought_text:
                        # 첫 번째 사고에서 완료된 경우
                        thought_data = {
                            "thought": final_thought_text,
                            "thoughtNumber": thought_number,
                            "isComplete": True,
                            "isRevision": False,
                            "revisesThought": None,
                            "branchFromThought": None,
                            "branchId": current_branch_id,
                            "needsMoreThoughts": False
                        }
                        thoughts.append(thought_data)
                    elif thoughts:
                        # 키워드만 받은 경우, 마지막 사고를 완료 상태로 표시
                        thoughts[-1]['isComplete'] = True
                    break
                elif not final_thought_text:
                    logger.warning(f"사고 단계 {thought_number} 응답이 키워드 제거 후 비었습니다. 건너뜁니다.")
                else:
                    # 사고 단계 데이터 저장
                    thought_data = {
                        "thought": final_thought_text,
                        "thoughtNumber": thought_number,
                        "isComplete": False,
                        "isRevision": is_revision,
                        "revisesThought": revises_thought,
                        "branchFromThought": branch_from,
                        "branchId": new_branch_id,
                        "needsMoreThoughts": needs_more_thoughts
                    }
                    thoughts.append(thought_data)
                    current_thought_text = final_thought_text
                    current_branch_id = new_branch_id
                
                # 최대 사고 단계 수 도달 확인
                if thought_number == dynamic_max_thoughts:
                    logger.warning(f"최대 사고 단계 수 ({dynamic_max_thoughts})에 도달했습니다.")
                    if thoughts and not is_complete:
                        thoughts[-1]['isComplete'] = False
                    break
                
                thought_number += 1
                
            except Exception as e:
                logger.error(f"사고 단계 {thought_number} 처리 오류: {str(e)}")
                break
        
        logger.info(f"=== Sequential Thinking 완료: {len(thoughts)}개 사고 단계 생성 ===")
        
        # 3. 최종 요약 생성
        final_summary = "요약을 생성할 수 없습니다."
        final_answer = "답을 도출할 수 없습니다."
        
        if thoughts:
            logger.info("최종 요약 생성 중...")
            summary_prompt = self._create_summary_prompt(
                problem_text, 
                initial_analysis, 
                thoughts, 
                problem_type, 
                concept_formulas
            )
            
            try:
                summary_response = await self._call_claude_api(summary_prompt, max_tokens=1000)
                final_summary = summary_response.strip()
                # 후처리: LLM 응답을 최종 JSON으로 정규화
                final_summary = self.postprocess_llm_response(final_summary)
                logger.info(f"[최종 요약 LLM 응답]: {final_summary}")
                try:
                    # LLM 응답이 파이썬 객체(리스트/딕트)라면 문자열로 변환
                    parsed = json.loads(final_summary)
                    if isinstance(parsed, (list, dict)):
                        final_answer = json.dumps(parsed, ensure_ascii=False)
                    else:
                        final_answer = final_summary
                except Exception:
                    final_answer = final_summary
                
            except Exception as summary_error:
                logger.error(f"최종 요약 생성 오류: {str(summary_error)}")
        
        # 4. 결과 구성
        solution_steps = []
        for thought in thoughts:
            step_text = thought['thought']
            if thought.get('isRevision') and thought.get('revisesThought'):
                step_text = f"[수정: 단계 {thought['revisesThought']}] {step_text}"
            elif thought.get('branchFromThought'):
                step_text = f"[분기: 단계 {thought['branchFromThought']}] {step_text}"
            solution_steps.append(step_text)
        
        # 최종 답변이 없으면 마지막 사고 단계를 사용
        if final_answer == "답을 도출할 수 없습니다." and thoughts:
            final_answer = thoughts[-1]['thought']
        
        # 자신감 점수 계산
        confidence = self._calculate_sequential_confidence_score(initial_analysis, thoughts, final_answer, is_complete)
        
        # 관련 개념 추출
        related_concepts = self._extract_related_concepts(initial_analysis)
        
        return {
            "problem_text": problem_text,
            "solution_steps": solution_steps,
            "final_answer": final_answer,
            "confidence": confidence,
            "related_concepts": related_concepts
        }
    
    async def _perform_initial_analysis(
        self, 
        problem_text: str, 
        problem_type: Optional[str], 
        solution_patterns: str, 
        concept_formulas: str,
        detected_concepts: List[str]
    ) -> str:
        """문제의 초기 분석 수행"""
        
        prompt = f"""당신은 수학 문제 해결을 위한 전문가 어시스턴트입니다. 다음 문제를 분석해 주세요:

문제: {problem_text}

"""
        
        if problem_type:
            prompt += f"문제 유형: {problem_type}\n\n"
        
        if detected_concepts:
            prompt += f"감지된 개념: {', '.join(detected_concepts)}\n\n"
        
        if concept_formulas:
            prompt += f"관련 개념 및 공식:\n{concept_formulas}\n\n"
        
        if solution_patterns:
            prompt += f"참고할 유사 문제 풀이:\n{solution_patterns}\n\n"
        
        prompt += """분석 작업:
1. 문제 유형 파악: 이 문제는 어떤 수학 영역(기하학, 대수학, 미적분 등)에 속하나요?
2. 주어진 정보: 문제에서 명시적/암시적으로 주어진 모든 조건과 변수를 정리하세요.
3. 구해야 할 것: 문제가 요구하는 답(값, 증명, 설명 등)이 무엇인지 명확히 하세요.
4. 적용 가능한 개념/공식: 이 문제 해결에 필요한 수학적 개념, 정리, 공식을 리스트업하세요.
5. 해결 방향: 문제 접근 방법과 풀이 전략을 개략적으로 제시하세요.

LaTeX을 사용하여 수식을 명확하게 표현해 주세요. 답을 아직 구하지 마세요.
"""
        
        return await self._call_claude_api(prompt)
    
    def _create_sequential_thinking_prompt(
        self, 
        problem_text: str, 
        initial_analysis: str, 
        previous_thoughts: str, 
        thought_number: int, 
        current_thought: str, 
        max_thoughts: int, 
        branch_id: str,
        problem_type: Optional[str],
        detected_concepts: List[str],
        solution_patterns: str,
        concept_formulas: str
    ) -> str:
        """순차적 사고 과정을 위한 프롬프트 생성"""
        
        prompt = f"""
        당신은 수학 문제 해결을 위한 수학 선생님 어시스턴트로, 단계별 사고 과정을 통해 문제를 해결하고 있습니다.

        **원본 문제:** {problem_text}
        
        **문제 유형:** {problem_type or '미지정'}
        
        **관련 개념:** {', '.join(detected_concepts) if detected_concepts else '미지정'}
        
        **초기 분석 (문제 이해, 개념, 접근법):** 
        {initial_analysis}

        **이전 사고 과정 기록 (실행 이력):**
        {previous_thoughts if previous_thoughts else '첫 번째 사고 단계를 생성합니다.'}

        **현재 과제 (사고 단계 {thought_number}):**
        **초기 분석**과 **이전 사고 과정**을 바탕으로 해결 계획의 *다음* 논리적 단계를 생성하세요.
        - 첫 번째 사고 단계라면, 초기 분석에서 개략적으로 제시된 첫 번째 단계를 실행하세요.
        - 후속 사고 단계라면, 이전 결과를 기반으로 계획을 계속 실행하거나 필요에 따라 조정하세요.
        - 이전 사고 ({current_thought[:100]}...)를 기반으로 발전시키세요.
        - 진행 상황을 비판적으로 평가하세요: 이전 사고 수정, 결과 검증, 불확실성 표현, 계획에 문제가 있을 경우 접근 방식 변경 등.

        **수학 문제 해결을 위한 특별 지침:**
        1. 모든 수학적 표현은 반드시 LaTeX을 사용하세요. 예: $x^2 + y^2 = z^2$
        2. 계산 과정은 생략하지 말고 상세히 보여주세요.
        3. 논리적 단계마다 명확한 이유를 설명하세요.
        4. 가능하면 중간 검증 단계를 포함하세요.
        5. 증명 문제의 경우, 각 논리적 단계 사이의 연결을 분명히 보여주세요.
        6. 계산기처럼 근삿값(예: $\sqrt{2} \approx 1.414$)을 직접 계산하지 마세요.
        7. 사람이 일반적으로 하지 않는 복잡한 수치 계산(무리수, 소수점 근사 등)은 피하고, 수학적 성질과 논리적 변형을 통해 풀이하세요.
        8. 답은 기호(예: $\sqrt{2}$, $\pi$ 등)나 수식 형태로 남기세요.

        **응답 지침:**
        1. 단계 {thought_number}에 대한 사고와 행동을 명확히 설명하세요.
        2. 상태를 분석하고 해당하는 경우 *하나의* 키워드만 포함하세요:
           * `REVISE_THOUGHT_N`: 사고 단계 #N의 실행을 수정/개선하는 경우.
           * `BRANCH_FROM_N`: 사고 단계 #N에서 대안적 실행 경로를 탐색하는 경우.
           * `NEED_MORE_THOUGHTS`: 현재 예상({max_thoughts}단계)보다 더 많은 실행 단계가 필요한 경우.
           * `THOUGHT_COMPLETE`: 문제가 *완전히* 해결되고 최종 답변이 도출된 경우.
        3. 위의 키워드가 적용되지 않으면 사고/실행 단계만 제공하세요.
        4. 초기 분석이나 이전 사고 단계를 반복하지 마세요.
        5. 수학적 엄밀성과 정확성을 유지하세요.

        **사고 단계 {thought_number} 생성 (분기: {branch_id}):**
        """
        
        return prompt
    
    def _create_summary_prompt(
        self, 
        problem_text: str, 
        initial_analysis: str, 
        thoughts: List[Dict[str, Any]], 
        problem_type: Optional[str], 
        concept_formulas: str
    ) -> str:
        """최종 요약을 위한 프롬프트 생성"""
        
        summary_prompt = f"""
        초기 분석과 다음 단계별 사고 과정을 바탕으로, 원본 문제 '{problem_text}'에 대한 최종적이고 깔끔하며 간결한 설명 또는 해결책을 제공하세요.
        각 단계의 핵심 통찰을 통합하세요. 모든 수학적 공식은 LaTeX($inline$ 또는 $$block$$)를 사용해 표현하세요.

        **문제 유형:** {problem_type or '미지정'}

        **초기 분석:**
        {initial_analysis}

        **사고 과정 기록 (실행 단계):**
        """
        
        for thought in thoughts:
            branch_info = f"분기: {thought.get('branchId', 'main')}"
            revision_info = f"수정: 단계 {thought['revisesThought']}" if thought.get('isRevision') else ""
            complete_info = f"완료: {thought.get('isComplete', False)}"
            info = f"{branch_info}{', ' + revision_info if revision_info else ''}{', ' + complete_info if complete_info else ''}"
            
            summary_prompt += f"단계 {thought['thoughtNumber']} ({info}): {thought['thought']}\n\n"
        
        summary_prompt += """
        **최종 요약 지침:**
        - 반드시 아래 예시처럼 JSON 배열만 반환하세요. (불필요한 텍스트, 마크다운, 설명, 라벨 등 금지)
        - 각 content, hint 등 문자열 내부의 LaTeX 역슬래시(\)는 반드시 두 번(\\) 이스케이프해서 반환하세요. (예: $\\frac{1}{2}$)
        - 마지막 단계의 title은 반드시 '정답' 또는 '최종 요약'으로 하세요.
        - 한글 등 일반 텍스트는 반드시 수식($...$) 밖에 두세요.
        - $...$ 또는 \\(...\\) 안에는 수식(영문, 기호, 숫자 등)만 넣으세요.
        예시:
        [
          {"title": "문제 이해", "content": "삼각형 ABC에서 $\\overline{AB}=4\\text{cm}$, $\\overline{BC}=3\\text{cm}$, $\\angle B=30^\\circ$일 때, 삼각형의 넓이를 구하세요.", "hint": "$\\sin 30^\\circ = \\frac{1}{2}$ 임을 기억하세요."},
          {"title": "공식 적용", "content": "$\\text{넓이} = \\frac{1}{2} \\times 4 \\times 3 \\times \\sin 30^\\circ = 6 \\times \\sin 30^\\circ$"},
          {"title": "정답", "content": "삼각형 ABC의 넓이 $= 6 \\times \\frac{1}{2} = 3 \\text{cm}^2$"}
        ]
        """
        
        return summary_prompt
    
    def _calculate_sequential_confidence_score(
        self, 
        initial_analysis: str, 
        thoughts: List[Dict[str, Any]], 
        final_answer: str,
        is_complete: bool
    ) -> float:
        """Sequential Thinking 기반 자신감 점수 계산"""
        
        confidence = 0.6  # 기본값 (Sequential Thinking에서는 좀 더 높은 시작점)
        
        # 1. 초기 분석 품질
        if "유형" in initial_analysis and "주어진 정보" in initial_analysis and "구해야 할 것" in initial_analysis:
            confidence += 0.05
        
        # 2. 사고 단계 수 및 품질
        if len(thoughts) >= 3:  # 충분한 단계가 있음
            confidence += 0.05
            
            # 더 많은 단계는 더 높은 신뢰도를 의미할 수 있음 (최대 0.1 추가)
            confidence += min(0.1, (len(thoughts) - 3) * 0.02)
        
        # 3. 완료 상태 (완료 신호를 받았는지)
        if is_complete:
            confidence += 0.1
        
        # 4. LaTeX 사용 여부 체크
        latex_count = sum(thought['thought'].count("$") for thought in thoughts)
        if latex_count > 10:  # 충분한 수학적 표현
            confidence += 0.05
        
        # 5. 수정 및 분기 사용 (더 신중한 분석 의미)
        has_revisions = any(thought.get('isRevision') for thought in thoughts)
        has_branches = any(thought.get('branchFromThought') is not None for thought in thoughts)
        
        if has_revisions or has_branches:
            confidence += 0.05
        
        # 6. 최종 답변 품질
        if "답은" in final_answer and "$" in final_answer:
            confidence += 0.05
        
        # 자신감 점수 범위 조정 (0.6 ~ 1.0)
        return min(max(confidence, 0.6), 1.0)
    
    async def provide_solution_feedback(self, problem_id: str, rating: float, feedback_text: Optional[str] = None) -> bool:
        """해결책에 대한 사용자 피드백 제공"""
        try:
            # 평점 업데이트
            return self.vector_service.update_solution_rating(problem_id, rating)
        except Exception as e:
            logger.error(f"피드백 처리 오류: {str(e)}")
            return False
    
    async def _call_claude_api(self, prompt: str, max_tokens: int = 2000) -> str:
        """Claude API 호출"""
        try:
            messages = [{
                "role": "user",
                "content": prompt
            }]
            
            response = await self.client.messages.create(
                model="claude-3-5-sonnet-20240620",
                max_tokens=max_tokens,
                messages=messages
            )
            
            return response.content[0].text
                
        except Exception as e:
            logger.error(f"Claude API 호출 오류: {str(e)}")
            return f"API 호출 오류: {str(e)}"
    
    def _extract_solution_steps(self, solution_text: str) -> List[str]:
        """해결 과정에서 단계 추출"""
        # 줄바꿈 기준으로 분리
        lines = solution_text.split('\n')
        steps = []
        current_step = []
        in_step = False
        
        # 단계 감지 패턴
        step_patterns = [
            "단계", "Step", "step", "STEP", 
            "1.", "2.", "3.", "4.", "5.", "6.", "7.", "8.", "9.",
            "첫째,", "둘째,", "셋째,", "넷째,", "다섯째,", "여섯째,"
        ]
        
        for line in lines:
            # 새로운 단계 시작 감지
            is_new_step = False
            for pattern in step_patterns:
                if pattern in line and (pattern[0].isdigit() or pattern in ["단계", "Step", "step", "STEP"]):
                    is_new_step = True
                    break
            
            # 새 단계가 시작될 때 이전 단계를 저장하고 새 단계 시작
            if is_new_step and in_step and current_step:
                steps.append('\n'.join(current_step))
                current_step = [line]
                continue
            
            # 첫 단계 시작
            if is_new_step and not in_step:
                in_step = True
                current_step = [line]
                continue
            
            # 현재 단계에 라인 추가
            if in_step:
                current_step.append(line)
        
        # 마지막 단계 저장
        if in_step and current_step:
            steps.append('\n'.join(current_step))
        
        # 단계 분리가 제대로 되지 않았을 경우 문단 단위로 분리
        if not steps:
            paragraphs = solution_text.split('\n\n')
            for para in paragraphs:
                if para.strip():
                    steps.append(para.strip())
        
        # 결과가 없으면 전체 텍스트를 하나의 단계로
        if not steps:
            steps = [solution_text]
        
        return steps
    
    def _extract_related_concepts(self, analysis_text: str) -> List[str]:
        """분석 텍스트에서 관련 개념 추출"""
        concepts = []
        
        # 분석 텍스트에서 개념을 추출하는 시도
        concept_sections = [
            "개념", "공식", "정리", "법칙", "필요한 수학적 개념", "적용 가능한 개념"
        ]
        
        for section in concept_sections:
            if section in analysis_text:
                # 섹션이 있는 경우, 그 뒤의 텍스트에서 개념 추출 시도
                section_pos = analysis_text.find(section)
                if section_pos != -1:
                    section_text = analysis_text[section_pos:section_pos + 200]  # 제한된 길이만 검사
                    lines = section_text.split('\n')
                    for line in lines[1:5]:  # 섹션 이름 이후 최대 4줄만 검사
                        if line.strip() and ":" not in line and len(line.strip()) < 50:
                            for concept in line.strip().split(','):
                                concept = concept.strip()
                                if concept and concept not in concepts:
                                    concepts.append(concept)
        
        # 개념 섹션이 명확하지 않은 경우 전체 텍스트에서 키워드 추출
        if not concepts:
            keywords = [
                "피타고라스", "삼각형", "원", "사각형", "이차방정식", "미분", "적분",
                "인수분해", "함수", "삼각함수", "사인", "코사인", "탄젠트", "행렬",
                "벡터", "확률", "통계", "집합", "수열", "급수", "로그", "지수"
            ]
            
            for keyword in keywords:
                if keyword in analysis_text and keyword not in concepts:
                    concepts.append(keyword)
        
        return concepts[:5]  # 최대 5개 개념만 반환
    
    def _format_solution_as_text(self, solution: Dict[str, Any]) -> str:
        """해결책을 텍스트로 포맷팅"""
        text = f"문제: {solution['problem_text']}\n\n"
        text += "해결 과정:\n"
        
        for i, step in enumerate(solution['solution_steps'], 1):
            text += f"단계 {i}: {step}\n\n"
        
        text += f"최종 답: {solution['final_answer']}\n"
        text += f"신뢰도: {solution['confidence']:.2f}\n"
        
        if solution.get('related_concepts'):
            text += f"관련 개념: {', '.join(solution['related_concepts'])}\n"
        
        return text
    
    async def feedback_based_text_correction(
        self,
        problem_id: str,
        original_text: str,
        current_text: str,
        feedback_history: List[str],
        new_feedback: str,
        image_url: Optional[str] = None
    ) -> str:
        """자연어 피드백 기반 문제 텍스트 수정 (Claude API 호출)"""
        prompt = f"""
        아래는 수학 문제와 그에 대한 사용자 피드백입니다.\n\n\n- 원본 문제: {original_text}\n- 현재 문제 텍스트: {current_text}\n- 이전 피드백: {feedback_history}\n- 새 피드백: {new_feedback}\n{'- 참고 이미지: ' + image_url if image_url else ''}\n\n위의 정보를 반영하여 최종적으로 수정된 문제를 LaTeX로 반환해줘.\n- 반드시 전체 문제를 완성된 형태로 출력할 것\n- 수식은 $...$로 감싸서 LaTeX로 표현\n- 불필요한 설명 없이 문제 텍스트만 반환\n        """
        # ClaudeService를 통해 LLM 호출
        result = await self.claude_service.send_message(prompt, image=image_url)
        # ClaudeService의 send_message는 dict를 반환하므로, 텍스트만 추출
        if isinstance(result, dict) and "content" in result:
            return result["content"]
        return str(result)

    def _escape_latex_in_json_values(self, json_str: str) -> str:
        """content, hint, explanation 등 value 내부의 역슬래시를 모두 두 번 이스케이프"""
        def replacer(match):
            value = match.group(2)
            value = value.replace('\\', '\\\\')
            return f'{match.group(1)}"{value}"'
        fields = ["content", "hint", "explanation"]
        for field in fields:
            json_str = re.sub(rf'("{field}":\s?")([^"]*)"', replacer, json_str)
        return json_str

    def _normalize_quotes(self, json_str: str) -> str:
        """content, hint, explanation 등 value의 앞/뒤 이중 따옴표를 한 개로 정규화"""
        fields = ["content", "hint", "explanation"]
        for field in fields:
            # 앞쪽 이중 따옴표를 한 개로
            json_str = re.sub(rf'("{field}":\s*)""', rf'\1"', json_str)
            # 뒤쪽 이중 따옴표를 한 개로 (value 끝에만)
            json_str = re.sub(rf'("{field}":\s*"[^"]*)""(\s*[\,\}}])', rf'\1"\2', json_str)
        return json_str

    def _remove_double_quotes(self, json_str: str) -> str:
        """content, hint, explanation 등 value의 이중 따옴표를 한 번만 남기도록 후처리"""
        fields = ["content", "hint", "explanation"]
        for field in fields:
            json_str = re.sub(rf'("{field}": )""([^"]*)""', rf'\1"\2"', json_str)
        return json_str

    def postprocess_llm_response(self, text: str) -> str:
        """LLM 응답에서 JSON 배열만 추출, 파이썬 객체로 파싱 후 json.dumps로 직렬화 (역슬래시 2개 보장)"""
        import re
        import json
        # 1. JSON 배열만 추출
        match = re.search(r'\[.*\]', text, re.DOTALL)
        json_str = match.group(0) if match else text
        # 2. 파이썬 객체로 파싱
        try:
            obj = json.loads(json_str)
        except Exception as e:
            # 파싱 실패 시 원본 반환 (프론트에서 fallback)
            return json_str
        # 3. 다시 json.dumps로 직렬화 (역슬래시 2개로 자동 변환)
        return json.dumps(obj, ensure_ascii=False) 