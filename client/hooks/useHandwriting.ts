// hooks/useHandwriting.ts
'use client';

import { useState, useCallback } from 'react';

type HandwritingMode = 'pen' | 'eraser' | 'select' | 'rect' | 'circle' | 'line' | 'text';

export const useHandwriting = () => {
  const [mode, setMode] = useState<HandwritingMode>('pen');
  const [penColor, setPenColor] = useState('#000000');
  const [penWidth, setPenWidth] = useState(3);
  const [isDrawingMode, setIsDrawingMode] = useState(true);
  const [addShapeFlag, setAddShapeFlag] = useState(0);

  // 필기모드 토글
  const toggleDrawingMode = useCallback((value: boolean) => {
    setIsDrawingMode(value);
    
    // 필기모드 전환 API 호출
    fetch('/api/v1/handwriting', {
      method: 'POST'
    })
    .then(response => response.json())
    .catch(error => {
      console.error('필기모드 전환 오류:', error);
    });
  }, []);

  // 캔버스 저장
  const saveCanvas = useCallback(async (dataURL: string) => {
    try {
      const response = await fetch('/api/v1/handwriting/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          handWritingImg: dataURL
        })
      });
      
      if (response.ok) {
        alert('필기가 성공적으로 저장되었습니다.');
        return true;
      } else {
        alert('저장 중 오류가 발생했습니다.');
        return false;
      }
    } catch (error) {
      console.error('캔버스 저장 오류:', error);
      alert('저장 중 오류가 발생했습니다.');
      return false;
    }
  }, []);

  // 수학 기호 삽입
  const insertMathSymbol = useCallback((symbol: string) => {
    // 이 함수는 canvas 객체에 직접 접근이 필요한데,
    // 여기서는 상태를 통해 HandwritingCanvas에 알려주는 역할만 함
    // 실제 기호 삽입은 HandwritingCanvas에서 처리
    setMode('text');
    // 약간의 트릭: 캔버스에 수학 기호를 직접 추가하는 신호
    setAddShapeFlag(prev => prev + 1);
  }, []);

  // 도형 추가 플래그
  const addShape = useCallback(() => {
    setAddShapeFlag(prev => prev + 1);
  }, []);

  return {
    mode,
    setMode,
    penColor,
    setPenColor,
    penWidth,
    setPenWidth,
    isDrawingMode,
    toggleDrawingMode,
    saveCanvas,
    insertMathSymbol,
    addShape,
    addShapeFlag
  };
};