"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { MapPin, Clock, Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/header"
import { getAllRoutes, isAuthenticated, type Route } from "@/lib/auth"

export default function HomePage() {
  const [routes, setRoutes] = useState<Route[]>([])
  const [loading, setLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const loadRoutes = async () => {
      try {
        const routesData = await getAllRoutes()
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
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-sage-dark">Routes worden geladen...</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-sage-dark mb-4 title-font leading-tight">
            De mooiste wandelingen<br />
            in en om Nieuwerkerken
          </h1>
          <p className="text-lg text-sage max-w-2xl mx-auto">
            Ontdek de routes die door echte lokale wandelaars werden samengesteld.
          </p>
        </div>

        {/* Admin Controls */}
        {isLoggedIn && (
          <div className="mb-8 flex justify-end">
            <Link href="/create-route">
              <Button className="bg-sage-light hover:bg-sage text-white">
                <Plus className="w-4 h-4 mr-2" />
                Nieuwe Route
              </Button>
            </Link>
          </div>
        )}

        {/* Routes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {routes.map((route) => (
            <Link key={route.id} href={`/route/${route.id}`}>
              <Card className="bg-white border-sage-light hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-12 h-12 bg-sage-light rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-sage-dark text-lg mb-1 title-font">
                        {route.name}
                      </h3>
                      <p className="text-sage text-sm">
                        {route.gehuchten && route.gehuchten.length > 0 ? route.gehuchten.join(' • ') : ''}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-4 text-sm text-sage-dark">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span className="font-medium">{route.distance} km</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{route.duration}</span>
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

                  <p className="text-sage text-sm leading-relaxed line-clamp-3">
                    {route.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {routes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sage-dark text-lg mb-4">Nog geen routes beschikbaar</p>
            {isLoggedIn && (
              <Link href="/create-route">
                <Button className="bg-sage-light hover:bg-sage text-white">
                  <Plus className="w-4 h-4 mr-2" />
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
