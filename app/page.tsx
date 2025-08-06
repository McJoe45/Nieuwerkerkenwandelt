"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { MapPin, Clock, Route, Users } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { getAllRoutes, type Route } from "@/lib/auth"

export default function HomePage() {
  const [routes, setRoutes] = useState<Route[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadRoutes() {
      try {
        const routesData = await getAllRoutes()
        setRoutes(routesData)
      } catch (error) {
        console.error('Error loading routes:', error)
      } finally {
        setLoading(false)
      }
    }

    loadRoutes()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-cream">
        <div className="container mx-auto px-6 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage mx-auto"></div>
            <p className="mt-4 text-sage">Routes laden...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-sage mb-6 leading-tight">
            De mooiste wandelingen
            <br />
            <span className="text-sage-light">in en om Nieuwerkerken</span>
          </h1>
          <p className="text-xl text-sage-dark/70 max-w-2xl mx-auto leading-relaxed">
            Ontdek de routes die door echte lokale wandelaars werden samengesteld.
          </p>
        </div>

        {/* Routes Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {routes.map((route) => (
            <Link key={route.id} href={`/route/${route.id}`}>
              <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-beige bg-white/90 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-sage-light rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-sage-dark mb-2 group-hover:text-sage transition-colors">
                        {route.name}
                      </h3>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {route.gehuchten?.map((gehucht, index) => (
                          <Badge key={index} variant="secondary" className="bg-sage-light/10 text-sage-dark border-sage-light/20">
                            {gehucht}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-4 text-sage">
                    <div className="flex items-center gap-1">
                      <Route className="w-4 h-4" />
                      <span className="text-sm font-medium">{route.distance} km</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm font-medium">{route.duration}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 mb-4">
                    <Badge 
                      variant={route.difficulty === 'Gemakkelijk' ? 'default' : route.difficulty === 'Matig' ? 'secondary' : 'destructive'}
                      className={
                        route.difficulty === 'Gemakkelijk' 
                          ? 'bg-green-100 text-green-800 border-green-200' 
                          : route.difficulty === 'Matig'
                          ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                          : 'bg-red-100 text-red-800 border-red-200'
                      }
                    >
                      {route.difficulty}
                    </Badge>
                    {route.muddy && (
                      <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200">
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
            <Users className="w-16 h-16 text-sage-light mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-sage-dark mb-2">Geen routes gevonden</h3>
            <p className="text-sage-dark/70">Er zijn nog geen wandelroutes beschikbaar.</p>
          </div>
        )}
      </div>
    </div>
  )
}
