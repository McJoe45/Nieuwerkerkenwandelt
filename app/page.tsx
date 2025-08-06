"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { MapPin, Clock, Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/header"
import { getRoutes, isAuthenticated, type Route } from "@/lib/auth"

export default function HomePage() {
  const [routes, setRoutes] = useState<Route[]>([])
  const [loading, setLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    async function loadRoutes() {
      try {
        const routesData = await getRoutes()
        setRoutes(routesData)
        setIsLoggedIn(isAuthenticated())
      } catch (error) {
        console.error('Error loading routes:', error)
      } finally {
        setLoading(false)
      }
    }

    loadRoutes()
  }, [])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Gemakkelijk': return 'bg-green-100 text-green-800 border-green-200'
      case 'Matig': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Moeilijk': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream">
        <Header />
        <main className="container mx-auto px-6 py-12">
          <div className="text-center">
            <p className="text-sage-dark text-xl">Routes worden geladen...</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      
      <main className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-sage-dark mb-6 leading-tight">
            De mooiste wandelingen<br />
            <span className="text-sage-light">in en om Nieuwerkerken</span>
          </h1>
          <p className="text-xl text-sage-dark/70 max-w-2xl mx-auto leading-relaxed">
            Ontdek de routes die door echte lokale wandelaars werden samengesteld.
          </p>
        </div>

        {/* Action Button for Logged In Users */}
        {isLoggedIn && (
          <div className="text-center mb-12">
            <Link href="/create-route">
              <Button className="bg-sage hover:bg-sage-light text-white px-8 py-3 text-lg">
                <Plus className="w-5 h-5 mr-2" />
                Nieuwe Route Toevoegen
              </Button>
            </Link>
          </div>
        )}

        {/* Routes Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {routes.map((route) => (
            <Link key={route.id} href={`/route/${route.id}`}>
              <Card className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-2 border-beige bg-white/90 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-sage-light rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-sage transition-colors">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-sage-dark mb-2 group-hover:text-sage transition-colors">
                        {route.name}
                      </h3>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {route.gehuchten.map((gehucht, index) => (
                          <Badge key={index} variant="secondary" className="text-xs bg-sage-light/10 text-sage-dark border-sage-light/20">
                            {gehucht}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-4 text-sage">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span className="font-medium">{route.distance} km</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span className="font-medium">{route.duration}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <Badge className={getDifficultyColor(route.difficulty)}>
                      {route.difficulty}
                    </Badge>
                    {route.muddy && (
                      <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                        Modderpad
                      </Badge>
                    )}
                  </div>

                  <p className="text-sage-dark/70 text-sm leading-relaxed line-clamp-3">
                    {route.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {routes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sage-dark/70 text-lg">Geen routes gevonden.</p>
            {isLoggedIn && (
              <Link href="/create-route">
                <Button className="mt-4 bg-sage hover:bg-sage-light text-white">
                  <Plus className="w-5 h-5 mr-2" />
                  Eerste Route Toevoegen
                </Button>
              </Link>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
