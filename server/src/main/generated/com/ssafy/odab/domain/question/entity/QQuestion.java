package com.ssafy.odab.domain.question.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QQuestion is a Querydsl query type for Question
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QQuestion extends EntityPathBase<Question> {

    private static final long serialVersionUID = 2080377346L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QQuestion question = new QQuestion("question");

    public final StringPath answer = createString("answer");

    public final NumberPath<Integer> level = createNumber("level", Integer.class);

    public final NumberPath<Long> questionId = createNumber("questionId", Long.class);

    public final StringPath questionImg = createString("questionImg");

    public final ListPath<com.ssafy.odab.domain.question_result.entity.QuestionResult, com.ssafy.odab.domain.question_result.entity.QQuestionResult> questionResults = this.<com.ssafy.odab.domain.question_result.entity.QuestionResult, com.ssafy.odab.domain.question_result.entity.QQuestionResult>createList("questionResults", com.ssafy.odab.domain.question_result.entity.QuestionResult.class, com.ssafy.odab.domain.question_result.entity.QQuestionResult.class, PathInits.DIRECT2);

    public final StringPath questionSolution = createString("questionSolution");

    public final StringPath questionText = createString("questionText");

    public final DatePath<java.time.LocalDate> regitAt = createDate("regitAt", java.time.LocalDate.class);

    public final ListPath<com.ssafy.odab.domain.solution.entity.Solution, com.ssafy.odab.domain.solution.entity.QSolution> solutions = this.<com.ssafy.odab.domain.solution.entity.Solution, com.ssafy.odab.domain.solution.entity.QSolution>createList("solutions", com.ssafy.odab.domain.solution.entity.Solution.class, com.ssafy.odab.domain.solution.entity.QSolution.class, PathInits.DIRECT2);

    public final com.ssafy.odab.domain.concept.entity.QSubConcept subConcept;

    public final com.ssafy.odab.domain.user.entity.QUser user;

    public QQuestion(String variable) {
        this(Question.class, forVariable(variable), INITS);
    }

    public QQuestion(Path<? extends Question> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QQuestion(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QQuestion(PathMetadata metadata, PathInits inits) {
        this(Question.class, metadata, inits);
    }

    public QQuestion(Class<? extends Question> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.subConcept = inits.isInitialized("subConcept") ? new com.ssafy.odab.domain.concept.entity.QSubConcept(forProperty("subConcept"), inits.get("subConcept")) : null;
        this.user = inits.isInitialized("user") ? new com.ssafy.odab.domain.user.entity.QUser(forProperty("user")) : null;
    }

}

