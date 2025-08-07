'use client'

import { useState, useEffect } from 'react'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowUpDown, MapPin, Clock, Users } from 'lucide-react'
import Header from "@/components/header"
import { supabase } from "@/lib/supabase"

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
    fetchRoutes()
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

  const fetchRoutes = async () => {
    try {
      const { data, error } = await supabase
        .from('routes')
        .select('*')
        .order('name')

      if (error) throw error
      setRoutes(data || [])
    } catch (error) {
      console.error('Error fetching routes:', error)
    } finally {
      setLoading(false)
    }
  }

  const getSortLabel = (option: SortOption) => {
    switch (option) {
      case 'name-asc': return 'Alfabetisch: A naar Z'
      case 'name-desc': return 'Alfabetisch: Z naar A'
      case 'distance-asc': return 'Afstand: klein naar groot'
      case 'distance-desc': return 'Afstand: groot naar klein'
    }
  }

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
              <Card key={route.id} className="border-2 border-beige bg-white shadow-sm hover:shadow-lg transition-all duration-300 group">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-sage-dark group-hover:text-sage transition-colors title-font">
                      {route.name}
                    </CardTitle>
                    <Badge 
                      variant={route.difficulty === 'Gemakkelijk' ? 'default' : route.difficulty === 'Matig' ? 'secondary' : 'destructive'}
                      className="ml-2"
                    >
                      {route.difficulty}
                    </Badge>
                  </div>
                  <CardDescription className="text-sage font-light">
                    {route.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 text-sm text-sage">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{route.distance} km</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{route.duration}</span>
                    </div>
                  </div>

                  {route.gehuchten && route.gehuchten.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-sage-dark mb-2">Gehuchten:</p>
                      <div className="flex flex-wrap gap-1">
                        {route.gehuchten.map((gehucht, index) => (
                          <Badge key={index} variant="outline" className="text-xs border-sage-light text-sage">
                            {gehucht}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {route.muddy_paths && (
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        Modderige paden mogelijk
                      </Badge>
                    </div>
                  )}

                  <div className="flex gap-2 pt-4">
                    <Link href={`/route/${route.id}`} className="flex-1">
                      <Button className="w-full bg-sage hover:bg-sage-dark text-white">
                        Bekijk route
                      </Button>
                    </Link>
                    <Link href={`/map/${route.id}`}>
                      <Button variant="outline" className="border-sage-light text-sage hover:bg-sage-light hover:text-white">
                        <MapPin className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
