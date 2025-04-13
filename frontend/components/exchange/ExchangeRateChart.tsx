"use client"

import { useEffect, useRef } from "react"

export default function ExchangeRateChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

   
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight


    const data = [70.3, 70.2, 70.5, 70.7, 70.6, 70.8, 71.0, 70.9, 71.2, 71.0, 71.5, 72.0, 72.5, 73.0]
    const labels = ["Feb 1", "", "", "Feb 45", "", "", "March 1", "", "", "", "April 1", "", ""]

   
    const chartWidth = canvas.width - 60
    const chartHeight = canvas.height - 40
    const leftPadding = 60
    const topPadding = 20

   
    const minValue = 70
    const maxValue = 73
    const yRange = maxValue - minValue


    ctx.clearRect(0, 0, canvas.width, canvas.height)

  
    ctx.beginPath()
    ctx.strokeStyle = "#e0e0e0"
    ctx.fillStyle = "#646464"
    ctx.font = "12px Inter, sans-serif"
    ctx.textAlign = "right"

    const ySteps = [70.0, 71.0, 72.5, 73.0]
    ySteps.forEach((value) => {
      const y = topPadding + chartHeight - ((value - minValue) / yRange) * chartHeight
      ctx.moveTo(leftPadding, y)
      ctx.lineTo(leftPadding + chartWidth, y)
      ctx.fillText(value.toFixed(1), leftPadding - 10, y + 4)
    })
    ctx.stroke()

   
    ctx.textAlign = "center"
    labels.forEach((label, i) => {
      if (label) {
        const x = leftPadding + (i / (labels.length - 1)) * chartWidth
        ctx.fillText(label, x, topPadding + chartHeight + 20)
      }
    })


    ctx.beginPath()
    ctx.strokeStyle = "#7f6dc6"
    ctx.lineWidth = 2

    data.forEach((value, i) => {
      const x = leftPadding + (i / (data.length - 1)) * chartWidth
      const y = topPadding + chartHeight - ((value - minValue) / yRange) * chartHeight

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.stroke()


    data.forEach((value, i) => {
      const x = leftPadding + (i / (data.length - 1)) * chartWidth
      const y = topPadding + chartHeight - ((value - minValue) / yRange) * chartHeight

    
      if (i === data.length - 1) {
        ctx.beginPath()
        ctx.fillStyle = "#7f6dc6"
        ctx.arc(x, y, 5, 0, Math.PI * 2)
        ctx.fill()
      }
    })

    
    const tooltipX = leftPadding + chartWidth * 0.75
    const tooltipY = topPadding + chartHeight - ((71.8 - minValue) / yRange) * chartHeight

 
    ctx.beginPath()
    ctx.strokeStyle = "#b1b1b2"
    ctx.setLineDash([2, 2])
    ctx.moveTo(tooltipX, topPadding)
    ctx.lineTo(tooltipX, topPadding + chartHeight)
    ctx.stroke()
    ctx.setLineDash([])

 
    ctx.fillStyle = "#202124"
    ctx.beginPath()
    ctx.roundRect(tooltipX - 60, tooltipY - 40, 120, 30, 4)
    ctx.fill()


    ctx.fillStyle = "white"
    ctx.textAlign = "center"
    ctx.font = "12px Inter, sans-serif"
    ctx.fillText("14.94 6 May Cum", tooltipX, tooltipY - 20)

    
    ctx.fillStyle = "#646464"
    ctx.textAlign = "right"
    ctx.font = "14px Inter, sans-serif"
    ctx.fillText("Time period", canvas.width - 10, canvas.height - 5)
  }, [])

  return (
    <div className="w-full h-[300px] relative">
      <canvas ref={canvasRef} className="w-full h-full"></canvas>
    </div>
  )
}
