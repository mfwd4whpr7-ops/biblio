import { NextRequest, NextResponse } from "next/server"
import { validateSession } from "@/lib/auth"

// Force l'utilisation de Node.js runtime pour accéder aux modules Node.js
export const runtime = "nodejs"

/**
 * API endpoint pour traiter les images scannées et extraire l'ISBN
 *
 * Pour une implémentation complète avec OCR réel, installez:
 * npm install tesseract.js
 *
 * Et utilisez le code suivant:
 *
 * import Tesseract from 'tesseract.js'
 *
 * const { data: { text } } = await Tesseract.recognize(imageBuffer, 'eng', {
 *   logger: m => console.log(m)
 * })
 *
 * const isbn = extractISBNFromText(text)
 */

// Fonction pour extraire un ISBN depuis du texte
function extractISBNFromText(text: string): string | null {
  // Regex pour ISBN-13 (format: 978-X-XXX-XXXXX-X ou 9781234567890)
  const isbn13Regex = /(?:ISBN(?:-13)?:?\s*)?(?=[-\d\s]{17}|[-\d]{13})(97[89][-\s]?\d{1,5}[-\s]?\d{1,7}[-\s]?\d{1,7}[-\s]?\d)/gi

  // Regex pour ISBN-10 (format: X-XXX-XXXXX-X ou 0123456789)
  const isbn10Regex = /(?:ISBN(?:-10)?:?\s*)?(?=[-\d\sX]{13}|[-\dX]{10})(\d{1,5}[-\s]?\d{1,7}[-\s]?\d{1,7}[-\s]?[\dX])/gi

  // Chercher ISBN-13 d'abord (préféré)
  let match = text.match(isbn13Regex)
  if (match) {
    // Nettoyer l'ISBN (enlever espaces et tirets)
    return match[0].replace(/[^\d]/g, "")
  }

  // Sinon chercher ISBN-10
  match = text.match(isbn10Regex)
  if (match) {
    return match[0].replace(/[^\dX]/gi, "")
  }

  return null
}

// Fonction de simulation OCR (à remplacer par un vrai OCR)
async function simulateOCR(imageData: string): Promise<string> {
  // Dans une vraie implémentation, on utiliserait Tesseract.js ou une API externe
  // Pour la démo, on retourne un texte simulé avec un ISBN

  // Simuler un délai de traitement
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // ISBN d'exemple pour test : "Le Petit Prince" d'Antoine de Saint-Exupéry
  return `
    LE PETIT PRINCE
    Antoine de Saint-Exupéry
    ISBN-13: 978-2070612758
    Éditions Gallimard
    Collection Folio
  `
}

export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const token = request.cookies.get("authToken")?.value

    if (!token || !validateSession(token)) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    const body = await request.json()
    const { image } = body

    if (!image) {
      return NextResponse.json({ error: "Image manquante" }, { status: 400 })
    }

    // Valider que c'est bien une image base64
    if (!image.startsWith("data:image/")) {
      return NextResponse.json({ error: "Format d'image invalide" }, { status: 400 })
    }

    // Traiter l'image avec OCR (simulation pour le moment)
    const ocrText = await simulateOCR(image)

    // Extraire l'ISBN du texte
    const isbn = extractISBNFromText(ocrText)

    if (!isbn) {
      return NextResponse.json(
        {
          error: "Aucun ISBN détecté dans l'image",
          suggestion: "Assurez-vous que le code-barres ou l'ISBN est bien visible",
          rawText: ocrText,
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      isbn,
      rawText: ocrText,
      message: "ISBN extrait avec succès",
    })
  } catch (error: any) {
    console.error("Scan processing error:", error)
    return NextResponse.json(
      {
        error: "Erreur lors du traitement de l'image",
        details: error.message,
      },
      { status: 500 }
    )
  }
}

// Méthode pour supporter les requêtes OPTIONS (CORS)
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 })
}
