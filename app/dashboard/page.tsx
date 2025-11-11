"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function DashboardPage() {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch("/api/auth/verify")

        if (!response.ok) {
          router.push("/")
          return
        }

        const data = await response.json()
        setUser(data.user)
      } catch (err) {
        setError("Erreur de connexion au serveur")
        console.error("Auth check error:", err)
      }
    }

    checkAuth()
  }, [router])

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/")
    } catch (err) {
      setError("Erreur lors de la déconnexion")
      console.error("Logout error:", err)
    }
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Vérification de l'authentification...</p>
          {error && <p className="text-destructive mt-2">{error}</p>}
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Bienvenue à la Bibliothèque</h1>
            <p className="text-muted-foreground mt-2">Connecté en tant que {user.email}</p>
          </div>
          <div className="flex gap-3">
            <Link href="/scan">
              <Button variant="default">Scanner un livre</Button>
            </Link>
            <Button onClick={handleLogout} variant="outline">
              Déconnexion
            </Button>
          </div>
        </header>

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6">
            <p className="text-destructive">{error}</p>
          </div>
        )}

        <div className="bg-card rounded-lg border border-border p-8 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C6.5 6.253 2 10.753 2 16.5S6.5 26.747 12 26.747s10-4.5 10-10.247S17.5 6.253 12 6.253z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Accès autorisé</h2>
          <p className="text-muted-foreground mb-6">
            Vous avez accès à votre bibliothèque sécurisée avec authentification forte.
          </p>
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="p-4 bg-secondary/10 rounded-lg border border-secondary/20">
              <p className="text-2xl font-bold text-foreground">128-bit</p>
              <p className="text-sm text-muted-foreground">Chiffrement SSL</p>
            </div>
            <div className="p-4 bg-secondary/10 rounded-lg border border-secondary/20">
              <p className="text-2xl font-bold text-foreground">PBKDF2</p>
              <p className="text-sm text-muted-foreground">Hash sécurisé</p>
            </div>
            <div className="p-4 bg-secondary/10 rounded-lg border border-secondary/20">
              <p className="text-2xl font-bold text-foreground">Sessions</p>
              <p className="text-sm text-muted-foreground">Tokens JWT</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
