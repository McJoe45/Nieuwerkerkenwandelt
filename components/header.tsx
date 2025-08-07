import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { isAuthenticated, logout } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { LogOut, User } from 'lucide-react'

export default function Header() {
  const router = useRouter()
  const loggedIn = isAuthenticated()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <header className="bg-sage-dark text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/public/images/nieuwerkerken-logo.png"
            alt="Nieuwerkerken Wandelt Logo"
            width={40}
            height={40}
            className="object-contain"
          />
          <span className="text-2xl font-bold title-font">Nieuwerkerken Wandelt</span>
        </Link>
        <nav>
          {loggedIn ? (
            <div className="flex items-center gap-4">
              <Link href="/admin" passHref>
                <Button variant="ghost" className="text-white hover:bg-sage-light">
                  <User className="w-5 h-5 mr-2" />
                  Admin
                </Button>
              </Link>
              <Button onClick={handleLogout} variant="ghost" className="text-white hover:bg-sage-light">
                <LogOut className="w-5 h-5 mr-2" />
                Uitloggen
              </Button>
            </div>
          ) : (
            <Link href="/login" passHref>
              <Button variant="ghost" className="text-white hover:bg-sage-light">
                Login
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
