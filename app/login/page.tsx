"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { login } from "@/lib/auth"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const success = login(username, password)

    if (success) {
      router.push("/")
    } else {
      setError("Ongeldige gebruikersnaam of wachtwoord")
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Card className="border-2 border-beige shadow-2xl bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center pb-8">
            <div className="w-16 h-16 bg-sage-light rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold text-sage-dark tracking-wide title-font">Welkom terug</CardTitle>
            <CardDescription className="text-sage text-lg font-light">
              Log in om wandelroutes te beheren
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sage-dark font-medium">
                  Gebruikersnaam
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="h-12 border-beige focus:border-sage-light focus:ring-sage-light/20 bg-cream/30"
                  placeholder="Voer je gebruikersnaam in"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sage-dark font-medium">
                  Wachtwoord
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12 border-beige focus:border-sage-light focus:ring-sage-light/20 bg-cream/30 pr-12"
                    placeholder="Voer je wachtwoord in"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4 text-sage" /> : <Eye className="h-4 w-4 text-sage" />}
                  </Button>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-600 text-sm font-medium">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-sage-light to-sage-lighter hover:from-sage-lighter hover:to-sage-light text-white border-0 transition-all duration-300 hover:scale-105 shadow-lg text-lg font-medium title-font"
                disabled={loading}
              >
                {loading ? "Bezig met inloggen..." : "Inloggen"}
              </Button>
            </form>

            <div className="pt-6 border-t border-beige">
              <div className="text-center">
                <p className="text-sage text-sm mb-3 font-light">Demo inloggegevens:</p>
                <div className="bg-cream rounded-xl p-4 border border-beige">
                  <p className="font-mono text-sage-dark font-medium">admin / wandelen123</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
