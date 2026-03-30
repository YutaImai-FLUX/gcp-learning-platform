"use client"

import { useRef, useCallback } from "react"
import { motion } from "framer-motion"
import { Download, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CertificateGeneratorProps {
  certName: string
  certShortName: string
  userName: string
  score: number
  date: string
  color: string
}

export function CertificateGenerator({ certName, certShortName, userName, score, date, color }: CertificateGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const generateCertificate = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const w = 800
    const h = 560
    canvas.width = w
    canvas.height = h

    // Background
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, w, h)

    // Border
    ctx.strokeStyle = color
    ctx.lineWidth = 4
    ctx.strokeRect(20, 20, w - 40, h - 40)
    ctx.strokeStyle = color + "40"
    ctx.lineWidth = 1
    ctx.strokeRect(30, 30, w - 60, h - 60)

    // Google Cloud dots
    const dots = ["#4285F4", "#EA4335", "#FBBC05", "#34A853"]
    dots.forEach((c, i) => {
      ctx.beginPath()
      ctx.arc(w / 2 - 30 + i * 20, 70, 6, 0, Math.PI * 2)
      ctx.fillStyle = c
      ctx.fill()
    })

    // Title
    ctx.fillStyle = "#202124"
    ctx.font = "bold 28px 'Google Sans', sans-serif"
    ctx.textAlign = "center"
    ctx.fillText("Certificate of Completion", w / 2, 120)

    // Cert name
    ctx.fillStyle = color
    ctx.font = "bold 24px 'Google Sans', sans-serif"
    ctx.fillText(`${certShortName} — ${certName}`, w / 2, 170)

    // "This certifies that"
    ctx.fillStyle = "#5f6368"
    ctx.font = "16px 'Google Sans', sans-serif"
    ctx.fillText("This certifies that", w / 2, 220)

    // User name
    ctx.fillStyle = "#202124"
    ctx.font = "bold 32px 'Google Sans', sans-serif"
    ctx.fillText(userName, w / 2, 270)

    // Line under name
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(w / 2 - 120, 285)
    ctx.lineTo(w / 2 + 120, 285)
    ctx.stroke()

    // Score
    ctx.fillStyle = "#5f6368"
    ctx.font = "16px 'Google Sans', sans-serif"
    ctx.fillText(`has successfully completed the learning program with a score of ${score}%`, w / 2, 330)

    // Date
    ctx.fillStyle = "#5f6368"
    ctx.font = "14px 'Google Sans', sans-serif"
    ctx.fillText(`Date: ${date}`, w / 2, 380)

    // GCP Learning Platform
    ctx.fillStyle = "#202124"
    ctx.font = "bold 14px 'Google Sans', sans-serif"
    ctx.fillText("GCP Interactive Learning Platform", w / 2, 440)

    // Footer
    ctx.fillStyle = "#9aa0a6"
    ctx.font = "11px 'Google Sans', sans-serif"
    ctx.fillText("This certificate is for learning purposes and does not represent official Google Cloud certification.", w / 2, 500)
  }, [certName, certShortName, userName, score, date, color])

  const handleDownload = () => {
    generateCertificate()
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement("a")
    link.download = `certificate-${certShortName.toLowerCase()}.png`
    link.href = canvas.toDataURL("image/png")
    link.click()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <canvas ref={canvasRef} className="hidden" />

      <div
        className="rounded-xl border-2 p-8 text-center space-y-3"
        style={{ borderColor: color }}
      >
        <div className="flex justify-center gap-1">
          {["#4285F4", "#EA4335", "#FBBC05", "#34A853"].map((c) => (
            <span key={c} className="w-2 h-2 rounded-full" style={{ backgroundColor: c }} />
          ))}
        </div>
        <h3 className="text-lg font-bold text-foreground">修了証</h3>
        <p className="text-sm" style={{ color }}>{certShortName} — {certName}</p>
        <p className="text-xl font-bold text-foreground">{userName}</p>
        <p className="text-xs text-muted-foreground">Score: {score}% · {date}</p>
      </div>

      <div className="flex justify-center gap-3">
        <Button onClick={handleDownload} variant="outline" size="sm">
          <Download size={14} className="mr-1.5" /> PNGダウンロード
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: `${certShortName} 修了証`,
                text: `GCP Learning Platformで${certShortName}の学習を完了しました！ Score: ${score}%`,
              })
            }
          }}
        >
          <Share2 size={14} className="mr-1.5" /> シェア
        </Button>
      </div>
    </motion.div>
  )
}
