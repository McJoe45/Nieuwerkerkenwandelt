"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X } from 'lucide-react'
import { isAuthenticated, logout, getCurrentUser } from "@/lib/auth"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState<string | null>(null)

  useEffect(() => {
    setIsLoggedIn(isAuthenticated())
    setCurrentUser(getCurrentUser())
  }, [])

  const handleLogout = () => {
    logout()
    setIsLoggedIn(false)
    setCurrentUser(null)
    setIsMenuOpen(false)
  }

  return (
    <header className="bg-sage text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <Image
              src="/images/nieuwerkerken-logo.png"
              alt="Nieuwerkerken Logo"
              width={40}
              height={40}
              className="rounded-full"
            />
            <span className="text-xl font-bold">Nieuwerkerken Wandelt</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="hover:text-sage-lightest transition-colors">
              Home
            </Link>
            {isLoggedIn ? (
              <>
                <Link href="/admin" className="hover:text-sage-lightest transition-colors">
                  Admin
                </Link>
                <span className="text-sage-lightest">Welkom, {currentUser}</span>
                <button
                  onClick={handleLogout}
                  className="hover:text-sage-lightest transition-colors"
                >
                  Uitloggen
                </button>
              </>
            ) : (
              <Link href="/login" className="hover:text-sage-lightest transition-colors">
                Inloggen
              </Link>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-sage-light">
            <div className="flex flex-col space-y-2">
              <Link
                href="/"
                className="py-2 hover:text-sage-lightest transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              {isLoggedIn ? (
                <>
                  <Link
                    href="/admin"
                    className="py-2 hover:text-sage-lightest transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin
                  </Link>
                  <span className="py-2 text-sage-lightest">Welkom, {currentUser}</span>
                  <button
                    onClick={handleLogout}
                    className="py-2 text-left hover:text-sage-lightest transition-colors"
                  >
                    Uitloggen
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="py-2 hover:text-sage-lightest transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Inloggen
                </Link>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
