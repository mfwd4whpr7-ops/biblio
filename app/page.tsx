"use client"

import { useState } from "react"
import { LoginForm } from "@/components/login-form"
import { RegisterForm } from "@/components/register-form"

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <svg className="w-7 h-7 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C6.5 6.253 2 10.753 2 16.5S6.5 26.747 12 26.747s10-4.5 10-10.247S17.5 6.253 12 6.253z"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Bibliothèque</h1>
          <p className="text-muted-foreground">Accès sécurisé à votre collection</p>
        </div>

        {/* Auth Container */}
        <div className="bg-card rounded-2xl shadow-lg p-8 border border-border">
          {isLogin ? (
            <>
              <LoginForm />
              <div className="mt-6 text-center">
                <p className="text-muted-foreground text-sm">
                  Pas encore de compte?{" "}
                  <button
                    onClick={() => setIsLogin(false)}
                    className="text-primary hover:text-accent font-semibold transition-colors"
                  >
                    S'inscrire
                  </button>
                </p>
              </div>
            </>
          ) : (
            <>
              <RegisterForm />
              <div className="mt-6 text-center">
                <p className="text-muted-foreground text-sm">
                  Vous avez un compte?{" "}
                  <button
                    onClick={() => setIsLogin(true)}
                    className="text-primary hover:text-accent font-semibold transition-colors"
                  >
                    Se connecter
                  </button>
                </p>
              </div>
            </>
          )}
        </div>

        {/* Security Info */}
        <div className="mt-8 p-4 bg-accent/10 rounded-lg border border-accent/20">
          <div className="flex gap-3">
            <svg className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="font-semibold text-sm text-foreground">Connexion sécurisée</p>
              <p className="text-xs text-muted-foreground mt-1">
                Vos données sont chiffrées et protégées par les dernières normes de sécurité.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
