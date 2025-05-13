package com.ssafy.odab.domain.question.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QQuestionSolution is a Querydsl query type for QuestionSolution
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QQuestionSolution extends EntityPathBase<QuestionSolution> {

    private static final long serialVersionUID = -1381590629L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QQuestionSolution questionSolution = new QQuestionSolution("questionSolution");

    public final NumberPath<Integer> id = createNumber("id", Integer.class);

    public final QQuestion question;

    public final StringPath solution = createString("solution");

    public final StringPath solutionContent = createString("solutionContent");

    public final NumberPath<Byte> step = createNumber("step", Byte.class);

    public QQuestionSolution(String variable) {
        this(QuestionSolution.class, forVariable(variable), INITS);
    }

    public QQuestionSolution(Path<? extends QuestionSolution> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QQuestionSolution(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QQuestionSolution(PathMetadata metadata, PathInits inits) {
        this(QuestionSolution.class, metadata, inits);
    }

    public QQuestionSolution(Class<? extends QuestionSolution> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.question = inits.isInitialized("question") ? new QQuestion(forProperty("question"), inits.get("question")) : null;
    }

}

