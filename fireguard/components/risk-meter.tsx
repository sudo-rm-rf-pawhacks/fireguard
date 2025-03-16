"use client"

import { useEffect, useState } from "react"

interface RiskMeterProps {
  value: number
}

export function RiskMeter({ value }: RiskMeterProps) {
  const [mounted, setMounted] = useState(false)

  // Ensure we only render the meter after component mount to avoid hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  // Calculate the position of the pointer (0-100%)
  const pointerPosition = `${value}%`

  // Determine risk level text based on value
  const getRiskLevelText = () => {
    if (value < 20) return "Low Risk"
    if (value < 50) return "Moderate Risk"
    if (value < 75) return "High Risk"
    return "Extreme Risk"
  }

  // Determine risk level color based on value
  const getRiskColor = () => {
    if (value < 20) return "text-green-600"
    if (value < 50) return "text-yellow-600"
    if (value < 75) return "text-orange-600"
    return "text-red-600"
  }

  if (!mounted) return null

  return (
    <div className="space-y-4">
      {/* Risk level text */}
      <div className="text-center">
        <span className={`text-sm font-medium ${getRiskColor()}`}>{getRiskLevelText()}</span>
      </div>

      {/* Meter container */}
      <div className="relative h-14 w-full">
        {/* Gradient background */}
        <div
          className="absolute inset-x-0 top-0 h-3 rounded-full overflow-hidden shadow-inner"
          style={{
            background:
              "linear-gradient(to right, #4ade80 0%, #4ade80 20%, #facc15 20%, #facc15 50%, #f97316 50%, #f97316 75%, #dc2626 75%, #dc2626 100%)",
          }}
        >
          {/* Tick marks */}
          <div className="absolute inset-0 flex justify-between px-[1px]">
            <div className="h-1.5 w-px bg-white/30"></div>
            <div className="h-1.5 w-px bg-white/30"></div>
            <div className="h-1.5 w-px bg-white/30"></div>
            <div className="h-1.5 w-px bg-white/30"></div>
            <div className="h-1.5 w-px bg-white/30"></div>
          </div>
        </div>

        {/* Pointer */}
        <div className="absolute top-0 -ml-2.5 transition-all duration-500 ease-out" style={{ left: pointerPosition }}>
          <div className="flex flex-col items-center">
            <div className="h-7 w-5 flex justify-center">
              <div className="h-7 w-0.5 bg-gray-800"></div>
            </div>
            <div className="h-4 w-4 rounded-full bg-gray-800 shadow-md flex items-center justify-center">
              <div className="h-2 w-2 rounded-full bg-white"></div>
            </div>
            <div className="mt-1 bg-gray-800 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[40px] text-center">
              {value}%
            </div>
          </div>
        </div>

        {/* Labels */}
        <div className="absolute top-4 left-0 right-0 flex justify-between text-[10px] text-gray-600 pt-2">
          <span>0%</span>
          <span>25%</span>
          <span>50%</span>
          <span>75%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Risk level labels */}
      <div className="flex justify-between text-xs text-gray-600 px-1">
        <span className="text-green-600 font-medium">Low</span>
        <span className="text-yellow-600 font-medium">Moderate</span>
        <span className="text-orange-600 font-medium">High</span>
        <span className="text-red-600 font-medium">Extreme</span>
      </div>
    </div>
  )
}

