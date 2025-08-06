"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { User, LogOut } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { isAuthenticated, logout, getCurrentUser } from "@/lib/supabase"

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState("")

  useEffect(() => {
    setIsLoggedIn(isAuthenticated())
    setUsername(getCurrentUser())
  }, [])

  const handleLogout = () => {
    logout()
    setIsLoggedIn(false)
    setUsername("")
    window.location.reload()
  }

  return (
    <header className="bg-sage text-white shadow-xl border-b border-sage/30">
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 sm:gap-4 group transition-all duration-300 hover:scale-105 min-w-0"
          >
            <div className="relative flex-shrink-0">
              <img
                src="/images/nieuwerkerken-logo.png"
                alt="Wapen van Nieuwerkerken"
                className="object-contain transition-all duration-300 group-hover:drop-shadow-lg"
                style={{ width: "40px", height: "40px" }}
              />
            </div>
            <div className="flex items-center gap-1 sm:gap-2 min-w-0">
              <span className="text-lg sm:text-2xl font-bold text-cream tracking-wide title-font truncate">
                Nieuwerkerken
              </span>
              <span className="text-lg sm:text-2xl font-bold text-cream tracking-wide title-font flex-shrink-0">
                wandelt
              </span>
            </div>
          </Link>

          <nav className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            {isLoggedIn && (
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-full bg-sage/30 border border-cream/20">
                  <div className="w-8 h-8 bg-sage-light rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-cream font-medium">{username}</span>
                </div>
                <div className="sm:hidden w-8 h-8 bg-sage-light rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="border-cream/30 text-cream hover:bg-sage/20 hover:text-white bg-transparent transition-all duration-300 text-xs sm:text-sm px-2 sm:px-3"
                >
                  <LogOut className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Uitloggen</span>
                </Button>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
