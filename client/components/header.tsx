import { CalculatorIcon as MathOperations } from "lucide-react"

export function Header() {
  return (
    <header className="bg-white border-b py-4 px-6">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MathOperations className="h-6 w-6 text-purple-600" />
          <span className="font-bold text-xl">수학 해결사</span>
        </div>
        <nav>
          <ul className="flex gap-6">
            <li className="font-medium">홈</li>
            <li className="font-medium text-gray-500 hover:text-gray-900">기록</li>
            <li className="font-medium text-gray-500 hover:text-gray-900">도움말</li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
