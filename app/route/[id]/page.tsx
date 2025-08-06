"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, MapPin, Clock, Users, Star, ExternalLink, Edit } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/header"
import RouteMap from "@/components/route-map"
import { getRouteById, isAuthenticated, type Route } from "@/lib/auth"

export default function RouteDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [route, setRoute] = useState<Route | null>(null)
  const [loading, setLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const loadRoute = async () => {
      if (!params.id) return
      
      try {
        setLoading(true)
        const routeData = await getRouteById(params.id as string)
        setRoute(routeData)
        setIsLoggedIn(isAuthenticated())
      } catch (error) {
        console.error('Error loading route:', error)
      } finally {
        setLoading(false)
      }
    }

    loadRoute()
  }, [params.id])

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
            <p className="text-sage-dark">Route wordt geladen...</p>
          </div>
        </main>
      </div>
    )
  }

  if (!route) {
    return (
      <div className="min-h-screen bg-cream">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-sage-dark mb-4">Route niet gevonden</h1>
            <p className="text-sage mb-6">De opgevraagde route bestaat niet of is verwijderd.</p>
            <Button onClick={() => router.push('/')} className="bg-sage hover:bg-sage-light text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Terug naar overzicht
            </Button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="outline" 
            onClick={() => router.push('/')}
            className="border-sage text-sage hover:bg-sage hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Terug naar overzicht
          </Button>
          
          {isLoggedIn && (
            <div className="flex gap-2">
              <Button 
                variant="outline"
                onClick={() => router.push(`/edit-route/${route.id}`)}
                className="border-sage text-sage hover:bg-sage hover:text-white"
              >
                <Edit className="w-4 h-4 mr-2" />
                Bewerken
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Route Info */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-white border-sage-light">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-sage-light rounded-xl flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-sage-dark text-xl title-font">{route.name}</CardTitle>
                      <p className="text-sage text-sm">
                        {route.gehuchten && route.gehuchten.length > 0 ? route.gehuchten.join(' • ') : ''}
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-sage-dark">
                    <MapPin className="w-4 h-4" />
                    <span className="font-semibold">{route.distance} km</span>
                  </div>
                  <div className="flex items-center gap-2 text-sage-dark">
                    <Clock className="w-4 h-4" />
                    <span>{route.duration}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge className={getDifficultyColor(route.difficulty)}>
                    {route.difficulty}
                  </Badge>
                  {route.muddy && (
                    <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                      Modderpad
                    </Badge>
                  )}
                </div>

                <div>
                  <h3 className="font-semibold text-sage-dark mb-2">Beschrijving</h3>
                  <p className="text-sage text-sm leading-relaxed">{route.description}</p>
                </div>

                {route.gehuchten && route.gehuchten.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-sage-dark mb-2 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Gehuchten
                    </h3>
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
                    <h3 className="font-semibold text-sage-dark mb-2 flex items-center gap-2">
                      <Star className="w-4 h-4" />
                      Hoogtepunten
                    </h3>
                    <ul className="text-sm text-sage space-y-1">
                      {route.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-sage-light mt-1">•</span>
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <Button 
                  className="w-full bg-sage-light hover:bg-sage text-white"
                  onClick={() => window.open(`/map/${route.id}`, '_blank')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open in nieuw venster
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Map */}
          <div className="lg:col-span-2">
            <Card className="bg-white border-sage-light h-[600px]">
              <CardContent className="p-0 h-full">
                <RouteMap 
                  coordinates={route.coordinates} 
                  routeName={route.name}
                  className="h-full w-full rounded-lg"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
