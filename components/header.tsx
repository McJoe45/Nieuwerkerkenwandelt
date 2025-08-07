'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Header() {
  const supabase = createClient()
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setIsLoggedIn(!!user)
    }
    checkUser()

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session?.user)
    })

    return () => {
      authListener?.unsubscribe()
    }
  }, [supabase])

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Error logging out:', error.message)
    } else {
      router.push('/login')
    }
  }

  return (
    <header className="bg-sage-dark text-white p-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3">
          <Image
            src="/public/images/nieuwerkerken-logo.png"
            alt="Nieuwerkerken Wandelt Logo"
            width={40}
            height={40}
            className="rounded-full"
          />
          <span className="text-xl font-bold">Nieuwerkerken Wandelt</span>
        </Link>
        <nav className="space-x-4">
          {isLoggedIn ? (
            <>
              <Link href="/admin" passHref>
                <Button variant="ghost" className="text-white hover:bg-sage-light">Admin</Button>
              </Link>
              <Button onClick={handleLogout} variant="ghost" className="text-white hover:bg-sage-light">Uitloggen</Button>
            </>
          ) : (
            <Link href="/login" passHref>
              <Button variant="ghost" className="text-white hover:bg-sage-light">Login</Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
