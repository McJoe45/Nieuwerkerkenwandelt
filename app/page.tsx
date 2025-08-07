'use client'

import { useState, useEffect } from 'react'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowUpDown, MapPin, Clock, Users, Ruler, TrendingUp, Droplets } from 'lucide-react'
import Header from "@/components/header"
import { getRoutes } from "@/lib/supabase" // Import getRoutes from lib/supabase

interface Route {
  id: string
  name: string
  description: string
  distance: number
  difficulty: 'Gemakkelijk' | 'Matig' | 'Moeilijk'
  duration: string
  gehuchten: string[]
  muddy_paths: boolean
  created_at: string
}

type SortOption = 'name-asc' | 'name-desc' | 'distance-asc' | 'distance-desc'

export default function HomePage() {
  const [routes, setRoutes] = useState<Route[]>([])
  const [sortedRoutes, setSortedRoutes] = useState<Route[]>([])
  const [sortBy, setSortBy] = useState<SortOption>('name-asc')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadRoutes = async () => {
      const routesData = await getRoutes()
      setRoutes(routesData)
      setLoading(false)
    }
    loadRoutes()

    // Re-fetch when window gains focus (e.g., returning from another tab)
    const handleFocus = () => {
      loadRoutes()
    }
    window.addEventListener('focus', handleFocus)

    return () => {
      window.removeEventListener('focus', handleFocus)
    }
  }, [])

  useEffect(() => {
    const sorted = [...routes].sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name)
        case 'name-desc':
          return b.name.localeCompare(a.name)
        case 'distance-asc':
          return a.distance - b.distance
        case 'distance-desc':
          return b.distance - a.distance
        default:
          return 0
      }
    })
    setSortedRoutes(sorted)
  }, [routes, sortBy])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Gemakkelijk':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Matig':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Moeilijk':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream">
        <Header />
        <main className="container mx-auto px-6 py-12">
          <div className="text-center">
            <p className="text-sage">Routes laden...</p>
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
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-sage-dark mb-6 tracking-wide leading-tight title-font">
            Ontdek het dorp, zijn gehuchten
            <br />
            <span className="bg-gradient-to-r from-sage-light to-sage-lighter bg-clip-text text-transparent">
              en de groene wandelpaden en steegjes
            </span>
          </h1>
        </div>

        {/* Info Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link href="/over-nieuwerkerken">
            <Button className="bg-sage hover:bg-sage-dark text-white px-8 py-3 text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              Over Nieuwerkerken en de gehuchten
            </Button>
          </Link>
          <Link href="/over-wandelen">
            <Button className="bg-sage hover:bg-sage-dark text-white px-8 py-3 text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              Over wandelen in Nieuwerkerken
            </Button>
          </Link>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-sage-dark title-font">
            Wandelroutes ({sortedRoutes.length})
          </h2>
          
          <div className="flex items-center gap-3">
            <ArrowUpDown className="w-5 h-5 text-sage" />
            <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
              <SelectTrigger className="w-64 border-sage-light focus:border-sage">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name-asc">Alfabetisch: A naar Z</SelectItem>
                <SelectItem value="name-desc">Alfabetisch: Z naar A</SelectItem>
                <SelectItem value="distance-asc">Afstand: klein naar groot</SelectItem>
                <SelectItem value="distance-desc">Afstand: groot naar klein</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Routes Grid */}
        {sortedRoutes.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-sage text-lg mb-6">Nog geen routes beschikbaar.</p>
            <Link href="/create-route">
              <Button className="bg-sage hover:bg-sage-dark text-white">
                Eerste route aanmaken
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedRoutes.map((route) => (
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
                      {route.muddy_paths && (
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
        )}
      </main>
    </div>
  )
}
