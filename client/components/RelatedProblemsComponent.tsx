import React from 'react';

interface RelatedProblemsComponentProps {
  subConceptId: string;
}

const RelatedProblemsComponent = ({ subConceptId }: RelatedProblemsComponentProps) => {
  return (
    <div>
      <h1>관련 문제 목록</h1>
      <p>서브 컨셉 ID: {subConceptId}</p>
    </div>
  );
};

export default RelatedProblemsComponent; 