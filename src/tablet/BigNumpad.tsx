import { useState, type ReactNode } from "react"
import { MdArrowForward, MdBackspace } from "react-icons/md";
import { cnw } from "../lib/tailwindUtil";

function NumpadButton({ children, onClick, className = "" }: { children: ReactNode, onClick: () => void, className?: string }) {
  return <button onClick={onClick} className={cnw("w-full aspect-square text-6xl rounded border border-gray-700 bg-gray-800 flex items-center justify-center", className)}>
    {children}
  </button>
}

export default function BigNumpad({defaultNumber, onSubmit}: { defaultNumber: number, onSubmit: (num: number) => void }) {
  const [num, setNumber] = useState<number>(defaultNumber);

  return <div className="rounded-xl border border-gray-700 bg-gray-900 p-6 w-120 max-h-full aspect-5/8" style={{ fontFamily: "JetBrains Mono" }}>
    <input 
      className="w-full text-9xl my-6 mt-2 text-center"
      type="number" 
      value={num} 
      onChange={(e) => {
        if (e.target.valueAsNumber) {
          setNumber(e.target.valueAsNumber)
          e.target.value = e.target.valueAsNumber.toString()
        } else {
          setNumber(0)
        }
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter")
          onSubmit(num);
      }}
    />
    <div className="grid grid-cols-3 gap-4">
      {Array.apply(null, Array(9)).map((_, index) => <NumpadButton onClick={() => setNumber((val) => val*10 + index+1)}>{index + 1}</NumpadButton>)}
      <NumpadButton onClick={() => setNumber((val) => Math.floor(val/10))} className="bg-red-500!"><MdBackspace /></NumpadButton>
      <NumpadButton onClick={() => setNumber((val) => val*10)}>0</NumpadButton>
      <NumpadButton onClick={() => onSubmit(num)} className="bg-blue-500!"><MdArrowForward /></NumpadButton>
    </div>
  </div>
}