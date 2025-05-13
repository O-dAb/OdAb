package com.ssafy.odab.domain.concept.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QQuestionConcept is a Querydsl query type for QuestionConcept
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QQuestionConcept extends EntityPathBase<QuestionConcept> {

    private static final long serialVersionUID = 501362006L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QQuestionConcept questionConcept = new QQuestionConcept("questionConcept");

    public final NumberPath<Integer> id = createNumber("id", Integer.class);

    public final com.ssafy.odab.domain.question.entity.QQuestion question;

    public final QSubConcept subConcept;

    public QQuestionConcept(String variable) {
        this(QuestionConcept.class, forVariable(variable), INITS);
    }

    public QQuestionConcept(Path<? extends QuestionConcept> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QQuestionConcept(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QQuestionConcept(PathMetadata metadata, PathInits inits) {
        this(QuestionConcept.class, metadata, inits);
    }

    public QQuestionConcept(Class<? extends QuestionConcept> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.question = inits.isInitialized("question") ? new com.ssafy.odab.domain.question.entity.QQuestion(forProperty("question"), inits.get("question")) : null;
        this.subConcept = inits.isInitialized("subConcept") ? new QSubConcept(forProperty("subConcept"), inits.get("subConcept")) : null;
    }

}

