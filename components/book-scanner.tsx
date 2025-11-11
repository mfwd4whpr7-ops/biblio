"use client"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Camera, Upload, Loader2, CheckCircle2, AlertCircle } from "lucide-react"

interface BookScannerProps {
  mode: "camera" | "upload"
  onScanComplete: (bookData: any) => void
}

export function BookScanner({ mode, onScanComplete }: BookScannerProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [isCameraActive, setIsCameraActive] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const startCamera = useCallback(async () => {
    try {
      setError(null)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        setIsCameraActive(true)
      }
    } catch (err) {
      setError("Impossible d'accéder à la caméra. Vérifiez les permissions.")
      console.error("Camera error:", err)
    }
  }, [])

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
      setIsCameraActive(false)
    }
  }, [])

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        const imageData = canvas.toDataURL("image/jpeg", 0.8)
        setCapturedImage(imageData)
        stopCamera()
      }
    }
  }, [stopCamera])

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Veuillez sélectionner une image valide")
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const imageData = e.target?.result as string
        setCapturedImage(imageData)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const processImage = useCallback(async () => {
    if (!capturedImage) return

    setIsProcessing(true)
    setError(null)

    try {
      // Envoyer l'image au serveur pour traitement OCR
      const response = await fetch("/api/scan/process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: capturedImage }),
      })

      if (!response.ok) {
        throw new Error("Erreur lors du traitement de l'image")
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      // Rechercher les informations du livre via ISBN
      if (data.isbn) {
        const bookResponse = await fetch(`/api/books/search?isbn=${data.isbn}`)

        if (bookResponse.ok) {
          const bookData = await bookResponse.json()
          onScanComplete(bookData)
          return
        }
      }

      // Si pas d'ISBN ou pas de résultats, retourner les données brutes
      onScanComplete(data)
    } catch (err: any) {
      setError(err.message || "Erreur lors du traitement de l'image")
      console.error("Processing error:", err)
    } finally {
      setIsProcessing(false)
    }
  }, [capturedImage, onScanComplete])

  const retakePhoto = () => {
    setCapturedImage(null)
    setError(null)
    if (mode === "camera") {
      startCamera()
    }
  }

  if (mode === "camera") {
    return (
      <div className="bg-card rounded-lg border border-border p-8">
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
          <Camera className="w-6 h-6" />
          Scanner avec la caméra
        </h2>

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <p className="text-destructive">{error}</p>
          </div>
        )}

        <div className="space-y-6">
          {!capturedImage ? (
            <>
              <div className="relative bg-black rounded-lg overflow-hidden" style={{ minHeight: "400px" }}>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                  style={{ maxHeight: "600px" }}
                />
                <canvas ref={canvasRef} className="hidden" />

                {!isCameraActive && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                    <Button onClick={startCamera} size="lg">
                      <Camera className="w-5 h-5 mr-2" />
                      Activer la caméra
                    </Button>
                  </div>
                )}
              </div>

              {isCameraActive && (
                <div className="flex justify-center gap-3">
                  <Button onClick={capturePhoto} size="lg">
                    <Camera className="w-5 h-5 mr-2" />
                    Capturer
                  </Button>
                  <Button onClick={stopCamera} variant="outline">
                    Annuler
                  </Button>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="relative rounded-lg overflow-hidden bg-black">
                <img src={capturedImage} alt="Captured" className="w-full h-auto max-h-96 object-contain mx-auto" />
              </div>

              <div className="flex justify-center gap-3">
                <Button onClick={processImage} disabled={isProcessing} size="lg">
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Traitement en cours...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5 mr-2" />
                      Analyser l'image
                    </>
                  )}
                </Button>
                <Button onClick={retakePhoto} variant="outline" disabled={isProcessing}>
                  Reprendre
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    )
  }

  // Mode Upload
  return (
    <div className="bg-card rounded-lg border border-border p-8">
      <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
        <Upload className="w-6 h-6" />
        Télécharger une image
      </h2>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
          <p className="text-destructive">{error}</p>
        </div>
      )}

      <div className="space-y-6">
        {!capturedImage ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-border rounded-lg p-12 text-center cursor-pointer hover:border-primary transition-colors"
          >
            <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-foreground font-medium mb-2">Cliquez pour sélectionner une image</p>
            <p className="text-sm text-muted-foreground">
              Formats acceptés : JPG, PNG, WEBP (max 10MB)
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        ) : (
          <>
            <div className="relative rounded-lg overflow-hidden bg-black">
              <img src={capturedImage} alt="Uploaded" className="w-full h-auto max-h-96 object-contain mx-auto" />
            </div>

            <div className="flex justify-center gap-3">
              <Button onClick={processImage} disabled={isProcessing} size="lg">
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Traitement en cours...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Analyser l'image
                  </>
                )}
              </Button>
              <Button onClick={retakePhoto} variant="outline" disabled={isProcessing}>
                Choisir une autre image
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
