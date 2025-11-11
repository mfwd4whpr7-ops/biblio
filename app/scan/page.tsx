"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { BookScanner } from "@/components/book-scanner"
import { Camera, Upload, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ScanPage() {
  const [scanMode, setScanMode] = useState<"camera" | "upload" | null>(null)
  const [scannedBook, setScannedBook] = useState<any>(null)

  const handleScanComplete = (bookData: any) => {
    setScannedBook(bookData)
  }

  const resetScan = () => {
    setScanMode(null)
    setScannedBook(null)
  }

  if (scannedBook) {
    return (
      <main className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto">
          <Link href="/dashboard">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour au tableau de bord
            </Button>
          </Link>

          <div className="bg-card rounded-lg border border-border p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">Livre scanné avec succès !</h2>

            <div className="grid md:grid-cols-2 gap-6">
              {scannedBook.imageUrl && (
                <div className="flex justify-center">
                  <img
                    src={scannedBook.imageUrl}
                    alt={scannedBook.title}
                    className="rounded-lg shadow-lg max-h-96 object-cover"
                  />
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{scannedBook.title}</h3>
                  {scannedBook.authors && (
                    <p className="text-muted-foreground">Par {scannedBook.authors.join(", ")}</p>
                  )}
                </div>

                {scannedBook.isbn && (
                  <div>
                    <p className="text-sm text-muted-foreground">ISBN</p>
                    <p className="font-mono">{scannedBook.isbn}</p>
                  </div>
                )}

                {scannedBook.publishedDate && (
                  <div>
                    <p className="text-sm text-muted-foreground">Date de publication</p>
                    <p>{scannedBook.publishedDate}</p>
                  </div>
                )}

                {scannedBook.publisher && (
                  <div>
                    <p className="text-sm text-muted-foreground">Éditeur</p>
                    <p>{scannedBook.publisher}</p>
                  </div>
                )}

                {scannedBook.description && (
                  <div>
                    <p className="text-sm text-muted-foreground">Description</p>
                    <p className="text-sm line-clamp-6">{scannedBook.description}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <Button onClick={resetScan} variant="outline">
                Scanner un autre livre
              </Button>
              <Button>Ajouter à ma bibliothèque</Button>
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (scanMode) {
    return (
      <main className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto">
          <Button variant="ghost" className="mb-6" onClick={() => setScanMode(null)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>

          <BookScanner mode={scanMode} onScanComplete={handleScanComplete} />
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/dashboard">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour au tableau de bord
          </Button>
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-foreground mb-4">Scanner un livre</h1>
          <p className="text-muted-foreground">
            Choisissez comment vous souhaitez scanner votre livre
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <button
            onClick={() => setScanMode("camera")}
            className="bg-card rounded-lg border-2 border-border hover:border-primary transition-colors p-8 text-center group"
          >
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
              <Camera className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Prendre une photo</h3>
            <p className="text-muted-foreground">
              Utilisez votre caméra pour scanner la couverture ou le code-barres
            </p>
          </button>

          <button
            onClick={() => setScanMode("upload")}
            className="bg-card rounded-lg border-2 border-border hover:border-primary transition-colors p-8 text-center group"
          >
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
              <Upload className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Télécharger une image</h3>
            <p className="text-muted-foreground">
              Sélectionnez une photo existante de la couverture ou du code-barres
            </p>
          </button>
        </div>
      </div>
    </main>
  )
}
