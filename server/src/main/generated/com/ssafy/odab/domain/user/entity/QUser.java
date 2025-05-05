package com.ssafy.odab.domain.user.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QUser is a Querydsl query type for User
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QUser extends EntityPathBase<User> {

    private static final long serialVersionUID = 1706589388L;

    public static final QUser user = new QUser("user");

    public final DateTimePath<java.time.LocalDateTime> createdAt = createDateTime("createdAt", java.time.LocalDateTime.class);

    public final NumberPath<Integer> grade = createNumber("grade", Integer.class);

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final NumberPath<Long> kakaoId = createNumber("kakaoId", Long.class);

    public final ListPath<com.ssafy.odab.domain.learning.entity.LastLearningDate, com.ssafy.odab.domain.learning.entity.QLastLearningDate> lastLearningDates = this.<com.ssafy.odab.domain.learning.entity.LastLearningDate, com.ssafy.odab.domain.learning.entity.QLastLearningDate>createList("lastLearningDates", com.ssafy.odab.domain.learning.entity.LastLearningDate.class, com.ssafy.odab.domain.learning.entity.QLastLearningDate.class, PathInits.DIRECT2);

    public final StringPath profileUrl = createString("profileUrl");

    public final ListPath<com.ssafy.odab.domain.question_result.entity.QuestionResult, com.ssafy.odab.domain.question_result.entity.QQuestionResult> questionResults = this.<com.ssafy.odab.domain.question_result.entity.QuestionResult, com.ssafy.odab.domain.question_result.entity.QQuestionResult>createList("questionResults", com.ssafy.odab.domain.question_result.entity.QuestionResult.class, com.ssafy.odab.domain.question_result.entity.QQuestionResult.class, PathInits.DIRECT2);

    public final ListPath<com.ssafy.odab.domain.question.entity.Question, com.ssafy.odab.domain.question.entity.QQuestion> questions = this.<com.ssafy.odab.domain.question.entity.Question, com.ssafy.odab.domain.question.entity.QQuestion>createList("questions", com.ssafy.odab.domain.question.entity.Question.class, com.ssafy.odab.domain.question.entity.QQuestion.class, PathInits.DIRECT2);

    public final ListPath<com.ssafy.odab.domain.solution.entity.Solution, com.ssafy.odab.domain.solution.entity.QSolution> solutions = this.<com.ssafy.odab.domain.solution.entity.Solution, com.ssafy.odab.domain.solution.entity.QSolution>createList("solutions", com.ssafy.odab.domain.solution.entity.Solution.class, com.ssafy.odab.domain.solution.entity.QSolution.class, PathInits.DIRECT2);

    public final StringPath userName = createString("userName");

    public QUser(String variable) {
        super(User.class, forVariable(variable));
    }

    public QUser(Path<? extends User> path) {
        super(path.getType(), path.getMetadata());
    }

    public QUser(PathMetadata metadata) {
        super(User.class, metadata);
    }

}

