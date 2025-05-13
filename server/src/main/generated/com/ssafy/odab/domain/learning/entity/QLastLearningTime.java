package com.ssafy.odab.domain.learning.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QLastLearningTime is a Querydsl query type for LastLearningTime
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QLastLearningTime extends EntityPathBase<LastLearningTime> {

    private static final long serialVersionUID = 1231303189L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QLastLearningTime lastLearningTime = new QLastLearningTime("lastLearningTime");

    public final NumberPath<Integer> id = createNumber("id", Integer.class);

    public final DateTimePath<java.time.LocalDateTime> lastLearningDate = createDateTime("lastLearningDate", java.time.LocalDateTime.class);

    public final com.ssafy.odab.domain.concept.entity.QSubConcept subConcept;

    public final com.ssafy.odab.domain.user.entity.QUser user;

    public QLastLearningTime(String variable) {
        this(LastLearningTime.class, forVariable(variable), INITS);
    }

    public QLastLearningTime(Path<? extends LastLearningTime> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QLastLearningTime(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QLastLearningTime(PathMetadata metadata, PathInits inits) {
        this(LastLearningTime.class, metadata, inits);
    }

    public QLastLearningTime(Class<? extends LastLearningTime> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.subConcept = inits.isInitialized("subConcept") ? new com.ssafy.odab.domain.concept.entity.QSubConcept(forProperty("subConcept"), inits.get("subConcept")) : null;
        this.user = inits.isInitialized("user") ? new com.ssafy.odab.domain.user.entity.QUser(forProperty("user")) : null;
    }

}

