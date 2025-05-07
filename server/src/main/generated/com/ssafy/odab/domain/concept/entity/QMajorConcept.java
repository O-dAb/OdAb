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

    public static final QMajorConcept majorConcept = new QMajorConcept("majorConcept");

    public final NumberPath<Integer> conceptOrder = createNumber("conceptOrder", Integer.class);

    public final StringPath conceptType = createString("conceptType");

    public final NumberPath<Integer> grade = createNumber("grade", Integer.class);

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final ListPath<SubConcept, QSubConcept> subConcepts = this.<SubConcept, QSubConcept>createList("subConcepts", SubConcept.class, QSubConcept.class, PathInits.DIRECT2);

    public QMajorConcept(String variable) {
        super(MajorConcept.class, forVariable(variable));
    }

    public QMajorConcept(Path<? extends MajorConcept> path) {
        super(path.getType(), path.getMetadata());
    }

    public QMajorConcept(PathMetadata metadata) {
        super(MajorConcept.class, metadata);
    }

}

