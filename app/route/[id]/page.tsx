"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, MapPin, Clock, Edit, Trash2, ExternalLink } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/header"
import RouteMap from "@/components/route-map"
import { getRouteById, deleteRoute, isAuthenticated } from "@/lib/auth"

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
  highlights: string[]
}

export default function RouteDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [route, setRoute] = useState<Route | null>(null)
  const [loading, setLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const loadRoute = async () => {
      if (params.id) {
        try {
          const routeData = await getRouteById(params.id as string)
          setRoute(routeData)
          setIsLoggedIn(isAuthenticated())
        } catch (error) {
          console.error('Error loading route:', error)
        } finally {
          setLoading(false)
        }
      }
    }

    loadRoute()
  }, [params.id])

  const handleDelete = async () => {
    if (route && window.confirm('Weet je zeker dat je deze route wilt verwijderen?')) {
      try {
        await deleteRoute(route.id)
        router.push('/')
      } catch (error) {
        console.error('Error deleting route:', error)
        alert('Er is een fout opgetreden bij het verwijderen van de route.')
      }
    }
  }

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

  if (loading) {
    return (
      <div className="min-h-screen bg-cream">
        <Header />
        <main className="container mx-auto px-6 py-8">
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
        <main className="container mx-auto px-6 py-8">
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
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/">
            <Button variant="outline" className="border-sage text-sage hover:bg-sage hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Terug naar overzicht
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Route Details */}
          <Card className="bg-white border-sage-light">
            <CardHeader>
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 bg-sage-light rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-2xl text-sage-dark title-font mb-2">
                    {route.name}
                  </CardTitle>
                  <div className="flex flex-wrap gap-2">
                    {route.gehuchten.map((gehucht, index) => (
                      <Badge key={index} variant="secondary" className="bg-sage-light/10 text-sage-dark">
                        {gehucht}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Route Stats */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-sage-dark">
                  <MapPin className="w-5 h-5" />
                  <span className="font-semibold text-lg">{route.distance} km</span>
                </div>
                <div className="flex items-center gap-2 text-sage-dark">
                  <Clock className="w-5 h-5" />
                  <span className="text-lg">{route.duration}</span>
                </div>
              </div>

              {/* Difficulty and Tags */}
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

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-sage-dark mb-3">Beschrijving</h3>
                <p className="text-sage leading-relaxed">{route.description}</p>
              </div>

              {/* Highlights */}
              {route.highlights && route.highlights.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-sage-dark mb-3">Hoogtepunten</h3>
                  <ul className="space-y-2">
                    {route.highlights.map((highlight, index) => (
                      <li key={index} className="flex items-start gap-2 text-sage">
                        <span className="w-2 h-2 bg-sage-light rounded-full mt-2 flex-shrink-0"></span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Admin Actions */}
              {isLoggedIn && (
                <div className="flex gap-3 pt-4 border-t border-sage-light/20">
                  <Link href={`/edit-route/${route.id}`}>
                    <Button variant="outline" className="border-sage text-sage hover:bg-sage hover:text-white">
                      <Edit className="w-4 h-4 mr-2" />
                      Bewerken
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    onClick={handleDelete}
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Verwijderen
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Route Map */}
          <Card className="bg-white border-sage-light">
            <CardHeader>
              <CardTitle className="text-sage-dark title-font">Route Kaart</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <RouteMap coordinates={route.coordinates} />
                <div className="mt-4">
                  <Link 
                    href={`/map/${route.id}`}
                    target="_blank"
                    className="text-sage hover:text-sage-light text-sm flex items-center gap-1 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Klik hier om de kaart in een eigen venster te openen
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
