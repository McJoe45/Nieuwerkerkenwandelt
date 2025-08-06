"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, MapPin, Clock, Users, Star, Edit } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import RouteMap from "@/components/route-map"
import { getRouteById, isAuthenticated } from "@/lib/auth"

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

export default function RouteDetailPage() {
  const params = useParams()
  const [route, setRoute] = useState<Route | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setIsLoggedIn(isAuthenticated())
    if (params.id) {
      loadRoute(params.id as string)
    }
  }, [params.id])

  const loadRoute = async (id: string) => {
    try {
      setLoading(true)
      const routeData = await getRouteById(id)
      setRoute(routeData)
    } catch (error) {
      console.error('Error loading route:', error)
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
            <Link href="/">
              <Button className="bg-sage hover:bg-sage-light text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Terug naar overzicht
              </Button>
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/">
            <Button variant="outline" className="border-sage-light text-sage hover:bg-sage-lightest">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Terug naar overzicht
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Route Details */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-white border-sage-light">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-2xl text-sage-dark">{route.name}</CardTitle>
                  <Badge className={getDifficultyColor(route.difficulty)}>
                    {route.difficulty}
                  </Badge>
                </div>
                <CardDescription className="text-sage text-base">
                  {route.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-sage-dark">
                    <MapPin className="w-5 h-5 text-sage-light" />
                    <div>
                      <p className="text-sm text-sage">Afstand</p>
                      <p className="font-semibold">{route.distance}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sage-dark">
                    <Clock className="w-5 h-5 text-sage-light" />
                    <div>
                      <p className="text-sm text-sage">Duur</p>
                      <p className="font-semibold">{route.duration}</p>
                    </div>
                  </div>
                </div>

                {route.gehuchten && route.gehuchten.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-sage-dark mb-3 flex items-center gap-2">
                      <Users className="w-5 h-5 text-sage-light" />
                      Gehuchten
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {route.gehuchten.map((gehucht, index) => (
                        <Badge key={index} variant="outline" className="border-sage-light text-sage">
                          {gehucht}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {route.highlights && route.highlights.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-sage-dark mb-3 flex items-center gap-2">
                      <Star className="w-5 h-5 text-sage-light" />
                      Hoogtepunten
                    </h3>
                    <ul className="space-y-2">
                      {route.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-start gap-2 text-sage-dark">
                          <span className="text-sage-light mt-1 flex-shrink-0">•</span>
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {isLoggedIn && (
                  <div className="pt-4 border-t border-sage-lightest">
                    <Link href={`/edit-route/${route.id}`}>
                      <Button className="w-full bg-sage-light hover:bg-sage text-white">
                        <Edit className="w-4 h-4 mr-2" />
                        Route Bewerken
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Map */}
          <div className="lg:col-span-2">
            <Card className="bg-white border-sage-light">
              <CardHeader>
                <CardTitle className="text-sage-dark">Routekaart</CardTitle>
                <CardDescription className="text-sage">
                  Bekijk het volledige verloop van de wandelroute
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RouteMap 
                  coordinates={route.coordinates || []} 
                  routeName={route.name}
                  routeId={route.id}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
