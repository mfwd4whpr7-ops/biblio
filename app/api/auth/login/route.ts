import { loginUser, createSession } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // Validation de base
    if (!email || !password) {
      return NextResponse.json({ error: "Email et mot de passe sont requis" }, { status: 400 })
    }

    const result = await loginUser(email, password)

    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 401 })
    }

    const token = createSession(result.user.id)

    const response = NextResponse.json(
      {
        token,
        user: {
          id: result.user.id,
          email: result.user.email,
        },
      },
      { status: 200 },
    )

    // Set secure HTTP-only cookie
    response.cookies.set("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60, // 24 heures
      path: "/",
    })

    return response
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la connexion" }, { status: 500 })
  }
}
