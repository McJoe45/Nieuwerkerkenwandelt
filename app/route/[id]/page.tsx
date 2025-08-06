"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { MapPin, Clock, ExternalLink, ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/header"
import RouteMap from "@/components/route-map"
import { getRouteById, type Route } from "@/lib/auth"

export default function RouteDetailPage() {
  const params = useParams()
  const [route, setRoute] = useState<Route | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadRoute() {
      if (params.id) {
        try {
          const routeData = await getRouteById(params.id as string)
          setRoute(routeData)
        } catch (error) {
          console.error('Error loading route:', error)
        } finally {
          setLoading(false)
        }
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
        <main className="container mx-auto px-6 py-12">
          <div className="text-center">
            <p className="text-sage-dark text-xl">Route wordt geladen...</p>
          </div>
        </main>
      </div>
    )
  }

  if (!route) {
    return (
      <div className="min-h-screen bg-cream">
        <Header />
        <main className="container mx-auto px-6 py-12">
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
      
      <main className="container mx-auto px-6 py-8">
        <div className="mb-6">
          <Link href="/">
            <Button variant="outline" className="border-sage-light text-sage hover:bg-sage-lightest">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Terug naar overzicht
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Route Details */}
          <Card className="bg-white border-sage-light">
            <CardHeader>
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-sage-light rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-2xl text-sage-dark title-font mb-2">
                    {route.name}
                  </CardTitle>
                  <div className="flex flex-wrap gap-2">
                    {route.gehuchten && route.gehuchten.map((gehucht, index) => (
                      <Badge key={index} variant="secondary" className="bg-sage-light/10 text-sage-dark border-sage-light/20">
                        {gehucht}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sage-dark">
                  <MapPin className="w-5 h-5" />
                  <span className="font-semibold text-lg">{route.distance} km</span>
                </div>
                <div className="flex items-center gap-2 text-sage-dark">
                  <Clock className="w-5 h-5" />
                  <span className="font-semibold text-lg">{route.duration}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
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
                <h3 className="text-lg font-semibold text-sage-dark mb-3 title-font">Beschrijving</h3>
                <p className="text-sage-dark/80 leading-relaxed">
                  {route.description}
                </p>
              </div>

              {route.highlights && route.highlights.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-sage-dark mb-3 title-font">Hoogtepunten</h3>
                  <ul className="space-y-2">
                    {route.highlights.map((highlight, index) => (
                      <li key={index} className="flex items-start gap-2 text-sage-dark/80">
                        <span className="w-2 h-2 bg-sage-light rounded-full mt-2 flex-shrink-0"></span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Route Map */}
          <Card className="bg-white border-sage-light">
            <CardHeader>
              <CardTitle className="text-xl text-sage-dark title-font">Route Kaart</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <RouteMap 
                  coordinates={route.coordinates} 
                  routeName={route.name}
                  className="h-96 rounded-lg overflow-hidden"
                />
                <div className="mt-4">
                  <Link href={`/map/${route.id}`} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="border-sage-light text-sage hover:bg-sage-lightest">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Klik hier om de kaart in een eigen venster te openen
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
