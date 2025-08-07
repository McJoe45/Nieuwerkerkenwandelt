import { createClient } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import Header from '@/components/header'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useState, useEffect } from 'react'
import { ArrowRight, MapPin, Ruler } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function IndexPage() {
  const [routes, setRoutes] = useState<any[]>([])
  const [sortBy, setSortBy] = useState('name-asc')

  useEffect(() => {
    const fetchRoutes = async () => {
      const supabase = createClient()
      const { data, error } = await supabase.from('routes').select('*')
      if (error) {
        console.error('Error fetching routes:', error)
      } else {
        setRoutes(data || [])
      }
    }

    fetchRoutes()

    // Refresh data when window gains focus
    window.addEventListener('focus', fetchRoutes)
    return () => window.removeEventListener('focus', fetchRoutes)
  }, [])

  const sortedRoutes = [...routes].sort((a, b) => {
    if (sortBy === 'name-asc') {
      return a.name.localeCompare(b.name)
    } else if (sortBy === 'name-desc') {
      return b.name.localeCompare(a.name)
    } else if (sortBy === 'distance-asc') {
      return (a.distance || 0) - (b.distance || 0)
    } else if (sortBy === 'distance-desc') {
      return (b.distance || 0) - (a.distance || 0)
    }
    return 0
  })

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <main className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-sage-dark mb-6 tracking-wide leading-tight title-font">
            Welkom in Nieuwerkerken
            <br />
            <span className="bg-gradient-to-r from-sage-light to-sage-lighter bg-clip-text text-transparent">
              Wandel door het hart van Vlaanderen
            </span>
          </h1>
          <p className="text-sage text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed font-light">
            Ontdek het dorp, zijn gehuchten en de groene wandelpaden en steegjes.
          </p>
        </div>

        {/* New Section with Buttons */}
        <section className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
          <Link href="/over-nieuwerkerken" passHref>
            <Button className="w-full sm:w-auto bg-sage hover:bg-sage-dark text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors duration-300">
              Over Nieuwerkerken en de gehuchten
            </Button>
          </Link>
          <Link href="/over-wandelen" passHref>
            <Button className="w-full sm:w-auto bg-sage hover:bg-sage-dark text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors duration-300">
              Over wandelen in Nieuwerkerken
            </Button>
          </Link>
        </section>

        <div className="flex justify-end mb-6">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px] border-sage-light text-sage">
              <SelectValue placeholder="Sorteer op" />
            </SelectTrigger>
            <SelectContent className="bg-white text-sage">
              <SelectItem value="name-asc">Alfabetisch: A naar Z</SelectItem>
              <SelectItem value="name-desc">Alfabetisch: Z naar A</SelectItem>
              <SelectItem value="distance-asc">Afstand: klein naar groot</SelectItem>
              <SelectItem value="distance-desc">Afstand: groot naar klein</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedRoutes.map((route) => (
            <Card key={route.id} className="border-2 border-beige bg-white shadow-sm hover:shadow-lg transition-all duration-300">
              <CardHeader className="relative">
                <div className="absolute top-4 left-4 bg-sage-light text-white text-xs font-semibold px-3 py-1 rounded-full z-10">
                  {route.difficulty || 'Onbekend'}
                </div>
                <img
                  src={route.image_url || '/placeholder.svg?height=200&width=300&query=scenic-route'}
                  alt={route.name}
                  width={400}
                  height={200}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              </CardHeader>
              <CardContent className="p-6">
                <CardTitle className="text-sage-dark text-xl font-bold mb-2 title-font">
                  {route.name}
                </CardTitle>
                <CardDescription className="text-sage text-sm mb-4 font-light">
                  {route.description}
                </CardDescription>
                <div className="flex items-center text-sage text-sm mb-2">
                  <Ruler className="w-4 h-4 mr-2 text-sage-light" />
                  <span>{route.distance ? `${route.distance.toFixed(1)} km` : 'Onbekend'}</span>
                </div>
                <div className="flex items-center text-sage text-sm mb-4">
                  <MapPin className="w-4 h-4 mr-2 text-sage-light" />
                  <span>{route.gehuchten?.join(', ') || 'Nieuwerkerken'}</span>
                </div>
                <Link href={`/route/${route.id}`} passHref>
                  <Button className="w-full bg-sage hover:bg-sage-dark text-white font-semibold py-2 rounded-lg transition-colors duration-300">
                    Bekijk Route
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
