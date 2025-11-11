import { NextRequest, NextResponse } from "next/server"
import { validateSession } from "@/lib/auth"

// Force l'utilisation de Node.js runtime pour accéder aux modules Node.js
export const runtime = "nodejs"

interface GoogleBooksVolume {
  id: string
  volumeInfo: {
    title: string
    authors?: string[]
    publisher?: string
    publishedDate?: string
    description?: string
    industryIdentifiers?: Array<{
      type: string
      identifier: string
    }>
    pageCount?: number
    categories?: string[]
    imageLinks?: {
      thumbnail?: string
      smallThumbnail?: string
    }
    language?: string
    previewLink?: string
    infoLink?: string
  }
}

interface GoogleBooksResponse {
  kind: string
  totalItems: number
  items?: GoogleBooksVolume[]
}

/**
 * Recherche un livre par ISBN via l'API Google Books
 * Documentation: https://developers.google.com/books/docs/v1/using
 */
export async function GET(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const token = request.cookies.get("authToken")?.value

    if (!token || !validateSession(token)) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const isbn = searchParams.get("isbn")
    const query = searchParams.get("q")

    if (!isbn && !query) {
      return NextResponse.json({ error: "ISBN ou requête de recherche requis" }, { status: 400 })
    }

    // Construire la requête vers Google Books API
    const searchQuery = isbn ? `isbn:${isbn}` : query
    const googleBooksUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
      searchQuery || ""
    )}&maxResults=1&langRestrict=fr`

    console.log("Fetching from Google Books:", googleBooksUrl)

    const response = await fetch(googleBooksUrl)

    if (!response.ok) {
      console.error("Google Books API error:", response.status, response.statusText)
      return NextResponse.json(
        { error: "Erreur lors de la recherche du livre" },
        { status: response.status }
      )
    }

    const data: GoogleBooksResponse = await response.json()

    if (!data.items || data.items.length === 0) {
      return NextResponse.json(
        {
          error: "Livre non trouvé",
          suggestion: "Vérifiez l'ISBN ou essayez une recherche par titre",
        },
        { status: 404 }
      )
    }

    // Extraire les informations du premier résultat
    const book = data.items[0]
    const volumeInfo = book.volumeInfo

    // Extraire l'ISBN (préférer ISBN-13)
    let bookIsbn = isbn
    if (!bookIsbn && volumeInfo.industryIdentifiers) {
      const isbn13 = volumeInfo.industryIdentifiers.find((id) => id.type === "ISBN_13")
      const isbn10 = volumeInfo.industryIdentifiers.find((id) => id.type === "ISBN_10")
      bookIsbn = isbn13?.identifier || isbn10?.identifier
    }

    // Formater les données du livre
    const bookData = {
      id: book.id,
      title: volumeInfo.title,
      authors: volumeInfo.authors || [],
      publisher: volumeInfo.publisher,
      publishedDate: volumeInfo.publishedDate,
      description: volumeInfo.description,
      isbn: bookIsbn,
      pageCount: volumeInfo.pageCount,
      categories: volumeInfo.categories || [],
      language: volumeInfo.language,
      imageUrl: volumeInfo.imageLinks?.thumbnail?.replace("http:", "https:") || null,
      previewLink: volumeInfo.previewLink,
      infoLink: volumeInfo.infoLink,
    }

    return NextResponse.json(bookData)
  } catch (error: any) {
    console.error("Book search error:", error)
    return NextResponse.json(
      {
        error: "Erreur lors de la recherche du livre",
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
