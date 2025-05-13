'use client';
import React from 'react';
import { useHandwriting } from '@/hooks/useHandwriting';

type HandwritingMode = 'pen' | 'eraser' | 'select' | 'rect' | 'circle' | 'line' | 'text';

const mathSymbols = ['π', '∞', '∫', '∑', '∏', '√', '≠', '≤', '≥', '±', '÷', '×', '∂', '∇', '∈', '∀', '∃', 'θ', 'α', 'β'];

interface HandwritingControlsProps {
  className?: string;
}

const HandwritingControls = ({ className = '' }: HandwritingControlsProps) => {
  const { 
    mode, 
    setMode, 
    penColor, 
    setPenColor, 
    penWidth, 
    setPenWidth,
    toggleDrawingMode,
    insertMathSymbol,
    addShape
  } = useHandwriting();

  // 모드 변경 핸들러
  const handleModeChange = (newMode: HandwritingMode) => {
    setMode(newMode);
    
    if (newMode === 'pen') {
      toggleDrawingMode(true);
    } else {
      toggleDrawingMode(false);
    }

    if (newMode === 'rect' || newMode === 'circle' || newMode === 'line' || newMode === 'text') {
      addShape();
    }
  };

  // 수학 기호 삽입 핸들러
  const handleMathSymbolClick = (symbol: string) => {
    insertMathSymbol(symbol);
  };

  return (
    <div className={`handwriting-controls p-4 bg-gray-100 rounded-lg ${className}`}>
      <div className="modes flex flex-wrap gap-2 mb-4">
        <button
          className={`tool-btn p-2 rounded ${mode === 'pen' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => handleModeChange('pen')}
        >
          펜
        </button>
        <button
          className={`tool-btn p-2 rounded ${mode === 'eraser' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => handleModeChange('eraser')}
        >
          지우개
        </button>
        <button
          className={`tool-btn p-2 rounded ${mode === 'select' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => handleModeChange('select')}
        >
          선택
        </button>
        <button
          className={`tool-btn p-2 rounded ${mode === 'rect' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => handleModeChange('rect')}
        >
          사각형
        </button>
        <button
          className={`tool-btn p-2 rounded ${mode === 'circle' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => handleModeChange('circle')}
        >
          원
        </button>
        <button
          className={`tool-btn p-2 rounded ${mode === 'line' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => handleModeChange('line')}
        >
          직선
        </button>
        <button
          className={`tool-btn p-2 rounded ${mode === 'text' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => handleModeChange('text')}
        >
          텍스트
        </button>
      </div>

      <div className="settings mb-4">
        <div className="flex items-center mb-2">
          <label className="mr-2">펜 두께:</label>
          <select
            value={penWidth}
            onChange={(e) => setPenWidth(parseInt(e.target.value))}
            className="border rounded p-1"
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="5">5</option>
            <option value="8">8</option>
          </select>
        </div>

        <div className="flex items-center">
          <label className="mr-2">펜 색상:</label>
          <input
            type="color"
            value={penColor}
            onChange={(e) => setPenColor(e.target.value)}
            className="border rounded p-1 w-12 h-8"
          />
        </div>
      </div>

      <div className="math-symbols">
        <h3 className="text-sm font-semibold mb-2">수학 기호:</h3>
        <div className="flex flex-wrap gap-2">
          {mathSymbols.map((symbol) => (
            <button
              key={symbol}
              className="symbol-btn w-8 h-8 flex items-center justify-center bg-white border rounded hover:bg-gray-100"
              onClick={() => handleMathSymbolClick(symbol)}
            >
              {symbol}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HandwritingControls;