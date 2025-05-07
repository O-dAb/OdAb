package com.ssafy.odab.domain.learning.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QLastLearningDate is a Querydsl query type for LastLearningDate
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QLastLearningDate extends EntityPathBase<LastLearningDate> {

    private static final long serialVersionUID = 1230819062L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QLastLearningDate lastLearningDate1 = new QLastLearningDate("lastLearningDate1");

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final DatePath<java.time.LocalDate> lastLearningDate = createDate("lastLearningDate", java.time.LocalDate.class);

    public final com.ssafy.odab.domain.concept.entity.QSubConcept subConcept;

    public final com.ssafy.odab.domain.user.entity.QUser user;

    public QLastLearningDate(String variable) {
        this(LastLearningDate.class, forVariable(variable), INITS);
    }

    public QLastLearningDate(Path<? extends LastLearningDate> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QLastLearningDate(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QLastLearningDate(PathMetadata metadata, PathInits inits) {
        this(LastLearningDate.class, metadata, inits);
    }

    public QLastLearningDate(Class<? extends LastLearningDate> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.subConcept = inits.isInitialized("subConcept") ? new com.ssafy.odab.domain.concept.entity.QSubConcept(forProperty("subConcept"), inits.get("subConcept")) : null;
        this.user = inits.isInitialized("user") ? new com.ssafy.odab.domain.user.entity.QUser(forProperty("user")) : null;
    }

}

