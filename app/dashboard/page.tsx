"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { redirect } from "next/navigation"

export default function DashboardPage() {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null)

  useEffect(() => {
    async function checkAuth() {
      const response = await fetch("/api/auth/verify")

      if (!response.ok) {
        redirect("/")
      }

      const data = await response.json()
      setUser(data.user)
    }

    checkAuth()
  }, [])

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" })
    redirect("/")
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Vérification de l'authentification...</p>
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
          <form action={handleLogout}>
            <Button type="submit" variant="outline">
              Déconnexion
            </Button>
          </form>
        </header>

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
