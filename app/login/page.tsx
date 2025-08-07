'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { login } from '@/lib/supabase'
import Header from '@/components/header'
import Image from 'next/image'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (login(username, password)) {
      router.push('/admin')
    } else {
      setError('Ongeldige gebruikersnaam of wachtwoord.')
    }
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <div className="flex justify-center mb-6">
            <Image
              src="/public/images/nieuwerkerken-logo.png"
              alt="Nieuwerkerken Wandelt Logo"
              width={120}
              height={120}
              className="object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold text-center text-sage-dark mb-6 title-font">Login</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="username" className="text-sage-dark">Gebruikersnaam</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="border-beige focus:border-sage"
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-sage-dark">Wachtwoord</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-beige focus:border-sage"
              />
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <Button type="submit" className="w-full bg-sage hover:bg-sage-dark text-white">
              Inloggen
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}
