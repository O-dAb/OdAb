package com.ssafy.odab.domain.question_result.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QQuestionResult is a Querydsl query type for QuestionResult
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QQuestionResult extends EntityPathBase<QuestionResult> {

    private static final long serialVersionUID = -327724515L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QQuestionResult questionResult = new QQuestionResult("questionResult");

    public final NumberPath<Integer> id = createNumber("id", Integer.class);

    public final BooleanPath isCorrect = createBoolean("isCorrect");

    public final com.ssafy.odab.domain.question.entity.QQuestion question;

    public final StringPath solutionImage = createString("solutionImage");

    public final DateTimePath<java.time.LocalDateTime> solvedAt = createDateTime("solvedAt", java.time.LocalDateTime.class);

    public final NumberPath<Integer> times = createNumber("times", Integer.class);

    public final com.ssafy.odab.domain.user.entity.QUser user;

    public QQuestionResult(String variable) {
        this(QuestionResult.class, forVariable(variable), INITS);
    }

    public QQuestionResult(Path<? extends QuestionResult> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QQuestionResult(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QQuestionResult(PathMetadata metadata, PathInits inits) {
        this(QuestionResult.class, metadata, inits);
    }

    public QQuestionResult(Class<? extends QuestionResult> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.question = inits.isInitialized("question") ? new com.ssafy.odab.domain.question.entity.QQuestion(forProperty("question"), inits.get("question")) : null;
        this.user = inits.isInitialized("user") ? new com.ssafy.odab.domain.user.entity.QUser(forProperty("user")) : null;
    }

}

