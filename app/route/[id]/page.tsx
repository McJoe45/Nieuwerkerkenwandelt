"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { MapPin, Clock, RouteIcon, ArrowLeft, ExternalLink } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import dynamic from "next/dynamic"
import { getRouteById, type Route } from "@/lib/auth"

const RouteMap = dynamic(() => import("@/components/route-map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage mx-auto mb-2"></div>
        <p className="text-sm text-sage">Kaart laden...</p>
      </div>
    </div>
  ),
})

export default function RouteDetailPage() {
  const params = useParams()
  const [route, setRoute] = useState<Route | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadRoute() {
      if (!params.id || typeof params.id !== 'string') {
        setError('Ongeldige route ID')
        setLoading(false)
        return
      }

      try {
        const routeData = await getRouteById(params.id)
        if (routeData) {
          setRoute(routeData)
        } else {
          setError('Route niet gevonden')
        }
      } catch (error) {
        console.error('Error loading route:', error)
        setError('Fout bij het laden van de route')
      } finally {
        setLoading(false)
      }
    }

    loadRoute()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-cream">
        <div className="container mx-auto px-6 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage mx-auto mb-4"></div>
            <p className="text-sage">Route laden...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !route) {
    return (
      <div className="min-h-screen bg-cream">
        <div className="container mx-auto px-6 py-12">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error || 'Route niet gevonden'}</p>
            <Link href="/">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Terug naar overzicht
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-6">
          <Link href="/">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Terug naar overzicht
            </Button>
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Route Details */}
          <Card className="border-2 border-beige bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-sage-light rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-sage-dark mb-3">
                    {route.name}
                  </h1>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {route.gehuchten?.map((gehucht, index) => (
                      <Badge key={index} variant="secondary" className="bg-sage-light text-white">
                        {gehucht}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 mb-6 text-sage">
                <div className="flex items-center gap-2">
                  <RouteIcon className="w-5 h-5" />
                  <span className="font-medium">{route.distance} km</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span className="font-medium">{route.duration}</span>
                </div>
              </div>

              <div className="flex gap-2 mb-6">
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

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-sage-dark mb-3">Beschrijving</h3>
                <p className="text-sage-dark/80 leading-relaxed">
                  {route.description}
                </p>
              </div>

              {route.highlights && route.highlights.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-sage-dark mb-3">Hoogtepunten</h3>
                  <ul className="space-y-2">
                    {route.highlights.map((highlight, index) => (
                      <li key={index} className="flex items-start gap-2 text-sage-dark/80">
                        <span className="w-1.5 h-1.5 bg-sage-light rounded-full mt-2 flex-shrink-0"></span>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Route Map */}
          <Card className="border-2 border-beige bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-sage-dark">Route Kaart</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="mb-4">
                <RouteMap 
                  coordinates={route.coordinates || []} 
                  routeName={route.name}
                  className="w-full h-64 rounded-lg"
                />
              </div>
              <Link 
                href={`/map/${route.id}`} 
                target="_blank"
                className="inline-flex items-center gap-2 text-sm text-sage hover:text-sage-dark transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Klik hier om de kaart in een eigen venster te openen
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
