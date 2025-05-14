package com.ssafy.odab.domain.question.service;

import com.ssafy.odab.domain.question.dto.RetryQuestionResponseDto;
import com.ssafy.odab.domain.question.dto.SubConceptRelatedQuestionResponseDto;
import com.ssafy.odab.domain.question.dto.VerifyAnswerRequestDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface QuestionService {

    Boolean verifyAnswer(VerifyAnswerRequestDto verifyAnswerRequestDto);

    RetryQuestionResponseDto findRetryQuestionByQuestionId(Integer questionId);

    Page<SubConceptRelatedQuestionResponseDto> findSubConceptRelatedQuestionBySubConceptId(Integer subConceptId, Pageable pageable);
}
