package com.ssafy.odab.domain.concept.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QMajorConcept is a Querydsl query type for MajorConcept
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QMajorConcept extends EntityPathBase<MajorConcept> {

    private static final long serialVersionUID = 658817339L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QMajorConcept majorConcept = new QMajorConcept("majorConcept");

    public final NumberPath<Integer> conceptOrder = createNumber("conceptOrder", Integer.class);

    public final StringPath conceptType = createString("conceptType");

    public final QGradeLevel gradeLevel;

    public final NumberPath<Integer> id = createNumber("id", Integer.class);

    public final ListPath<SubConcept, QSubConcept> subConcepts = this.<SubConcept, QSubConcept>createList("subConcepts", SubConcept.class, QSubConcept.class, PathInits.DIRECT2);

    public QMajorConcept(String variable) {
        this(MajorConcept.class, forVariable(variable), INITS);
    }

    public QMajorConcept(Path<? extends MajorConcept> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QMajorConcept(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QMajorConcept(PathMetadata metadata, PathInits inits) {
        this(MajorConcept.class, metadata, inits);
    }

    public QMajorConcept(Class<? extends MajorConcept> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.gradeLevel = inits.isInitialized("gradeLevel") ? new QGradeLevel(forProperty("gradeLevel")) : null;
    }

}

