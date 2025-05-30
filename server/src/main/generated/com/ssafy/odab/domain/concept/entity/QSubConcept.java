package com.ssafy.odab.domain.concept.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QSubConcept is a Querydsl query type for SubConcept
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QSubConcept extends EntityPathBase<SubConcept> {

    private static final long serialVersionUID = 1646634452L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QSubConcept subConcept = new QSubConcept("subConcept");

    public final StringPath conceptContent = createString("conceptContent");

    public final NumberPath<Integer> conceptOrder = createNumber("conceptOrder", Integer.class);

    public final StringPath conceptType = createString("conceptType");

    public final QGradeLevel gradeLevel;

    public final NumberPath<Integer> id = createNumber("id", Integer.class);

    public final ListPath<com.ssafy.odab.domain.learning.entity.LastLearningTime, com.ssafy.odab.domain.learning.entity.QLastLearningTime> lastLearningTimes = this.<com.ssafy.odab.domain.learning.entity.LastLearningTime, com.ssafy.odab.domain.learning.entity.QLastLearningTime>createList("lastLearningTimes", com.ssafy.odab.domain.learning.entity.LastLearningTime.class, com.ssafy.odab.domain.learning.entity.QLastLearningTime.class, PathInits.DIRECT2);

    public final QMajorConcept majorConcept;

    public final ListPath<QuestionConcept, QQuestionConcept> questionConcepts = this.<QuestionConcept, QQuestionConcept>createList("questionConcepts", QuestionConcept.class, QQuestionConcept.class, PathInits.DIRECT2);

    public QSubConcept(String variable) {
        this(SubConcept.class, forVariable(variable), INITS);
    }

    public QSubConcept(Path<? extends SubConcept> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QSubConcept(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QSubConcept(PathMetadata metadata, PathInits inits) {
        this(SubConcept.class, metadata, inits);
    }

    public QSubConcept(Class<? extends SubConcept> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.gradeLevel = inits.isInitialized("gradeLevel") ? new QGradeLevel(forProperty("gradeLevel")) : null;
        this.majorConcept = inits.isInitialized("majorConcept") ? new QMajorConcept(forProperty("majorConcept"), inits.get("majorConcept")) : null;
    }

}

