import { validateSession, users } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const token = request.cookies.get("authToken")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const session = validateSession(token)

    if (!session) {
      return NextResponse.json({ error: "Session invalide ou expirée" }, { status: 401 })
    }

    const user = users.get(session.userId)

    if (!user) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 })
    }

    return NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
        },
      },
      { status: 200 },
    )
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la vérification" }, { status: 500 })
  }
}
