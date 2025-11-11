import crypto from "crypto"

// Simulé - en production, utilisez bcrypt
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16).toString("hex")
  const iterations = 100000
  const keyLength = 64
  const digest = "sha256"

  const hash = crypto.pbkdf2Sync(password, salt, iterations, keyLength, digest).toString("hex")

  return `${iterations}:${salt}:${hash}`
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  const [iterations, salt, hash] = hashedPassword.split(":")
  const keyLength = 64
  const digest = "sha256"

  const testHash = crypto.pbkdf2Sync(password, salt, Number.parseInt(iterations), keyLength, digest).toString("hex")

  return testHash === hash
}

export function generateToken(): string {
  return crypto.randomBytes(32).toString("hex")
}

export interface User {
  id: string
  email: string
  passwordHash: string
}

// Base de données simulée (remplacer par une vraie DB)
export const users: Map<string, User> = new Map()

const sessions: Map<string, { userId: string; expiresAt: number }> = new Map()

// Nettoyage automatique des sessions expirées toutes les heures
setInterval(() => {
  const now = Date.now()
  for (const [token, session] of sessions.entries()) {
    if (session.expiresAt < now) {
      sessions.delete(token)
    }
  }
}, 60 * 60 * 1000) // 1 heure

export function createSession(userId: string): string {
  const token = generateToken()
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000 // 24 heures
  sessions.set(token, { userId, expiresAt })
  return token
}

export function validateSession(token: string): { userId: string } | null {
  const session = sessions.get(token)

  if (!session) {
    return null
  }

  if (session.expiresAt < Date.now()) {
    sessions.delete(token)
    return null
  }

  return { userId: session.userId }
}

export function destroySession(token: string): void {
  sessions.delete(token)
}

export async function initializeDemoUser() {
  // Vérifier si l'utilisateur démo existe déjà
  const demoExists = Array.from(users.values()).some((u) => u.email === "demo@bibliotheque.fr")

  if (!demoExists) {
    const demoPasswordHash = await hashPassword("DemoSecure2025!")
    const demoUser: User = {
      id: crypto.randomUUID(),
      email: "demo@bibliotheque.fr",
      passwordHash: demoPasswordHash,
    }
    users.set(demoUser.id, demoUser)
  }
}

// Initialiser l'utilisateur démo au démarrage
initializeDemoUser().catch(console.error)

export async function registerUser(
  email: string,
  password: string,
): Promise<{ user: User; token: string } | { error: string }> {
  const normalizedEmail = email.toLowerCase()

  // Vérifier si l'utilisateur existe déjà
  if (Array.from(users.values()).some((u) => u.email === normalizedEmail)) {
    return { error: "Cet email est déjà utilisé" }
  }

  const passwordHash = await hashPassword(password)
  const user: User = {
    id: crypto.randomUUID(),
    email: normalizedEmail,
    passwordHash,
  }

  users.set(user.id, user)

  const token = createSession(user.id)
  return { user, token }
}

export async function loginUser(
  email: string,
  password: string,
): Promise<{ user: User; token: string } | { error: string }> {
  const normalizedEmail = email.toLowerCase()
  const user = Array.from(users.values()).find((u) => u.email === normalizedEmail)

  if (!user) {
    return { error: "Email ou mot de passe incorrect" }
  }

  const isPasswordValid = await verifyPassword(password, user.passwordHash)

  if (!isPasswordValid) {
    return { error: "Email ou mot de passe incorrect" }
  }

  const token = createSession(user.id)
  return { user, token }
}
