"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Edit, Trash2, MapPin, Ruler, Droplets, Navigation } from "lucide-react"
import Link from "next/link"
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
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const routeData = getRouteById(params.id as string)
    setRoute(routeData)
    setIsLoggedIn(isAuthenticated())
  }, [params.id])

  const handleDelete = () => {
    if (route && confirm(`Weet je zeker dat je de route "${route.name}" wilt verwijderen?`)) {
      deleteRoute(route.id)
      router.push("/")
    }
  }

  if (!route) {
    return (
      <div className="min-h-screen bg-cream">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-sage-dark title-font">Route niet gevonden</h1>
          <Link href="/">
            <Button className="mt-4 bg-sage-light hover:bg-sage-lighter text-white">Terug naar overzicht</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/">
            <Button
              variant="outline"
              className="border-sage-light text-sage-dark hover:bg-sage-lightest bg-transparent"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Terug naar overzicht
            </Button>
          </Link>

          {isLoggedIn && (
            <div className="flex gap-2">
              <Link href={`/edit-route/${route.id}`}>
                <Button
                  variant="outline"
                  className="border-sage-light text-sage-dark hover:bg-sage-lightest bg-transparent"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Bewerken
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={handleDelete}
                className="border-red-300 text-red-700 hover:bg-red-100 bg-transparent"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Verwijderen
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card className="border-beige bg-white">
              <CardHeader>
                <CardTitle className="text-2xl text-sage-dark flex items-center gap-2 title-font">
                  <MapPin className="w-6 h-6" />
                  {route.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {route.gehuchten.map((gehucht) => (
                    <Badge key={gehucht} variant="secondary" className="bg-sage-lightest text-sage-dark">
                      {gehucht}
                    </Badge>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-sage">
                    <Ruler className="w-5 h-5" />
                    <span className="font-medium">{route.distance} km</span>
                  </div>
                  <div className="flex items-center gap-2 text-sage">
                    <Navigation className="w-5 h-5" />
                    <span className="font-medium">{route.duration}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="border-sage-light text-sage-dark">
                    {route.difficulty}
                  </Badge>
                  {route.muddy && (
                    <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                      <Droplets className="w-3 h-3 mr-1" />
                      Modderpad
                    </Badge>
                  )}
                </div>

                <div>
                  <h3 className="font-semibold text-sage-dark mb-2 title-font">Beschrijving</h3>
                  <p className="text-sage leading-relaxed">{route.description}</p>
                </div>

                {route.highlights.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-sage-dark mb-2 title-font">Hoogtepunten</h3>
                    <ul className="list-disc list-inside space-y-1 text-sage">
                      {route.highlights.map((highlight, index) => (
                        <li key={index}>{highlight}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-beige bg-white">
              <CardHeader>
                <CardTitle className="text-sage-dark title-font">Route Kaart</CardTitle>
              </CardHeader>
              <CardContent>
                <RouteMap coordinates={route.coordinates} routeName={route.name} />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
