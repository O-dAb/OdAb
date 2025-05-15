package com.ssafy.odab.domain.concept.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QGradeLevel is a Querydsl query type for GradeLevel
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QGradeLevel extends EntityPathBase<GradeLevel> {

    private static final long serialVersionUID = -2000350279L;

    public static final QGradeLevel gradeLevel = new QGradeLevel("gradeLevel");

    public final NumberPath<Byte> grade = createNumber("grade", Byte.class);

    public final StringPath gradeName = createString("gradeName");

    public final NumberPath<Integer> id = createNumber("id", Integer.class);

    public final ListPath<MajorConcept, QMajorConcept> majorConcepts = this.<MajorConcept, QMajorConcept>createList("majorConcepts", MajorConcept.class, QMajorConcept.class, PathInits.DIRECT2);

    public final ListPath<SubConcept, QSubConcept> subConcepts = this.<SubConcept, QSubConcept>createList("subConcepts", SubConcept.class, QSubConcept.class, PathInits.DIRECT2);

    public QGradeLevel(String variable) {
        super(GradeLevel.class, forVariable(variable));
    }

    public QGradeLevel(Path<? extends GradeLevel> path) {
        super(path.getType(), path.getMetadata());
    }

    public QGradeLevel(PathMetadata metadata) {
        super(GradeLevel.class, metadata);
    }

}

