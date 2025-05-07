"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Eraser, Pencil, Save, Trash2, Undo } from "lucide-react"
import { Slider } from "@/components/ui/slider"

export function DrawingBoard() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null)
  const [color, setColor] = useState("#000000")
  const [lineWidth, setLineWidth] = useState(2)
  const [tool, setTool] = useState<"pencil" | "eraser">("pencil")
  const [history, setHistory] = useState<ImageData[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  // 캔버스 초기화
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // 캔버스 크기 설정
    const resizeCanvas = () => {
      const parent = canvas.parentElement
      if (!parent) return

      canvas.width = parent.clientWidth
      canvas.height = 400

      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.fillStyle = "#ffffff"
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        setContext(ctx)

        // 초기 상태 저장
        const initialState = ctx.getImageData(0, 0, canvas.width, canvas.height)
        setHistory([initialState])
        setHistoryIndex(0)
      }
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  // 그리기 시작
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!context || !canvasRef.current) return

    setIsDrawing(true)

    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()

    let clientX, clientY

    if ("touches" in e) {
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    } else {
      clientX = e.clientX
      clientY = e.clientY
    }

    context.beginPath()
    context.moveTo(clientX - rect.left, clientY - rect.top)

    // 이벤트 기본 동작 방지
    e.preventDefault()
  }

  // 그리기
  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !context || !canvasRef.current) return

    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()

    let clientX, clientY

    if ("touches" in e) {
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    } else {
      clientX = e.clientX
      clientY = e.clientY
    }

    context.lineTo(clientX - rect.left, clientY - rect.top)

    context.strokeStyle = tool === "pencil" ? color : "#ffffff"
    context.lineWidth = tool === "pencil" ? lineWidth : lineWidth * 3
    context.lineCap = "round"
    context.lineJoin = "round"
    context.stroke()

    // 이벤트 기본 동작 방지
    e.preventDefault()
  }

  // 그리기 종료
  const stopDrawing = () => {
    if (!isDrawing || !context || !canvasRef.current) return

    context.closePath()
    setIsDrawing(false)

    // 현재 상태 저장
    const canvas = canvasRef.current
    const currentState = context.getImageData(0, 0, canvas.width, canvas.height)

    // 히스토리 업데이트
    const newHistory = [...history.slice(0, historyIndex + 1), currentState]
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }

  // 실행 취소
  const undo = () => {
    if (historyIndex <= 0 || !context || !canvasRef.current) return

    const newIndex = historyIndex - 1
    setHistoryIndex(newIndex)

    const canvas = canvasRef.current
    context.putImageData(history[newIndex], 0, 0)
  }

  // 모두 지우기
  const clearCanvas = () => {
    if (!context || !canvasRef.current) return

    const canvas = canvasRef.current
    context.fillStyle = "#ffffff"
    context.fillRect(0, 0, canvas.width, canvas.height)

    // 초기 상태 저장
    const clearedState = context.getImageData(0, 0, canvas.width, canvas.height)
    setHistory([...history, clearedState])
    setHistoryIndex(history.length)
  }

  // 저장하기
  const saveDrawing = () => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const dataUrl = canvas.toDataURL("image/png")

    const link = document.createElement("a")
    link.download = `math-note-${new Date().toISOString().slice(0, 10)}.png`
    link.href = dataUrl
    link.click()
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>메모장</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="border rounded-md bg-white">
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="touch-none w-full cursor-crosshair"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="flex justify-between w-full">
            <div className="flex gap-2">
              <Button variant={tool === "pencil" ? "default" : "outline"} size="icon" onClick={() => setTool("pencil")}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant={tool === "eraser" ? "default" : "outline"} size="icon" onClick={() => setTool("eraser")}>
                <Eraser className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={undo} disabled={historyIndex <= 0}>
                <Undo className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={clearCanvas}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <Button variant="outline" size="icon" onClick={saveDrawing}>
              <Save className="h-4 w-4" />
            </Button>
          </div>

          {tool === "pencil" && (
            <div className="w-full space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">색상</span>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-8 h-8 p-0 border-0"
                />
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm">굵기</span>
                <Slider
                  value={[lineWidth]}
                  min={1}
                  max={10}
                  step={1}
                  onValueChange={(value) => setLineWidth(value[0])}
                  className="flex-1"
                />
                <span className="text-sm font-medium w-6 text-center">{lineWidth}</span>
              </div>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
