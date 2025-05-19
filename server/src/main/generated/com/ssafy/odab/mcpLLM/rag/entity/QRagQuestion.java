package com.ssafy.odab.mcpLLM.rag.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QRagQuestion is a Querydsl query type for RagQuestion
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QRagQuestion extends EntityPathBase<RagQuestion> {

    private static final long serialVersionUID = 398853523L;

    public static final QRagQuestion ragQuestion = new QRagQuestion("ragQuestion");

    public final StringPath answer = createString("answer");

    public final NumberPath<Integer> id = createNumber("id", Integer.class);

    public final ListPath<RagQuestionSolution, QRagQuestionSolution> questionSolutions = this.<RagQuestionSolution, QRagQuestionSolution>createList("questionSolutions", RagQuestionSolution.class, QRagQuestionSolution.class, PathInits.DIRECT2);

    public final StringPath questionText = createString("questionText");

    public QRagQuestion(String variable) {
        super(RagQuestion.class, forVariable(variable));
    }

    public QRagQuestion(Path<? extends RagQuestion> path) {
        super(path.getType(), path.getMetadata());
    }

    public QRagQuestion(PathMetadata metadata) {
        super(RagQuestion.class, metadata);
    }

}

