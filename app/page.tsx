import { Suspense } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Header from '@/components/header'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowRight, MapPin, Ruler } from 'lucide-react'

export const revalidate = 0

interface Route {
  id: string
  name: string
  description: string | null
  distance: number | null
  gehuchten: string[] | null
  created_at: string
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const supabase = createClient()
  const { data: routes, error } = await supabase.from('routes').select('*')

  if (error) {
    console.error('Error fetching routes:', error)
    return <div className="text-red-500 text-center py-10">Fout bij het laden van routes.</div>
  }

  const sort = searchParams.sort as string || 'name-asc'

  const sortedRoutes = routes.sort((a: Route, b: Route) => {
    if (sort === 'name-asc') {
      return a.name.localeCompare(b.name)
    } else if (sort === 'name-desc') {
      return b.name.localeCompare(a.name)
    } else if (sort === 'distance-asc') {
      return (a.distance || 0) - (b.distance || 0)
    } else if (sort === 'distance-desc') {
      return (b.distance || 0) - (a.distance || 0)
    }
    return 0
  })

  return (
    <div className="min-h-screen bg-cream">
      <Header />

      <main className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-sage-dark mb-6 tracking-wide leading-tight title-font">
            Nieuwerkerken Wandelt
          </h1>
          <p className="text-lg sm:text-xl text-sage mb-8 max-w-3xl mx-auto font-light">
            Ontdek het dorp, zijn gehuchten en de groene wandelpaden en steegjes.
          </p>

          {/* New Buttons Section */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <Link href="/over-nieuwerkerken" passHref>
              <Button className="bg-sage hover:bg-sage-dark text-white font-semibold py-3 px-6 rounded-full shadow-md transition-all duration-300 text-base">
                Over Nieuwerkerken en de gehuchten
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/over-wandelen" passHref>
              <Button className="bg-sage hover:bg-sage-dark text-white font-semibold py-3 px-6 rounded-full shadow-md transition-all duration-300 text-base">
                Over wandelen in Nieuwerkerken
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* Sort Section */}
          <div className="flex justify-end mb-8">
            <Select
              onValueChange={(value) => {
                const params = new URLSearchParams(window.location.search)
                params.set('sort', value)
                window.history.pushState(null, '', `?${params.toString()}`)
              }}
              defaultValue={sort}
            >
              <SelectTrigger className="w-[180px] bg-white border-beige text-sage-dark">
                <SelectValue placeholder="Sorteer op" />
              </SelectTrigger>
              <SelectContent className="bg-white border-beige text-sage-dark">
                <SelectItem value="name-asc">Alfabetisch: A naar Z</SelectItem>
                <SelectItem value="name-desc">Alfabetisch: Z naar A</SelectItem>
                <SelectItem value="distance-asc">Afstand: klein naar groot</SelectItem>
                <SelectItem value="distance-desc">Afstand: groot naar klein</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </section>

        {/* Routes Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedRoutes.map((route) => (
            <Link href={`/route/${route.id}`} key={route.id} passHref>
              <Card className="border-2 border-beige bg-white shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer h-full flex flex-col">
                <CardHeader>
                  <CardTitle className="text-sage-dark text-xl title-font">{route.name}</CardTitle>
                  {route.description && (
                    <CardDescription className="text-sage text-sm mt-1 font-light">
                      {route.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="flex items-center text-sage text-sm mb-2">
                    <Ruler className="w-4 h-4 mr-2 text-sage-light" />
                    <span>{route.distance ? `${route.distance.toFixed(2)} km` : 'N/A km'}</span>
                  </div>
                  {route.gehuchten && route.gehuchten.length > 0 && (
                    <div className="flex items-center text-sage text-sm">
                      <MapPin className="w-4 h-4 mr-2 text-sage-light" />
                      <span>{route.gehuchten.join(', ')}</span>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button variant="ghost" className="text-sage hover:text-sage-dark">
                    Bekijk route
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </section>
      </main>
    </div>
  )
}
