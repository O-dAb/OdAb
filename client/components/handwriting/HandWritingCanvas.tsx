'use client';

import React, { useEffect, useRef, useState } from 'react';
import fabric from 'fabric';
import { useHandwriting } from '@/hooks/useHandwriting';

interface HandwritingCanvasProps {
  width?: number;
  height?: number;
  className?: string;
}

const HandwritingCanvas = ({ 
  width = 800, 
  height = 600, 
  className = '' 
}: HandwritingCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const { 
    penColor, 
    penWidth, 
    mode, 
    saveCanvas, 
    toggleDrawingMode,
    addShape
  } = useHandwriting();

  // 캔버스 초기화
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      isDrawingMode: false,
      backgroundColor: 'white',
      width,
      height
    });

    fabricCanvasRef.current = canvas;

    // 브러시 설정
    (canvas.freeDrawingBrush as fabric.BaseBrush).color = penColor;
    (canvas.freeDrawingBrush as fabric.BaseBrush).width = penWidth;

    // 클린업 함수
    return () => {
      canvas.dispose();
    };
  }, []);

  // 펜 설정 변경 시 적용
  useEffect(() => {
    if (!fabricCanvasRef.current) return;
    
    (fabricCanvasRef.current.freeDrawingBrush as fabric.BaseBrush).color = penColor;
    (fabricCanvasRef.current.freeDrawingBrush as fabric.BaseBrush).width = penWidth;
  }, [penColor, penWidth]);

  // 모드 변경 시 처리
  useEffect(() => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;

    switch (mode) {
      case 'pen':
        toggleDrawingMode(true);
        break;
      case 'select':
        toggleDrawingMode(false);
        break;
      case 'eraser':
        // 개별 선택된 객체 삭제 모드
        toggleDrawingMode(false);
        break;
      case 'rect':
      case 'circle':
      case 'line':
      case 'text':
        toggleDrawingMode(false);
        break;
      default:
        break;
    }
  }, [mode]);

  // 드로잉 모드 토글
  useEffect(() => {
    if (!fabricCanvasRef.current) return;
    
    fabricCanvasRef.current.isDrawingMode = isDrawingMode;
    setIsDrawingMode(isDrawingMode);
  }, [isDrawingMode]);

  // 선택 취소 함수
  const clearSelection = () => {
    if (!fabricCanvasRef.current) return;
    fabricCanvasRef.current.discardActiveObject();
    fabricCanvasRef.current.requestRenderAll();
  };

  // 전체 지우기 함수
  const clearCanvas = async () => {
    if (!fabricCanvasRef.current) return;
    
    if (confirm('모든 내용을 지우시겠습니까?')) {
      fabricCanvasRef.current.clear();
      fabricCanvasRef.current.backgroundColor = 'white';
      fabricCanvasRef.current.renderAll();
      
      try {
        const response = await fetch('/api/v1/handwriting/erase', {
          method: 'POST'
        });
        
        if (response.ok) {
          console.log('캔버스가 초기화되었습니다.');
        }
      } catch (error) {
        console.error('캔버스 초기화 중 오류가 발생했습니다.', error);
      }
    }
  };

  // 모양 추가 함수
  const handleAddShape = () => {
    if (!fabricCanvasRef.current) return;
    
    if (mode === 'rect') {
      const rect = new fabric.Rect({
        left: width / 2 - 50,
        top: height / 2 - 50,
        width: 100,
        height: 100,
        fill: 'transparent',
        stroke: penColor,
        strokeWidth: penWidth
      });
      
      fabricCanvasRef.current.add(rect);
      fabricCanvasRef.current.setActiveObject(rect);
    } else if (mode === 'circle') {
      const circle = new fabric.Circle({
        left: width / 2 - 50,
        top: height / 2 - 50,
        radius: 50,
        fill: 'transparent',
        stroke: penColor,
        strokeWidth: penWidth
      });
      
      fabricCanvasRef.current.add(circle);
      fabricCanvasRef.current.setActiveObject(circle);
    } else if (mode === 'line') {
      const line = new fabric.Line([
        width / 2 - 50, height / 2,
        width / 2 + 50, height / 2
      ], {
        stroke: penColor,
        strokeWidth: penWidth
      });
      
      fabricCanvasRef.current.add(line);
      fabricCanvasRef.current.setActiveObject(line);
    } else if (mode === 'text') {
      const text = new fabric.IText('텍스트를 입력하세요', {
        left: width / 2 - 50,
        top: height / 2 - 10,
        fontFamily: 'Cambria Math, serif',
        fontSize: 20,
        fill: penColor
      });
      
      fabricCanvasRef.current.add(text);
      fabricCanvasRef.current.setActiveObject(text);
      text.enterEditing();
    }
    
    fabricCanvasRef.current.renderAll();
  };

  // 저장 핸들러
  const handleSave = async () => {
    if (!fabricCanvasRef.current) return;
    
    try {
      const dataURL = fabricCanvasRef.current.toDataURL({
        format: 'png',
        quality: 1.0,
        multiplier: 1
      });
      
      await saveCanvas(dataURL);
    } catch (error) {
      console.error('캔버스 저장 중 오류가 발생했습니다.', error);
    }
  };

  // 모양 추가 버튼 클릭 핸들러
  useEffect(() => {
    if (mode === 'rect' || mode === 'circle' || mode === 'line' || mode === 'text') {
      handleAddShape();
    }
  }, [addShape]);

  return (
    <div className="handwriting-canvas-container">
      <canvas ref={canvasRef} className={className} />
      <div className="handwriting-actions mt-4 flex space-x-2">
        <button
          className="px-4 py-2 bg-red-500 text-white rounded"
          onClick={clearCanvas}
        >
          모두 지우기
        </button>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={handleSave}
        >
          저장
        </button>
      </div>
    </div>
  );
};

export default HandwritingCanvas;