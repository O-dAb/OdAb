package com.ssafy.odab.domain.solution.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QSolution is a Querydsl query type for Solution
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QSolution extends EntityPathBase<Solution> {

    private static final long serialVersionUID = 471770920L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QSolution solution = new QSolution("solution");

    public final DateTimePath<java.time.LocalDateTime> drawingLastModified = createDateTime("drawingLastModified", java.time.LocalDateTime.class);

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final com.ssafy.odab.domain.question.entity.QQuestion question;

    public final StringPath solutionImg = createString("solutionImg");

    public final com.ssafy.odab.domain.user.entity.QUser user;

    public QSolution(String variable) {
        this(Solution.class, forVariable(variable), INITS);
    }

    public QSolution(Path<? extends Solution> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QSolution(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QSolution(PathMetadata metadata, PathInits inits) {
        this(Solution.class, metadata, inits);
    }

    public QSolution(Class<? extends Solution> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.question = inits.isInitialized("question") ? new com.ssafy.odab.domain.question.entity.QQuestion(forProperty("question"), inits.get("question")) : null;
        this.user = inits.isInitialized("user") ? new com.ssafy.odab.domain.user.entity.QUser(forProperty("user")) : null;
    }

}

