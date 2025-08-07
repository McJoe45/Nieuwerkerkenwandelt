"use client"

export function login(username: string, password: string): boolean {
  // Simple demo authentication - in production you'd use Supabase Auth
  if (username === "admin" && password === "wandelen123") {
    if (typeof window !== "undefined") {
      localStorage.setItem("isLoggedIn", "true")
      localStorage.setItem("username", username)
    }
    return true
  }
  return false
}

export function isAuthenticated(): boolean {
  if (typeof window !== "undefined") {
    return localStorage.getItem("isLoggedIn") === "true"
  }
  return false
}

export function logout(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("username")
  }
}

export function getCurrentUser(): string {
  if (typeof window !== "undefined") {
    return localStorage.getItem("username") || ""
  }
  return ""
}
