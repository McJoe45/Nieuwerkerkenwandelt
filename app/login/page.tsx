import { createClient } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import Image from 'next/image'

export default function LoginPage() {
  const signIn = async (formData: FormData) => {
    'use server'

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const supabase = createClient()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error('Login error:', error.message)
      // In a real app, you'd show an error message to the user
      return redirect('/login?message=Could not authenticate user')
    }

    return redirect('/')
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-2 border-beige bg-white shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Image
              src="/images/nieuwerkerken-logo.png"
              alt="Nieuwerkerken Wandelt Logo"
              width={80}
              height={80}
              className="rounded-full"
            />
          </div>
          <CardTitle className="text-3xl font-bold text-sage-dark">Welkom Terug</CardTitle>
          <CardDescription className="text-sage">Log in om verder te gaan</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-sage">E-mailadres</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="jouw@email.com"
                className="border-beige text-sage-dark focus:border-sage focus:ring-sage"
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-sage">Wachtwoord</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                placeholder="********"
                className="border-beige text-sage-dark focus:border-sage focus:ring-sage"
              />
            </div>
            <Button formAction={signIn} className="w-full bg-sage hover:bg-sage-dark text-white font-semibold py-3 rounded-full shadow-md transition-all duration-300">
              Inloggen
            </Button>
            {/* You can add a message display here if needed */}
            {/* <p className="text-center text-sm text-red-500 mt-4">
              {searchParams?.message}
            </p> */}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
