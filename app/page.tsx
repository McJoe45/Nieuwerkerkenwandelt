"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { MapPin, Clock, Users, Plus } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import { getAllRoutes, isAuthenticated } from "@/lib/auth"

interface Route {
  id: string
  name: string
  description: string
  distance: string
  duration: string
  difficulty: 'Gemakkelijk' | 'Matig' | 'Moeilijk'
  highlights: string[]
  gehuchten: string[]
  coordinates: [number, number][]
  createdAt: string
  createdBy: string
}

export default function HomePage() {
  const [routes, setRoutes] = useState<Route[]>([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setIsLoggedIn(isAuthenticated())
    loadRoutes()
  }, [])

  const loadRoutes = async () => {
    try {
      setLoading(true)
      const routesData = await getAllRoutes()
      setRoutes(routesData)
    } catch (error) {
      console.error('Error loading routes:', error)
    } finally {
      setLoading(false)
    }
  }

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
          <h1 className="text-4xl md:text-6xl font-bold text-sage-dark mb-4">
            Wandelroutes Nieuwerkerken
          </h1>
          <p className="text-xl text-sage mb-8 max-w-2xl mx-auto">
            Ontdek de mooiste wandelpaden door onze prachtige gemeente. 
            Van rustige natuurwandelingen tot uitdagende routes door heuvels en bossen.
          </p>
          
          {isLoggedIn && (
            <Link href="/create-route">
              <Button size="lg" className="bg-sage hover:bg-sage-light text-white">
                <Plus className="w-5 h-5 mr-2" />
                Nieuwe Route Toevoegen
              </Button>
            </Link>
          )}
        </div>

        {/* Routes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {routes.map((route) => (
            <Card key={route.id} className="bg-white border-sage-light hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-sage-dark text-xl">{route.name}</CardTitle>
                  <Badge className={getDifficultyColor(route.difficulty)}>
                    {route.difficulty}
                  </Badge>
                </div>
                <CardDescription className="text-sage">
                  {route.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 text-sm text-sage-dark">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{route.distance}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{route.duration}</span>
                  </div>
                </div>

                {route.gehuchten && route.gehuchten.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sage-dark mb-2 flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      Gehuchten
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {route.gehuchten.map((gehucht, index) => (
                        <Badge key={index} variant="outline" className="text-xs border-sage-light text-sage">
                          {gehucht}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {route.highlights && route.highlights.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sage-dark mb-2">Hoogtepunten</h4>
                    <ul className="text-sm text-sage space-y-1">
                      {route.highlights.slice(0, 3).map((highlight, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-sage-light mt-1">•</span>
                          <span>{highlight}</span>
                        </li>
                      ))}
                      {route.highlights.length > 3 && (
                        <li className="text-sage-light text-xs">
                          +{route.highlights.length - 3} meer...
                        </li>
                      )}
                    </ul>
                  </div>
                )}

                <Link href={`/route/${route.id}`}>
                  <Button className="w-full bg-sage-light hover:bg-sage text-white">
                    Route Bekijken
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {routes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sage-dark text-lg mb-4">Nog geen routes beschikbaar.</p>
            {isLoggedIn && (
              <Link href="/create-route">
                <Button className="bg-sage hover:bg-sage-light text-white">
                  <Plus className="w-5 h-5 mr-2" />
                  Eerste Route Toevoegen
                </Button>
              </Link>
            )}
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 text-center text-sage">
          <p>&copy; 2024 Gemeente Nieuwerkerken. Alle rechten voorbehouden.</p>
        </footer>
      </main>
    </div>
  )
}
