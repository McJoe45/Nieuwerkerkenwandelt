'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Ruler, Droplets, Clock, TrendingUp, ArrowLeft, Map } from 'lucide-react'
import Header from '@/components/header'
import { getRouteById, deleteRoute, isAuthenticated } from '@/lib/supabase'

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

export default function RouteDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  const [route, setRoute] = useState<Route | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()

  const loadRoute = async () => {
    setLoading(true)
    setError(null)
    try {
      const routeData = await getRouteById(id)
      if (routeData) {
        setRoute(routeData)
      } else {
        setError('Route niet gevonden.')
      }
    } catch (err) {
      console.error('Fout bij het laden van de route:', err)
      setError('Fout bij het laden van de route.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setIsLoggedIn(isAuthenticated())
    loadRoute()

    // Re-fetch data when the window gains focus
    window.addEventListener('focus', loadRoute)

    return () => {
      window.removeEventListener('focus', loadRoute)
    }
  }, [id])

  const handleDelete = async () => {
    if (window.confirm('Weet je zeker dat je deze route wilt verwijderen?')) {
      const success = await deleteRoute(id)
      if (success) {
        router.push('/admin') // Redirect to admin page after deletion
      } else {
        alert('Fout bij het verwijderen van de route.')
      }
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Gemakkelijk':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'Matig':
        return 'bg-amber-100 text-amber-800 border-amber-200'
      case 'Moeilijk':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream">
        <Header />
        <main className="container mx-auto px-6 py-12">
          <div className="text-center">
            <p className="text-sage">Route laden...</p>
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-cream">
        <Header />
        <main className="container mx-auto px-6 py-12">
          <div className="text-center text-red-500">
            <p>{error}</p>
            <Link href="/" passHref>
              <Button className="mt-4 bg-sage hover:bg-sage-dark text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Terug naar overzicht
              </Button>
            </Link>
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
          <div className="text-center text-sage">
            <p>Geen routegegevens beschikbaar.</p>
            <Link href="/" passHref>
              <Button className="mt-4 bg-sage hover:bg-sage-dark text-white">
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
      <main className="container mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-sage-dark title-font">{route.name}</h1>
          <div className="flex gap-4">
            <Link href="/" passHref>
              <Button variant="outline" className="border-sage text-sage hover:bg-sage-light hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Terug naar overzicht
              </Button>
            </Link>
            {isLoggedIn && (
              <>
                <Link href={`/edit-route/${route.id}`} passHref>
                  <Button className="bg-sage hover:bg-sage-dark text-white">
                    Route Bewerken
                  </Button>
                </Link>
                <Button variant="destructive" onClick={handleDelete}>
                  Route Verwijderen
                </Button>
              </>
            )}
          </div>
        </div>

        <Card className="border-2 border-beige bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-sage-dark text-2xl title-font">{route.name}</CardTitle>
            <CardDescription className="text-sage text-base font-light">
              {route.gehuchten.join(" • ")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sage-dark">
                <Ruler className="w-5 h-5 text-sage-light" />
                <span className="font-semibold">{route.distance} km</span>
              </div>
              {route.duration && (
                <div className="flex items-center gap-2 text-sage-dark">
                  <Clock className="w-5 h-5 text-sage-light" />
                  <span className="text-base">{route.duration}</span>
                </div>
              )}
              {route.difficulty && (
                <div className="flex items-center gap-2 text-sage-dark">
                  <TrendingUp className="w-5 h-5 text-sage-light" />
                  <Badge variant="outline" className={`${getDifficultyColor(route.difficulty)} border font-medium`}>
                    {route.difficulty}
                  </Badge>
                </div>
              )}
              {route.muddy && (
                <div className="flex items-center gap-2 text-sage-dark">
                  <Droplets className="w-5 h-5 text-sage-light" />
                  <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200 font-medium">
                    Modderpaden
                  </Badge>
                </div>
              )}
            </div>

            <p className="text-sage text-base leading-relaxed">{route.description}</p>

            {route.highlights && route.highlights.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-sage-dark mb-2">Highlights:</h3>
                <ul className="list-disc list-inside text-sage text-base">
                  {route.highlights.map((highlight, index) => (
                    <li key={index}>{highlight}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="text-center mt-8">
              <Link href={`/map/${route.id}`} passHref>
                <Button className="bg-sage hover:bg-sage-dark text-white text-lg px-8 py-3 rounded-full shadow-md transition-all duration-300">
                  <Map className="w-5 h-5 mr-2" />
                  Bekijk op Kaart
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
