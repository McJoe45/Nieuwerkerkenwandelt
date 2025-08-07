'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Header from '@/components/header'
import { createClient } from '@/lib/supabase'
import { MapPin, Ruler } from 'lucide-react'

interface Route {
  id: string
  name: string
  description: string
  distance: number
  coordinates: any // JSONB type from Supabase
  created_at: string
}

export default function HomePage() {
  const [routes, setRoutes] = useState<Route[]>([])
  const [sortBy, setSortBy] = useState<string>('name-asc')
  const supabase = createClient()

  useEffect(() => {
    const fetchRoutes = async () => {
      const { data, error } = await supabase.from('routes').select('*')
      if (error) {
        console.error('Error fetching routes:', error)
      } else {
        setRoutes(data || [])
      }
    }

    fetchRoutes()

    // Re-fetch when window gains focus (e.g., returning from another tab)
    const handleFocus = () => {
      fetchRoutes()
    }
    window.addEventListener('focus', handleFocus)

    return () => {
      window.removeEventListener('focus', handleFocus)
    }
  }, [])

  const sortedRoutes = [...routes].sort((a, b) => {
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

  return (
    <div className="min-h-screen bg-cream">
      <Header />

      <main className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-sage-dark mb-6 tracking-tight leading-tight title-font">
            Nieuwerkerken
            <br />
            <span className="bg-gradient-to-r from-sage-light to-sage-lighter bg-clip-text text-transparent">
              Wandelt
            </span>
          </h1>
          <p className="text-lg md:text-xl text-sage-dark max-w-3xl mx-auto mb-8 font-light">
            Ontdek het dorp, zijn gehuchten en de groene wandelpaden en steegjes.
          </p>

          {/* New Buttons Section */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <Link href="/over-nieuwerkerken" passHref>
              <Button className="bg-sage hover:bg-sage-dark text-white font-semibold py-3 px-6 rounded-full shadow-md transition-all duration-300 text-base">
                Over Nieuwerkerken en de gehuchten
              </Button>
            </Link>
            <Link href="/over-wandelen" passHref>
              <Button className="bg-sage hover:bg-sage-dark text-white font-semibold py-3 px-6 rounded-full shadow-md transition-all duration-300 text-base">
                Over wandelen in Nieuwerkerken
              </Button>
            </Link>
          </div>
        </section>

        {/* Sort and Filter Section */}
        <section className="flex justify-end mb-8">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[200px] border-sage-light text-sage">
              <SelectValue placeholder="Sorteer op" />
            </SelectTrigger>
            <SelectContent className="bg-white text-sage">
              <SelectItem value="name-asc">Alfabetisch: A naar Z</SelectItem>
              <SelectItem value="name-desc">Alfabetisch: Z naar A</SelectItem>
              <SelectItem value="distance-asc">Afstand: klein naar groot</SelectItem>
              <SelectItem value="distance-desc">Afstand: groot naar klein</SelectItem>
            </SelectContent>
          </Select>
        </section>

        {/* Routes Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedRoutes.map((route) => (
            <Link href={`/route/${route.id}`} key={route.id} passHref>
              <Card className="border-2 border-beige bg-white shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-sage-dark text-xl title-font">{route.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sage text-sm mb-4 font-light line-clamp-3">{route.description}</p>
                  <div className="flex items-center text-sage-dark text-sm font-medium">
                    <Ruler className="w-4 h-4 mr-2 text-sage-light" />
                    <span>{route.distance ? `${route.distance.toFixed(2)} km` : 'N/A km'}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </section>
      </main>
    </div>
  )
}
