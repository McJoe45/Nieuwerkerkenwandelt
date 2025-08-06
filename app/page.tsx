"use client"

import { useState, useEffect } from "react"
import { Plus, MapPin, Ruler, Droplets, Clock, TrendingUp } from 'lucide-react'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/header"
import { getRoutes, isAuthenticated } from "@/lib/supabase"

interface Route {
  id: string
  name: string
  gehuchten: string[]
  distance: number
  muddy: boolean
  description: string
  coordinates: [number, number][]
  difficulty: string
  duration: string
}

export default function HomePage() {
  const [routes, setRoutes] = useState<Route[]>([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const loadRoutes = async () => {
      const routesData = await getRoutes()
      setRoutes(routesData)
      setIsLoggedIn(isAuthenticated())
    }
    loadRoutes()
  }, [])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Gemakkelijk":
        return "bg-green-100 text-green-800 border-green-200"
      case "Matig":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "Moeilijk":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="min-h-screen bg-cream">
      <Header />

      <main className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-sage-dark mb-6 tracking-wide leading-tight title-font">
            De mooiste wandelingen
            <br />
            <span className="bg-gradient-to-r from-sage-light to-sage-lighter bg-clip-text text-transparent">
              in en om Nieuwerkerken
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-sage max-w-2xl mx-auto leading-relaxed font-light">
            Ontdek de routes die door echte lokale wandelaars werden samengesteld.
          </p>
        </div>

        {/* CTA Section */}
        {isLoggedIn && (
          <div className="mb-12 text-center">
            <Link href="/create-route">
              <Button
                size="lg"
                className="bg-gradient-to-r from-sage-light to-sage-lighter hover:from-sage-lighter hover:to-sage-light text-white border-0 transition-all duration-300 hover:scale-105 shadow-lg px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg title-font"
              >
                <Plus className="w-5 h-5 mr-2" />
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
                          {route.gehuchten.join(" • ")}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="relative space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-sage">
                        <Ruler className="w-4 h-4" />
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
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {route.difficulty}
                      </Badge>
                    )}
                    {route.muddy && (
                      <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200 font-medium">
                        <Droplets className="w-3 h-3 mr-1" />
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
