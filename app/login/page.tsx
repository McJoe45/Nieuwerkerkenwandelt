'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Header from '@/components/header'
import Image from 'next/image'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setMessage(error.message)
    } else {
      setMessage('Succesvol ingelogd!')
      router.push('/admin') // Redirect to admin page on successful login
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-md bg-white shadow-lg border-2 border-beige">
          <CardHeader className="text-center">
            <Image
              src="/public/images/nieuwerkerken-logo.png"
              alt="Nieuwerkerken Wandelt Logo"
              width={150}
              height={150}
              className="mx-auto mb-4"
            />
            <CardTitle className="text-sage-dark text-3xl">Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <Label htmlFor="email" className="text-sage-dark">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 border-beige focus:border-sage-light focus:ring-sage-light text-sage-dark"
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
                  className="mt-1 border-beige focus:border-sage-light focus:ring-sage-light text-sage-dark"
                />
              </div>
              {message && (
                <p className={`text-center text-sm ${message.includes('Succesvol') ? 'text-green-600' : 'text-red-600'}`}>
                  {message}
                </p>
              )}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-sage hover:bg-sage-dark text-white font-semibold py-3 px-6 rounded-full shadow-md transition-all duration-300 text-base"
              >
                {loading ? 'Inloggen...' : 'Inloggen'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
