import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase'
import { User, LogOut } from 'lucide-react'
import { redirect } from 'next/navigation'

export default async function Header() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const signOut = async () => {
    'use server'
    const supabase = createClient()
    await supabase.auth.signOut()
    return redirect('/login')
  }

  return (
    <header className="bg-sage-dark text-white py-4 px-6 flex items-center justify-between shadow-md">
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/images/nieuwerkerken-logo.png"
          alt="Nieuwerkerken Wandelt Logo"
          width={40}
          height={40}
          className="rounded-full"
          priority
        />
        <span className="text-xl font-bold title-font">Nieuwerkerken Wandelt</span>
      </Link>
      <nav className="flex items-center gap-4">
        {user ? (
          <>
            <Link href="/create-route" passHref>
              <Button variant="ghost" className="text-white hover:bg-sage-light/20">
                Nieuwe Route
              </Button>
            </Link>
            <Link href="/admin" passHref>
              <Button variant="ghost" className="text-white hover:bg-sage-light/20">
                Admin
              </Button>
            </Link>
            <form action={signOut}>
              <Button variant="ghost" className="text-white hover:bg-sage-light/20">
                <LogOut className="w-4 h-4 mr-2" />
                Uitloggen
              </Button>
            </form>
          </>
        ) : (
          <Link href="/login" passHref>
            <Button variant="ghost" className="text-white hover:bg-sage-light/20">
              <User className="w-4 h-4 mr-2" />
              Inloggen
            </Button>
          </Link>
        )}
      </nav>
    </header>
  )
}
