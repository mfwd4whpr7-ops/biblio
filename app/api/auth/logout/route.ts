import { destroySession } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const token = request.cookies.get("authToken")?.value

    if (token) {
      destroySession(token)
    }

    const response = NextResponse.json({ success: true }, { status: 200 })

    // Clear the auth cookie
    response.cookies.set("authToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0,
      path: "/",
    })

    return response
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la déconnexion" }, { status: 500 })
  }
}
