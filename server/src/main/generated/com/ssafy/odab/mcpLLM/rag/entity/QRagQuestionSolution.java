package com.ssafy.odab.mcpLLM.rag.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QRagQuestionSolution is a Querydsl query type for RagQuestionSolution
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QRagQuestionSolution extends EntityPathBase<RagQuestionSolution> {

    private static final long serialVersionUID = -939232212L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QRagQuestionSolution ragQuestionSolution = new QRagQuestionSolution("ragQuestionSolution");

    public final NumberPath<Integer> id = createNumber("id", Integer.class);

    public final QRagQuestion question;

    public final StringPath solutionContent = createString("solutionContent");

    public final NumberPath<Byte> step = createNumber("step", Byte.class);

    public QRagQuestionSolution(String variable) {
        this(RagQuestionSolution.class, forVariable(variable), INITS);
    }

    public QRagQuestionSolution(Path<? extends RagQuestionSolution> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QRagQuestionSolution(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QRagQuestionSolution(PathMetadata metadata, PathInits inits) {
        this(RagQuestionSolution.class, metadata, inits);
    }

    public QRagQuestionSolution(Class<? extends RagQuestionSolution> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.question = inits.isInitialized("question") ? new QRagQuestion(forProperty("question")) : null;
    }

}

