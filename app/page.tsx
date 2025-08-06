"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { MapPin, Clock, Plus } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import { getAllRoutes, isAuthenticated, type Route } from "@/lib/auth"

export default function HomePage() {
  const [routes, setRoutes] = useState<Route[]>([])
  const [loading, setLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    async function loadRoutes() {
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
          <h1 className="text-4xl md:text-5xl font-bold text-sage-dark mb-6 leading-tight title-font">
            De mooiste wandelingen<br />
            in en om Nieuwerkerken
          </h1>
          <p className="text-xl text-sage max-w-2xl mx-auto leading-relaxed">
            Ontdek de routes die door echte lokale wandelaars werden samengesteld.
          </p>
        </div>

        {/* Admin Actions */}
        {isLoggedIn && (
          <div className="mb-12 text-center">
            <Link href="/create-route">
              <Button className="bg-sage hover:bg-sage-light text-white">
                <Plus className="w-4 h-4 mr-2" />
                Nieuwe Route Aanmaken
              </Button>
            </Link>
          </div>
        )}

        {/* Routes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {routes.map((route) => (
            <Link key={route.id} href={`/route/${route.id}`}>
              <Card className="group hover:shadow-2xl transition-all duration-500 cursor-pointer border-2 border-beige hover:border-sage-light bg-white hover:-translate-y-2 overflow-hidden">
                <CardHeader className="relative">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-sage-light rounded-xl flex items-center justify-center shadow-sm">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-sage-dark group-hover:text-sage-light transition-colors duration-300 text-lg title-font">
                          {route.name}
                        </CardTitle>
                        <CardDescription className="text-sage text-sm font-light">
                          {route.gehuchten && route.gehuchten.length > 0 ? route.gehuchten.join(" • ") : ""}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="relative space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-sage">
                        <MapPin className="w-4 h-4" />
                        <span className="font-semibold">{route.distance} km</span>
                      </div>
                      {route.duration && (
                        <div className="flex items-center gap-2 text-sage">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">{route.duration}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {route.difficulty && (
                      <Badge variant="outline" className={`${getDifficultyColor(route.difficulty)} border font-medium`}>
                        {route.difficulty}
                      </Badge>
                    )}
                    {route.muddy && (
                      <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200 font-medium">
                        Modderpad
                      </Badge>
                    )}
                  </div>

                  <p className="text-sage text-sm leading-relaxed line-clamp-3 font-light">{route.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {routes.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-sage-light/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <MapPin className="w-10 h-10 text-sage" />
            </div>
            <h3 className="text-2xl font-bold text-sage-dark mb-3 title-font">Nog geen routes beschikbaar</h3>
            <p className="text-sage max-w-md mx-auto font-light">
              {isLoggedIn
                ? "Maak de eerste wandelroute aan en deel de mooiste plekken van Nieuwerkerken!"
                : "Binnenkort worden hier de mooiste wandelroutes toegevoegd."}
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
